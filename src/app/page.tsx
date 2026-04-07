"use client";
import Link from "next/link";
import { ArrowRight, Search, ActivitySquare } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col flex-1 px-4 lg:px-0 py-12 md:py-20 max-w-3xl">
      <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium w-max">
        {/* <ActivitySquare className="w-4 h-4 text-slate-500" /> */}
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600"></span>
        </span>
        Carmichael College Rangpur
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
        Student Blood Group Registry
      </h1>

      <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
        An open, collaborative directory of emergency blood donors managed directly by the students of CCR.
        Add your details to the directory to assist peers during medical emergencies.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        {session ? (
          <>
            <Link href="/search" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
              <Search className="w-4 h-4" />
              Search Directory
            </Link>
            <Link href="/profile" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
              Manage Profile
            </Link>
          </>
        ) : (
          <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Join the Registry
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-200 pt-12">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Search Network</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Query the collaborative database to find registered students by specific blood groups. Get immediate access to their provided contact endpoints.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Contribute Data</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Volunteer your information to the registry. Only authenticated peers from the college can view your emergency contact details.
          </p>
        </div>
      </div>
    </div>
  );
}
