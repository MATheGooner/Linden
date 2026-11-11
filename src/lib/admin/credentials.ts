import "server-only";
import { compare } from "bcryptjs";

export type AdminCredentialResult = "authenticated" | "not-configured" | "invalid-hash" | "email-mismatch" | "password-mismatch";

export async function diagnoseAdminCredentials(email: string, password: string): Promise<AdminCredentialResult> {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !passwordHash) return "not-configured";
  if (!/^\$2[aby]\$\d\d\$[./A-Za-z0-9]{53}$/.test(passwordHash)) return "invalid-hash";
  let validPassword: boolean;
  try {
    validPassword = await compare(password, passwordHash);
  } catch {
    return "invalid-hash";
  }
  const emailMatches = email.trim().toLowerCase() === expectedEmail;
  if (!emailMatches) return "email-mismatch";
  return validPassword ? "authenticated" : "password-mismatch";
}

export async function verifyAdminCredentials(email: string, password: string) {
  return (await diagnoseAdminCredentials(email, password)) === "authenticated";
}
