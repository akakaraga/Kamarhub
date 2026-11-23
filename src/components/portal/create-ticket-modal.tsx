"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createMaintenanceTicket } from "@/app/portal/actions";
import { 
  Wrench, 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  Zap, 
  Droplet, 
  Wind, 
  Key, 
  Building 
} from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomNumber: string;
}

const categories = [
  { id: "AC", label: "AC / Pendingin", icon: Wind },
  { id: "Air", label: "Pipa / Air / Kran", icon: Droplet },
  { id: "Listrik", label: "Kelistrikan / Lampu", icon: Zap },
  { id: "Kunci", label: "Kunci / Pintu", icon: Key },
  { id: "Bangunan", label: "Dinding / Plafon", icon: Building },
  { id: "Lainnya", label: "Lainnya", icon: Wrench },
];

export function CreateTicketModal({
  isOpen,
  onClose,
  roomNumber,
}: CreateTicketModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("AC");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("category", selectedCategory);
    if (selectedFile) {
      formData.set("photoFile", selectedFile);
    }

    const res = await createMaintenanceTicket(formData);

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
      title="Laporkan Kendala / Kerusakan"
      description={`Kamar ${roomNumber} • Pengelola kos akan segera meninjau dan menugaskan teknisi.`}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pilihan Kategori */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Kategori Fasilitas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-xs">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deskripsi Masalah */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Deskripsi Permasalahan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Contoh: AC meneteskan air terus-menerus sejak kemarin malam dan kurang dingin..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Upload Foto Kerusakan */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Foto Bukti Kerusakan (Opsional)
          </label>

          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition">
            {previewUrl ? (
              <div className="space-y-1 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview Kerusakan"
                  className="max-h-36 w-auto mx-auto rounded-lg shadow-sm"
                />
                <p className="text-[10px] text-blue-600 font-semibold">
                  Ganti Foto ({selectedFile?.name})
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 font-medium">
                  Sentuh untuk lampirkan foto kerusakan
                </span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
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
            Kirim Laporan
          </button>
        </div>
      </form>
    </Modal>
  );
}
