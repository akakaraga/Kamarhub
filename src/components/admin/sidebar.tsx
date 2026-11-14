"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  DoorClosed, 
  Users, 
  Receipt, 
  Wrench, 
  Settings, 
  CreditCard,
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(auth)/actions";

interface SidebarProps {
  companyName?: string;
  subscriptionPlan?: string;
}

const navigation = [
  { name: "Ringkasan Dasbor", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properti (Kos)", href: "/properties", icon: Home },
  { name: "Daftar Kamar", href: "/rooms", icon: DoorClosed },
  { name: "Penghuni & Kontrak", href: "/renters", icon: Users },
  { name: "Tagihan & Invoices", href: "/invoices", icon: Receipt },
  { name: "Keluhan / Maintenance", href: "/maintenance", icon: Wrench },
];

export function AdminSidebar({ companyName = "Kos Hub", subscriptionPlan = "free" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-white tracking-tight flex items-center gap-1">
            Kamar<span className="text-blue-500">Hub</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
            {companyName}
          </span>
        </div>
      </div>

      {/* Plan Badge */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Plan {subscriptionPlan}
          </span>
        </div>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
          Multi-Tenant
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Operasional
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer & User Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30 space-y-1">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 font-medium transition"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
