import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { loginAction } from "@/lib/admin/actions";
import { AdminPasswordInput } from "@/components/admin/admin-password-input";

export default async function AdminLogin({searchParams}:{searchParams:Promise<{error?:string}>}) {
  if(await isAdminAuthenticated()) redirect("/admin");
  const {error}=await searchParams;
  return <main className="mx-auto my-20 w-full max-w-md bg-paper p-8 shadow-sm"><p className="text-xs uppercase tracking-[.2em] text-olive">Secure access</p><h1 className="mt-3 font-serif text-4xl text-forest">Administrator sign in</h1><p className="mt-3 text-sm leading-6 text-stone">Sign in to manage the property portfolio and enquiries.</p>{error&&<p role="alert" className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error==="rate"?"Too many attempts. Try again in 15 minutes.":error==="setup"?"Administrator credentials and a 32-character session secret must be configured in the server environment.":error==="session"?"Credentials were verified, but a secure session could not be started. Contact the site administrator.":"The credentials could not be verified."}</p>}<form action={loginAction} className="mt-7 grid gap-5"><label className="grid gap-2 text-sm" htmlFor="admin-email">Email<input className="border border-line bg-ivory px-3 py-3 focus-visible:outline-2 focus-visible:outline-olive" id="admin-email" type="email" name="email" autoComplete="username" required maxLength={254}/></label><div className="grid gap-2 text-sm"><label htmlFor="admin-password">Password</label><AdminPasswordInput /></div><button className="bg-forest px-5 py-3 text-sm text-paper focus-visible:outline-2 focus-visible:outline-olive" type="submit">Sign in</button></form></main>;
}
