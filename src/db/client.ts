import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("The database is not configured or is currently unavailable.");
    this.name = "DatabaseUnavailableError";
  }
}

export type LindenDatabase = NeonHttpDatabase<typeof schema>;

let cachedDatabase: LindenDatabase | undefined;
let cachedUrl: string | undefined;

export function getDatabase(): LindenDatabase {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new DatabaseUnavailableError();
  if (cachedDatabase && cachedUrl === url) return cachedDatabase;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") throw new Error();
    cachedDatabase = drizzle({ client: neon(url), schema });
    cachedUrl = url;
    return cachedDatabase;
  } catch {
    throw new DatabaseUnavailableError();
  }
}
