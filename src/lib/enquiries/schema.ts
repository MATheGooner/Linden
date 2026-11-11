import { z } from "zod";

const name = z.string().trim().min(2, "Enter your name.").max(120, "Name must be 120 characters or fewer.");
const email = z.email("Enter a valid email address.").max(254, "Email address is too long.");
const phone = z.string().trim().max(40, "Phone number must be 40 characters or fewer.").optional().default("");
const requiredPhone = z.string().trim().min(5, "Enter a phone number.").max(40, "Phone number must be 40 characters or fewer.");
const message = z.string().trim().max(2000, "Message must be 2,000 characters or fewer.").optional().default("");
const location = z.string().trim().min(2, "Enter a property location.").max(240, "Location must be 240 characters or fewer.");
const propertyType = z.enum(["Apartment", "Townhouse", "Villa", "Other"], { error: "Choose a property type." });
const propertyReference = z.object({ id: z.string().min(1).max(40), slug: z.string().min(1).max(120), title: z.string().min(1).max(200) });
const trap = z.string().max(0).optional();

export const enquirySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("viewing"), name, email, phone, preferredDateTime: z.string().max(40).optional().default("").refine((value) => !value || Number.isFinite(Date.parse(value)), "Enter a valid preferred date and time."), message, property: propertyReference, website: trap }),
  z.object({ kind: z.literal("valuation"), name, email, phone: requiredPhone, location, propertyType, message, website: trap }),
  z.object({ kind: z.literal("landlord"), name, email, phone, location, propertyType, message, website: trap }),
  z.object({ kind: z.literal("contact"), name, email, category: z.enum(["Buying", "Renting", "Selling", "Letting", "Other"], { error: "Choose an enquiry category." }), message: z.string().trim().min(10, "Please add a little more detail.").max(2000, "Message must be 2,000 characters or fewer."), website: trap }),
]);

export type EnquiryPayload = z.infer<typeof enquirySchema>;
