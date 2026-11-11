import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";
import { demoProperties } from "../src/data/properties";
import { properties } from "../src/db/schema";
import { seedDemoProperties, toDemoSeedRows } from "../src/db/seed";
import type { LindenDatabase } from "../src/db";
import { DatabaseUnavailableError, getDatabase } from "../src/db";
import { enquiries } from "../src/db/schema";
import { saveEnquiry } from "../src/lib/enquiries/repository";
import { enquirySchema } from "../src/lib/enquiries/schema";
import { filterProperties, parsePropertyFilters } from "../src/lib/property-filters";
import { CHF_FORMAT, formatChfPrice } from "../src/lib/currency";
import { listProperties } from "../src/repositories/properties";
import { diagnoseAdminCredentials, verifyAdminCredentials } from "../src/lib/admin/credentials";
import { enquiryStatusSchema, loginSchema, propertyInputSchema } from "../src/lib/admin/schemas";
import { isDuplicateSlugError, shouldBlockPropertyDeletion } from "../src/lib/admin/policies";
import { escapeForNextEnv, hashAdminPassword, passwordPolicyError } from "../scripts/hash-admin-password.mjs";

test("the schema declares typed tables, relationships, and required constraints", () => {
  assert.equal(properties.slug.notNull, true);
  assert.equal(properties.priceChf.notNull, true);
  assert.equal(properties.imagePaths.notNull, true);
  assert.equal(enquiries.id.hasDefault, true);
  assert.equal(enquiries.propertyId.notNull, false);
});

test("demo seed rows preserve all fourteen source listings and local images", () => {
  const rows = toDemoSeedRows();
  assert.equal(rows.length, 14);
  assert.equal(new Set(rows.map((row) => row.slug)).size, 14);
  assert.equal(new Set(rows.map((row) => row.id)).size, 14);
  assert.ok(rows.every((row) => row.isFictional && row.publicationStatus === "demo"));
  assert.ok(rows.every((row) => row.imagePaths.length > 0 && row.imagePaths.every((path) => existsSync(resolve("public", `.${path}`)))));
  assert.equal(rows.filter((row) => row.transactionType === "sale").length, 8);
  assert.equal(rows.filter((row) => row.transactionType === "rent").length, 6);
  const allImagePaths = rows.flatMap((row) => row.imagePaths);
  assert.ok(rows.every((row) => row.imagePaths.length === 2));
  assert.equal(new Set(allImagePaths).size, 28);
});

test("seed operation uses slug upserts and can be rerun without duplicate rows", async () => {
  const saved = new Map<string, { id: string; slug: string; title: string }>();
  let upsertCalls = 0;
  const fake = {
    insert: (table: unknown) => {
      assert.equal(table, properties);
      return {
        values: (rows: Array<{ id: string; slug: string; title: string }>) => ({
          onConflictDoUpdate: async (config: { target: unknown }) => {
            assert.equal(config.target, properties.slug);
            upsertCalls += 1;
            for (const row of rows) saved.set(row.slug, row);
          },
        }),
      };
    },
  } as unknown as LindenDatabase;
  await seedDemoProperties(fake);
  await seedDemoProperties(fake);
  assert.equal(upsertCalls, 2);
  assert.equal(saved.size, 14);
});

test("enquiry schemas accept valid payloads and reject invalid fields", () => {
  const validContact = enquirySchema.safeParse({ kind: "contact", name: "A person", email: "person@example.com", category: "Buying", message: "I would like to ask a question.", website: "" });
  assert.equal(validContact.success, true);
  const invalidEmail = enquirySchema.safeParse({ kind: "contact", name: "A person", email: "bad-address", category: "Buying", message: "I would like to ask a question.", website: "" });
  assert.equal(invalidEmail.success, false);
  const missingPhone = enquirySchema.safeParse({ kind: "valuation", name: "A person", email: "person@example.com", location: "Champel", propertyType: "Apartment", website: "" });
  assert.equal(missingPhone.success, false);
  const invalidViewingReference = enquirySchema.safeParse({ kind: "viewing", name: "A person", email: "person@example.com", property: { id: "", slug: "", title: "" }, website: "" });
  assert.equal(invalidViewingReference.success, false);
});

test("property filtering and sorting remain consistent with listing query values", () => {
  const filters = parsePropertyFilters(new URLSearchParams("minPrice=1000000&maxPrice=2000000&minBeds=3&type=Apartment&area=Champel"));
  const matches = filterProperties(demoProperties, "sale", filters);
  assert.deepEqual(matches.map((property) => property.slug), ["champel-family-apartment"]);
  assert.equal(filterProperties(demoProperties, "sale", parsePropertyFilters(new URLSearchParams("sort=price-asc")))[0].priceChf, 895000);
  assert.equal(filterProperties(demoProperties, "sale", parsePropertyFilters(new URLSearchParams("sort=price-desc")))[0].priceChf, 4850000);
});

test("CHF formatting is deterministic and uses Swiss grouping", () => {
  assert.equal(CHF_FORMAT.locale, "fr-CH");
  assert.equal(CHF_FORMAT.currency, "CHF");
  assert.equal(formatChfPrice(2_350_000), "2'350'000\u00a0CHF");
  assert.equal(formatChfPrice(895_000), "895'000\u00a0CHF");
  assert.equal(formatChfPrice(1_234.5, { maximumFractionDigits: 2 }), "1'234.5\u00a0CHF");
  assert.equal(formatChfPrice(1_234.5, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "1'234.50\u00a0CHF");
  assert.equal(formatChfPrice(1_234.567, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "1'234.57\u00a0CHF");
  assert.throws(() => formatChfPrice(Number.NaN), RangeError);
});

test("repository returns deliberate unavailable errors without DATABASE_URL", async () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    assert.throws(() => getDatabase(), DatabaseUnavailableError);
    await assert.rejects(() => listProperties("sale", parsePropertyFilters(new URLSearchParams())), DatabaseUnavailableError);
    const parsed = enquirySchema.parse({ kind: "contact", name: "A person", email: "person@example.com", category: "Buying", message: "I would like to ask a question.", website: "" });
    assert.deepEqual(await saveEnquiry(parsed), { saved: false, reason: "database-unavailable" });
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});

test("generated migrations include foreign keys, indexes, and per-kind enquiry requirements", () => {
  const migration = readFileSync(resolve("drizzle/0001_clean_wendell_vaughn.sql"), "utf8");
  const initialMigration = readFileSync(resolve("drizzle/0000_nifty_tarantula.sql"), "utf8");
  assert.match(migration, /FOREIGN KEY \("property_id"\)/);
  assert.match(migration, /enquiries_required_details_by_type/);
  assert.match(migration, /ON DELETE no action/);
  assert.match(initialMigration, /CREATE UNIQUE INDEX "properties_slug_unique"/);
});

test("admin property input rejects unsafe paths and invalid listing fields", () => {
  const valid = {
    slug: "sample-geneva-home", title: "A sample Geneva home", description: "A sufficiently detailed property description for validation.",
    propertyType: "Apartment", transactionType: "sale", area: "Eaux-Vives", priceChf: 1000000, bedrooms: 2, bathrooms: 1, areaSqM: 90,
    imagePaths: ["/images/buy-interior.jpg"], keyFeatures: ["Bright rooms"], featured: false, publicationStatus: "draft", isFictional: false, listedAt: "2026-01-01",
  };
  assert.equal(propertyInputSchema.safeParse(valid).success, true);
  assert.equal(propertyInputSchema.safeParse({ ...valid, imagePaths: ["https://example.com/image.jpg"] }).success, false);
  assert.equal(propertyInputSchema.safeParse({ ...valid, slug: "Invalid Slug" }).success, false);
  assert.equal(enquiryStatusSchema.safeParse("closed").success, true);
  assert.equal(enquiryStatusSchema.safeParse("deleted").success, false);
});

test("admin credentials require the configured email and matching bcrypt password", async () => {
  const previousEmail = process.env.ADMIN_EMAIL;
  const previousHash = process.env.ADMIN_PASSWORD_HASH;
  const knownPassword = "correct horse battery staple 7!";
  process.env.ADMIN_EMAIL = "admin@example.test";
  process.env.ADMIN_PASSWORD_HASH = await hashAdminPassword(knownPassword);
  try {
    assert.equal(await verifyAdminCredentials("ADMIN@example.test", knownPassword), true);
    assert.equal(await verifyAdminCredentials("other@example.test", knownPassword), false);
    assert.equal(await verifyAdminCredentials("admin@example.test", "wrong password value"), false);
    assert.equal(await diagnoseAdminCredentials("admin@example.test", "wrong password value"), "password-mismatch");
    assert.equal(await diagnoseAdminCredentials("other@example.test", knownPassword), "email-mismatch");
    assert.equal(loginSchema.safeParse({ email: " admin@example.test ", password: knownPassword }).success, true);
    process.env.ADMIN_PASSWORD_HASH = "not-a-bcrypt-hash";
    assert.equal(await diagnoseAdminCredentials("admin@example.test", "anything"), "invalid-hash");
  } finally {
    if (previousEmail === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = previousEmail;
    if (previousHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = previousHash;
  }
});

test("admin hash helper accepts only non-empty strong passwords", async () => {
  assert.equal(passwordPolicyError("") !== undefined, true);
  assert.equal(passwordPolicyError("short") !== undefined, true);
  assert.equal(passwordPolicyError("é".repeat(37)) !== undefined, true);
  await assert.rejects(() => hashAdminPassword(""));
  const generatedHash = await hashAdminPassword("known non-empty password 42");
  const previousEmail = process.env.ADMIN_EMAIL;
  const previousHash = process.env.ADMIN_PASSWORD_HASH;
  process.env.ADMIN_EMAIL = "configured@example.test";
  process.env.ADMIN_PASSWORD_HASH = generatedHash;
  try {
    assert.equal(await diagnoseAdminCredentials("configured@example.test", "known non-empty password 42"), "authenticated");
  } finally {
    if (previousEmail === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = previousEmail;
    if (previousHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = previousHash;
  }
});

test("bcrypt hashes survive Next.js environment expansion and the checker uses Next loading", () => {
  const bcryptLikeHash = `$2b$04$${"A".repeat(53)}`;
  const escapedHash = escapeForNextEnv(bcryptLikeHash);
  const script = `
    const { processEnv } = require("@next/env");
    const raw = process.argv[1];
    const escaped = process.argv[2];
    processEnv([{ path: ".env.local", contents: "LINDEN_RAW_TEST=" + raw + "\\nLINDEN_ESCAPED_TEST=" + escaped + "\\n", env: {} }], process.cwd(), { info() {}, error() {} }, true);
    process.stdout.write(JSON.stringify({ raw: process.env.LINDEN_RAW_TEST, escaped: process.env.LINDEN_ESCAPED_TEST }));
  `;
  const result = spawnSync(process.execPath, ["-e", script, bcryptLikeHash, escapedHash], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { raw: "", escaped: bcryptLikeHash });

  const checker = readFileSync(resolve("scripts/check-admin-password.mjs"), "utf8");
  assert.match(checker, /loadEnvConfig\(process\.cwd\(\)/);
});

test("admin password visibility control is hidden by default and does not submit its toggle", () => {
  const component = readFileSync(resolve("src/components/admin/admin-password-input.tsx"), "utf8");
  assert.match(component, /useState\(false\)/);
  assert.match(component, /type=\{visible \? "text" : "password"\}/);
  assert.match(component, /aria-label=\{visible \? "Hide password" : "Show password"\}/);
  assert.match(component, /type="button"/);
});

test("public property queries explicitly exclude draft records", () => {
  const repository = readFileSync(resolve("src/repositories/properties.ts"), "utf8");
  assert.match(repository, /inArray\(properties\.publicationStatus, \["demo", "published"\]\)/);
});

test("admin mutation policies surface duplicate slugs and block deleting referenced properties", () => {
  assert.equal(isDuplicateSlugError({ code: "23505" }), true);
  assert.equal(isDuplicateSlugError({ code: "08006" }), false);
  assert.equal(shouldBlockPropertyDeletion(1), true);
  assert.equal(shouldBlockPropertyDeletion(0), false);
});

test("admin database mutations and private enquiry reads require a server session", () => {
  const actions = readFileSync(resolve("src/lib/admin/actions.ts"), "utf8");
  for (const name of ["savePropertyAction", "setPropertyFlagAction", "deletePropertyAction", "updateEnquiryStatusAction", "dashboardData", "propertyRows", "enquiryRows", "enquiryById"]) {
    const start = actions.indexOf(`function ${name}(`);
    assert.notEqual(start, -1, `Missing ${name}`);
    const next = actions.indexOf("\nexport async function ", start + 1);
    const body = actions.slice(start, next === -1 ? undefined : next);
    assert.match(body, /await requireAdmin\(\)/, `${name} must check authorization`);
  }
});
