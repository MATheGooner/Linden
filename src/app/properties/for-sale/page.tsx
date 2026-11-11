import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/property-listing-page";

export const metadata: Metadata = { title: "Homes for sale | Linden & Co. Real Estate", description: "Explore fictional portfolio examples of homes for sale around Geneva." };

export default function ForSalePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PropertyListingPage config={{ transaction: "sale", title: "Homes for sale", eyebrow: "A place to call your own", intro: "Explore a considered collection of fictional homes across Geneva and its surrounding neighbourhoods." }} searchParams={searchParams} />;
}
