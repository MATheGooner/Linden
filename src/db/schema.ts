import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", ["sale", "rent"]);
export const propertyTypeEnum = pgEnum("property_type", ["Apartment", "Townhouse", "Villa"]);
export const propertyPublicationEnum = pgEnum("property_publication_status", ["draft", "published", "demo"]);
export const enquiryTypeEnum = pgEnum("enquiry_type", ["viewing", "valuation", "landlord", "contact"]);
export const enquiryStatusEnum = pgEnum("enquiry_status", ["new", "in_progress", "closed"]);
export const enquiryPropertyTypeEnum = pgEnum("enquiry_property_type", ["Apartment", "Townhouse", "Villa", "Other"]);
export const enquiryCategoryEnum = pgEnum("enquiry_category", ["Buying", "Renting", "Selling", "Letting", "Other"]);

export const properties = pgTable("properties", {
  id: varchar("id", { length: 60 }).primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  area: varchar("area", { length: 120 }).notNull(),
  publicLocation: varchar("public_location", { length: 200 }).notNull(),
  priceChf: integer("price_chf").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  areaSqM: integer("area_sq_m").notNull(),
  imagePaths: text("image_paths").array().notNull(),
  keyFeatures: text("key_features").array().notNull().default(sql`ARRAY[]::text[]`),
  featured: boolean("featured").notNull().default(false),
  isFictional: boolean("is_fictional").notNull().default(false),
  publicationStatus: propertyPublicationEnum("publication_status").notNull().default("draft"),
  listedAt: timestamp("listed_at", { withTimezone: true, mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("properties_slug_unique").on(table.slug),
  index("properties_transaction_status_price_idx").on(table.transactionType, table.publicationStatus, table.priceChf),
  index("properties_area_idx").on(table.area),
  check("properties_price_nonnegative", sql`${table.priceChf} >= 0`),
  check("properties_bedrooms_nonnegative", sql`${table.bedrooms} >= 0`),
  check("properties_bathrooms_nonnegative", sql`${table.bathrooms} >= 0`),
  check("properties_area_positive", sql`${table.areaSqM} > 0`),
  check("properties_images_present", sql`cardinality(${table.imagePaths}) > 0`),
]);

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: enquiryTypeEnum("type").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  propertyId: varchar("property_id", { length: 60 }).references(() => properties.id),
  preferredViewingAt: varchar("preferred_viewing_at", { length: 40 }),
  propertyLocation: varchar("property_location", { length: 240 }),
  propertyType: enquiryPropertyTypeEnum("property_type"),
  category: enquiryCategoryEnum("category"),
  message: text("message"),
  status: enquiryStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
}, (table) => [
  index("enquiries_type_created_idx").on(table.type, table.createdAt),
  index("enquiries_status_created_idx").on(table.status, table.createdAt),
  index("enquiries_property_idx").on(table.propertyId),
  check("enquiries_required_details_by_type", sql`
    (${table.type} <> 'viewing' OR ${table.propertyId} IS NOT NULL) AND
    (${table.type} <> 'valuation' OR (${table.phone} IS NOT NULL AND ${table.propertyLocation} IS NOT NULL AND ${table.propertyType} IS NOT NULL)) AND
    (${table.type} <> 'landlord' OR (${table.propertyLocation} IS NOT NULL AND ${table.propertyType} IS NOT NULL)) AND
    (${table.type} <> 'contact' OR (${table.category} IS NOT NULL AND ${table.message} IS NOT NULL))
  `),
]);
