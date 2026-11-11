ALTER TABLE "enquiries" DROP CONSTRAINT "enquiries_property_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_required_details_by_type" CHECK (
    ("enquiries"."type" <> 'viewing' OR "enquiries"."property_id" IS NOT NULL) AND
    ("enquiries"."type" <> 'valuation' OR ("enquiries"."phone" IS NOT NULL AND "enquiries"."property_location" IS NOT NULL AND "enquiries"."property_type" IS NOT NULL)) AND
    ("enquiries"."type" <> 'landlord' OR ("enquiries"."property_location" IS NOT NULL AND "enquiries"."property_type" IS NOT NULL)) AND
    ("enquiries"."type" <> 'contact' OR ("enquiries"."category" IS NOT NULL AND "enquiries"."message" IS NOT NULL))
  );