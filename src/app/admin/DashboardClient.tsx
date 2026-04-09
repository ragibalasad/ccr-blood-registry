"use client";

import { Users, Droplets, GraduationCap, CheckCircle } from "lucide-react";

export default function DashboardClient({ stats }: { stats: any }) {
  const { totalUsers, verifiedDonors, bloodDist, departmentDist } = stats;

  const statCards = [
    { label: "Total Students", value: totalUsers, icon: Users, color: "blue" },
    { label: "Verified Donors", value: verifiedDonors, icon: CheckCircle, color: "emerald" },
    // { label: "Blood Types", value: bloodDist.length, icon: Droplets, color: "red" },
    // { label: "Departments", value: departmentDist.length, icon: GraduationCap, color: "amber" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of the blood registry system status</p>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 sm:p-3 bg-${stat.color}-50 rounded-xl text-${stat.color}-600 shrink-0`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* ── Blood Distribution ── */}
        <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Blood Group Distribution</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {bloodDist.sort((a: any, b: any) => b.count - a.count).map((item: any) => (
              <div key={item.group} className="flex flex-col items-center p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs sm:text-sm font-bold text-red-600 mb-0.5 sm:mb-1">{item.group}</span>
                <span className="text-lg sm:text-xl font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Department Distribution ── */}
        <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Top Departments</h3>
          </div>
          <div className="space-y-4">
            {departmentDist.sort((a: any, b: any) => b.count - a.count).slice(0, 5).map((dept: any) => (
              <div key={dept.name}>
                <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wide">
                  <span className="text-slate-600 truncate">{dept.name}</span>
                  <span className="text-slate-400">{dept.count} students</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(dept.count / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {departmentDist.length === 0 && (
              <p className="text-sm text-slate-400 italic">No department data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
