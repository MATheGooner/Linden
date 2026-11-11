import "server-only";
import { and, asc, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { illustrativeGalleryImages, type PropertyRecord, type TransactionType } from "@/data/properties";
import { getDatabase } from "@/db";
import { properties } from "@/db/schema";
import type { PropertyFilters } from "@/lib/property-filters";

export const PROPERTY_PAGE_SIZE = 12;

export async function listProperties(transaction: TransactionType, filters: PropertyFilters): Promise<{ items: PropertyRecord[]; total: number; page: number }> {
  const database = getDatabase();
  const conditions = [eq(properties.transactionType, transaction), inArray(properties.publicationStatus, ["demo", "published"])];
  if (filters.minPrice !== "") conditions.push(gte(properties.priceChf, Number(filters.minPrice)));
  if (filters.maxPrice !== "") conditions.push(lte(properties.priceChf, Number(filters.maxPrice)));
  if (filters.minBeds !== "") conditions.push(gte(properties.bedrooms, Number(filters.minBeds)));
  if (filters.type) conditions.push(eq(properties.propertyType, filters.type as "Apartment" | "Townhouse" | "Villa"));
  if (filters.area) conditions.push(eq(properties.area, filters.area));
  const where = and(...conditions);
  const requestedPage = Math.max(1, Math.min(10_000, Number(filters.page) || 1));
  const order = filters.sort === "price-asc" ? asc(properties.priceChf) : filters.sort === "price-desc" ? desc(properties.priceChf) : desc(properties.listedAt);
  const totalRows = await database.select({ value: count() }).from(properties).where(where);
  const total = totalRows[0]?.value ?? 0;
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / PROPERTY_PAGE_SIZE)));
  const rows = await database.select().from(properties).where(where).orderBy(order, asc(properties.id)).limit(PROPERTY_PAGE_SIZE).offset((page - 1) * PROPERTY_PAGE_SIZE);
  return { items: rows.map(toPropertyRecord), total, page };
}

export async function getPropertyBySlug(slug: string): Promise<PropertyRecord | null> {
  const database = getDatabase();
  const [row] = await database.select().from(properties).where(and(
    eq(properties.slug, slug),
    inArray(properties.publicationStatus, ["demo", "published"]),
  )).limit(1);
  return row ? toPropertyRecord(row) : null;
}

export async function getPropertyForViewing(reference: { id: string; slug: string; title: string }) {
  const database = getDatabase();
  const [row] = await database.select({ id: properties.id }).from(properties).where(and(
    eq(properties.id, reference.id),
    eq(properties.slug, reference.slug),
    eq(properties.title, reference.title),
    inArray(properties.publicationStatus, ["demo", "published"]),
  )).limit(1);
  return row ?? null;
}

function toPropertyRecord(row: typeof properties.$inferSelect): PropertyRecord {
  const paths = row.imagePaths.filter((path) => path.startsWith("/images/") && !path.includes(".."));
  const gallery = paths.map((path) => illustrativeGalleryImages.find((candidate) => candidate.src === path) ?? { src: path, alt: `Illustrative property photograph for ${row.title}` });
  if (gallery.length === 0) {
    throw new Error(`Property ${row.id} has no verified local photography.`);
  }
  const image = gallery[0];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    transactionType: row.transactionType,
    propertyType: row.propertyType,
    area: row.area,
    publicLocation: row.publicLocation,
    priceChf: row.priceChf,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqM: row.areaSqM,
    description: row.description,
    image,
    featured: row.featured,
    isFictional: row.isFictional,
    publicationStatus: row.publicationStatus,
    availabilityStatus: row.isFictional ? "fictional-demo" : "published",
    listedAt: row.listedAt.toISOString().slice(0, 10),
    keyFeatures: row.keyFeatures,
    gallery,
  };
}
