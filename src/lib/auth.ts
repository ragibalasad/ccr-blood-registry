import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  // Hardcoded for local dev to avoid any env loading issues causing "replace" errors
  baseURL: "http://localhost:3000",
  secret: "sdlkfhaskfhklaslhflashfklashlf_at_least_32_chars_now",
  emailAndPassword: {
    enabled: true,
  },
});
