import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { demoProperties } from "@/data/properties";
import { getDatabase, type LindenDatabase } from "./client";
import { properties } from "@/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

export function toDemoSeedRows() {
  return demoProperties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    transactionType: property.transactionType,
    area: property.area,
    publicLocation: property.publicLocation,
    priceChf: property.priceChf,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqM: property.areaSqM,
    imagePaths: property.gallery.map(({ src }) => src),
    keyFeatures: property.keyFeatures,
    featured: property.featured,
    isFictional: true,
    publicationStatus: "demo" as const,
    listedAt: new Date(`${property.listedAt}T12:00:00.000Z`),
  }));
}

export async function seedDemoProperties(database: LindenDatabase = getDatabase()) {
  const rows = toDemoSeedRows();
  await database.insert(properties).values(rows).onConflictDoUpdate({
    target: properties.slug,
    set: {
      imagePaths: sql`CASE
        WHEN ${properties.imagePaths} = ARRAY[
          '/images/buy-interior.jpg',
          '/images/geneva-architecture.jpg',
          '/images/geneva-old-town.jpg',
          '/images/carouge-street.jpg',
          '/images/geneva-facade.jpg',
          '/images/paris-bedroom.jpg'
        ]::text[]
        THEN excluded.image_paths
        ELSE ${properties.imagePaths}
      END`,
      updatedAt: sql`CASE
        WHEN ${properties.imagePaths} = ARRAY[
          '/images/buy-interior.jpg',
          '/images/geneva-architecture.jpg',
          '/images/geneva-old-town.jpg',
          '/images/carouge-street.jpg',
          '/images/geneva-facade.jpg',
          '/images/paris-bedroom.jpg'
        ]::text[]
        THEN now()
        ELSE ${properties.updatedAt}
      END`,
    },
  });
  return rows.length;
}

if (process.argv[1]?.endsWith("seed.ts")) {
  seedDemoProperties()
    .then((count) => console.log(`Seeded ${count} fictional portfolio properties (safe to rerun).`))
    .catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      console.error(`Property seeding failed: ${detail}`);
      process.exitCode = 1;
    });
}
