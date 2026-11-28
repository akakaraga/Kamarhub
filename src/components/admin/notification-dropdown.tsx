"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  CreditCard, 
  Wrench, 
  AlertCircle, 
  CheckCheck, 
  ChevronRight, 
  ShieldCheck,
  X
} from "lucide-react";
import { AdminNotification } from "@/lib/notifications";

interface NotificationDropdownProps {
  initialNotifications: AdminNotification[];
}

export function NotificationDropdown({ initialNotifications }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "actionable">("all");
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if initialNotifications updates
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(
    (n) => n.isActionable && !readIds.has(n.id)
  ).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "actionable") {
      return n.isActionable;
    }
    return true;
  });

  function handleMarkAllAsRead() {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
  }

  function handleItemClick(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Buka Notifikasi & Aktivitas Kos"
        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition relative ${
          isOpen
            ? "bg-blue-50 border-blue-300 text-blue-600 shadow-sm"
            : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Floating Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Notifikasi
              </span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full border border-red-200">
                  {unreadCount} perlu tindakan
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                  Terbaru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                title="Tandai semua sudah dibaca"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Sudah Dibaca</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pt-2 pb-1 flex items-center gap-2 border-b border-slate-100 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("actionable")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "actionable"
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Perlu Tindakan ({notifications.filter((n) => n.isActionable).length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Semua Beres! Tidak Ada Tindakan Tertunda
                </h4>
                <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                  Tidak ada bukti transfer yang menunggu verifikasi atau tiket keluhan fasilitas yang tertunda.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isRead = readIds.has(notif.id);

                const iconConfig = {
                  payment: {
                    icon: CreditCard,
                    bgClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
                    badgeColor: "bg-emerald-100 text-emerald-800",
                  },
                  maintenance: {
                    icon: Wrench,
                    bgClass: "bg-amber-50 text-amber-600 border-amber-200",
                    badgeColor: "bg-amber-100 text-amber-800",
                  },
                  overdue: {
                    icon: AlertCircle,
                    bgClass: "bg-rose-50 text-rose-600 border-rose-200",
                    badgeColor: "bg-rose-100 text-rose-800",
                  },
                  system: {
                    icon: ShieldCheck,
                    bgClass: "bg-blue-50 text-blue-600 border-blue-200",
                    badgeColor: "bg-blue-100 text-blue-800",
                  },
                }[notif.type];

                const Icon = iconConfig.icon;

                return (
                  <Link
                    key={notif.id}
                    href={notif.link}
                    onClick={() => handleItemClick(notif.id)}
                    className={`block p-3.5 transition hover:bg-slate-50 relative ${
                      isRead ? "opacity-60 bg-white" : "bg-blue-50/20"
                    }`}
                  >
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-4 right-3"></span>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconConfig.bgClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          {notif.badge && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${iconConfig.badgeColor}`}>
                              {notif.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {notif.time}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 leading-tight">
                          {notif.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer Navigation Shortcuts */}
          <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <Link
              href="/invoices"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition flex items-center gap-1"
            >
              <span>Semua Tagihan</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
            <Link
              href="/maintenance"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition flex items-center gap-1"
            >
              <span>Tiket Keluhan</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
