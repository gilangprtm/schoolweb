import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://smpn17denpasar.sch.id",
});

export const { signIn, signOut, signUp, useSession } = authClient;
