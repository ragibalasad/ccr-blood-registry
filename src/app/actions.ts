"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Check if data entry is enabled
    // Note: Admins can bypass this restriction
    if (session.user.role !== "admin") {
      const settings = await prisma.systemSetting.findUnique({
        where: { id: "config" },
      });
      if (settings && !settings.dataEntryEnabled) {
        return { error: "Data entry is currently disabled by the administrator." };
      }
    }
    
    const bloodGroup = formData.get("bloodGroup") as string;
    const contactInfo = formData.get("contactInfo") as string;
    const department = formData.get("department") as string;
    const sessionYear = formData.get("sessionYear") as string;
    const lastDonatedAtStr = formData.get("lastDonatedAt") as string;
    const name = formData.get("name") as string;
    
    const lastDonatedAt = lastDonatedAtStr ? new Date(lastDonatedAtStr) : null;
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        bloodGroup: bloodGroup || null,
        contactInfo: contactInfo || null,
        department: department || null,
        sessionYear: sessionYear || null,
        lastDonatedAt,
      }
    });
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
