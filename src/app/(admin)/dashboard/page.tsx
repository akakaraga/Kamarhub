import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { 
  Building2, 
  DoorClosed, 
  ArrowUpRight, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Percent
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Tables } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch properties
  const { data: properties } = await supabase
    .from("properties")
    .select("*");

  // Fetch rooms
  const { data: rawRooms } = await supabase
    .from("rooms")
    .select("*");

  const rooms = (rawRooms || []) as Tables<"rooms">[];
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Fetch invoices for total unpaid and monthly revenue
  const { data: rawInvoices } = await supabase
    .from("invoices")
    .select("*");

  const invoices = (rawInvoices || []) as Tables<"invoices">[];
  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalPaidThisMonth = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  // Fetch pending maintenance tickets
  const { data: rawTickets } = await supabase
    .from("maintenance_tickets")
    .select("*")
    .eq("status", "pending");

  const pendingTickets = (rawTickets || []) as Tables<"maintenance_tickets">[];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ringkasan Operasional Kos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pantau status kamar, arus kas sewa, dan tiket perbaikan fasilitas secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Kelola Properti
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Kamar
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Piutang (Unpaid) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Piutang Belum Bayar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {formatRupiah(totalUnpaid)}
            </div>
            <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Menunggu pembayaran penghuni
            </p>
          </div>
        </div>

        {/* Tingkat Okupansi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tingkat Okupansi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {occupancyRate}%
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {occupiedRooms} terisi dari {totalRooms} total kamar
            </p>
          </div>
        </div>

        {/* Pendapatan Terverifikasi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pendapatan Terbayar</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {formatRupiah(totalPaidThisMonth)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Status lunas diverifikasi
            </p>
          </div>
        </div>

        {/* Tiket Keluhan Masuk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tiket Keluhan Pending</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {pendingTickets.length} Tiket
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Fasilitas butuh perbaikan
            </p>
          </div>
        </div>
      </div>

      {/* Visual Status Kamar Overview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Status Ketersediaan Kamar</h2>
            <p className="text-xs text-slate-500">Visualisasi sebaran kamar berdasarkan kondisi operasional saat ini</p>
          </div>
          <Link href="/rooms" className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1">
            Lihat Grid Lengkap
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              {availableRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-950">Kamar Kosong (Tersedia)</div>
              <div className="text-xs text-emerald-700">Siap disewakan untuk penghuni baru</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
              {occupiedRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-rose-950">Kamar Terisi (Aktif)</div>
              <div className="text-xs text-rose-700">Kontrak sewa sedang berjalan</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
              {maintenanceRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-950">Dalam Perbaikan (Maintenance)</div>
              <div className="text-xs text-amber-700">Perbaikan AC, pipa, atau renovasi</div>
            </div>
          </div>
        </div>

        {totalRooms === 0 && (
          <div className="mt-6 text-center py-8 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <DoorClosed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">Belum Ada Kamar Terdaftar</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Mulai dengan mendaftarkan gedung properti dan unit kamar untuk mengaktifkan manajemen sewa dan tagihan otomatis.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Mulai Daftarkan Properti Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
