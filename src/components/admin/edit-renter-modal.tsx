"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { updateRenterAccount } from "@/app/(admin)/renters/actions";
import { 
  User, 
  Phone, 
  CreditCard, 
  UploadCloud, 
  Loader2, 
  AlertCircle,
  Smartphone
} from "lucide-react";
import { Tables } from "@/types/database";

interface EditRenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  renter: Tables<"renters">;
}

export function EditRenterModal({
  isOpen,
  onClose,
  renter,
}: EditRenterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("renterId", renter.id);

    const res = await updateRenterAccount(formData);

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
      title="Edit Akun Anak Kos"
      description="Perbarui informasi profil atau ganti nomor WhatsApp login portal anak kos ini."
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Box: WhatsApp Login */}
      <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Akun Login Portal:</span> Jika Anda mengubah nomor WhatsApp, anak kos akan otomatis menggunakan nomor baru tersebut untuk masuk ke <strong>/portal</strong>.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nama Lengkap Anak Kos <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="fullName"
              required
              defaultValue={renter.full_name}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nomor WhatsApp (Login Portal) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="whatsappNumber"
              required
              defaultValue={renter.whatsapp_number}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* NIK / KTP */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nomor Induk Kependudukan (NIK/KTP)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="idCardNumber"
              maxLength={16}
              defaultValue={renter.id_card_number || ""}
              placeholder="16 Digit NIK KTP (Opsional)"
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Kontak Darurat */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Kontak Darurat (Ortu/Wali)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="emergencyContact"
              defaultValue={renter.emergency_contact || ""}
              placeholder="081987654321 (Ibu/Ayah)"
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Ganti Foto KTP */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            {renter.id_card_url ? "Perbarui Foto KTP (Opsional)" : "Unggah Foto KTP"}
          </label>
          <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-700">
              {fileName ? fileName : renter.id_card_url ? "Klik jika ingin mengganti foto KTP saat ini" : "Klik untuk upload foto KTP"}
            </span>
            <input
              type="file"
              name="ktpFile"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? "Menyimpan..." : "Simpan Perubahan Akun"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
