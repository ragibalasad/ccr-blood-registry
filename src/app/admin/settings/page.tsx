import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Strict server-side check
  if (session?.user.role !== "admin") {
    redirect("/");
  }

  return <SettingsClient />;
}
