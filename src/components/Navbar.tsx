"use client";
import Link from "next/link";
import { useSession, signOut, signUp, signIn } from "@/lib/auth-client";
import { Droplet, Search, User, LogOut, Terminal, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loadingDev, setLoadingDev] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleDevLogin = async () => {
    setLoadingDev(true);
    const devEmail = "dev@college.edu";
    const devPass = "password123456";

    try {
      // Always try sign-up first, then sign-in if account exists
      const res = await signUp.email({
        email: devEmail,
        password: devPass,
        name: "Dev User",
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/profile";
          },
          onError: async (ctx) => {
            // If account already exists (common during dev), just sign in
            if (ctx.error.message?.includes("exists") || ctx.error.status === 400) {
              await signIn.email({
                email: devEmail,
                password: devPass,
                fetchOptions: {
                  onSuccess: () => { window.location.href = "/profile"; },
                  onError: (sCtx) => {
                    alert(`Auth failed: ${sCtx.error.message || "Unknown error"}`);
                  }
                }
              });
            } else {
              alert(`Dev entry failed: ${ctx.error.message || "General failure"}`);
            }
          }
        }
      });
    } catch (err: any) {
      alert(`Runtime error: ${err.message || "Failed to reach server"}`);
    } finally {
      setLoadingDev(false);
    }
  };

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-red-600 fill-red-600" />
          <span className="text-base font-bold text-slate-900 tracking-tight">CCR Blood Database</span>
        </Link>

        <div className="flex items-center gap-2">
          {process.env.NODE_ENV !== "production" && !session && !isPending && (
            <button
              onClick={handleDevLogin}
              disabled={loadingDev}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm border border-emerald-700 disabled:opacity-50"
              title="Click to instantly bypass login in development"
            >
              <Terminal className="w-3.5 h-3.5" />
              {loadingDev ? "Entering..." : "Dev Login"}
            </button>
          )}

          {!isPending && session ? (
            <div className="flex items-center gap-1">
              <Link href="/search" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Find Donors</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Record</span>
              </Link>
              {((session.user as any).role === "admin" || (session.user as any).role === "moderator") && (
                <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 rotate-0 hover:bg-rose-50 rounded"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : !isPending ? (
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-slate-900 rounded hover:bg-slate-800 shadow-sm">
              <Search className="w-4 h-4" />
              Find Donors
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
