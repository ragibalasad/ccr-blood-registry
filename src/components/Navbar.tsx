"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Droplet, User, LogOut, Shield, HelpCircle, UserCog, Menu, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Find Donor", href: "/search" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b-2 border-slate-100 transition-all duration-300">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-none">Blood Registry</span>
              <span className="text-xs font-medium text-slate-400 leading-none mt-1.5 whitespace-nowrap">Carmichael College Rangpur</span>
            </div>
          </Link>

          {/* Right Side: Links + Auth */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive(link.href)
                    ? "bg-red-50 text-red-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Section / Unified Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {!isPending && session ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-slate-900 flex items-center justify-center text-white text-sm font-bold uppercase overflow-hidden shadow-sm">
                    {(session.user as any).name?.charAt(0) || <User className="w-5 h-5" />}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : !isPending ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="hidden md:block px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="md:hidden flex items-center justify-center w-11 h-11 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all duration-300"
                  >
                    <Menu className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-50 animate-pulse border-2 border-slate-100" />
              )}

              {/* Dropdown Menu (Unified for Links + Auth) */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[110]">
                  {/* User Profile Header (Only if logged in) */}
                  {session && (
                    <div className="p-6 border-b-2 border-slate-50 bg-slate-50/50">
                      <p className="text-base font-bold text-slate-900 truncate">{(session.user as any).name}</p>
                      <p className="text-sm font-medium text-slate-400 truncate mt-1">{(session.user as any).email}</p>
                    </div>
                  )}

                  {/* Navigation Links (Visible only on Mobile in dropdown) */}
                  <div className="md:hidden p-3 border-b-2 border-slate-50 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${isActive(link.href)
                          ? "text-red-600 bg-red-50"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  <div className="p-3 space-y-1">
                    {session ? (
                      <>
                        {/* Admin Link if authorized */}
                        {((session.user as any).role === "admin" || (session.user as any).role === "moderator") && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-violet-600 bg-violet-50/50 hover:bg-violet-100 rounded-2xl transition-all duration-300 mb-2 border border-violet-100/50"
                          >
                            <Shield className="w-4.5 h-4.5" />
                            Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-300"
                        >
                          <UserCog className="w-4.5 h-4.5 text-slate-400" />
                          Edit Profile
                        </Link>

                        <Link
                          href="/about"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-300"
                        >
                          <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                          Help Center
                        </Link>

                        <div className="h-0.5 bg-slate-50 my-2 mx-1" />

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 text-left"
                        >
                          <LogOut className="w-4.5 h-4.5" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-300"
                      >
                        <User className="w-4.5 h-4.5 text-slate-400" />
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
