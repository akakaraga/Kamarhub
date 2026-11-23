"use client";

import { useState } from "react";
import { 
  Building2, 
  DoorClosed, 
  LogOut, 
  Receipt, 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Plus, 
  Phone, 
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { logoutRenter } from "@/app/portal/actions";
import { PaymentUploadModal } from "./payment-upload-modal";
import { CreateTicketModal } from "./create-ticket-modal";
import { formatRupiah, formatDate } from "@/lib/utils";

interface RenterPortalViewProps {
  renter: any;
  contract: any;
  invoices: any[];
  tickets: any[];
}

export function RenterPortalView({
  renter,
  contract,
  invoices,
  tickets,
}: RenterPortalViewProps) {
  const [uploadInvoice, setUploadInvoice] = useState<any | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const room = contract?.rooms;
  const property = room?.properties;
  const owner = contract?.tenants;

  // Active (unpaid/overdue) invoice
  const activeInvoice = invoices.find(
    (i) => i.status === "unpaid" || i.status === "overdue"
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 selection:bg-blue-500 selection:text-white">
      {/* Mobile-Friendly Top Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 px-4 py-3.5 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>{property?.name || "KamarHub Kos"}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Kamar {room?.room_number || "-"} • {renter.full_name}
              </div>
            </div>
          </div>

          <form action={logoutRenter}>
            <button
              type="submit"
              title="Keluar Akun"
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Container (Mobile Form Factor) */}
      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Welcome & Room Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                  Unit Sewa Anda
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
                  Kamar {room?.room_number || "-"}
                </h2>
                <p className="text-xs text-blue-100 font-medium">
                  {room?.room_type || "Standard Room"}
                </p>
              </div>

              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                🟢 Aktif
              </span>
            </div>

            <div className="pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-blue-200 block">Mulai Sewa:</span>
                <span className="font-semibold">{contract ? formatDate(contract.start_date) : "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block">Uang Deposit:</span>
                <span className="font-semibold">
                  {contract ? formatRupiah(Number(contract.deposit_amount)) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tagihan Sewa (Invoice Card) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-400" />
              Tagihan Sewa Bulan Ini
            </h3>
          </div>

          {activeInvoice ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Periode Bulan</span>
                  <div className="text-base font-extrabold text-slate-900">
                    {activeInvoice.billing_month}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeInvoice.status === "overdue"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {activeInvoice.status === "overdue" ? "⚠️ Terlambat" : "⏳ Belum Lunas"}
                </span>
              </div>

              {/* Rincian Komponen Biaya */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Sewa Pokok Kamar:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(Number(activeInvoice.room_fee))}
                  </span>
                </div>

                {Number(activeInvoice.additional_fee) > 0 && (
                  <div className="flex items-center justify-between text-blue-600">
                    <span>Biaya Tambahan:</span>
                    <span className="font-semibold">
                      +{formatRupiah(Number(activeInvoice.additional_fee))}
                    </span>
                  </div>
                )}

                {Number(activeInvoice.penalty_fee) > 0 && (
                  <div className="flex items-center justify-between text-rose-600">
                    <span>Denda Keterlambatan:</span>
                    <span className="font-semibold">
                      +{formatRupiah(Number(activeInvoice.penalty_fee))}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                  <span>Total Tagihan:</span>
                  <span className="text-blue-600">
                    {formatRupiah(Number(activeInvoice.total_amount))}
                  </span>
                </div>
              </div>

              {/* Rekening Pembayaran */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Rekening Tujuan Transfer:
                </div>
                <div className="text-slate-600">
                  Transfer ke rekening pemilik kos (<strong>{owner?.company_name || owner?.full_name || "Pengelola Kos"}</strong>).
                </div>
                <div className="text-[11px] text-slate-500">
                  Jatuh tempo: <strong className="text-slate-800">{formatDate(activeInvoice.due_date)}</strong>
                </div>
              </div>

              {/* Tombol Upload Struk */}
              {activeInvoice.payment_proof_url ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bukti Transfer Telah Dikirim</span>
                  </div>
                  <button
                    onClick={() => setUploadInvoice(activeInvoice)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setUploadInvoice(activeInvoice)}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Kirim / Unggah Bukti Bayar
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Semua Tagihan Sudah Lunas! 🎉
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tidak ada tagihan sewa yang menunggu pembayaran. Terima kasih telah membayar tepat waktu.
              </p>
            </div>
          )}
        </div>

        {/* Section Lapor Kerusakan Fasilitas (Maintenance) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-slate-400" />
              Keluhan & Perbaikan Fasilitas
            </h3>
            <button
              onClick={() => setTicketModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Lapor Kerusakan
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-1 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">
                Belum ada laporan kerusakan fasilitas.
              </p>
              <p className="text-[11px] text-slate-400">
                Mengalami masalah AC, air, atau lampu mati? Laporkan ke pengelola kos kapan saja.
              </p>
              <button
                onClick={() => setTicketModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Laporan Baru
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {t.issue_category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status === "resolved"
                          ? "Selesai"
                          : t.status === "in_progress"
                          ? "Diproses"
                          : "Menunggu"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {t.description}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Dilaporkan: {formatDate(t.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Riwayat Tagihan Lampau */}
        {invoices.length > 1 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Riwayat Pembayaran Sebelumnya
            </h3>
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {invoices
                .filter((i) => i.id !== activeInvoice?.id)
                .map((inv) => (
                  <div key={inv.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{inv.billing_month}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.status === "paid" ? `Lunas pada ${formatDate(inv.paid_at || inv.due_date)}` : `Jatuh tempo: ${formatDate(inv.due_date)}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        {formatRupiah(Number(inv.total_amount))}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        LUNAS
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <PaymentUploadModal
        isOpen={Boolean(uploadInvoice)}
        onClose={() => setUploadInvoice(null)}
        invoice={uploadInvoice}
      />

      <CreateTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        roomNumber={room?.room_number || "-"}
      />
    </div>
  );
}
