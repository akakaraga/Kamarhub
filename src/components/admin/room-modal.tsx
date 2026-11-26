"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { createRoom, updateRoom } from "@/app/(admin)/rooms/actions";
import { DoorClosed, Building2, Tag, Banknote, Loader2 } from "lucide-react";
import { Tables, RoomStatus } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Tables<"properties">[];
  room?: Tables<"rooms"> | null;
  defaultPropertyId?: string;
}

const PRICE_PRESETS = [
  { label: "Rp 800.000", value: 800000 },
  { label: "Rp 1.000.000", value: 1000000 },
  { label: "Rp 1.500.000", value: 1500000 },
  { label: "Rp 2.000.000", value: 2000000 },
];

export function RoomModal({
  isOpen,
  onClose,
  properties,
  room,
  defaultPropertyId,
}: RoomModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(room);

  // Form states to allow preset chip clicks
  const [roomNumber, setRoomNumber] = useState(room?.room_number || "");
  const [roomType, setRoomType] = useState(room?.room_type || "");
  const [basePrice, setBasePrice] = useState<number | string>(
    room?.base_price ?? (isEditing ? 1500000 : 1000000)
  );

  // Sync state when room prop changes or modal opens
  useEffect(() => {
    if (room) {
      setRoomNumber(room.room_number || "");
      setRoomType(room.room_type || "");
      setBasePrice(room.base_price ?? 1500000);
    } else {
      setRoomNumber("");
      setRoomType("");
      setBasePrice(1000000);
    }
    setError(null);
  }, [room, isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = isEditing && room
      ? await updateRoom(room.id, formData)
      : await createRoom(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Unit Kamar ${room?.room_number}` : "Tambah Unit Kamar Kos"}
      description="Tentukan nomor kamar, fasilitas tipe, dan harga sewa dasar bulanan."
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Gedung Kos */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Gedung Kos <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              name="propertyId"
              required
              defaultValue={room?.property_id || defaultPropertyId || properties[0]?.id || ""}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition font-medium text-slate-800"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nomor / Kode Kamar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Nomor / Kode Kamar <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DoorClosed className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="roomNumber"
              required
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="Contoh: Kamar 101, A-02, atau VIP-1"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Tipe Kamar & Fasilitas */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Tipe Kamar & Fasilitas
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="Contoh: AC + KM Dalam, Non-AC, atau Suite VIP"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Harga Sewa Dasar Bulanan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Harga Sewa Dasar Bulanan (Rp) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {formatRupiah(Number(basePrice) || 0)} / bulan
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Banknote className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="basePrice"
              required
              min={0}
              step={50000}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="1000000"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold text-slate-900"
            />
          </div>

          {/* Price Quick Presets */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setBasePrice(p.value)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition ${
                  Number(basePrice) === p.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Operasional */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Status Operasional Kamar
          </label>
          <select
            name="status"
            defaultValue={room?.status || "available"}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition font-medium text-slate-800"
          >
            <option value="available">🟢 Tersedia (Available)</option>
            <option value="occupied">🔴 Terisi (Occupied)</option>
            <option value="maintenance">🟡 Dalam Perbaikan (Maintenance)</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEditing ? "Simpan Perubahan" : "Simpan Kamar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
