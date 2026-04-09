import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage(props: { searchParams: Promise<{ filter?: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" && session?.user.role !== "moderator") {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const filter = searchParams.filter || "all";

  return <UsersClient initialFilter={filter} />;
}
