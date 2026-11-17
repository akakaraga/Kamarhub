"use client";

import { useState } from "react";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Sliders, 
  FileText, 
  Trash2, 
  Loader2,
  Building2,
  DoorClosed,
  Phone
} from "lucide-react";
import { CreateInvoiceModal, ActiveContractOption } from "./create-invoice-modal";
import { EditFeesModal } from "./edit-fees-modal";
import { VerifyPaymentModal } from "./verify-payment-modal";
import { DigitalReceiptModal } from "./digital-receipt-modal";
import { deleteInvoice } from "@/app/(admin)/invoices/actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Tables } from "@/types/database";

export interface InvoiceWithDetails extends Tables<"invoices"> {
  contracts?: {
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
      room_type: string | null;
      base_price: number;
      properties?: {
        id: string;
        name: string;
        address: string | null;
      } | null;
    } | null;
  } | null;
}

interface InvoiceListProps {
  invoices: InvoiceWithDetails[];
  activeContracts: ActiveContractOption[];
  properties: Tables<"properties">[];
  companyName?: string;
}

export function InvoiceList({
  invoices,
  activeContracts,
  properties,
  companyName,
}: InvoiceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editFeesInvoice, setEditFeesInvoice] = useState<any | null>(null);
  const [verifyInvoice, setVerifyInvoice] = useState<any | null>(null);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Compute KPI totals
  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const overdueCount = invoices.filter((i) => {
    if (i.status === "paid") return false;
    const isPastDue = new Date(i.due_date) < new Date();
    return i.status === "overdue" || isPastDue;
  }).length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const renterName = inv.contracts?.renters?.full_name?.toLowerCase() || "";
    const roomNumber = inv.contracts?.rooms?.room_number?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();

    const matchesSearch = renterName.includes(q) || roomNumber.includes(q);

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "unpaid" && inv.status === "unpaid") ||
      (selectedStatus === "paid" && inv.status === "paid") ||
      (selectedStatus === "overdue" && (inv.status === "overdue" || (inv.status !== "paid" && new Date(inv.due_date) < new Date())));

    const matchesProperty =
      selectedPropertyId === "all" ||
      inv.contracts?.rooms?.properties?.id === selectedPropertyId;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  async function handleDelete(invoiceId: string) {
    if (!confirm("Hapus tagihan ini secara permanen?")) return;
    setDeletingId(invoiceId);
    setActionError(null);
    const res = await deleteInvoice(invoiceId);
    if (res?.error) {
      setActionError(res.error);
    }
    setDeletingId(null);
  }

  function handleOpenReceipt(inv: InvoiceWithDetails) {
    setReceiptData({
      invoiceNumber: inv.id,
      billingMonth: inv.billing_month,
      dueDate: inv.due_date,
      paidAt: inv.paid_at,
      status: inv.status,
      roomFee: Number(inv.room_fee),
      additionalFee: Number(inv.additional_fee),
      penaltyFee: Number(inv.penalty_fee),
      totalAmount: Number(inv.total_amount),
      renterName: inv.contracts?.renters?.full_name || "Penghuni",
      renterPhone: inv.contracts?.renters?.whatsapp_number || "-",
      roomNumber: inv.contracts?.rooms?.room_number || "-",
      roomType: inv.contracts?.rooms?.room_type || "Standard",
      propertyName: inv.contracts?.rooms?.properties?.name || "Kos Mawar",
      propertyAddress: inv.contracts?.rooms?.properties?.address || null,
      ownerCompanyName: companyName,
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Tagihan & Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manajemen siklus penagihan sewa, penyesuaian denda & biaya tambahan, serta verifikasi bukti bayar.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat Tagihan Manual
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {actionError}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Piutang */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Piutang (Belum Bayar)
            </span>
            <div className="text-xl font-black text-amber-600 mt-1">
              {formatRupiah(totalUnpaid)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Total Lunas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Pendapatan Lunas
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {formatRupiah(totalPaid)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Tagihan Overdue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jatuh Tempo / Menunggak
            </span>
            <div className="text-xl font-black text-rose-600 mt-1">
              {overdueCount} Tagihan
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua ({invoices.length})
          </button>
          <button
            onClick={() => setSelectedStatus("unpaid")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "unpaid"
                ? "bg-amber-600 text-white"
                : "text-amber-700 hover:bg-amber-50 bg-amber-50/50"
            }`}
          >
            Belum Lunas ({invoices.filter((i) => i.status === "unpaid").length})
          </button>
          <button
            onClick={() => setSelectedStatus("paid")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "paid"
                ? "bg-emerald-600 text-white"
                : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
            }`}
          >
            Lunas ({invoices.filter((i) => i.status === "paid").length})
          </button>
          <button
            onClick={() => setSelectedStatus("overdue")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "overdue"
                ? "bg-rose-600 text-white"
                : "text-rose-700 hover:bg-rose-50 bg-rose-50/50"
            }`}
          >
            Menunggak ({overdueCount})
          </button>
        </div>

        {/* Property & Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Gedung Kos</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penghuni / kamar..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Tagihan Dibuat</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Buat tagihan sewa bulanan pertama Anda untuk penghuni aktif sekarang.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Buat Tagihan Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase font-bold text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Bulan & Penghuni</th>
                  <th className="px-5 py-3.5">Kamar & Kos</th>
                  <th className="px-5 py-3.5">Rincian Komponen Biaya</th>
                  <th className="px-5 py-3.5">Total Tagihan</th>
                  <th className="px-5 py-3.5">Jatuh Tempo</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const renter = inv.contracts?.renters;
                  const room = inv.contracts?.rooms;
                  const isPaid = inv.status === "paid";
                  const isPastDue = !isPaid && new Date(inv.due_date) < new Date();

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      {/* Periode & Renter */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {inv.billing_month}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5">
                          {renter?.full_name || "Penghuni"}
                        </div>
                        {renter?.whatsapp_number && (
                          <a
                            href={`https://wa.me/${renter.whatsapp_number.replace(/^0/, "62")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            {renter.whatsapp_number}
                          </a>
                        )}
                      </td>

                      {/* Room & Property */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <DoorClosed className="w-3.5 h-3.5 text-blue-600" />
                          Kamar {room?.room_number || "-"}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {room?.properties?.name || "Kos"}
                        </div>
                      </td>

                      {/* Breakdown */}
                      <td className="px-5 py-4 text-[11px] space-y-0.5">
                        <div className="text-slate-600">
                          Sewa Pokok: <span className="font-semibold">{formatRupiah(Number(inv.room_fee))}</span>
                        </div>
                        {Number(inv.additional_fee) > 0 && (
                          <div className="text-blue-600 font-medium">
                            + Tambahan: {formatRupiah(Number(inv.additional_fee))}
                          </div>
                        )}
                        {Number(inv.penalty_fee) > 0 && (
                          <div className="text-rose-600 font-medium">
                            + Denda: {formatRupiah(Number(inv.penalty_fee))}
                          </div>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="px-5 py-4 font-black text-slate-900 text-sm">
                        {formatRupiah(Number(inv.total_amount))}
                      </td>

                      {/* Due Date & Paid At */}
                      <td className="px-5 py-4">
                        <div className={`font-semibold ${isPastDue ? "text-rose-600" : "text-slate-700"}`}>
                          {formatDate(inv.due_date)}
                        </div>
                        {isPaid && inv.paid_at && (
                          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            Lunas: {formatDate(inv.paid_at)}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isPastDue || inv.status === "overdue"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> LUNAS
                            </>
                          ) : isPastDue || inv.status === "overdue" ? (
                            <>
                              <AlertTriangle className="w-3 h-3" /> MENUNGGAK
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> BELUM LUNAS
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verifikasi Tombol */}
                          <button
                            onClick={() =>
                              setVerifyInvoice({
                                id: inv.id,
                                total_amount: Number(inv.total_amount),
                                billing_month: inv.billing_month,
                                due_date: inv.due_date,
                                status: inv.status,
                                payment_proof_url: inv.payment_proof_url,
                                paid_at: inv.paid_at,
                                renter_name: renter?.full_name,
                                room_number: room?.room_number,
                              })
                            }
                            title="Verifikasi Pembayaran"
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          >
                            Verifikasi
                          </button>

                          {/* Edit Biaya Tambahan / Denda */}
                          <button
                            onClick={() =>
                              setEditFeesInvoice({
                                id: inv.id,
                                room_fee: Number(inv.room_fee),
                                additional_fee: Number(inv.additional_fee),
                                penalty_fee: Number(inv.penalty_fee),
                                total_amount: Number(inv.total_amount),
                                renter_name: renter?.full_name,
                                room_number: room?.room_number,
                              })
                            }
                            title="Sesuaikan Biaya & Denda"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          {/* Kwitansi Struk */}
                          <button
                            onClick={() => handleOpenReceipt(inv)}
                            title="Cetak Kwitansi Struk"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus Tagihan */}
                          {!isPaid && (
                            <button
                              onClick={() => handleDelete(inv.id)}
                              disabled={deletingId === inv.id}
                              title="Hapus Tagihan"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition disabled:opacity-50"
                            >
                              {deletingId === inv.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        activeContracts={activeContracts}
      />

      <EditFeesModal
        isOpen={Boolean(editFeesInvoice)}
        onClose={() => setEditFeesInvoice(null)}
        invoice={editFeesInvoice}
      />

      <VerifyPaymentModal
        isOpen={Boolean(verifyInvoice)}
        onClose={() => setVerifyInvoice(null)}
        invoice={verifyInvoice}
      />

      <DigitalReceiptModal
        isOpen={Boolean(receiptData)}
        onClose={() => setReceiptData(null)}
        receiptData={receiptData}
      />
    </div>
  );
}
