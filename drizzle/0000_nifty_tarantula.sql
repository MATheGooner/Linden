CREATE TYPE "public"."enquiry_category" AS ENUM('Buying', 'Renting', 'Selling', 'Letting', 'Other');--> statement-breakpoint
CREATE TYPE "public"."enquiry_property_type" AS ENUM('Apartment', 'Townhouse', 'Villa', 'Other');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'in_progress', 'closed');--> statement-breakpoint
CREATE TYPE "public"."enquiry_type" AS ENUM('viewing', 'valuation', 'landlord', 'contact');--> statement-breakpoint
CREATE TYPE "public"."property_publication_status" AS ENUM('draft', 'published', 'demo');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('Apartment', 'Townhouse', 'Villa');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('sale', 'rent');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "enquiry_type" NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(40),
	"property_id" varchar(60),
	"preferred_viewing_at" varchar(40),
	"property_location" varchar(240),
	"property_type" "enquiry_property_type",
	"category" "enquiry_category",
	"message" text,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar(60) PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"property_type" "property_type" NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"area" varchar(120) NOT NULL,
	"public_location" varchar(200) NOT NULL,
	"price_chf" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"area_sq_m" integer NOT NULL,
	"image_paths" text[] NOT NULL,
	"key_features" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_fictional" boolean DEFAULT false NOT NULL,
	"publication_status" "property_publication_status" DEFAULT 'draft' NOT NULL,
	"listed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_price_nonnegative" CHECK ("properties"."price_chf" >= 0),
	CONSTRAINT "properties_bedrooms_nonnegative" CHECK ("properties"."bedrooms" >= 0),
	CONSTRAINT "properties_bathrooms_nonnegative" CHECK ("properties"."bathrooms" >= 0),
	CONSTRAINT "properties_area_positive" CHECK ("properties"."area_sq_m" > 0),
	CONSTRAINT "properties_images_present" CHECK (cardinality("properties"."image_paths") > 0)
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_type_created_idx" ON "enquiries" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_status_created_idx" ON "enquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_property_idx" ON "enquiries" USING btree ("property_id");--> statement-breakpoint
CREATE UNIQUE INDEX "properties_slug_unique" ON "properties" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "properties_transaction_status_price_idx" ON "properties" USING btree ("transaction_type","publication_status","price_chf");--> statement-breakpoint
CREATE INDEX "properties_area_idx" ON "properties" USING btree ("area");