"use client";

import { illustrativeGalleryImages } from "@/data/properties";
import type { properties } from "@/db/schema";
import { savePropertyAction } from "@/lib/admin/actions";
import { useActionState } from "react";

type Existing = typeof properties.$inferSelect;
const input = "w-full border border-line bg-paper px-3 py-2.5";

export function PropertyForm({ property, error }: { property?: Existing; error?: string }) {
  const [state, action, pending] = useActionState(savePropertyAction, { error });
  const textFields: [string, string, string][] = [
    ["title", "Title", property?.title ?? ""],
    ["slug", "Slug", property?.slug ?? ""],
    ["area", "Neighbourhood", property?.area ?? ""],
  ];
  const numberFields: [string, string, string | number][] = [
    ["priceChf", "Price (CHF)", property?.priceChf ?? ""],
    ["bedrooms", "Bedrooms", property?.bedrooms ?? 0],
    ["bathrooms", "Bathrooms", property?.bathrooms ?? 0],
    ["areaSqM", "Internal area (m²)", property?.areaSqM ?? ""],
  ];
  return <form action={action} className="mt-7 grid gap-5 md:grid-cols-2">
    {property && <input type="hidden" name="id" value={property.id} />}
    {state.error && <p role="alert" className="md:col-span-2 bg-red-50 p-4 text-sm text-red-900">{state.error === "slug" ? "That slug is already in use." : state.error === "validation" ? "Some fields need attention. Check required fields and use a verified project image." : "The property could not be saved. Review the form and try again."}</p>}
    {textFields.map(([name, label, value]) => <label className="grid gap-2 text-sm" key={name}>{label}<input required name={name} defaultValue={value} className={input} /></label>)}
    <label className="grid gap-2 text-sm">Property type<select className={input} name="propertyType" defaultValue={property?.propertyType ?? "Apartment"}><option>Apartment</option><option>Townhouse</option><option>Villa</option></select></label>
    <label className="grid gap-2 text-sm">Transaction<select className={input} name="transactionType" defaultValue={property?.transactionType ?? "sale"}><option value="sale">Sale</option><option value="rent">Rent</option></select></label>
    {numberFields.map(([name, label, value]) => <label className="grid gap-2 text-sm" key={name}>{label}<input className={input} type="number" min="0" name={name} defaultValue={value} /></label>)}
    <label className="grid gap-2 text-sm md:col-span-2">Description<textarea required minLength={20} maxLength={6000} name="description" defaultValue={property?.description ?? ""} rows={5} className={input} /></label>
    <label className="grid gap-2 text-sm md:col-span-2">Key features, one per line<textarea name="keyFeatures" defaultValue={property?.keyFeatures.join("\n") ?? ""} rows={3} className={input} /></label>
    <fieldset className="md:col-span-2"><legend className="mb-3 text-sm">Select local project photography</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{illustrativeGalleryImages.map(image => <label key={image.src} className="flex items-start gap-2 border border-line bg-paper p-3 text-sm"><input type="checkbox" name="imagePaths" value={image.src} defaultChecked={property?.imagePaths.includes(image.src) ?? false} /><span>{image.alt}</span></label>)}</div></fieldset>
    <label className="grid gap-2 text-sm">Publication status<select className={input} name="publicationStatus" defaultValue={property?.publicationStatus ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="demo">Demo</option></select></label>
    <label className="grid gap-2 text-sm">Listed date<input required className={input} name="listedAt" type="date" defaultValue={property?.listedAt.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10)} /></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={property?.featured ?? false} /> Featured</label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFictional" defaultChecked={property?.isFictional ?? false} /> Fictional demo record</label>
    <div className="md:col-span-2"><button disabled={pending} className="bg-forest px-6 py-3 text-sm text-paper disabled:opacity-60" type="submit">{pending ? "Saving…" : "Save property"}</button></div>
  </form>;
}
