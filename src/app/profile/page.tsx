import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col flex-1 px-4 lg:px-0 py-8 w-full max-w-3xl">
      <div className="mb-8 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Record</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your public information and contact details.</p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
