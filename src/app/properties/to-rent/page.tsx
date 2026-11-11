import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/property-listing-page";

export const metadata: Metadata = { title: "Homes to rent | Linden & Co. Real Estate", description: "Explore fictional portfolio examples of homes to rent around Geneva." };

export default function ToRentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PropertyListingPage config={{ transaction: "rent", title: "Homes to rent", eyebrow: "Find a place to settle", intro: "Browse fictional rental examples, from quiet apartments to larger homes in Geneva's neighbourhoods." }} searchParams={searchParams} />;
}
