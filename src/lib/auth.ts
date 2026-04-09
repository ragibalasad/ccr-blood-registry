import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Dynamically set baseURL if possible, but fallback to env for Better Auth inference
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
     google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
     }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
      bloodGroup: {
        type: "string",
      },
      contactInfo: {
        type: "string",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const settings = await prisma.systemSetting.findUnique({
            where: { id: "config" },
          });
          if (settings && !settings.registrationEnabled) {
            throw new Error("Registration is currently disabled by the administrator.");
          }
        },
      },
    },
  },
});
