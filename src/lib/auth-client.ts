import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://smpn17denpasar.edjavu.cloud",
});

export const { signIn, signOut, signUp, useSession } = authClient;
