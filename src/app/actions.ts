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
    
    const bloodGroup = formData.get("bloodGroup") as string;
    const contactInfo = formData.get("contactInfo") as string;
    const department = formData.get("department") as string;
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bloodGroup: bloodGroup || null,
        contactInfo: contactInfo || null,
        department: department || null,
      }
    });
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
