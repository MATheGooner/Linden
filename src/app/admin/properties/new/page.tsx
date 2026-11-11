import Link from "next/link";
import { PropertyForm } from "../property-form";
import { requireAdmin } from "@/lib/admin/auth";
export default async function NewProperty({searchParams}:{searchParams:Promise<{error?:string}>}){await requireAdmin();const {error}=await searchParams;return <><Link className="text-sm text-olive underline" href="/admin/properties">← Properties</Link><h1 className="mt-4 font-serif text-4xl text-forest">New property</h1><PropertyForm error={error}/></>}
