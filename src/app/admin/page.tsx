import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats } from "./actions";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" && session?.user.role !== "moderator") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  if ("error" in stats) {
    return (
      <div className="p-8 bg-red-50 text-red-700 border border-red-100 rounded-2xl">
        <h2 className="font-bold">Error loading dashboard</h2>
        <p>{stats.error as string}</p>
      </div>
    );
  }

  return <DashboardClient stats={stats} />;
}
