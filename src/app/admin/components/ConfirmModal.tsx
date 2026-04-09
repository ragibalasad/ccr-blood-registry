"use client";

import { X, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  variant?: "danger" | "success" | "warning";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const colors = {
    danger: "bg-red-50 text-red-600 border-red-100 ring-red-500 hover:bg-red-600",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500 hover:bg-emerald-600",
    warning: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-500 hover:bg-amber-600",
  };

  const btnColors = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-200",
    success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    warning: "bg-red-600 hover:bg-red-700 shadow-red-200", // Standard admin red for warning
  };

  const Icon = variant === "success" ? ShieldCheck : AlertTriangle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={loading ? undefined : onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onCancel}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${colors[variant].split(' ').slice(0, 3).join(' ')}`}>
            <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${btnColors[variant]}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
