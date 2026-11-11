import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "linden_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;
const attempts = new Map<string, { count: number; started: number }>();

function sessionKey() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(value);
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" })
    .setSubject("admin").setIssuedAt().setExpirationTime(`${SESSION_SECONDS}s`).sign(sessionKey());
  (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: SESSION_SECONDS });
}

export async function destroyAdminSession() {
  // Cookie deletion must use the same path as creation. `delete(name)` uses
  // the default `/` path, which does not expire this `/admin` scoped cookie.
  (await cookies()).set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, sessionKey(), { algorithms: ["HS256"], subject: "admin" });
    return payload.role === "admin";
  } catch { return false; }
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export async function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const previous = attempts.get(key);
  if (!previous || now - previous.started > 15 * 60_000) {
    attempts.set(key, { count: 1, started: now });
    return true;
  }
  if (previous.count >= 5) return false;
  previous.count += 1;
  return true;
}

export async function requestKey() {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}
