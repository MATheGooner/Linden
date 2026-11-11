import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { getDatabase } from "@/db";
import { properties } from "@/db/schema";
import { PropertyForm } from "../../property-form";
import { requireAdmin } from "@/lib/admin/auth";
export default async function EditProperty({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}){await requireAdmin();const [{id},{error}]=await Promise.all([params,searchParams]);const [property]=await getDatabase().select().from(properties).where(eq(properties.id,id)).limit(1);if(!property)notFound();return <><Link className="text-sm text-olive underline" href="/admin/properties">← Properties</Link><h1 className="mt-4 font-serif text-4xl text-forest">Edit property</h1><PropertyForm property={property} error={error}/></>}
