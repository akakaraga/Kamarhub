"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { verifyPayment, getPaymentProofSignedUrl } from "@/app/(admin)/invoices/actions";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Calendar,
  AlertCircle
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface VerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    total_amount: number;
    billing_month: string;
    due_date: string;
    status: string;
    payment_proof_url: string | null;
    paid_at: string | null;
    renter_name?: string;
    room_number?: string;
  } | null;
}

export function VerifyPaymentModal({
  isOpen,
  onClose,
  invoice,
}: VerifyPaymentModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingProof, setLoadingProof] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProof() {
      if (!isOpen || !invoice?.payment_proof_url) {
        setSignedUrl(null);
        return;
      }

      setLoadingProof(true);
      setError(null);
      const res = await getPaymentProofSignedUrl(invoice.payment_proof_url);
      if (res?.error) {
        setError(res.error);
      } else if (res?.signedUrl) {
        setSignedUrl(res.signedUrl);
      }
      setLoadingProof(false);
    }

    loadProof();
  }, [isOpen, invoice]);

  if (!invoice) return null;

  async function handleAction(targetStatus: "paid" | "unpaid") {
    if (!invoice) return;

    setSubmitting(true);
    setError(null);

    const res = await verifyPayment(invoice.id, targetStatus);
    if (res?.error) {
      setError(res.error);
      setSubmitting(false);
    } else {
      setSubmitting(false);
      onClose();
    }
  }

  const isCurrentlyPaid = invoice.status === "paid";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifikasi Pembayaran Tagihan"
      description={`Kamar ${invoice.room_number || ""} • ${invoice.renter_name || ""}`}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Info Ringkas */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Nominal Tagihan:</span>
            <span className="font-bold text-slate-900 text-sm">
              {formatRupiah(Number(invoice.total_amount))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Bulan Periode:</span>
            <span className="font-semibold text-slate-800">{invoice.billing_month}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Jatuh Tempo:</span>
            <span className="font-semibold text-slate-800">{formatDate(invoice.due_date)}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500">Status Saat Ini:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                isCurrentlyPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {invoice.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Bukti Transfer / Photo */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Foto Bukti Struk Transfer
          </label>

          {loadingProof && (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1" />
              <span className="text-xs">Mengambil foto struk transfer...</span>
            </div>
          )}

          {!loadingProof && signedUrl && (
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedUrl}
                  alt="Bukti Transfer"
                  className="max-h-52 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  Buka Ukuran Asli
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {!loadingProof && !invoice.payment_proof_url && (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
              Penghuni belum mengunggah foto bukti transfer manual. Anda tetap dapat memverifikasi jika pembayaran telah diterima via rekening/tunai.
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Tutup
          </button>

          {isCurrentlyPaid ? (
            <button
              type="button"
              onClick={() => handleAction("unpaid")}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              Batalkan Status Lunas
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAction("paid")}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Verifikasi Sebagai Lunas
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
