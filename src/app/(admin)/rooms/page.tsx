import { DoorClosed, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Tables } from "@/types/database";

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data: rawRooms } = await supabase.from("rooms").select("*");
  const rooms = (rawRooms || []) as Tables<"rooms">[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Unit Kamar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola status ketersediaan, tipe fasilitas (AC/Non-AC), dan harga sewa dasar.
          </p>
        </div>
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Unit Kamar
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <DoorClosed className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Kamar Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Daftarkan unit kamar baru agar dapat dihubungkan dengan kontrak sewa penghuni.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Tambah Kamar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {rooms.map((room) => {
            const isAvailable = room.status === "available";
            const isOccupied = room.status === "occupied";

            return (
              <div 
                key={room.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  isAvailable ? "bg-emerald-50/50 border-emerald-200" :
                  isOccupied ? "bg-rose-50/50 border-rose-200" :
                  "bg-amber-50/50 border-amber-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-lg text-slate-900">
                      {room.room_number}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isAvailable ? "bg-emerald-500" :
                      isOccupied ? "bg-rose-500" :
                      "bg-amber-500"
                    }`} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{room.room_type || "Standard"}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="text-xs font-bold text-slate-800">
                    {formatRupiah(Number(room.base_price))}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">
                    {room.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
