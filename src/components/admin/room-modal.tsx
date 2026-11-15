"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createRoom, updateRoom } from "@/app/(admin)/rooms/actions";
import { DoorClosed, Building2, Tag, Banknote, Loader2 } from "lucide-react";
import { Tables, RoomStatus } from "@/types/database";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Tables<"properties">[];
  room?: Tables<"rooms"> | null;
  defaultPropertyId?: string;
}

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
      title={isEditing ? `Edit Kamar ${room?.room_number}` : "Tambah Unit Kamar Baru"}
      description="Tentukan nomor kamar, fasilitas tipe, dan harga sewa dasar bulanan."
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              name="propertyId"
              required
              defaultValue={room?.property_id || defaultPropertyId || properties[0]?.id || ""}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nomor Kamar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Nomor / Kode Kamar <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <DoorClosed className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="roomNumber"
              required
              defaultValue={room?.room_number || ""}
              placeholder="Contoh: 101, A-02, VIP-1"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Tipe Kamar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Tipe Kamar & Fasilitas
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="roomType"
              defaultValue={room?.room_type || "Standard (AC, KM Dalam)"}
              placeholder="Contoh: AC + KM Dalam, Non-AC, Suite VIP"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Harga Dasar Bulanan */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Harga Sewa Dasar Bulanan (Rp) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Banknote className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="basePrice"
              required
              min={0}
              step={50000}
              defaultValue={room?.base_price || 1500000}
              placeholder="1500000"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Status Awal (jika edit) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Status Operasional
          </label>
          <select
            name="status"
            defaultValue={room?.status || "available"}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
          >
            <option value="available">Tersedia (Available)</option>
            <option value="occupied">Terisi (Occupied)</option>
            <option value="maintenance">Dalam Perbaikan (Maintenance)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEditing ? "Simpan Perubahan" : "Simpan Kamar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
