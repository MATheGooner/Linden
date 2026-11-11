import type { PropertyRecord, PropertyType, TransactionType } from "@/data/properties";

export type PropertySort = "recent" | "price-asc" | "price-desc";
export type PropertyFilters = {
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  type: string;
  area: string;
  sort: PropertySort;
  page: string;
};

export const emptyPropertyFilters: PropertyFilters = {
  minPrice: "", maxPrice: "", minBeds: "", type: "", area: "", sort: "recent", page: "1",
};

const isPropertyType = (value: string): value is PropertyType =>
  value === "Apartment" || value === "Townhouse" || value === "Villa";

export function parsePropertyFilters(params: URLSearchParams): PropertyFilters {
  const bounded = (key: string) => {
    const raw = params.get(key);
    if (!raw || !/^\d+$/.test(raw)) return "";
    const value = Number(raw);
    return Number.isSafeInteger(value) && value >= 0 && value <= 100_000_000 ? String(value) : "";
  };
  const minPrice = bounded("minPrice");
  const maxPrice = bounded("maxPrice");
  const sortValue = params.get("sort");
  const pageValue = params.get("page");
  const page = pageValue && /^\d+$/.test(pageValue) && Number(pageValue) >= 1 && Number(pageValue) <= 10000 ? String(Number(pageValue)) : "1";
  return {
    minPrice: minPrice && maxPrice && Number(minPrice) > Number(maxPrice) ? "" : minPrice,
    maxPrice: minPrice && maxPrice && Number(minPrice) > Number(maxPrice) ? "" : maxPrice,
    minBeds: ["1", "2", "3", "4"].includes(params.get("minBeds") ?? "") ? params.get("minBeds")! : "",
    type: isPropertyType(params.get("type") ?? "") ? params.get("type")! : "",
    area: ["Eaux-Vives", "Champel", "Plainpalais", "Carouge", "Cologny"].includes(params.get("area") ?? "") ? params.get("area")! : "",
    sort: sortValue === "price-asc" || sortValue === "price-desc" ? sortValue : "recent",
    page,
  };
}

export function propertyFilterQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  for (const key of ["minPrice", "maxPrice", "minBeds", "type", "area"] as const) {
    if (filters[key]) params.set(key, filters[key]);
  }
  if (filters.sort !== "recent") params.set("sort", filters.sort);
  if (filters.page !== "1") params.set("page", filters.page);
  return params.toString();
}

export function filterProperties(properties: PropertyRecord[], transaction: TransactionType, filters: PropertyFilters): PropertyRecord[] {
  return properties
    .filter((property) => property.transactionType === transaction)
    .filter((property) => !filters.minPrice || property.priceChf >= Number(filters.minPrice))
    .filter((property) => !filters.maxPrice || property.priceChf <= Number(filters.maxPrice))
    .filter((property) => !filters.minBeds || property.bedrooms >= Number(filters.minBeds))
    .filter((property) => !filters.type || property.propertyType === filters.type)
    .filter((property) => !filters.area || property.area === filters.area)
    .sort((a, b) => filters.sort === "price-asc" ? a.priceChf - b.priceChf : filters.sort === "price-desc" ? b.priceChf - a.priceChf : b.listedAt.localeCompare(a.listedAt));
}
