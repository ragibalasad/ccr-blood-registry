"use client";

import { useEffect, useState } from "react";
import { searchUsers, updateUserRole, updateUserVerification } from "../actions";
import { Search, Check, X, ShieldAlert, GraduationCap, Loader2, UserCircle } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

export default function UsersClient({ initialFilter }: { initialFilter: string }) {
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
    action: async () => {},
    variant: "warning",
  });

  const fetchUsers = async (q: string, f: string) => {
    setIsSearching(true);
    const res = await searchUsers(q, f);
    if ("users" in res && res.users) {
      setUsers(res.users);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    fetchUsers(searchQuery, initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only fetch if a search or a clear is happening
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        fetchUsers(searchQuery, initialFilter);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Update User Role",
      message: `Are you sure you want to change this student's permissions to ${newRole.toUpperCase()}? This will take effect immediately.`,
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
      title: currentStatus ? "Remove Verification" : "Verify Donor",
      message: `Are you sure you want to ${action} this donor? Verified donors are highlighted in search results.`,
      variant: currentStatus ? "danger" : "success",
      action: async () => {
        const res = await updateUserVerification(userId, !currentStatus);
        if (!res.error) {
          setUsers(users.map(u => u.id === userId ? { ...u, verified: !currentStatus } : u));
        }
      }
    });
  };

  const getFilterName = () => {
    switch (initialFilter) {
      case "verified": return "Verified Donors";
      case "unverified": return "Unverified Accounts";
      case "moderator": return "Moderators";
      case "admin": return "Administrators";
      default: return "All Users";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500">Manage accounts for <span className="text-red-600 font-bold">{getFilterName()}</span></p>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
          {users.length} {users.length === 1 ? 'user' : 'users'} found
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
        <input
          type="text"
          placeholder={`Search ${getFilterName().toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all shadow-sm group-hover:shadow-md"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-red-500" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-red-100 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-400 uppercase text-lg sm:text-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {user.image ? <img src={user.image} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <UserCircle className="w-8 h-8" />}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5 overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-none truncate max-w-full" title={user.name}>
                      {user.name}
                    </h4>
                    <div className="flex gap-1.5 shrink-0">
                      {user.verified ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-2 truncate max-w-full" title={user.email}>
                    {user.email}
                  </p>
                  {user.department && (
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wide truncate max-w-full" title={`${user.department} ${user.sessionYear || ''}`}>
                      <GraduationCap className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                      <span className="truncate">{user.department} {user.sessionYear ? `• ${user.sessionYear}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => handleToggleVerification(user.id, user.verified)}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all text-xs sm:text-sm font-bold shadow-sm ${user.verified
                    ? 'bg-white text-slate-400 border-slate-200 hover:text-red-600 hover:border-red-200'
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    }`}
                  title={user.verified ? "Remove Verification" : "Verify Donor"}
                >
                  {user.verified ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                  <span>{user.verified ? "Unverify" : "Verify"}</span>
                </button>
                
                <div className="w-px h-6 bg-slate-200 mx-0.5" />
                
                <div className="flex-1 lg:flex-none relative h-full">
                  <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="w-full h-full pl-8 sm:pl-9 pr-6 sm:pr-8 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-red-100 transition-all font-bold text-xs sm:text-sm shadow-sm outline-none focus:ring-2 focus:ring-red-100 appearance-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        {searchQuery.length >= 2 && users.length === 0 && !isSearching && (
          <div className="p-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">No users found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">We couldn't find any accounts matching "{searchQuery}". Try a different term.</p>
          </div>
        )}

        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm font-medium animate-pulse">Waiting for your input...</p>
          </div>
        )}

        {searchQuery.length === 0 && users.length === 0 && !isSearching && (
          <div className="p-16 text-center bg-slate-50/30 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
            <UserCircle className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users found in this category</p>
          </div>
        )}
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
