"use client";
import Link from "next/link";
import { useSession, signOut, signUp } from "@/lib/auth-client";
import { Droplet, Search, User, LogOut, Code } from "lucide-react";
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

  const handleDebugLogin = async () => {
    setLoadingDev(true);
    try {
      const email = `dev${Math.floor(Math.random() * 10000)}@college.edu`;
      const { error } = await signUp.email({
        email: email,
        password: "password123",
        name: "Dev User",
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/profile";
          },
          onError: (ctx) => {
            alert(`Sign up failed: ${ctx.error.message}`);
          }
        }
      });
      if (error) {
        alert(error.message);
      }
    } catch (err: any) {
      alert(err.message || "Failed");
    } finally {
      setLoadingDev(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 md:px-6 xl:px-8 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-red-600 fill-red-600" />
          <span className="text-base font-semibold text-slate-900 tracking-tight">CCR Directory</span>
        </Link>
        
        <div className="flex items-center gap-4">
          
          {process.env.NODE_ENV !== "production" && !session && !isPending && (
            <button 
              onClick={handleDebugLogin}
              disabled={loadingDev}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 border border-slate-200 disabled:opacity-50"
            >
              <Code className="w-3.5 h-3.5" />
              {loadingDev ? "Loading..." : "Dev Login"}
            </button>
          )}

          {!isPending && session ? (
            <div className="flex items-center gap-1">
              <Link href="/search" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : !isPending ? (
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm">
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
