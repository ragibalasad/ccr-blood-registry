import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all users with blood groups — client handles filtering
  const users = await prisma.user.findMany({
    where: {
      bloodGroup: { not: null },
    },
    select: {
      id: true,
      name: true,
      image: true,
      bloodGroup: true,
      department: true,
      sessionYear: true,
      lastDonatedAt: true,
      contactInfo: true,
      role: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  const isPrivileged = (session.user as any).role === "admin" || (session.user as any).role === "moderator";

  return (
    <div className="py-8 md:py-12 w-full mx-auto">
      <SearchClient initialUsers={users} isPrivileged={isPrivileged} />
    </div>
  );
}
