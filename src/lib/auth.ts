import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    /*
      The drizzle adapter maps to our Drizzle instance using the
      standard Better Auth table schemas.
    */
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  /*
    Map to our custom users table. Better Auth stores users in the
    "user" table by default. We've named ours "users" (plural).
    The adapter's usePlural option handles the table name mapping.
  */
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "admin",
        // Role-based access: "superadmin" | "admin"
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
