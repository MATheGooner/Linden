import { z } from "zod";
import { illustrativeGalleryImages } from "@/data/properties";

const slug = z.string().trim().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens for the slug.");
const localImage = z.string().refine((value) => illustrativeGalleryImages.some((image) => image.src === value), "Choose a verified project image.");
export const propertyInputSchema = z.object({
  id: z.string().trim().min(1).max(60).optional(), slug, title: z.string().trim().min(5).max(200), description: z.string().trim().min(20).max(6000),
  propertyType: z.enum(["Apartment", "Townhouse", "Villa"]), transactionType: z.enum(["sale", "rent"]), area: z.string().trim().min(2).max(120),
  priceChf: z.coerce.number().int().min(0).max(2_000_000_000), bedrooms: z.coerce.number().int().min(0).max(30), bathrooms: z.coerce.number().int().min(0).max(30),
  areaSqM: z.coerce.number().int().positive().max(100_000), imagePaths: z.array(localImage).min(1).max(6), keyFeatures: z.array(z.string().trim().min(2).max(100)).max(20),
  featured: z.boolean(), publicationStatus: z.enum(["draft", "published", "demo"]), isFictional: z.boolean(), listedAt: z.coerce.date(),
});
export const enquiryStatusSchema = z.enum(["new", "in_progress", "closed"]);
export const loginSchema = z.object({ email: z.string().trim().pipe(z.email().max(254)), password: z.string().min(1).max(200) });
export const propertyFlagSchema = z.object({ id: z.string().min(1).max(60), field: z.enum(["featured", "publicationStatus"]), value: z.boolean() });
export const deletePropertySchema = z.object({ id: z.string().min(1).max(60), confirm: z.literal("delete") });
