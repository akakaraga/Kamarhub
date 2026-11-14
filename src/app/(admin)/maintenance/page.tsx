import { Wrench, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/database";

export default async function MaintenancePage() {
  const supabase = await createClient();
  const { data: rawTickets } = await supabase.from("maintenance_tickets").select("*");
  const tickets = (rawTickets || []) as Tables<"maintenance_tickets">[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tiket Keluhan & Pemeliharaan (Maintenance)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Laporan kerusakan fasilitas dari anak kos (Air, Listrik, AC, Kunci, dll).
          </p>
        </div>
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Catat Tiket Perbaikan
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Tidak Ada Keluhan Aktif</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Seluruh fasilitas operasional kos saat ini dalam kondisi optimal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {t.issue_category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  t.status === "resolved" ? "bg-emerald-50 text-emerald-700" :
                  t.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-slate-800 font-medium">{t.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
