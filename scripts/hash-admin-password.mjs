import { password as passwordPrompt } from "@inquirer/prompts";
import { hash } from "bcryptjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export function passwordPolicyError(password) {
  if (password.length < 12) return "Use a password of at least 12 characters.";
  if (Buffer.byteLength(password, "utf8") > 72) return "Use a password no longer than 72 UTF-8 bytes.";
  return undefined;
}

export async function hashAdminPassword(password) {
  const policyError = passwordPolicyError(password);
  if (policyError) throw new Error(policyError);
  return hash(password, 12);
}

export function escapeForNextEnv(value) {
  return value.replaceAll("$", "\\$");
}

export async function runPasswordHashPrompt() {
  const enteredPassword = await passwordPrompt({
    message: "Enter a strong administrator password",
    mask: "*",
    toggleMask: false,
    validate: (value) => passwordPolicyError(value) ?? true,
  });
  const passwordHash = await hashAdminPassword(enteredPassword);
  process.stdout.write(`ADMIN_PASSWORD_HASH=${escapeForNextEnv(passwordHash)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runPasswordHashPrompt().catch(() => {
    process.stderr.write("Password hash was not generated. Use an interactive terminal and enter a valid password.\n");
    process.exitCode = 1;
  });
}
