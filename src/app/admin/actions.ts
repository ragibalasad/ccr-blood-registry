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

export async function searchUsers(query: string, filter: string = "all") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" && session?.user.role !== "moderator") {
    return { error: "Unauthorized" };
  }

  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { department: { contains: query, mode: "insensitive" } },
    ];
  }

  if (filter === "verified") {
    where.verified = true;
  } else if (filter === "unverified") {
    where.verified = false;
  } else if (filter === "moderator") {
    where.role = "moderator";
  } else if (filter === "admin") {
    where.role = "admin";
  }

  const users = await prisma.user.findMany({
    where,
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  return { users };
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    return { error: "Unauthorized. Only administrators can change user roles." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateUserVerification(userId: string, verified: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" && session?.user.role !== "moderator") {
    return { error: "Unauthorized" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { verified },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" && session?.user.role !== "moderator") {
    return { error: "Unauthorized" };
  }

  const totalUsers = await prisma.user.count();
  const verifiedDonors = await prisma.user.count({
    where: { verified: true },
  });
  
  const bloodDist = await prisma.user.groupBy({
    by: ['bloodGroup'],
    _count: {
      bloodGroup: true,
    },
    where: {
      bloodGroup: { not: null },
    },
  });

  const departmentDist = await prisma.user.groupBy({
    by: ['department'],
    _count: {
      department: true,
    },
    where: {
      department: { not: null },
    },
  });

  return {
    totalUsers,
    verifiedDonors,
    bloodDist: bloodDist.map(d => ({ group: d.bloodGroup, count: d._count.bloodGroup })),
    departmentDist: departmentDist.map(d => ({ name: d.department, count: d._count.department })),
  };
}
