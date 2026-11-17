"use client";

import { Modal } from "@/components/ui/modal";
import { formatRupiah, formatDate } from "@/lib/utils";
import { 
  Building2, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Receipt
} from "lucide-react";

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    invoiceNumber: string;
    billingMonth: string;
    dueDate: string;
    paidAt: string | null;
    status: string;
    roomFee: number;
    additionalFee: number;
    penaltyFee: number;
    totalAmount: number;
    renterName: string;
    renterPhone: string;
    roomNumber: string;
    roomType: string;
    propertyName: string;
    propertyAddress: string | null;
    ownerCompanyName?: string;
  } | null;
}

export function DigitalReceiptModal({
  isOpen,
  onClose,
  receiptData,
}: DigitalReceiptModalProps) {
  if (!receiptData) return null;

  const isPaid = receiptData.status === "paid";

  function handlePrint() {
    window.print();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kwitansi & Struk Tagihan Digital"
      description="Bukti pembayaran resmi hospitality-grade untuk penghuni kos."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Receipt Box */}
        <div 
          id="printable-receipt" 
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-slate-800"
        >
          {/* Header Receipt */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  {receiptData.ownerCompanyName || "KamarHub SaaS"}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {receiptData.propertyName}
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                {receiptData.propertyAddress || "Alamat Properti Kos"}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lunas / Paid
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" /> Belum Lunas
                  </>
                )}
              </span>
              <div className="text-[11px] text-slate-400 mt-2">
                ID Tagihan: <span className="font-mono text-slate-600 font-semibold">{receiptData.invoiceNumber.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Periode: <span className="font-semibold">{receiptData.billingMonth}</span>
              </div>
            </div>
          </div>

          {/* Renter & Room Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Ditagihkan Kepada:
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {receiptData.renterName}
              </div>
              <div className="text-slate-500">{receiptData.renterPhone}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Unit Kamar:
              </span>
              <div className="font-black text-slate-900 text-sm mt-0.5">
                Kamar {receiptData.roomNumber}
              </div>
              <div className="text-slate-500">{receiptData.roomType}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rincian Biaya
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-2">Deskripsi Layanan</th>
                  <th className="py-2 text-right">Jumlah (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-medium text-slate-800">
                    Sewa Kamar Periode {receiptData.billingMonth}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    {formatRupiah(Number(receiptData.roomFee))}
                  </td>
                </tr>

                {Number(receiptData.additionalFee) > 0 && (
                  <tr>
                    <td className="py-2.5 text-slate-600">
                      Biaya Tambahan Fasilitas Pribadi (Kulkas/Listrik/dll)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-900">
                      {formatRupiah(Number(receiptData.additionalFee))}
                    </td>
                  </tr>
                )}

                {Number(receiptData.penaltyFee) > 0 && (
                  <tr>
                    <td className="py-2.5 text-rose-600 font-medium">
                      Denda Keterlambatan Pembayaran
                    </td>
                    <td className="py-2.5 text-right font-semibold text-rose-600">
                      {formatRupiah(Number(receiptData.penaltyFee))}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 text-sm font-black text-slate-900">
                  <td className="py-3">TOTAL TAGIHAN</td>
                  <td className="py-3 text-right text-base text-blue-600">
                    {formatRupiah(Number(receiptData.totalAmount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              {isPaid ? (
                <span>
                  Dibayar pada:{" "}
                  <strong className="text-slate-700">
                    {receiptData.paidAt ? formatDate(receiptData.paidAt) : "-"}
                  </strong>
                </span>
              ) : (
                <span>
                  Jatuh tempo:{" "}
                  <strong className="text-rose-600">
                    {formatDate(receiptData.dueDate)}
                  </strong>
                </span>
              )}
            </div>
            <div className="italic">
              Kwitansi ini dihasilkan secara otomatis oleh sistem KamarHub.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
