import { password as passwordPrompt } from "@inquirer/prompts";
import nextEnv from "@next/env";
import { diagnoseAdminCredentials } from "../src/lib/admin/credentials.ts";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", undefined, true);

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
  process.stderr.write("ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing from .env.local.\n");
  process.exitCode = 1;
} else {
  try {
    const enteredPassword = await passwordPrompt({
      message: "Enter the administrator password to check against .env.local",
      mask: "*",
      toggleMask: false,
    });
    const result = await diagnoseAdminCredentials(process.env.ADMIN_EMAIL, enteredPassword);
    if (result === "authenticated") {
      process.stdout.write("The password matches the credentials loaded from .env.local.\n");
    } else {
      process.stderr.write(`The local credential check failed (${result}).\n`);
      process.exitCode = 1;
    }
  } catch {
    process.stderr.write("Credential check could not run. Use an interactive terminal.\n");
    process.exitCode = 1;
  }
}
