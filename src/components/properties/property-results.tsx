"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PropertyRecord, TransactionType } from "@/data/properties";
import { formatChfPrice } from "@/lib/currency";
import { emptyPropertyFilters, parsePropertyFilters, propertyFilterQuery, type PropertyFilters } from "@/lib/property-filters";

const controlClass = "mt-2 min-h-11 w-full border border-line bg-paper px-3 text-sm text-charcoal outline-offset-2 focus-visible:outline-2 focus-visible:outline-olive";

export function PropertyResults({ initialFilters, initialItems, initialTotal, initialError, transaction }: { initialFilters: PropertyFilters; initialItems: PropertyRecord[]; initialTotal: number; initialError: string | null; transaction: TransactionType }) {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const loadedQuery = useRef(propertyFilterQuery(initialFilters));
  const areas = ["Carouge", "Champel", "Cologny", "Eaux-Vives", "Plainpalais"];

  useEffect(() => {
    const canonical = propertyFilterQuery(filters);
    const current = new URLSearchParams(window.location.search);
    const currentSupported = propertyFilterQuery(parsePropertyFilters(current));
    if (currentSupported !== canonical || current.toString() !== canonical) {
      const url = `${window.location.pathname}${canonical ? `?${canonical}` : ""}`;
      window.history.replaceState(null, "", url);
    }
    if (canonical === loadedQuery.current) return;
    loadedQuery.current = canonical;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setItems([]);
    setTotal(0);
    const query = new URLSearchParams(canonical);
    query.set("transaction", transaction);
    void fetch(`/api/properties?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { items?: PropertyRecord[]; total?: number; page?: number; error?: string };
        if (!response.ok || !result.items || typeof result.total !== "number") throw new Error(result.error ?? "Property search is temporarily unavailable. Please try again.");
        setItems(result.items);
        setTotal(result.total);
        if (typeof result.page === "number" && result.page !== Number(filters.page)) setFilters((current) => ({ ...current, page: String(result.page) }));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Property search is temporarily unavailable. Please try again.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, retry, transaction]);

  useEffect(() => {
    function restoreFromUrl() {
      setFilters(parsePropertyFilters(new URLSearchParams(window.location.search)));
    }
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  function update<K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) {
    setFilters((current) => {
      if ((key === "minPrice" || key === "maxPrice") && value !== "") {
        const numeric = Number(value);
        if (!Number.isSafeInteger(numeric) || numeric < 0 || numeric > 100_000_000) return current;
        if (key === "minPrice" && current.maxPrice && numeric > Number(current.maxPrice)) {
          return { ...current, minPrice: String(numeric), maxPrice: "", page: "1" };
        }
        if (key === "maxPrice" && current.minPrice && numeric < Number(current.minPrice)) {
          return { ...current, minPrice: "", maxPrice: String(numeric), page: "1" };
        }
      }
      return { ...current, [key]: value, ...(key === "page" ? {} : { page: "1" }) };
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <aside className="self-start lg:sticky lg:top-6">
        <button aria-expanded={filtersOpen} aria-controls="property-filters" className="flex min-h-12 w-full items-center justify-between border-y border-line py-3 text-left text-sm font-medium text-forest lg:hidden" onClick={() => setFiltersOpen((open) => !open)} type="button">
          <span>Refine your search</span><span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
        </button>
        <div className={`${filtersOpen ? "block" : "hidden"} border-b border-line pb-6 pt-4 lg:block lg:border-y lg:py-5`} id="property-filters">
          <div className="mb-5 hidden items-center justify-between lg:flex">
            <h2 className="font-serif text-2xl text-forest">Refine</h2>
            <button className="text-xs text-olive underline underline-offset-4" onClick={() => setFilters(emptyPropertyFilters)} type="button">Reset</button>
          </div>
          <fieldset>
            <legend className="text-xs font-medium uppercase tracking-[0.16em] text-stone">Price in CHF{transaction === "rent" ? " per month" : ""}</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="mt-3 text-xs text-stone">Minimum<input className={controlClass} inputMode="numeric" min="0" step="1" onChange={(event) => update("minPrice", event.target.value)} placeholder="No minimum" type="number" value={filters.minPrice} /></label>
              <label className="mt-3 text-xs text-stone">Maximum<input className={controlClass} inputMode="numeric" min="0" step="1" onChange={(event) => update("maxPrice", event.target.value)} placeholder="No maximum" type="number" value={filters.maxPrice} /></label>
            </div>
          </fieldset>
          <label className="mt-5 block text-xs font-medium uppercase tracking-[0.16em] text-stone">Bedrooms<select className={controlClass} onChange={(event) => update("minBeds", event.target.value)} value={filters.minBeds} aria-label="Minimum bedrooms">
            <option value="">Any</option>{[1, 2, 3, 4].map((bed) => <option key={bed} value={bed}>{bed}+ bedrooms</option>)}
          </select></label>
          <label className="mt-5 block text-xs font-medium uppercase tracking-[0.16em] text-stone">Property type<select className={controlClass} onChange={(event) => update("type", event.target.value)} value={filters.type}>
            <option value="">All types</option>{["Apartment", "Townhouse", "Villa"].map((type) => <option key={type} value={type}>{type}</option>)}
          </select></label>
          <label className="mt-5 block text-xs font-medium uppercase tracking-[0.16em] text-stone">Neighbourhood<select className={controlClass} onChange={(event) => update("area", event.target.value)} value={filters.area}>
            <option value="">All areas</option>{areas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select></label>
          <button className="mt-5 min-h-11 w-full border border-line px-3 text-sm text-forest underline underline-offset-4 lg:hidden" onClick={() => setFilters(emptyPropertyFilters)} type="button">Reset filters</button>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-stone"><span className="font-medium text-charcoal">{total}</span> {total === 1 ? "property" : "properties"}{loading && <span className="ml-2">Updating…</span>}</p>
          <label className="flex items-center gap-3 text-sm text-stone">Sort by<select className="min-h-11 border border-line bg-paper px-3 text-sm text-charcoal outline-offset-2 focus-visible:outline-2 focus-visible:outline-olive" onChange={(event) => update("sort", event.target.value as PropertyFilters["sort"])} value={filters.sort}>
            <option value="recent">Most recently listed</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
          </select></label>
        </div>
        {error ? <div className="border-y border-line py-16 text-center sm:py-24" role="alert"><h2 className="font-serif text-3xl text-forest">Property search is unavailable.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone">{error} No cached property results are being shown.</p><button className="mt-6 min-h-11 border border-forest px-5 text-sm text-forest outline-offset-4 hover:bg-paper" onClick={() => { loadedQuery.current = "\u0000"; setRetry((value) => value + 1); }} type="button">Try again</button></div> : items.length ? <>
          <div aria-busy={loading} className={`grid gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {items.map((property) => <PropertyCard key={property.id} property={property} transaction={transaction} />)}
          </div>
          {total > 12 && <nav aria-label="Property results pages" className="mt-12 flex items-center justify-center gap-5 border-t border-line pt-6 text-sm"><button className="min-h-11 px-3 text-forest underline underline-offset-4 disabled:text-stone disabled:no-underline" disabled={filters.page === "1" || loading} onClick={() => update("page", String(Number(filters.page) - 1))} type="button">Previous</button><span aria-current="page">Page {filters.page} of {Math.ceil(total / 12)}</span><button className="min-h-11 px-3 text-forest underline underline-offset-4 disabled:text-stone disabled:no-underline" disabled={Number(filters.page) >= Math.ceil(total / 12) || loading} onClick={() => update("page", String(Number(filters.page) + 1))} type="button">Next</button></nav>}
        </> : loading ? <p aria-live="polite" className="border-y border-line py-16 text-center text-sm text-stone">Loading properties…</p> : <div className="border-y border-line py-16 text-center sm:py-24"><h2 className="font-serif text-3xl text-forest">No homes match these filters.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone">Try widening your price range or choosing a different area or home type.</p><button className="mt-6 min-h-11 bg-forest px-5 text-sm text-paper outline-offset-4 hover:bg-[#1b3027]" onClick={() => setFilters(emptyPropertyFilters)} type="button">Clear all filters</button></div>}
      </div>
    </div>
  );
}

function PropertyCard({ property, transaction }: { property: PropertyRecord; transaction: TransactionType }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="group min-w-0">
    <Link aria-label={`${property.title}, ${property.area}. ${formatChfPrice(property.priceChf)}${transaction === "rent" ? " per month" : ""}. View property details`} className="block outline-offset-4" href={`/properties/${property.slug}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e3d9]">
        {!imageFailed && <Image alt={property.image.alt} className="object-cover transition-transform duration-700 motion-reduce:transition-none motion-safe:group-hover:scale-[1.025]" fill onError={() => setImageFailed(true)} sizes="(min-width: 1280px) 28vw, (min-width: 640px) 44vw, 100vw" src={property.image.src} />}
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3"><h2 className="font-serif text-2xl leading-tight tracking-[-0.025em] text-forest group-hover:underline group-hover:decoration-line group-hover:underline-offset-4">{property.title}</h2><span className="shrink-0 pt-1 text-sm font-medium text-charcoal">{formatChfPrice(property.priceChf)}{transaction === "rent" && <span className="block text-right text-xs font-normal text-stone">per month</span>}</span></div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-olive">{property.area} · {property.propertyType}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone">{property.description}</p>
        <ul aria-label="Property details" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3 text-xs text-charcoal"><li>{property.bedrooms} bedrooms</li><li>{property.bathrooms} bathrooms</li><li>{property.areaSqM} m²</li></ul>
      </div>
    </Link>
  </article>;
}
