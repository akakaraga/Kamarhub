"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createProperty, updateProperty } from "@/app/(admin)/properties/actions";
import { Building2, MapPin, Loader2 } from "lucide-react";
import { Tables } from "@/types/database";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Tables<"properties"> | null;
}

export function PropertyModal({ isOpen, onClose, property }: PropertyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(property);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = isEditing && property
      ? await updateProperty(property.id, formData)
      : await createProperty(formData);

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
      title={isEditing ? "Edit Gedung Properti" : "Tambah Gedung Kos Baru"}
      description="Kelola nama bangunan kos dan lokasinya untuk mengelompokkan unit kamar."
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Nama Bangunan / Kos <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              required
              defaultValue={property?.name || ""}
              placeholder="Contoh: Kos Mawar Indah, Paviliun Garuda"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Alamat Lengkap
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              name="address"
              rows={3}
              defaultValue={property?.address || ""}
              placeholder="Jl. Kaliurang KM 5, Gang Mawar No. 12, Sleman, Yogyakarta"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
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
            {isEditing ? "Simpan Perubahan" : "Simpan Gedung"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
