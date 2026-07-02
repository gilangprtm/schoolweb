import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://smpn17denpasar.my.id",
});

export const { signIn, signOut, signUp, useSession } = authClient;
