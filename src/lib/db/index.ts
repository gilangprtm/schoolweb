import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Limit connections for low-memory environments (2GB VPS)
const client = postgres(databaseUrl, { prepare: false, max: 5, idle_timeout: 20 });

export const db = drizzle(client, { schema });
export { schema };
