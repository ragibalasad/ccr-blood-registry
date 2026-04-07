import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchClient from "./SearchClient";

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session?.user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const q = searchParams.q;

  const users = await prisma.user.findMany({
    where: {
      bloodGroup: q ? { equals: q } : { not: null },
      id: { not: session.user.id }
    },
    select: {
      id: true,
      name: true,
      image: true,
      bloodGroup: true,
      department: true,
      contactInfo: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="flex flex-col flex-1 px-4 lg:px-0 py-8 w-full">
      <div className="mb-8 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Directory</h1>
        <p className="text-slate-500 text-sm mt-1">Browse and filter the registry by blood type.</p>
      </div>
      
      <SearchClient initialUsers={users} initialQuery={q || ""} />
    </div>
  );
}
