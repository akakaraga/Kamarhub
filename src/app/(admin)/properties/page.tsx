import Link from "next/link";
import { Building2, Plus, MapPin, DoorClosed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/database";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: rawProps } = await supabase.from("properties").select("*");
  const properties = (rawProps || []) as Tables<"properties">[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Properti (Gedung Kos)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola cabang dan bangunan kos Anda. Satu akun pemilik dapat mengelola multi-gedung.
          </p>
        </div>
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Gedung Baru
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Properti Kos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Daftarkan gedung kos pertama Anda untuk mulai mengatur kamar dan harga sewa dasar.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Tambah Gedung Properti
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{prop.name}</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md">
                    {prop.total_rooms} Kamar
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {prop.address || "Belum ada alamat rinci"}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/rooms?property=${prop.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
                >
                  <DoorClosed className="w-3.5 h-3.5" />
                  Lihat Kamar
                </Link>
                <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                  Edit Gedung
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
