import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchClient from "./SearchClient";

export default async function SearchPage(props: { searchParams: Promise<{ q?: string, eligible?: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const q = searchParams.q;
  const eligibleOnly = searchParams.eligible !== "false"; // Default to true

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const users = await prisma.user.findMany({
    where: {
      bloodGroup: q ? { equals: q } : undefined,
      ...(eligibleOnly ? {
        OR: [
          { lastDonatedAt: { lte: ninetyDaysAgo } },
          { lastDonatedAt: null }
        ]
      } : {})
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

  return (
    <div className="flex flex-col flex-1 lg:px-0 py-8 max-sm:py-0 w-full">
      <div className="mb-8 max-sm:mb-4 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blood donors registry</h1>
        <p className="text-slate-500 text-sm mt-1">Browse and filter the registry by blood type.</p>
      </div>

      <SearchClient initialUsers={users} initialQuery={q || ""} initialEligible={eligibleOnly} />
    </div>
  );
}
