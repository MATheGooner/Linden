import "server-only";
import { getDatabase, DatabaseUnavailableError } from "@/db";
import { enquiries } from "@/db/schema";
import type { EnquiryPayload } from "./schema";
import { getPropertyForViewing } from "@/repositories/properties";

export type SaveEnquiryResult =
  | { saved: true; reference: string }
  | { saved: false; reason: "database-unavailable" | "database-error" | "property-not-found" };

export async function saveEnquiry(payload: EnquiryPayload): Promise<SaveEnquiryResult> {
  try {
    const database = getDatabase();
    let values: typeof enquiries.$inferInsert;
    switch (payload.kind) {
      case "viewing": {
        const property = await getPropertyForViewing(payload.property);
        if (!property) return { saved: false, reason: "property-not-found" };
        values = {
          type: payload.kind,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || null,
          propertyId: property.id,
          preferredViewingAt: payload.preferredDateTime || null,
          message: payload.message || null,
        };
        break;
      }
      case "valuation":
      case "landlord":
        values = {
          type: payload.kind,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || null,
          propertyLocation: payload.location,
          propertyType: payload.propertyType,
          message: payload.message || null,
        };
        break;
      case "contact":
        values = {
          type: payload.kind,
          name: payload.name,
          email: payload.email,
          category: payload.category,
          message: payload.message,
        };
        break;
    }
    const [inserted] = await database.insert(enquiries).values(values).returning({ id: enquiries.id });
    if (!inserted) return { saved: false, reason: "database-error" };
    return { saved: true, reference: inserted.id };
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) return { saved: false, reason: "database-unavailable" };
    return { saved: false, reason: "database-error" };
  }
}
