"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { onboardRenter } from "@/app/(admin)/renters/actions";
import { 
  User, 
  Phone, 
  CreditCard, 
  DoorClosed, 
  Calendar, 
  Banknote, 
  UploadCloud, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Tables } from "@/types/database";

interface AvailableRoomOption extends Tables<"rooms"> {
  properties?: { name: string } | null;
}

interface OnboardRenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: AvailableRoomOption[];
  onSuccess?: (renter: {
    id: string;
    fullName: string;
    whatsappNumber: string;
    roomNumber?: string | null;
  }) => void;
}

export function OnboardRenterModal({
  isOpen,
  onClose,
  availableRooms,
  onSuccess,
}: OnboardRenterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await onboardRenter(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
      if (onSuccess && res?.renter) {
        const roomId = formData.get("roomId") as string;
        const selectedRoom = availableRooms.find((r) => r.id === roomId);
        onSuccess({
          id: res.renter.id,
          fullName: res.renter.fullName,
          whatsappNumber: res.renter.whatsappNumber,
          roomNumber: selectedRoom ? selectedRoom.room_number : null,
        });
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboarding Penghuni & Buat Kontrak Baru"
      description="Daftarkan identitas anak kos, hubungkan ke kamar kosong, dan catat uang jaminan."
      maxWidth="xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {availableRooms.length === 0 ? (
        <div className="text-center py-8">
          <DoorClosed className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Tidak Ada Kamar Tersedia</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Seluruh unit kamar saat ini berstatus terisi atau sedang dalam perbaikan. Daftarkan kamar baru terlebih dahulu.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            1. Data Identitas Penghuni
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Contoh: Rian Pratama"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  required
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor NIK KTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor NIK KTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="idCardNumber"
                  placeholder="3201xxxxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Kontak Darurat */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kontak Darurat (Keluarga)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="081987654321 (Ibu Kandung)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Upload Foto KTP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Foto KTP (Tersimpan Privat / PDP Compliant)
            </label>
            <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs text-slate-600 font-medium">
                {fileName || "Klik untuk mengunggah foto KTP (JPG, PNG, WebP)"}
              </span>
              <input
                type="file"
                name="ktpFile"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 pt-2">
            2. Detail Kontrak & Kamar
          </div>

          {/* Unit Kamar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Pilih Kamar Kosong <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DoorClosed className="w-4 h-4" />
              </div>
              <select
                name="roomId"
                required
                defaultValue={availableRooms[0]?.id || ""}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Kamar {r.room_number} - {r.properties?.name || "Kos"} ({r.room_type || "Standard"}) - {formatRupiah(Number(r.base_price))}/bln
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Tanggal Mulai */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mulai Sewa <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Selesai (Opsional)
              </label>
              <input
                type="date"
                name="endDate"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Uang Deposit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Uang Jaminan / Deposit (Rp)
              </label>
              <input
                type="number"
                name="depositAmount"
                min={0}
                step={50000}
                defaultValue={500000}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Aktifkan Kontrak & Penghuni
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
