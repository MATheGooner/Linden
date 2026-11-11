# Linden & Co. Real Estate

A fictional Geneva real estate agency website and Bitmason Labs portfolio project. The initial 14 property records are fictional demonstration content. They are not market listings, and their locally stored images are illustrative.

## Requirements

- Node.js 20.9 or newer and npm
- A Neon PostgreSQL database for property pages and durable enquiry storage

## Database setup

1. Create a project in the [Neon Console](https://console.neon.tech/). Choose a region close to the application deployment and copy its pooled PostgreSQL connection string.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to that Neon connection string. Keep the credential private; it is read only by server-side database code and Drizzle Kit. Never prefix it with `NEXT_PUBLIC_` or commit `.env.local`.
3. Install dependencies with `npm install`.
4. Apply the checked-in schema migrations with `npm run db:migrate`.
5. Seed the existing fictional portfolio with `npm run db:seed`. Seeding uses an upsert on the unique property slug and can be rerun safely.
6. Start the site with `npm run dev`.

## Administrator setup

Set these server-only variables in `.env.local` and in the deployment environment:

- `ADMIN_EMAIL`: the single administrator's login email.
- `ADMIN_PASSWORD_HASH`: a bcrypt hash for the administrator password. Run `npm run admin:hash-password` in an interactive terminal, enter a strong password when prompted (input is masked), then copy the printed assignment into `.env.local`. The helper escapes `$` so Next.js does not expand the bcrypt separators as environment-variable references. The password itself is never passed as a command argument or printed. The helper uses Inquirer’s terminal prompt so Windows PowerShell keyboard and paste input are handled by the prompt library.
- To test the password you remember against the current `.env.local` hash without printing it, run `npm run admin:check-password` in an interactive terminal. This uses the same bcrypt verifier as login and reports only whether it matched.
- `ADMIN_SESSION_SECRET`: at least 32 random characters; generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` and store it only in the local/deployment environment.

Do not use example or shared credentials. With all three variables set, open `/admin/login`; sessions use an eight-hour signed JWT in an HTTP-only, SameSite=Lax cookie, marked Secure in production. Login attempts are limited per process and reset on restart; use a shared rate limiter before running multiple production instances. Server actions use Next.js origin protections, and each database operation checks the session server-side. Do not expose these variables with a `NEXT_PUBLIC_` prefix.

The admin area includes database-backed property and enquiry lists, property create/edit/publish/feature/archive controls, related-enquiry-safe property deletion, enquiry detail, and status updates. Use `draft` to keep a listing private; public queries only include `published` or intentionally fictional `demo` content. Deletion is blocked when enquiries reference a property. The admin can only select the verified local image paths listed in the application.

Database credentials are not required to build the project. Without a reachable database, property listings and details show an explicit unavailable state; they do not display stale in-memory demo records. Valid enquiries receive a truthful not-saved response until the insert succeeds.

### Schema and migrations

Drizzle schema definitions are in `src/db/schema.ts`; migrations and snapshots are in `drizzle/`. After changing the schema, create a migration with `npm run db:generate`, review the generated SQL, then apply it with `npm run db:migrate`. Migration and seed commands require `DATABASE_URL`.

The `properties` table contains typed transaction/property/publication fields, Geneva-area public location, CHF pricing, room and area measurements, nonempty local-image arrays, key features, fictional/demo markers, and timestamps. The `enquiries` table stores a typed enquiry category, contact details, relevant structured fields, optional property relation, status, and timestamps. Database constraints and indexes enforce unique slugs, valid nonnegative measurements/prices, nonempty image arrays, enquiry details by kind, and efficient listing and enquiry lookups. Seed image paths are verified against the local asset set.

The seed imports all 14 records from `src/data/properties.ts` (8 sale and 6 rent), retaining IDs, slugs, descriptions, prices, transaction categories, and local imagery. It does not add street addresses or availability claims.

## Enquiries and abuse protection

`src/lib/enquiries/schema.ts` validates every form on the server. `src/lib/enquiries/repository.ts` writes only validated values and returns a saved result only after PostgreSQL confirms an inserted ID. Viewing requests are checked against a property record and protected by the foreign key. No email notifications are sent.

The route includes a same-origin check, request body limit, honeypot, and a small in-memory per-process rate limit. That limiter resets on restart and is not shared across server instances; production deployments needing distributed abuse protection should use a shared rate limiter or edge service in a later milestone.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` runs schema, validation, property filtering, seed-upsert, migration, and missing-database checks. It does not require Neon credentials. Live migration, seed, property-read, and enquiry-insert behavior must be verified after configuring `DATABASE_URL`.

## Production

```bash
npm run build
npm run start
```

Configure the same server-only `DATABASE_URL` in the deployment environment and apply migrations before routing traffic. The current database connection uses Neon's HTTP driver; it is suitable for independent application queries, not interactive multi-statement transactions.
