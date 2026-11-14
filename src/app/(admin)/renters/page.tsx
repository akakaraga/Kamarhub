import { Users, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/database";

export default async function RentersPage() {
  const supabase = await createClient();
  const { data: rawRenters } = await supabase.from("renters").select("*");
  const renters = (rawRenters || []) as Tables<"renters">[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Penghuni & Kontrak Sewa
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manajemen identitas KTP, nomor WhatsApp darurat, dan masa aktif sewa penghuni.
          </p>
        </div>
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Onboard Penghuni Baru
        </button>
      </div>

      {renters.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Penghuni Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Buat kontrak sewa baru dan daftarkan anak kos dengan aman ke sistem.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Tambah Penghuni
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Nama Penghuni</th>
                <th className="px-6 py-3">WhatsApp</th>
                <th className="px-6 py-3">Kontak Darurat</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renters.map((renter) => (
                <tr key={renter.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-slate-900">{renter.full_name}</td>
                  <td className="px-6 py-4">{renter.whatsapp_number}</td>
                  <td className="px-6 py-4">{renter.emergency_contact || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-500 font-semibold">
                      Detail Kontrak
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
