import { Receipt, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Tables } from "@/types/database";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: rawInvoices } = await supabase.from("invoices").select("*");
  const invoices = (rawInvoices || []) as Tables<"invoices">[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Tagihan & Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola tagihan sewa bulanan, denda keterlambatan, dan verifikasi bukti transfer pembayaran.
          </p>
        </div>
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat Tagihan Manual
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Tagihan Dibuat</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Tagihan akan digenerasi otomatis H-7 sebelum jatuh tempo atau Anda dapat membuat tagihan manual.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Buat Tagihan Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Periode Bulan</th>
                <th className="px-6 py-3">Total Tagihan</th>
                <th className="px-6 py-3">Jatuh Tempo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-slate-900">{inv.billing_month}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatRupiah(Number(inv.total_amount))}</td>
                  <td className="px-6 py-4">{formatDate(inv.due_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      inv.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                      inv.status === "overdue" ? "bg-rose-50 text-rose-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-500 font-semibold">
                      Verifikasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
