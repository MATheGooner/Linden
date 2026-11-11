import Link from "next/link";
import { dashboardData } from "@/lib/admin/actions";

export default async function AdminDashboard(){
 const d=await dashboardData();
 const metrics=[["Published properties",d.published],["Draft or demo",d.unpublished],["For sale",d.sale],["For rent",d.rent],["Total enquiries",d.totalEnquiries],["Awaiting follow-up",d.openEnquiries]] as const;
 return <><p className="text-xs uppercase tracking-[.2em] text-olive">Overview</p><h1 className="mt-2 font-serif text-4xl text-forest">Dashboard</h1><p className="mt-3 text-stone">A live summary from the property and enquiry records.</p><dl className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([label,value])=><div key={label} className="bg-paper p-6"><dt className="text-sm text-stone">{label}</dt><dd className="mt-3 font-serif text-4xl text-forest">{value}</dd></div>)}</dl><div className="mt-8 flex flex-wrap gap-4"><Link className="bg-forest px-5 py-3 text-sm text-paper" href="/admin/properties">Manage properties</Link><Link className="border border-forest px-5 py-3 text-sm text-forest" href="/admin/enquiries">Review enquiries</Link></div></>;
}
