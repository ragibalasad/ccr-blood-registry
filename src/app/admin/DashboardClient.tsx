"use client";

import { Users, Droplets, GraduationCap, CheckCircle } from "lucide-react";

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
  return map[g] || "from-slate-400 to-slate-500";
}

export default function DashboardClient({ stats }: { stats: any }) {
  const { totalUsers, verifiedDonors, bloodDist, departmentDist } = stats;

  const statCards = [
    { label: "Total Students", value: totalUsers, icon: Users, colorText: "text-blue-500", colorBg: "bg-blue-50" },
    { label: "Verified Donors", value: verifiedDonors, icon: CheckCircle, colorText: "text-emerald-500", colorBg: "bg-emerald-50" },
    { label: "Blood Types", value: bloodDist.length, icon: Droplets, colorText: "text-red-500", colorBg: "bg-red-50" },
    { label: "Departments", value: departmentDist.length, icon: GraduationCap, colorText: "text-violet-500", colorBg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Overview of the blood registry system status</p>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${stat.colorBg} ${stat.colorText}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Blood Distribution ── */}
        <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Droplets className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-slate-900">Blood Group Distribution</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bloodDist.sort((a: any, b: any) => b.count - a.count).map((item: any) => (
              <div key={item.group} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100/50 group hover:border-slate-200 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgForGroup(item.group)} flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform`}>
                  <span className="text-sm font-bold text-white">{item.group}</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
            {bloodDist.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm font-medium text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No blood groups recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* ── Department Distribution ── */}
        <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-slate-900">Top Departments</h3>
          </div>
          <div className="space-y-5">
            {departmentDist.sort((a: any, b: any) => b.count - a.count).slice(0, 5).map((dept: any, index: number) => {
              const bgColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"];
              return (
              <div key={dept.name} className="group cursor-default">
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wider">
                  <span className="text-slate-600 truncate">{dept.name}</span>
                  <span className="text-slate-400 group-hover:text-slate-900 transition-colors">{dept.count} students</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                  <div
                    className={`h-full ${bgColors[index % bgColors.length]} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.max(5, (dept.count / totalUsers) * 100)}%` }}
                  />
                </div>
              </div>
            )})}
            {departmentDist.length === 0 && (
              <p className="text-sm text-slate-400 italic py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">No department data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
