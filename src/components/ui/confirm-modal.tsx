"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, Info, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: Trash2,
      badgeClass: "bg-red-50 text-red-600 ring-8 ring-red-50/60 border border-red-100",
      confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    },
    warning: {
      icon: AlertTriangle,
      badgeClass: "bg-amber-50 text-amber-600 ring-8 ring-amber-50/60 border border-amber-100",
      confirmBtnClass: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    },
    info: {
      icon: Info,
      badgeClass: "bg-blue-50 text-blue-600 ring-8 ring-blue-50/60 border border-blue-100",
      confirmBtnClass: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    },
  }[variant];

  const Icon = iconConfig.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-6 text-center animate-in zoom-in-95 duration-150"
      >
        {/* Centered Icon Badge */}
        <div className="flex justify-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconConfig.badgeClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-slate-500 font-normal">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 ${iconConfig.confirmBtnClass}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
