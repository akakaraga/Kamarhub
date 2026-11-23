"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { uploadPaymentProof } from "@/app/portal/actions";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PaymentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    billing_month: string;
    total_amount: number;
    payment_proof_url: string | null;
  } | null;
}

export function PaymentUploadModal({
  isOpen,
  onClose,
  invoice,
}: PaymentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!invoice || !selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("invoiceId", invoice.id);
    formData.append("proofFile", selectedFile);

    const res = await uploadPaymentProof(formData);

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
      title="Unggah Bukti Transfer Pembayaran"
      description={`Tagihan Periode ${invoice.billing_month} • Total: ${formatRupiah(Number(invoice.total_amount))}`}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Pilih Foto Struk / Screenshot Bukti Transfer
          </label>

          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer transition">
            {previewUrl ? (
              <div className="space-y-2 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview Bukti"
                  className="max-h-48 w-auto mx-auto rounded-lg shadow-sm"
                />
                <p className="text-[11px] text-blue-600 font-semibold">
                  Klik untuk mengganti gambar ({selectedFile?.name})
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  Sentuh di sini untuk memilih foto struk
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Format JPG, PNG, atau WebP (Maks. 5 MB)
                </span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="hidden"
            />
          </label>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-800">
          💡 <strong>Tips:</strong> Setelah Anda mengunggah bukti, status tagihan akan otomatis dikirimkan ke pengelola kos untuk diverifikasi sebagai Lunas.
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
            disabled={loading || !selectedFile}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Kirim Bukti Pembayaran
          </button>
        </div>
      </form>
    </Modal>
  );
}
