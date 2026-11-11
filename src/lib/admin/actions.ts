"use server";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, createAdminSession, destroyAdminSession, checkLoginRateLimit, requestKey } from "./auth";
import { diagnoseAdminCredentials } from "./credentials";
import { deletePropertySchema, enquiryStatusSchema, loginSchema, propertyFlagSchema, propertyInputSchema } from "./schemas";
import { isDuplicateSlugError, shouldBlockPropertyDeletion } from "./policies";
import { getDatabase } from "@/db";
import { enquiries, properties } from "@/db/schema";

export async function loginAction(form: FormData) {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    console.warn("[admin-auth] configuration incomplete", { emailConfigured: Boolean(process.env.ADMIN_EMAIL?.trim()), passwordHashConfigured: Boolean(process.env.ADMIN_PASSWORD_HASH), sessionSecretConfigured: Boolean(process.env.ADMIN_SESSION_SECRET), sessionSecretMeetsMinimum: (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32 });
    redirect("/admin/login?error=setup");
  }
  const key = await requestKey();
  if (!(await checkLoginRateLimit(key))) {
    console.warn("[admin-auth] login rate limited");
    redirect("/admin/login?error=rate");
  }
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) {
    console.warn("[admin-auth] invalid login input", { emailFieldValid: !parsed.error.issues.some(issue => issue.path[0] === "email"), passwordFieldValid: !parsed.error.issues.some(issue => issue.path[0] === "password") });
    redirect("/admin/login?error=invalid");
  }
  const credentialResult = await diagnoseAdminCredentials(parsed.data.email, parsed.data.password);
  if (credentialResult !== "authenticated") {
    console.warn("[admin-auth] credential verification failed", { result: credentialResult });
    redirect("/admin/login?error=invalid");
  }
  try {
    await createAdminSession();
  } catch {
    console.error("[admin-auth] session creation failed", { stage: "signing_or_cookie_write" });
    redirect("/admin/login?error=session");
  }
  console.info("[admin-auth] login successful");
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function savePropertyAction(_previousState: { error?: string }, form: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const isEdit = Boolean(form.get("id"));
  const parsed = propertyInputSchema.safeParse({
    id: form.get("id") || undefined, slug: form.get("slug"), title: form.get("title"), description: form.get("description"), propertyType: form.get("propertyType"),
    transactionType: form.get("transactionType"), area: form.get("area"), priceChf: form.get("priceChf"), bedrooms: form.get("bedrooms"), bathrooms: form.get("bathrooms"),
    areaSqM: form.get("areaSqM"), imagePaths: form.getAll("imagePaths"), keyFeatures: String(form.get("keyFeatures") ?? "").split("\n").map(s=>s.trim()).filter(Boolean),
    featured: form.get("featured") === "on", publicationStatus: form.get("publicationStatus"), isFictional: form.get("isFictional") === "on", listedAt: form.get("listedAt"),
  });
  if (!parsed.success) return { error: "validation" };
  const data = { ...parsed.data, id: parsed.data.id ?? randomUUID(), publicLocation: `${parsed.data.area}, Geneva`, updatedAt: new Date() };
  let saveError: unknown;
  try {
    const db = getDatabase();
    if (isEdit) await db.update(properties).set(data).where(eq(properties.id, data.id));
    else await db.insert(properties).values(data);
  } catch (error) {
    saveError = error;
  }
  if (saveError) {
    return { error: isDuplicateSlugError(saveError) ? "slug" : "save" };
  }
  revalidatePath("/admin"); revalidatePath("/admin/properties"); revalidatePath("/properties/for-sale"); revalidatePath("/properties/to-rent"); revalidatePath(`/properties/${data.slug}`);
  redirect("/admin/properties?saved=1");
}

export async function setPropertyFlagAction(form: FormData) {
  await requireAdmin();
  const parsed = propertyFlagSchema.safeParse({ id: form.get("id"), field: form.get("field"), value: form.get("value") === "true" });
  if (!parsed.success) redirect("/admin/properties?error=invalid");
  const { id, field, value } = parsed.data;
  const db = getDatabase();
  if (field === "featured") await db.update(properties).set({ featured: value, updatedAt: new Date() }).where(eq(properties.id,id));
  else await db.update(properties).set({ publicationStatus: value ? "published" : "draft", updatedAt: new Date() }).where(eq(properties.id,id));
  revalidatePath("/admin"); revalidatePath("/admin/properties"); revalidatePath("/properties/for-sale"); revalidatePath("/properties/to-rent");
  redirect("/admin/properties?updated=1");
}

export async function deletePropertyAction(form: FormData) {
  await requireAdmin();
  const parsed = deletePropertySchema.safeParse({ id: form.get("id"), confirm: form.get("confirm") });
  if (!parsed.success) redirect("/admin/properties?error=confirm");
  const { id } = parsed.data;
  const db = getDatabase();
  const refs = await db.select({ value: sql<number>`count(*)::int` }).from(enquiries).where(eq(enquiries.propertyId,id));
  if (shouldBlockPropertyDeletion(refs[0]?.value ?? 0)) redirect("/admin/properties?error=referenced");
  await db.delete(properties).where(eq(properties.id,id));
  revalidatePath("/admin/properties"); revalidatePath("/properties/for-sale"); revalidatePath("/properties/to-rent");
  redirect("/admin/properties?deleted=1");
}

export async function updateEnquiryStatusAction(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? ""); const status = enquiryStatusSchema.safeParse(form.get("status"));
  if (!id || !status.success) redirect("/admin/enquiries?error=invalid");
  await getDatabase().update(enquiries).set({ status: status.data, updatedAt: new Date() }).where(eq(enquiries.id,id));
  revalidatePath("/admin"); revalidatePath("/admin/enquiries"); revalidatePath(`/admin/enquiries/${id}`);
  redirect(form.get("returnTo") === "detail" ? `/admin/enquiries/${encodeURIComponent(id)}?updated=1` : "/admin/enquiries?updated=1");
}

export async function dashboardData() {
  await requireAdmin(); const db=getDatabase();
  const [published]=await db.select({value:sql<number>`count(*)::int`}).from(properties).where(eq(properties.publicationStatus,"published"));
  const [unpublished]=await db.select({value:sql<number>`count(*)::int`}).from(properties).where(inArray(properties.publicationStatus,["draft","demo"]));
  const [sale]=await db.select({value:sql<number>`count(*)::int`}).from(properties).where(eq(properties.transactionType,"sale"));
  const [rent]=await db.select({value:sql<number>`count(*)::int`}).from(properties).where(eq(properties.transactionType,"rent"));
  const [totalEnquiries]=await db.select({value:sql<number>`count(*)::int`}).from(enquiries);
  const [openEnquiries]=await db.select({value:sql<number>`count(*)::int`}).from(enquiries).where(inArray(enquiries.status,["new","in_progress"]));
  return {published:published.value,unpublished:unpublished.value,sale:sale.value,rent:rent.value,totalEnquiries:totalEnquiries.value,openEnquiries:openEnquiries.value};
}

export async function propertyRows(search="", transaction="", status="") {
  await requireAdmin(); const conditions=[];
  if(transaction==="sale"||transaction==="rent") conditions.push(eq(properties.transactionType,transaction));
  if(status==="draft"||status==="published"||status==="demo") conditions.push(eq(properties.publicationStatus,status));
  const query=search.trim(); if(query) conditions.push(or(ilike(properties.title,`%${query}%`),ilike(properties.slug,`%${query}%`),ilike(properties.area,`%${query}%`))!);
  return getDatabase().select().from(properties).where(conditions.length?and(...conditions):undefined).orderBy(desc(properties.updatedAt)).limit(200);
}

export async function enquiryRows(status="", type="", search="") {
  await requireAdmin(); const conditions=[];
  if(status==="new"||status==="in_progress"||status==="closed") conditions.push(eq(enquiries.status,status));
  if(type==="viewing"||type==="valuation"||type==="landlord"||type==="contact") conditions.push(eq(enquiries.type,type));
  const query=search.trim(); if(query) conditions.push(or(ilike(enquiries.name,`%${query}%`),ilike(enquiries.email,`%${query}%`))!);
  return getDatabase().select({enquiry:enquiries,property:properties}).from(enquiries).leftJoin(properties,eq(enquiries.propertyId,properties.id)).where(conditions.length?and(...conditions):undefined).orderBy(desc(enquiries.createdAt)).limit(200);
}

export async function enquiryById(id: string) {
  await requireAdmin(); const [row]=await getDatabase().select({enquiry:enquiries,property:properties}).from(enquiries).leftJoin(properties,eq(enquiries.propertyId,properties.id)).where(eq(enquiries.id,id)).limit(1); return row ?? null;
}

