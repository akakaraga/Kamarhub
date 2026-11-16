"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { getKtpSignedUrl } from "@/app/(admin)/renters/actions";
import { ShieldCheck, Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface ViewKtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  renterName: string;
  storagePath: string | null;
}

export function ViewKtpModal({
  isOpen,
  onClose,
  renterName,
  storagePath,
}: ViewKtpModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUrl() {
      if (!isOpen || !storagePath) return;

      setLoading(true);
      setError(null);
      setSignedUrl(null);

      const res = await getKtpSignedUrl(storagePath);
      if (res?.error) {
        setError(res.error);
      } else if (res?.signedUrl) {
        setSignedUrl(res.signedUrl);
      }
      setLoading(false);
    }

    loadUrl();
  }, [isOpen, storagePath]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dokumen KTP: ${renterName}`}
      description="Akses foto KTP privat berbatas waktu (1 jam) sesuai regulasi Perlindungan Data Pribadi."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-xs">Mengambil foto KTP dari penyimpanan terenkripsi...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Gagal Membuka Dokumen</div>
              <div className="mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && signedUrl && (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signedUrl}
                alt={`KTP ${renterName}`}
                className="max-h-[55vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tautan aman kedaluwarsa dalam 60 menit
              </span>
              <a
                href={signedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-500 font-semibold flex items-center gap-1"
              >
                Buka Resolusi Penuh
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
