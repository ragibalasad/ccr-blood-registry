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
    <div className="container mx-auto px-4">
      <div className="py-8 md:py-12 w-full max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-slate-200 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 text-base mt-2">Manage your student details and registry availability.</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
