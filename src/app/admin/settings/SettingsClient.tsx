"use client";

import { useEffect, useState, useTransition } from "react";
import { getSystemSettings, updateSystemSettings, promoteSelfToAdmin, searchUsers, updateUserRole, updateUserVerification } from "../actions";
import { Shield, UserPlus, FileEdit, Save, Loader2, AlertCircle, CheckCircle2, Search, Check, X, ShieldAlert, GraduationCap } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    dataEntryEnabled: true,
  });
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    variant: "danger" | "success" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: async () => { },
    variant: "warning",
  });

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const res = await searchUsers(searchQuery);
        if ("users" in res && res.users) {
          setUsers(res.users);
        }
        setIsSearching(false);
      } else if (searchQuery.length === 0) {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setConfirmModal({
      isOpen: true,
      title: "Save System Settings",
      message: "Are you sure you want to update the global system configuration? This will affect all current and future users.",
      variant: "warning",
      action: async () => {
        setMsg(null);
        startTransition(async () => {
          const res = await updateSystemSettings(settings.registrationEnabled, settings.dataEntryEnabled);
          if (res?.error) {
            setMsg({ type: "error", text: res.error });
          } else {
            setMsg({ type: "success", text: "Settings updated successfully!" });
          }
        });
      }
    });
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "user" ? "moderator" : currentRole === "moderator" ? "admin" : "user";
    setConfirmModal({
      isOpen: true,
      title: "Update User Permissions",
      message: `Change this account's role to ${newRole.toUpperCase()}?`,
      variant: "warning",
      action: async () => {
        const res = await updateUserRole(userId, newRole);
        if (!res.error) {
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
      }
    });
  };

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "unverify" : "verify";
    setConfirmModal({
      isOpen: true,
      title: currentStatus ? "Revoke Verification" : "Authorize Donor",
      message: `Are you sure you want to ${action} this user?`,
      variant: currentStatus ? "danger" : "success",
      action: async () => {
        const res = await updateUserVerification(userId, !currentStatus);
        if (!res.error) {
          setUsers(users.map(u => u.id === userId ? { ...u, verified: !currentStatus } : u));
        }
      }
    });
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
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System Controls</h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage global permissions and registrations</p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
          {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{msg.text}</p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Registration Toggle */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">User Registration</h3>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">Allow new students to create accounts</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("registrationEnabled")}
            disabled={isPending}
            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shrink-0 ${settings.registrationEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
          >
            <span
              className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${settings.registrationEnabled ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        </div>

        {/* Data Entry Toggle */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-1 shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">Data Entry & Updates</h3>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">Allow users to modify blood group info</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("dataEntryEnabled")}
            disabled={isPending}
            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shrink-0 ${settings.dataEntryEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
          >
            <span
              className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${settings.dataEntryEnabled ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
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
      </div>
      <div className="p-4 bg-slate-100 rounded-xl">
        <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold">
          Administrator Panel - Internal Use Only
        </p>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        variant={confirmModal.variant}
      />
    </div>
  );
}
