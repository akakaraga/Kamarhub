"use client";

import { User, Search, Shield, Building } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";
import { AdminNotification } from "@/lib/notifications";

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  companyName?: string;
  notifications?: AdminNotification[];
}

export function AdminHeader({ userEmail, userName, companyName, notifications = [] }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kamar, nomor invoice, atau nama penghuni..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Interactive Notification Bell Dropdown */}
        <NotificationDropdown initialNotifications={notifications} />

        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
            {userName ? userName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {userName || "Pemilik Kos"}
            </span>
            <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
              {userEmail || "admin@kamarhub.id"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
