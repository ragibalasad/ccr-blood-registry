"use client";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Droplet,
  UserPlus,
  ShieldCheck,
  HeartPulse,
  Clock,
  AlertTriangle,
  Users,
  Activity,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getSystemSettings } from "./admin/actions";
import { getPublicStats } from "./home-actions";

// ── Animated counter ─────────────────────────────────────────
function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = duration / (target / step);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// ── Blood group colour helper ────────────────────────────────
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

// ═════════════════════════════════════════════════════════════
export default function Home() {
  const { data: session } = useSession();

  const [settings, setSettings] = useState({
    registrationEnabled: true,
    dataEntryEnabled: true,
  });
  const [stats, setStats] = useState<{
    totalDonors: number;
    withBloodGroup: number;
    eligibleCount: number;
    bloodDist: { group: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    getSystemSettings().then((d) => {
      if (!("error" in d)) setSettings(d);
    });
    getPublicStats().then(setStats);
  }, []);

  const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex flex-col flex-1">
      {/* ── Maintenance Banners ─────────────────────────────── */}
      {!settings.registrationEnabled && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-3 text-amber-800 max-w-3xl mx-auto shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium italic">New registrations are temporarily closed for maintenance.</p>
        </div>
      )}
      {!settings.dataEntryEnabled && (
        <div className="mb-6 p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-600 max-w-3xl mx-auto shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium italic">Data updates are currently disabled. You can still search for donors.</p>
        </div>
      )}

      {/* ── Integrated Hero & Stats ────────────────────────── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-32 overflow-hidden bg-white">
        {/* Background Blobs (Strategic placement) */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-red-50 rounded-full mix-blend-multiply opacity-70 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-80 h-80 bg-rose-50 rounded-full mix-blend-multiply opacity-50 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              {/* College badge */}
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </span>
                CCR Blood Registry
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Save Lives with
                <br />
                <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  Every Drop.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A student-run, emergency database for Carmichael College students.
                Joining the registry today could save a life tomorrow.
              </p>

              {/* ── Profile completion banner (Compact) ──────────── */}
              {session &&
                (!(session.user as any).bloodGroup || !(session.user as any).contactInfo) && (
                  <div className="mb-10 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-4 max-w-lg mx-auto lg:mx-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-white leading-tight">Complete your profile</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Add blood group & contact</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all flex-shrink-0"
                    >
                      Complete Now
                    </Link>
                  </div>
                )}

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                {session ? (
                  <>
                    <Link
                      href="/search"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                      <Search className="w-4 h-4" />
                      Find Donors
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all w-full sm:w-auto"
                    >
                      My Profile
                    </Link>
                  </>
                ) : settings.registrationEnabled ? (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                      Join Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/search"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all w-full sm:w-auto"
                    >
                      Search Donors
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl w-full sm:w-auto"
                  >
                    <Search className="w-4 h-4" />
                    Search Donors
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Stats Cloud */}
            <div className="lg:w-[42%] w-full relative">
              {/* Decorative glow behind stats */}
              <div className="absolute inset-0 bg-red-500/5 blur-[100px] rounded-full" />

              <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
                {[
                  {
                    icon: <Users className="w-6 h-6" />,
                    label: "Total Donors",
                    value: stats?.totalDonors ?? 0,
                    color: "text-slate-900",
                    bg: "bg-white",
                    border: "border-slate-100",
                    delay: "0",
                  },
                  {
                    icon: <HeartPulse className="w-6 h-6" />,
                    label: "Eligible Now",
                    value: stats?.eligibleCount ?? 0,
                    color: "text-red-500",
                    bg: "bg-white",
                    border: "border-slate-100",
                    delay: "100",
                  },
                  {
                    icon: <Droplet className="w-6 h-6" />,
                    label: "Groups Listed",
                    value: stats?.withBloodGroup ?? 0,
                    color: "text-emerald-600",
                    bg: "bg-white",
                    border: "border-slate-100",
                    delay: "200",
                  },
                  {
                    icon: <Activity className="w-6 h-6" />,
                    label: "Live Stats",
                    value: stats?.bloodDist.length ?? 0,
                    suffix: "/8",
                    color: "text-violet-600",
                    bg: "bg-white",
                    border: "border-slate-100",
                    delay: "300",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`group ${s.bg} border-2 ${s.border} rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center lg:items-start text-center lg:text-left`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform ${s.color} bg-slate-50`}
                    >
                      {s.icon}
                    </div>
                    <div className="flex flex-col items-center lg:items-start">
                      <span className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        <AnimatedCount target={s.value} suffix={(s as any).suffix} />
                      </span>
                      <p className="text-xs md:text-sm text-slate-500 mt-2 font-semibold tracking-wider">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── Blood Group Distribution ────────────────────────── */}
      {stats && stats.bloodDist.length > 0 && (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none fill-slate-900" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Registry Strength
              </h2>
              <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6" />
              <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                A live breakdown of our donor database. Groups marked as <span className="text-red-600 font-bold">Critical</span> or <span className="text-amber-600 font-bold">Limited</span> need more voluntary registrations.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {allBloodGroups.map((bg) => {
                const entry = stats.bloodDist.find((d) => d.group === bg);
                const count = entry?.count ?? 0;
                const maxCount = Math.max(...stats.bloodDist.map((d) => d.count), 1);
                const barPercent = Math.round((count / maxCount) * 100);

                // Status Logic
                let status = { text: "Stable", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" };
                if (count === 0 || barPercent < 20) {
                  status = { text: "Critical", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
                } else if (barPercent < 50) {
                  status = { text: "Limited", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" };
                }

                return (
                  <div
                    key={bg}
                    className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] md:p-10 flex flex-col items-center gap-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Background Progress Fill */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${bgForGroup(bg)} opacity-[0.03] transition-all duration-1000 ease-in-out group-hover:opacity-[0.08]`}
                      style={{ height: `${barPercent}%` }}
                    />

                    {/* Status Badge */}
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color} border ${status.border} shadow-sm`}>
                      {status.text}
                    </div>

                    <div
                      className={`relative w-20 h-20 rounded-[2rem] bg-gradient-to-br ${bgForGroup(bg)} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform overflow-hidden`}
                    >
                      <Droplet className="absolute top-3 left-3 w-4 h-4 text-white/40 fill-white/20" />
                      <span className="text-2xl font-bold text-white drop-shadow-sm">{bg}</span>
                    </div>

                    <div className="text-center relative">
                      <div className="flex flex-col items-center">
                        <span className="block text-4xl font-bold text-slate-900 tracking-tighter mb-1">
                          {count}
                        </span>
                        <span className="text-slate-400 font-medium mt-1 text-sm">
                          Donors Registered
                        </span>
                      </div>
                    </div>

                    {/* Minimalist Bar */}
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden mt-4 border border-slate-100 p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${bgForGroup(bg)} transition-all duration-1000 ease-out`}
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {session && (
              <div className="mt-16 text-center">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm group"
                >
                  Explore Registry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-6" />
            <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Joining our life-saving community is simple and takes less than a minute. Follow these three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                icon: <UserPlus className="w-8 h-8" />,
                title: "Sign Up",
                desc: "Create an account using your Google login. Only authenticated CCR students can join.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
              {
                step: "02",
                icon: <Droplet className="w-8 h-8" />,
                title: "Add Your Details",
                desc: "Fill in your blood group, department, session, and a contact number for emergencies.",
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-100",
              },
              {
                step: "03",
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Be Discoverable",
                desc: "Peers can now find you by blood type. You help save a life when every second counts.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Connector (Desktop Only) */}
                {item.step !== "03" && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] border-t-2 border-dashed border-slate-200" />
                )}

                <div
                  className={`${item.bg} ${item.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 shadow-sm border ${item.border}`}
                >
                  {item.icon}
                </div>

                <span className="text-xs font-semibold text-slate-400 uppercase mb-4">
                  Step {item.step}
                </span>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-md max-w-[280px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility Note ────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-200">
        <div className="">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-16 text-slate-900 shadow-2xl relative overflow-hidden border border-slate-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 blur-[100px] -mr-32 -mt-32 opacity-50" />

              <div className="relative flex flex-col md:flex-row md:items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6 text-red-600">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      Important Policy
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight tracking-tight">
                    90-Day Recovery Period
                  </h2>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                    To protect your health, you are marked as &ldquo;On Recovery&rdquo; for 90 days after each donation.
                    During this period, your profile is hidden from urgent searches to ensure you have time to recover fully.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-red-50 bg-white shadow-inner relative group">
                  <div className="absolute inset-0 rounded-full border-t-8 border-red-500 animate-[spin_10s_linear_infinite] opacity-20" />
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-bold text-red-600 group-hover:scale-110 transition-transform">90</span>
                    <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest text-center">
                      Days<br />Required Rest
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      {!session && (
        <section className="py-32 md:py-48 bg-white text-center relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-32 -translate-y-1/2 opacity-50" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -translate-y-1/2 opacity-50" />

          <div className="relative">
            <div className="max-w-2xl mx-auto">
              <Droplet className="w-12 h-12 text-red-600 mx-auto mb-8 fill-red-600 animate-bounce opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                Ready to save a life today?
              </h2>
              <p className="text-slate-500 text-xl mb-12 leading-relaxed">
                Join hundreds of your peers from Carmichael College in building Rangpur&apos;s most reliable student donor network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {settings.registrationEnabled ? (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl text-lg font-bold hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Become a donor
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:translate-y-px"
                  >
                    Browse Donors
                    <Search className="w-5 h-5" />
                  </Link>
                )}
              </div>
              <p className="mt-8 text-slate-400 text-sm font-medium italic">
                Open to all students of Carmichael College Rangpur
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}