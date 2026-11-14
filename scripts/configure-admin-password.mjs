import { password as passwordPrompt } from "@inquirer/prompts";
import nextEnv from "@next/env";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { verifyAdminCredentials } from "../src/lib/admin/credentials.ts";

export function formatEnvPassword(password) {
  return `"${password.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("$", "\\$")}"`;
}

export async function storeAdminPassword(password, filePath = ".env.local") {
  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 200 || /[\r\n]/.test(password)) {
    throw new Error("Use a password between 12 and 200 UTF-8 bytes.");
  }
  const contents = await readFile(filePath, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const assignment = `ADMIN_PASSWORD=${formatEnvPassword(password)}`;
  const updated = /^ADMIN_PASSWORD=.*$/m.test(contents)
    ? contents.replace(/^ADMIN_PASSWORD=.*$/m, assignment)
    : `${contents}${contents && !contents.endsWith("\n") ? "\n" : ""}${assignment}\n`;
  await writeFile(filePath, updated, "utf8");
}

export async function configureAdminPassword() {
  nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", undefined, true);
  const email = process.env.ADMIN_EMAIL?.trim();
  if (!email) throw new Error("ADMIN_EMAIL is missing from .env.local.");

  const password = await passwordPrompt({
    message: "Enter the administrator password to save (input is hidden)",
    mask: "*",
    toggleMask: false,
    validate: (value) => value.length >= 12 && Buffer.byteLength(value, "utf8") <= 200
      ? true
      : "Use a password between 12 and 200 UTF-8 bytes.",
  });

  await storeAdminPassword(password);
  delete process.env.ADMIN_PASSWORD;
  nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", undefined, true);
  if (!(await verifyAdminCredentials(email, process.env.ADMIN_PASSWORD ?? ""))) {
    throw new Error("The password could not be verified using the login credential checker.");
  }
  process.stdout.write("Administrator password saved and verified. Restart the application server before logging in.\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  configureAdminPassword().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : "Password setup failed."}\n`);
    process.exitCode = 1;
  });
}
