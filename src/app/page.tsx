"use client";
import Link from "next/link";
import { ArrowRight, Search, User, Clock, Users, Bell, AlertTriangle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getSystemSettings } from "./admin/actions";

export default function Home() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({ registrationEnabled: true, dataEntryEnabled: true });

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSystemSettings();
      if (!("error" in data)) {
        setSettings(data);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col flex-1 lg:px-0 py-6 md:py-20 max-w-3xl">
      {/* Maintenance Banners */}
      {!settings.registrationEnabled && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium italic">New registrations are temporarily closed for maintenance.</p>
        </div>
      )}
      {!settings.dataEntryEnabled && (
        <div className="mb-6 p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-3 text-slate-600">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium italic">Data updates are currently disabled. You can still search for donors.</p>
        </div>
      )}

      <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium w-max">
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
        An open, collaborative database of emergency blood donors managed
        directly by the students of CCR. Add your details to the registry to
        assist peers during medical emergencies.
      </p>


      {session ? (
        <>
          {/* Onboarding banner — hide this once user has filled profile */}
          {!(session.user as any).bloodGroup || !(session.user as any).contactInfo ? (
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex flex-col gap-4 px-5 py-4 rounded-lg bg-slate-900 text-white sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-base leading-none">+</span>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white leading-snug">
                      Complete your donor profile
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Add your blood type and contact info so peers can reach you in an emergency
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto flex-shrink-0"
                >
                  Add your info
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : null}

          {/* Secondary actions */}
        </>
      ) : (
        <></>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        {session ? (
          <>
            <Link href="/search" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
              <Search className="w-4 h-4" />
              Find Donors
            </Link>
            <Link href="/profile" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
              Manage Profile
            </Link>
          </>
        ) : settings.registrationEnabled ? (
          <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Join the Registry
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href="/search" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            Search Registry
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-200 pt-12">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Find Donors
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Query the collaborative database to find registered students by
            specific blood groups. Get immediate access to their provided
            contact information.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Contribute Data
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Volunteer your information to the registry. Only authenticated peers
            from the college can view your emergency contact details.
          </p>
        </div>
      </div>
    </div>
  );
}