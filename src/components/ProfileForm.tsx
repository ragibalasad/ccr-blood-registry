"use client";
import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions";
import { Loader2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
      <div className="flex gap-6 items-center">
        <div className="w-20 h-20 shrink-0 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center text-2xl font-semibold uppercase overflow-hidden border border-slate-200">
          {user.image ? (
            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user.name?.[0] || 'U'
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
          <p className="text-slate-500 text-sm">{user.email}</p>
        </div>
      </div>

      {message && (
        <div className={`px-3 py-2 text-sm rounded-md border ${message.includes("Error") ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Blood Group</label>
          <select 
            name="bloodGroup" 
            defaultValue={user.bloodGroup || ""}
            className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm focus:border-transparent"
          >
            <option value="" disabled>Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Department</label>
          <input 
            type="text" 
            name="department"
            defaultValue={user.department || ""}
            placeholder="e.g. Computer Science"
            className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm placeholder-slate-400 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">Contact Info</label>
        <input 
          type="text" 
          name="contactInfo"
          defaultValue={user.contactInfo || ""}
          placeholder="Phone number, Facebook, etc."
          className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm placeholder-slate-400 focus:border-transparent"
        />
        <p className="mt-1.5 text-xs text-slate-500">Provide an accessible way for peers to reach you.</p>
      </div>
      
      <div className="pt-4 flex">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-sm"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  )
}
