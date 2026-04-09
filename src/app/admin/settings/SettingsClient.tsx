"use client";

import { useEffect, useState, useTransition } from "react";
import { getSystemSettings, updateSystemSettings, promoteSelfToAdmin } from "../actions";
import { Shield, UserPlus, FileEdit, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    dataEntryEnabled: true,
  });
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSystemSettings();
      if ("error" in data) {
         setMsg({ type: "error", text: data.error as string });
      } else {
         setSettings(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await updateSystemSettings(settings.registrationEnabled, settings.dataEntryEnabled);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else {
        setMsg({ type: "success", text: "Settings updated successfully!" });
      }
    });
  };

  const handlePromote = async () => {
    setMsg(null);
    const res = await promoteSelfToAdmin();
    if (res?.error) {
        setMsg({ type: "error", text: res.error });
    } else {
        setMsg({ type: "success", text: "You are now an Admin! Refresh the page." });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="mt-4 text-slate-500 font-medium">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Controls</h1>
          <p className="text-sm text-slate-500">Manage global permissions and registration status</p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{msg.text}</p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Registration Toggle */}
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">User Registration</h3>
              <p className="text-sm text-slate-500">Allow new students to create accounts</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("registrationEnabled")}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              settings.registrationEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.registrationEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Data Entry Toggle */}
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-1">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Data Entry & Updates</h3>
              <p className="text-sm text-slate-500">Allow users to modify their blood group and contact info</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("dataEntryEnabled")}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              settings.dataEntryEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.dataEntryEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save System Configuration
        </button>
        
        <button
          onClick={handlePromote}
          className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
        >
          Promote Me to Admin
        </button>
      </div>

      <div className="p-4 bg-slate-100 rounded-xl">
        <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold">
          Administrator Panel - Internal Use Only
        </p>
      </div>
    </div>
  );
}
