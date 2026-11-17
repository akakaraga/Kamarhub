"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { updateInvoiceFees } from "@/app/(admin)/invoices/actions";
import { Banknote, Loader2, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface EditFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    room_fee: number;
    additional_fee: number;
    penalty_fee: number;
    total_amount: number;
    renter_name?: string;
    room_number?: string;
  } | null;
}

export function EditFeesModal({ isOpen, onClose, invoice }: EditFeesModalProps) {
  const [additionalFee, setAdditionalFee] = useState<number>(
    invoice?.additional_fee || 0
  );
  const [penaltyFee, setPenaltyFee] = useState<number>(
    invoice?.penalty_fee || 0
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) return null;

  const roomFee = Number(invoice.room_fee);
  const calculatedTotal = roomFee + Number(additionalFee) + Number(penaltyFee);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!invoice) return;

    setLoading(true);
    setError(null);

    const res = await updateInvoiceFees(
      invoice.id,
      Number(additionalFee),
      Number(penaltyFee)
    );

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
      title="Sesuaikan Biaya Tambahan & Denda"
      description={`Kamar ${invoice.room_number || ""} • ${invoice.renter_name || ""}`}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sewa Kamar Tetap */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Sewa Pokok Kamar:</span>
          <span className="text-xs font-bold text-slate-900">{formatRupiah(roomFee)}</span>
        </div>

        {/* Biaya Tambahan */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Biaya Tambahan Fasilitas (Rp)
          </label>
          <p className="text-[11px] text-slate-400 mb-1.5">
            Contoh: Bawa kulkas sendiri, dispenser, atau tamu menginap mingguan.
          </p>
          <input
            type="number"
            min={0}
            step={10000}
            value={additionalFee}
            onChange={(e) => setAdditionalFee(Number(e.target.value))}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Denda Keterlambatan */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Denda Keterlambatan Bayar (Rp)
          </label>
          <p className="text-[11px] text-slate-400 mb-1.5">
            Denda yang dikenakan jika pembayaran melewati tanggal jatuh tempo.
          </p>
          <input
            type="number"
            min={0}
            step={10000}
            value={penaltyFee}
            onChange={(e) => setPenaltyFee(Number(e.target.value))}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total Terkini */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900">Total Tagihan Baru:</span>
          <span className="text-sm font-black text-blue-700">
            {formatRupiah(calculatedTotal)}
          </span>
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
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Simpan Perubahan Biaya
          </button>
        </div>
      </form>
    </Modal>
  );
}
