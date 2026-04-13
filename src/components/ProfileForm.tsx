"use client";
import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions";
import { Loader2, Droplet, User, Phone, Calendar, GraduationCap, BookOpen, CheckCircle2, AlertCircle, Shield } from "lucide-react";

const DEPARTMENTS = {
  "Arts": ["Bangla", "English", "History", "Philosophy", "Political Science"],
  "Social Science": ["Economics", "Sociology"],
  "Islamic Studies": ["Islamic History & Culture", "Islamic Studies"],
  "Business": ["Accounting", "Management", "Marketing", "Finance"],
  "Science": ["Physics", "Chemistry", "Botany", "Zoology", "Mathematics"],
};

export default function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage("Profile updated successfully.");
        setTimeout(() => setMessage(""), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Status message */}
      {message && (
        <div className={`flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold rounded-2xl border-2 transition-all shadow-sm ${
          message.includes("Error")
            ? "bg-red-50 text-red-600 border-red-200"
            : "bg-emerald-50 text-emerald-600 border-emerald-200"
        }`}>
          {message.includes("Error")
            ? <AlertCircle className="w-5 h-5 shrink-0" />
            : <CheckCircle2 className="w-5 h-5 shrink-0" />
          }
          {message}
        </div>
      )}

      {/* ── Section 1: Contact & Identity ── */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:border-slate-200 transition-all duration-300">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Personal Identity
        </h2>

        {/* Identity Badge */}
        <div className="flex gap-4 items-center pb-6 border-b border-slate-100 mb-6">
          <div className="w-16 h-16 shrink-0 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center text-xl font-bold uppercase overflow-hidden border border-slate-100 shadow-sm">
            {user.image ? (
              <img src={user.image} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0] || 'U'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-400 font-medium mb-0.5">Google Account Linked</p>
            <p className="text-base font-bold text-slate-900 truncate">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name || ""}
              placeholder="Your full name"
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-300 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Contact / Phone
            </label>
            <input
              type="text"
              name="contactInfo"
              defaultValue={user.contactInfo || ""}
              placeholder="e.g., 017XXXXXXX"
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-300 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Academic Info ── */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:border-slate-200 transition-all duration-300">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          College Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Department
            </label>
            <select
              name="department"
              defaultValue={user.department || ""}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 transition-colors appearance-none"
            >
              <option value="" disabled>Select Department</option>
              {Object.entries(DEPARTMENTS).map(([group, depts]) => (
                <optgroup key={group} label={group}>
                  {depts.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Session Year
            </label>
            <select
              name="sessionYear"
              defaultValue={user.sessionYear || ""}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 transition-colors appearance-none"
            >
              <option value="" disabled>Select Session</option>
              {["2017-2018", "2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025"].map(session => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Section 3: Registry Status ── */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:border-slate-200 transition-all duration-300">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-red-500" />
          Donation Status
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              defaultValue={user.bloodGroup || ""}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 transition-colors appearance-none"
            >
              <option value="" disabled>Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              Last Donated
            </label>
            <input
              type="date"
              name="lastDonatedAt"
              defaultValue={user.lastDonatedAt ? new Date(user.lastDonatedAt).toISOString().split('T')[0] : ""}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-0 text-sm font-medium text-slate-900 transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed font-medium">
            After donating, update your date here. The system will automatically place you on a 90-day hiatus to protect your health.
          </p>
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-6 flex justify-center pb-12">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-w-[200px] px-10 py-4 bg-slate-900 text-white rounded-2xl text-base font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-xl"
        >
          {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          Save Profile
        </button>
      </div>

    </form>
  )
}
