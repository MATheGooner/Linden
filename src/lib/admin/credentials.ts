import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

export type AdminCredentialResult = "authenticated" | "not-configured" | "email-mismatch" | "password-mismatch";

export async function diagnoseAdminCredentials(email: string, password: string): Promise<AdminCredentialResult> {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return "not-configured";
  const emailMatches = email.trim().toLowerCase() === expectedEmail;
  if (!emailMatches) return "email-mismatch";
  const submittedDigest = createHash("sha256").update(password, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expectedPassword, "utf8").digest();
  const validPassword = timingSafeEqual(submittedDigest, expectedDigest);
  return validPassword ? "authenticated" : "password-mismatch";
}

export async function verifyAdminCredentials(email: string, password: string) {
  return (await diagnoseAdminCredentials(email, password)) === "authenticated";
}
