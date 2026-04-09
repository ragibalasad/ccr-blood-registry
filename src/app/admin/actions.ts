"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findUnique({
    where: { id: "config" },
  });
  
  if (!settings) {
    // Return defaults if not created yet
    return {
      registrationEnabled: true,
      dataEntryEnabled: true,
    };
  }
  
  return settings;
}

export async function updateSystemSettings(registrationEnabled: boolean, dataEntryEnabled: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    return { error: "Only administrators can change system settings." };
  }

  await prisma.systemSetting.upsert({
    where: { id: "config" },
    update: {
      registrationEnabled,
      dataEntryEnabled,
    },
    create: {
      id: "config",
      registrationEnabled,
      dataEntryEnabled,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/"); // Revalidate home for potential banners
  return { success: true };
}

// Emergency role promotion - for development use
export async function promoteSelfToAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "Not logged in" };
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "admin" }
    });

    return { success: true };
}
