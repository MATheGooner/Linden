import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { logoutAction } from "@/lib/admin/actions";

export default async function AdminLayout({ children }: Readonly<{children:React.ReactNode}>) {
  const authenticated=await isAdminAuthenticated();
  return <div className="min-h-screen bg-ivory"><header className="border-b border-line bg-paper px-6 py-5 sm:px-10"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><Link href="/admin" className="font-serif text-2xl text-forest">Linden &amp; Co. <span className="font-sans text-xs uppercase tracking-widest text-stone">Administration</span></Link>{authenticated&&<nav className="flex items-center gap-5 text-sm"><Link href="/admin/properties">Properties</Link><Link href="/admin/enquiries">Enquiries</Link><form action={logoutAction}><button className="border border-line px-4 py-2 text-forest" type="submit">Log out</button></form></nav>}</div></header><main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">{children}</main></div>;
}
