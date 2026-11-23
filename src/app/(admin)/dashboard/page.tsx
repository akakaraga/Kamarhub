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
  Percent,
  Receipt,
  Wrench,
  Users,
  ShieldCheck,
  ChevronRight,
  Wallet
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Tables } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch properties
  const { data: rawProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: true });
  const properties = (rawProperties || []) as Tables<"properties">[];

  // 2. Fetch rooms with property names
  const { data: rawRooms } = await supabase
    .from("rooms")
    .select("*, properties(name)")
    .order("room_number", { ascending: true });
  const rooms = (rawRooms || []) as (Tables<"rooms"> & { properties?: { name: string } | null })[];

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // 3. Fetch invoices with contract, renter, and room relations
  const { data: rawInvoices } = await supabase
    .from("invoices")
    .select(`
      *,
      contracts (
        renters (name, phone),
        rooms (room_number, properties (name))
      )
    `)
    .order("created_at", { ascending: false });

  const invoices = (rawInvoices || []) as any[];

  // Financial aggregates
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalOverdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalInReview = invoices
    .filter((i) => i.status === "review")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalReceivables = totalUnpaid + totalOverdue;

  // 4. Fetch maintenance tickets
  const { data: rawTickets } = await supabase
    .from("maintenance_tickets")
    .select(`
      *,
      rooms (room_number, properties (name))
    `)
    .order("created_at", { ascending: false });

  const tickets = (rawTickets || []) as any[];
  const pendingTickets = tickets.filter((t) => t.status === "pending" || t.status === "in_progress");

  // Per-property statistics breakdown
  const propertyStats = properties.map((prop) => {
    const propRooms = rooms.filter((r) => r.property_id === prop.id);
    const pTotal = propRooms.length;
    const pOccupied = propRooms.filter((r) => r.status === "occupied").length;
    const pRate = pTotal > 0 ? Math.round((pOccupied / pTotal) * 100) : 0;
    return {
      id: prop.id,
      name: prop.name,
      address: prop.address,
      totalRooms: pTotal,
      occupiedRooms: pOccupied,
      occupancyRate: pRate,
    };
  });

  // Calculate 6-month revenue trend (grouping paid invoices by month)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const now = new Date();
  const past6Months = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return {
      monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: monthNames[d.getMonth()],
      year: d.getFullYear(),
      amount: 0,
    };
  });

  invoices.forEach((inv) => {
    if (inv.status === "paid") {
      const invDate = new Date(inv.paid_at || inv.created_at);
      const invKey = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, "0")}`;
      const found = past6Months.find((m) => m.monthKey === invKey);
      if (found) {
        found.amount += Number(inv.total_amount);
      }
    }
  });

  const maxMonthAmount = Math.max(...past6Months.map((m) => m.amount), 1000000);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dasbor Eksekutif & Analitik Kos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
              Live Real-Time
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Ikhtisar performa arus kas, tingkat okupansi unit, serta pemantauan tiket perbaikan seluruh properti kos Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            Kelola Tagihan
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
        {/* Total Piutang (Receivables) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-amber-200 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Total Piutang Belum Bayar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(totalReceivables)}
            </div>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
              <span className="text-slate-500">Unpaid: {formatRupiah(totalUnpaid)}</span>
              {totalOverdue > 0 && (
                <span className="text-rose-600 font-semibold">Jatuh Tempo: {formatRupiah(totalOverdue)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Tingkat Okupansi Total */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Tingkat Okupansi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{occupancyRate}%</span>
              <span className="text-xs text-slate-500">({occupiedRooms}/{totalRooms} kamar)</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pendapatan Terbayar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Pendapatan Terbayar</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(totalPaid)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Arus kas masuk terverifikasi
            </p>
          </div>
        </div>

        {/* Butuh Verifikasi & Tiket Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-rose-200 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Perlu Tindakan Cepat</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {invoices.filter((i) => i.status === "review").length + pendingTickets.length} Isu
            </div>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 text-slate-500">
              <span>{invoices.filter((i) => i.status === "review").length} Bukti bayar</span>
              <span>{pendingTickets.length} Komplain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Property Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Arus Kas 6 Bulan Terakhir (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                Tren Arus Kas Pendapatan Sewa
              </h2>
              <p className="text-xs text-slate-500">Historis akumulasi pembayaran sewa yang berhasil diverifikasi 6 bulan terakhir</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600">
              Semester Ini
            </span>
          </div>

          {/* Visual Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-200 px-2">
              {past6Months.map((item, idx) => {
                const heightPercent = maxMonthAmount > 0 
                  ? Math.max(Math.round((item.amount / maxMonthAmount) * 100), item.amount > 0 ? 8 : 2)
                  : 2;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap mb-1">
                      {formatRupiah(item.amount)}
                    </div>
                    <div 
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                        item.amount > 0 
                          ? "bg-blue-600 group-hover:bg-blue-700 shadow-sm" 
                          : "bg-slate-100"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-medium text-slate-600 mt-2">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Pendapatan Terverifikasi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                Belum Terisi
              </span>
            </div>
            <span className="font-medium text-slate-700">
              Total 6 Bulan: {formatRupiah(past6Months.reduce((sum, m) => sum + m.amount, 0))}
            </span>
          </div>
        </div>

        {/* Performa Okupansi per Properti (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Okupansi per Gedung
              </h2>
              <Link href="/properties" className="text-xs text-blue-600 font-semibold hover:underline">
                Detail
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Tingkat keterisian kamar di masing-masing lokasi kos aktif
            </p>

            <div className="space-y-4">
              {propertyStats.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Belum ada properti terdaftar
                </div>
              ) : (
                propertyStats.map((prop) => (
                  <div key={prop.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {prop.name}
                      </span>
                      <span className="font-bold text-slate-700">
                        {prop.occupancyRate}% <span className="text-slate-400 font-normal">({prop.occupiedRooms}/{prop.totalRooms})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          prop.occupancyRate >= 80 
                            ? "bg-emerald-500" 
                            : prop.occupancyRate >= 50 
                            ? "bg-blue-600" 
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.min(prop.occupancyRate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Status Kamar Terisi</span>
            <span className="font-semibold text-slate-800">
              {occupiedRooms} dari {totalRooms} Unit
            </span>
          </div>
        </div>
      </div>

      {/* Visual Status Kamar Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Distribusi Ketersediaan Unit</h2>
            <p className="text-xs text-slate-500">Status operasional seluruh kamar kos secara keseluruhan</p>
          </div>
          <Link href="/rooms" className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1">
            Lihat Grid Visual Interaktif
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {availableRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-950">Kamar Kosong (Tersedia)</div>
              <div className="text-xs text-emerald-700">Siap ditempati penghuni baru segera</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {occupiedRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-rose-950">Kamar Terisi (Aktif)</div>
              <div className="text-xs text-rose-700">Kontrak sewa berjalan & menghasilkan pendapatan</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {maintenanceRooms}
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-950">Dalam Perbaikan (Maintenance)</div>
              <div className="text-xs text-amber-700">Unit sedang diservis atau renovasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Invoices & Pending Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Tagihan Terbaru */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Tagihan & Pembayaran Terbaru</h2>
              <p className="text-xs text-slate-500">Daftar transaksi tagihan sewa terbaru</p>
            </div>
            <Link href="/invoices" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Semua Tagihan
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.slice(0, 5).map((inv) => {
              const renterName = inv.contracts?.renters?.name || "Penghuni";
              const roomNumber = inv.contracts?.rooms?.room_number || "-";
              return (
                <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      inv.status === "paid" ? "bg-emerald-50 text-emerald-600" :
                      inv.status === "review" ? "bg-purple-50 text-purple-600" :
                      inv.status === "overdue" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{renterName} (Kamar {roomNumber})</div>
                      <div className="text-[11px] text-slate-400">Jatuh Tempo: {formatDate(inv.due_date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatRupiah(inv.total_amount)}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      inv.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                      inv.status === "review" ? "bg-purple-100 text-purple-700" :
                      inv.status === "overdue" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {invoices.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                Belum ada tagihan sewa dibuat.
              </div>
            )}
          </div>
        </div>

        {/* Tiket Komplain Pemeliharaan Terbaru */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Keluhan Fasilitas Kamar</h2>
              <p className="text-xs text-slate-500">Tiket perbaikan yang dilaporkan penghuni</p>
            </div>
            <Link href="/maintenance" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Pusat Pemeliharaan
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {tickets.slice(0, 5).map((t) => {
              const roomNumber = t.rooms?.room_number || "-";
              return (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      t.status === "resolved" ? "bg-emerald-50 text-emerald-600" :
                      t.status === "in_progress" ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-400">Kamar {roomNumber} • {formatDate(t.created_at)}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      t.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
            {tickets.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                Tidak ada tiket kerusakan yang dilaporkan saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
