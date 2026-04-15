import Link from "next/link";
import { ArrowRight, HeartPulse, ShieldCheck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-red-500/5 blur-[100px] rounded-full -mr-40 -mt-40" />
        <div className=" relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest shadow-sm">
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-8">
            Connecting Hearts, <br />
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Saving Lives.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            CCR Blood Registry is a community-driven platform dedicated to connecting students and making blood donation accessible during emergencies at Carmichael College Rangpur.
          </p>
        </div>
      </section>

      {/* ── Content Section ─────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Founded on the spirit of <span className="text-red-600">Volunteerism.</span>
              </h2>
              <div className="w-24 h-1.5 bg-red-600 rounded-full" />
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                In critical medical emergencies, every second counts. Finding a compatible donor can be a life-or-death challenge.
                Our platform provides a real-time, authenticated database of selfless student donors ready to help their peers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <HeartPulse className="w-5 h-5" />, label: "Health First" },
                  { icon: <ShieldCheck className="w-5 h-5" />, label: "Secure Data" },
                  { icon: <Users className="w-5 h-5" />, label: "By Students" },
                  { icon: <Users className="w-5 h-5" />, label: "For Students" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-900 font-bold">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    {feature.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-red-600 rounded-[3rem] rotate-3 opacity-5" />
              <div className="relative bg-white border-2 border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Why CCR Registry?</h3>
                <ul className="space-y-6">
                  {[
                    "100% Student-verified network",
                    "Strict 90-day recovery policy for donor health",
                    "Emergency-first search algorithms",
                    "Institutional focus on privacy and security"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                      <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="pb-24 pt-12">
        <div className="">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] -mr-48 -mt-48" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
              Be a part of the movement.
            </h2>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl text-lg font-bold hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
