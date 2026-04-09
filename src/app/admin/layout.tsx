"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Shield, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      subItems: [
        { name: "All", href: "/admin/users" },
        { name: "Verified", href: "/admin/users?filter=verified" },
        { name: "Unverified", href: "/admin/users?filter=unverified" },
        { name: "Moderators", href: "/admin/users?filter=moderator" },
      ]
    },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full py-8 max-sm:mt-4">
      {/* ── Mobile Navigation (Top/Bottom Bar) ── */}
      <nav className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm overflow-x-auto no-scrollbar gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${isActive ? "bg-red-600 text-white shadow-md shadow-red-100" : "text-slate-600 font-bold text-xs uppercase"
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Sidebar (Desktop Only) ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 sticky top-24 bg-white/50 backdrop-blur-sm self-start p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-4 mb-2 border-b border-slate-100">
          <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Admin Portal</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-200"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4.5 h-4.5" />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  {isActive && !item.subItems && <ChevronRight className="w-4 h-4" />}
                </Link>

                {/* Sub Items */}
                {item.subItems && isActive && (
                  <div className="flex flex-col gap-1 ml-9 mt-1 mb-2">
                    {item.subItems.map((sub) => {
                      const search = sub.href.split('?')[1] || "";
                      const subActive = pathname + (search ? `?${search}` : "") === (pathname + (typeof window !== 'undefined' ? window.location.search : ""));
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`text-xs font-bold py-1.5 transition-colors ${subActive ? "text-red-600" : "text-slate-500 hover:text-red-500"
                            }`}
                        >
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
      <main className="flex-1 min-w-0 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  );
}
