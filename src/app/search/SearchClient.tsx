"use client";

import { Droplet, Phone, Copy, Check, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import { maskPhoneNumber } from "@/lib/utils";

interface UserType {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
  bloodGroup: string | null;
  contactInfo: string | null;
  department: string | null;
  sessionYear: string | null;
  lastDonatedAt: Date | null;
}

interface SearchClientProps {
  initialUsers: UserType[];
  isPrivileged: boolean;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function bgForGroup(g: string) {
  const map: Record<string, string> = {
    "A+": "from-rose-500 to-pink-600",
    "A-": "from-rose-400 to-pink-500",
    "B+": "from-blue-500 to-indigo-600",
    "B-": "from-blue-400 to-indigo-500",
    "AB+": "from-violet-500 to-purple-600",
    "AB-": "from-violet-400 to-purple-500",
    "O+": "from-emerald-500 to-teal-600",
    "O-": "from-emerald-400 to-teal-500",
  };
  return map[g] || "from-slate-500 to-slate-600";
}

export default function SearchClient({ initialUsers, isPrivileged }: SearchClientProps) {
  const [activeGroup, setActiveGroup] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ninetyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d;
  }, []);

  const filtered = useMemo(() => {
    return initialUsers.filter(u => {
      if (activeGroup && u.bloodGroup !== activeGroup) return false;
      if (eligibleOnly) {
        const eligible = !u.lastDonatedAt || new Date(u.lastDonatedAt) <= ninetyDaysAgo;
        if (!eligible) return false;
      }
      return true;
    });
  }, [initialUsers, activeGroup, eligibleOnly, ninetyDaysAgo]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full pb-12">

      {/* ── Mobile: Horizontal filter strip ── */}
      <div className="md:hidden w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-400">{filtered.length} donors</span>
          <button
            onClick={() => setEligibleOnly(!eligibleOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${eligibleOnly
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-white text-slate-500 border-slate-200"
              }`}
          >
            {eligibleOnly ? "✓ Eligible only" : "All donors"}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveGroup("")}
            className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${!activeGroup
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-500 border-slate-200"
              }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              onClick={() => setActiveGroup(bg === activeGroup ? "" : bg)}
              className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${activeGroup === bg
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-slate-500 border-slate-200"
                }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: Sidebar ── */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col gap-4 sticky top-24 self-start bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl">
        
        {/* Header embedded similarly to Admin Panel */}
        <div className="flex items-center gap-3 px-2 pb-6 border-b-2 border-slate-50">
          <div className="p-2.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl text-white shadow-lg shadow-red-200">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-lg leading-tight block">Donor Registry</span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Find Matches</span>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-2">
          {/* Eligible toggle card */}
          <button
            onClick={() => setEligibleOnly(!eligibleOnly)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${eligibleOnly
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
              }`}
          >
            Eligible only
            <div className={`w-9 h-5 rounded-full relative transition-colors ${eligibleOnly ? "bg-red-600" : "bg-slate-200"}`}>
              <div className={`absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all ${eligibleOnly ? "left-[15px]" : "left-[3px]"}`} />
            </div>
          </button>

          {/* Blood group selection */}
          <div className="space-y-3">
            <button
              onClick={() => setActiveGroup("")}
              className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all ${!activeGroup
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
                }`}
            >
              All groups
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setActiveGroup(bg === activeGroup ? "" : bg)}
                  className={`text-center px-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${activeGroup === bg
                    ? `bg-gradient-to-br ${bgForGroup(bg)} text-white shadow-md hover:-translate-y-0.5`
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
                    }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Note card */}
          <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-4 mt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Note</span>
            </div>
            <p className="text-xs text-emerald-600/80 leading-relaxed font-medium">
              Verified student volunteers only. Always confirm availability locally.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Results ── */}
      <div className="flex-1 min-w-0">
        <div className="hidden md:flex items-baseline justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {activeGroup ? `${activeGroup} Donors` : "All Donors"}
          </h2>
          <span className="text-sm text-slate-400 font-medium">{filtered.length} found</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-5">
            {filtered.map(user => {
              const isEligible = !user.lastDonatedAt || new Date(user.lastDonatedAt) <= ninetyDaysAgo;

              return (
                <div
                  key={user.id}
                  className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${bgForGroup(user.bloodGroup || "")} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500`} />

                  <div className="relative flex gap-5">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center text-lg font-bold text-slate-300 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {user.image ? (
                        <img src={user.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0] || "?"
                      )}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-400 truncate mt-0.5">
                        {user.department || "General"}{user.sessionYear ? ` · ${user.sessionYear}` : ""}
                      </p>
                    </div>

                    {/* Blood group badge — uses same gradient style as home page */}
                    <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${bgForGroup(user.bloodGroup || "")} flex flex-col items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden`}>
                      <Droplet className="absolute w-4 h-4 top-1.5 left-1.5 text-white/30 fill-white/15" />
                      <span className="text-lg font-bold text-white leading-none">{user.bloodGroup}</span>
                    </div>
                  </div>

                  {/* Status + Contact row */}
                  <div className="relative flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isEligible
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                        {isEligible && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {isEligible ? "Ready" : "Recovery"}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {user.lastDonatedAt
                          ? new Date(user.lastDonatedAt).toLocaleDateString()
                          : "New donor"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm font-mono text-slate-500">
                        {user.contactInfo
                          ? (isPrivileged || user.role === "admin" || user.role === "moderator")
                            ? user.contactInfo
                            : maskPhoneNumber(user.contactInfo)
                          : "Private"}
                      </span>
                      {user.contactInfo && (isPrivileged || user.role === "admin" || user.role === "moderator") && (
                        <button
                          onClick={() => handleCopy(user.id, user.contactInfo!)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          {copiedId === user.id
                            ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center">
            <Droplet className="w-10 h-10 text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No donors found</h3>
            <p className="text-sm text-slate-400">Try a different blood group or clear your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}