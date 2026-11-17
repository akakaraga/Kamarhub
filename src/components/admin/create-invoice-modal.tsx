"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createManualInvoice } from "@/app/(admin)/invoices/actions";
import { 
  Receipt, 
  User, 
  Calendar, 
  Banknote, 
  PlusCircle, 
  AlertTriangle, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export interface ActiveContractOption {
  id: string;
  room_id: string;
  renter_id: string;
  start_date: string;
  renters?: {
    full_name: string;
    whatsapp_number: string;
  } | null;
  rooms?: {
    room_number: string;
    base_price: number;
    properties?: {
      name: string;
    } | null;
  } | null;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContracts: ActiveContractOption[];
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  activeContracts,
}: CreateInvoiceModalProps) {
  const [selectedContractId, setSelectedContractId] = useState<string>(
    activeContracts[0]?.id || ""
  );

  const selectedContract = activeContracts.find((c) => c.id === selectedContractId);
  const defaultRoomFee = selectedContract?.rooms?.base_price || 0;

  const [roomFee, setRoomFee] = useState<number>(defaultRoomFee);
  const [additionalFee, setAdditionalFee] = useState<number>(0);
  const [penaltyFee, setPenaltyFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update room fee when contract selection changes
  function handleContractChange(contractId: string) {
    setSelectedContractId(contractId);
    const c = activeContracts.find((item) => item.id === contractId);
    if (c?.rooms?.base_price) {
      setRoomFee(c.rooms.base_price);
    }
  }

  const totalAmount = Number(roomFee) + Number(additionalFee) + Number(penaltyFee);

  // Default dates
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const defaultDueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("roomFee", roomFee.toString());
    formData.set("additionalFee", additionalFee.toString());
    formData.set("penaltyFee", penaltyFee.toString());

    const res = await createManualInvoice(formData);

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
      title="Buat Tagihan Sewa Baru (Manual)"
      description="Terbitkan invoice sewa bulanan untuk penghuni aktif dengan rincian biaya sewa dan denda."
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {activeContracts.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Tidak Ada Kontrak Aktif</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Anda perlu mendaftarkan penghuni dan kontrak sewa aktif sebelum membuat tagihan sewa.
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
          {/* Pilih Kontrak / Penghuni */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pilih Penghuni & Kamar <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <select
                name="contractId"
                required
                value={selectedContractId}
                onChange={(e) => handleContractChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {activeContracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.renters?.full_name} — Kamar {c.rooms?.room_number} ({c.rooms?.properties?.name || "Kos"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Periode Bulan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bulan Tagihan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="month"
                  name="billingMonth"
                  required
                  defaultValue={currentMonthStr}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Jatuh Tempo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Jatuh Tempo Pembayaran <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                required
                defaultValue={defaultDueDate}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rincian Komponen Biaya */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Rincian Komponen Biaya
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Biaya Sewa Kamar Pokok */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sewa Pokok (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={roomFee}
                  onChange={(e) => setRoomFee(Number(e.target.value))}
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Biaya Tambahan */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tambahan (Kulkas/Dispenser)
                </label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={additionalFee}
                  onChange={(e) => setAdditionalFee(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Denda Keterlambatan */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Denda Keterlambatan (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={penaltyFee}
                  onChange={(e) => setPenaltyFee(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Total Kalkulasi */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Total Nominal Tagihan:</span>
              <span className="text-sm font-extrabold text-blue-600">
                {formatRupiah(totalAmount)}
              </span>
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Terbitkan Invoice
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
