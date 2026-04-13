"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Shield, ChevronRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "user";

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      subItems: [
        { name: "All", href: "/admin/users", filter: "" },
        { name: "Verified", href: "/admin/users?filter=verified", filter: "verified" },
        { name: "Unverified", href: "/admin/users?filter=unverified", filter: "unverified" },
        { name: "Moderators", href: "/admin/users?filter=moderator", filter: "moderator" },
      ]
    },
    ...(userRole === "admin" ? [
      { name: "Settings", href: "/admin/settings", icon: Settings }
    ] : []),
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start w-full py-8 md:py-12 max-sm:mt-4">
      {/* ── Mobile Navigation (Top Bar) ── */}
      <nav className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-b-2 border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm overflow-x-auto no-scrollbar gap-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-bold text-xs uppercase tracking-wider ${
                isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Sidebar (Desktop Only) ── */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col gap-4 sticky top-24 bg-white self-start p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-3 px-2 pb-6 border-b-2 border-slate-50">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl text-white shadow-lg shadow-violet-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-lg leading-tight block">Admin Portal</span>
            <span className="text-xs font-bold text-violet-500 uppercase tracking-widest block">{userRole} access</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
            return (
              <div key={item.name} className="flex flex-col gap-1.5">
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  {isActive && !item.subItems && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>

                {/* Sub Items */}
                {item.subItems && isActive && (
                  <div className="flex flex-col gap-1.5 ml-11 mt-1 mb-2">
                    {item.subItems.map((sub) => {
                      const currentFilter = searchParams.get("filter") || "";
                      const subActive = currentFilter === sub.filter;
                      
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`text-xs font-bold py-2 transition-all duration-200 flex items-center gap-2 ${
                            subActive ? "text-slate-900 flex" : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {subActive && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 min-w-0 w-full pt-10 md:pt-0">
        {children}
      </main>
    </div>
  );
}
