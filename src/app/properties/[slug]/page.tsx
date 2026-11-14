import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiries/enquiry-form";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { formatChfPrice } from "@/lib/currency";
import { getPropertyBySlug } from "@/repositories/properties";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let property;
  try {
    property = await getPropertyBySlug(slug);
  } catch {
    return { title: "Property details temporarily unavailable | Linden & Co. Real Estate" };
  }
  if (!property) return { title: "Property not found | Linden & Co. Real Estate" };
  return {
    title: `${property.title} | Linden & Co. Real Estate`,
    description: `${property.title} in ${property.area}, Geneva. A fictional ${property.transactionType === "sale" ? "home for sale" : "home to rent"} portfolio example.`,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let property;
  try {
    property = await getPropertyBySlug(slug);
  } catch {
    return <section className="flex-1 bg-paper px-[var(--space-page)] py-20"><div className="mx-auto max-w-3xl"><h1 className="font-serif text-4xl text-forest">Property details are unavailable.</h1><p className="mt-4 text-sm leading-7 text-stone">The property database could not be reached. Please try again later. No cached property details are being shown.</p></div></section>;
  }
  if (!property) notFound();
  const resultsHref = property.transactionType === "sale" ? "/properties/for-sale" : "/properties/to-rent";
  const price = `${formatChfPrice(property.priceChf)}${property.transactionType === "rent" ? " per month" : ""}`;

  return (
    <>
      <section className="bg-paper px-[var(--space-page)]">
        <div className="mx-auto max-w-7xl py-8 sm:py-12">
          <Link className="text-sm text-olive underline underline-offset-4 outline-offset-4 hover:text-forest" href={resultsHref}>← Back to {property.transactionType === "sale" ? "homes for sale" : "homes to rent"}</Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-olive">{property.area} · Geneva · {property.propertyType}</p>
              <h1 className="max-w-4xl font-serif text-[clamp(2.8rem,6.4vw,5.5rem)] leading-[1] tracking-[-0.045em] text-forest">{property.title}</h1>
            </div>
            <div className="lg:justify-self-end">
              <p className="mt-2 font-serif text-3xl text-forest sm:text-4xl">{price}</p>
              <Link className="mt-5 inline-flex min-h-12 items-center justify-center bg-forest px-5 text-sm text-paper outline-offset-4 hover:bg-[#1b3027]" href="#viewing-request">Request a viewing</Link>
            </div>
          </div>
          {property.isFictional && <div className="mt-8 border-l-2 border-olive pl-4 text-sm leading-6 text-stone">Fictional portfolio content only. This is not a real property and is not available on the market. All photographs on this page are illustrative and do not depict this home.</div>}
        </div>
      </section>

      <section className="px-[var(--space-page)] py-8 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.5fr)] lg:gap-16">
          <PropertyGallery images={property.gallery} illustrative={property.isFictional} title={property.title} />
          <aside className="self-start border-y border-line py-5 lg:sticky lg:top-8">
            <h2 className="font-serif text-2xl text-forest">At a glance</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              <Detail label="Bedrooms" value={String(property.bedrooms)} />
              <Detail label="Bathrooms" value={String(property.bathrooms)} />
              <Detail label="Internal area" value={`${property.areaSqM} m²`} />
              <Detail label="Property type" value={property.propertyType} />
              <Detail label="Neighbourhood" value={property.area} />
              <Detail label="Reference" value={property.id.toUpperCase()} />
            </dl>
            <Link className="mt-5 inline-flex min-h-11 items-center text-sm text-forest underline underline-offset-4 outline-offset-4" href="#viewing-request">Ask about this example</Link>
          </aside>
        </div>
      </section>

      <section className="bg-paper px-[var(--space-page)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-[0.7fr_1fr] sm:gap-16">
          <div><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-olive">The home</p><h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">A closer look</h2></div>
          <div><p className="text-base leading-8 text-stone">{property.description}</p><ul aria-label="Key property details" className="mt-7 grid gap-3 border-t border-line pt-5 text-sm text-charcoal sm:grid-cols-2"><li>{property.propertyType} in {property.area}</li><li>{property.bedrooms} bedrooms</li><li>{property.bathrooms} bathrooms</li><li>{property.areaSqM} m² internal area</li>{property.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        </div>
      </section>

      <section className="px-[var(--space-page)] py-14 sm:py-20" id="viewing-request">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <div className="max-w-md"><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-olive">A question about this property</p><h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">Request a viewing</h2><p className="mt-4 text-sm leading-7 text-stone">The form confirms only after the database saves your request. No email notifications are sent.</p></div>
          <EnquiryForm kind="viewing" property={{ id: property.id, slug: property.slug, title: property.title }} />
        </div>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-4 py-3 text-sm"><dt className="text-stone">{label}</dt><dd className="text-right font-medium text-charcoal">{value}</dd></div>;
}
