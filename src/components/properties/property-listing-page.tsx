import Link from "next/link";
import type { PropertyRecord, TransactionType } from "@/data/properties";
import { parsePropertyFilters } from "@/lib/property-filters";
import { listProperties } from "@/repositories/properties";
import { PropertyResults } from "./property-results";

type ListingConfig = { transaction: TransactionType; title: string; intro: string; eyebrow: string };
type SearchParams = Record<string, string | string[] | undefined>;

export async function PropertyListingPage({ config, searchParams }: { config: ListingConfig; searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (typeof value === "string") query.set(key, value);
  let initialFilters = parsePropertyFilters(query);
  let items: PropertyRecord[] = [];
  let total = 0;
  let error: string | null = null;
  try {
    const result = await listProperties(config.transaction, initialFilters);
    items = result.items;
    total = result.total;
    initialFilters = { ...initialFilters, page: String(result.page) };
  } catch {
    error = "The property database could not be reached. Please try again later.";
  }
  return (
    <>
      <section className="bg-paper px-[var(--space-page)]">
        <div className="mx-auto max-w-7xl py-14 sm:py-20 lg:py-24">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-olive">{config.eyebrow} · Geneva</p>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <h1 className="max-w-4xl font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.05em] text-forest">{config.title}</h1>
            <div className="max-w-lg lg:justify-self-end">
              <p className="text-base leading-7 text-stone">{config.intro}</p>
              <nav aria-label="Property transaction" className="mt-5 flex gap-5 text-sm">
                <Link className={`underline underline-offset-4 ${config.transaction === "sale" ? "font-medium text-forest" : "text-stone"}`} href="/properties/for-sale" aria-current={config.transaction === "sale" ? "page" : undefined}>For sale</Link>
                <Link className={`underline underline-offset-4 ${config.transaction === "rent" ? "font-medium text-forest" : "text-stone"}`} href="/properties/to-rent" aria-current={config.transaction === "rent" ? "page" : undefined}>To rent</Link>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="px-[var(--space-page)] py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-l-2 border-olive pl-4 text-sm leading-6 text-stone">Fictional portfolio entries are labeled as examples. Images identified as illustrative do not depict a property.</div>
          <PropertyResults initialFilters={initialFilters} initialItems={items} initialTotal={total} initialError={error} transaction={config.transaction} />
        </div>
      </section>
    </>
  );
}
