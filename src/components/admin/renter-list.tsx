"use client";

import { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  DoorClosed, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  LogOut, 
  Loader2,
  ExternalLink,
  Smartphone,
  Pencil,
  Trash2,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  QrCode
} from "lucide-react";
import { CreateRenterModal } from "./create-renter-modal";
import { EditRenterModal } from "./edit-renter-modal";
import { ViewKtpModal } from "./view-ktp-modal";
import { RenterAccessModal, RenterAccessData } from "./renter-access-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { terminateContract, deleteRenterAccount } from "@/app/(admin)/renters/actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Tables } from "@/types/database";

export interface RenterWithContract extends Tables<"renters"> {
  contracts?: {
    id: string;
    room_id: string;
    start_date: string;
    end_date: string | null;
    deposit_amount: number;
    status: string;
    rooms?: {
      room_number: string;
      room_type: string | null;
      properties?: { name: string } | null;
    } | null;
  }[];
}

interface RenterListProps {
  renters: RenterWithContract[];
  availableRooms: any[];
  properties?: { id: string; name: string }[];
}

export function RenterList({ renters, availableRooms, properties = [] }: RenterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingRenter, setEditingRenter] = useState<Tables<"renters"> | null>(null);
  const [viewKtpData, setViewKtpData] = useState<{
    name: string;
    path: string | null;
  } | null>(null);
  const [terminatingContractId, setTerminatingContractId] = useState<string | null>(null);
  const [deletingRenterId, setDeletingRenterId] = useState<string | null>(null);
  const [confirmDeleteRenter, setConfirmDeleteRenter] = useState<{ id: string; name: string } | null>(null);
  const [confirmTerminate, setConfirmTerminate] = useState<{
    contractId: string;
    roomId: string;
    renterName: string;
    roomNumber?: string;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [accessModalRenter, setAccessModalRenter] = useState<RenterAccessData | null>(null);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  // Filter renters
  const filteredRenters = renters.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchName = r.full_name.toLowerCase().includes(q);
    const matchPhone = r.whatsapp_number.includes(q);
    const matchRoom = r.contracts?.some((c) =>
      c.rooms?.room_number.toLowerCase().includes(q)
    );
    return matchName || matchPhone || matchRoom;
  });

  async function handleTerminateConfirm() {
    if (!confirmTerminate) return;
    const { contractId, roomId } = confirmTerminate;
    setTerminatingContractId(contractId);
    setActionError(null);

    const res = await terminateContract(contractId, roomId);
    if (res?.error) {
      setActionError(res.error);
    } else {
      setConfirmTerminate(null);
    }
    setTerminatingContractId(null);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteRenter) return;
    const renterId = confirmDeleteRenter.id;
    setDeletingRenterId(renterId);
    setActionError(null);

    const res = await deleteRenterAccount(renterId);
    if (res?.error) {
      setActionError(res.error);
    } else {
      setConfirmDeleteRenter(null);
    }
    setDeletingRenterId(null);
  }

  function handleSendInviteWhatsApp(renter: Tables<"renters">) {
    const cleanPhone = renter.whatsapp_number.replace(/[^0-9]/g, "");
    const waNumber = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/portal` : "https://kamarhub.com/portal";

    const message = encodeURIComponent(
      `Halo Kak ${renter.full_name}! 👋\n\n` +
      `Akun Portal Mandiri Anak Kos Anda di KamarHub telah aktif.\n\n` +
      `Melalui portal ini, Anda dapat:\n` +
      `1. Melihat rincian tagihan sewa bulanan & kuitansi lunas\n` +
      `2. Mengunggah bukti transfer pembayaran langsung\n` +
      `3. Melaporkan kerusakan fasilitas kamar (AC, air, lampu, dll)\n\n` +
      `👉 Masuk ke Portal: ${portalUrl}\n` +
      `📱 ID Masuk (Tanpa Sandi): ${renter.whatsapp_number}\n\n` +
      `Cukup masukkan nomor WhatsApp di atas untuk langsung masuk. Terima kasih!`
    );

    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
  }

  function handleCopyPortalLink(renterId: string) {
    const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/portal` : "https://kamarhub.com/portal";
    navigator.clipboard.writeText(portalUrl);
    setCopiedId(renterId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Akun Anak Kos & Kontrak Sewa
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftarkan akun anak kos, pantau masa sewa kamar, kelola akses portal mandiri, dan brankas KTP privat.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Akun Anak Kos
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-500 font-bold ml-2">×</button>
        </div>
      )}

      {/* Search Bar & Summary */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama anak kos, no. WhatsApp, atau nomor kamar..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <div>
            Total Akun: <span className="font-bold text-slate-900">{renters.length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            Kamar Kosong: <span className="font-bold text-blue-600">{availableRooms.length} Unit</span>
          </div>
        </div>
      </div>

      {/* Table List */}
      {renters.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Akun Anak Kos Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Mulai daftarkan akun anak kos pertama Anda. Akun yang didaftarkan akan otomatis bisa mengakses Portal Mandiri Anak Kos via WhatsApp.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Akun Anak Kos Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase font-bold text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Akun Anak Kos</th>
                  <th className="px-5 py-3.5">Unit Kamar Disewa</th>
                  <th className="px-5 py-3.5">Akses Portal (WhatsApp)</th>
                  <th className="px-5 py-3.5">Periode Kontrak</th>
                  <th className="px-5 py-3.5">Deposit</th>
                  <th className="px-5 py-3.5 text-center">Dokumen KTP</th>
                  <th className="px-5 py-3.5 text-right">Aksi & Undangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRenters.map((renter) => {
                  const activeContract = renter.contracts?.find(
                    (c) => c.status === "active"
                  );
                  const room = activeContract?.rooms;

                  return (
                    <tr key={renter.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & NIK */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {renter.full_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>NIK: {renter.id_card_number || "Belum dicatat"}</span>
                        </div>
                      </td>

                      {/* Room Details */}
                      <td className="px-5 py-4">
                        {room ? (
                          <div>
                            <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <DoorClosed className="w-3 h-3" />
                              Kamar {room.room_number}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-1 truncate max-w-[140px]">
                              {room.properties?.name || "Kos"}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Belum Ada Kamar
                          </span>
                        )}
                      </td>

                      {/* WhatsApp / Portal Login */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                          {renter.whatsapp_number}
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Login Portal Siap
                        </div>
                      </td>

                      {/* Contract Period */}
                      <td className="px-5 py-4">
                        {activeContract ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              Mulai: {formatDate(activeContract.start_date)}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Sampai: {activeContract.end_date ? formatDate(activeContract.end_date) : "Auto-Perpanjang"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
                        )}
                      </td>

                      {/* Deposit Amount */}
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {activeContract
                          ? formatRupiah(Number(activeContract.deposit_amount))
                          : "-"}
                      </td>

                      {/* KTP Document */}
                      <td className="px-5 py-4 text-center">
                        {renter.id_card_url ? (
                          <button
                            onClick={() =>
                              setViewKtpData({
                                name: renter.full_name,
                                path: renter.id_card_url,
                              })
                            }
                            title="Buka Foto KTP Privat"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Lihat KTP
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Tidak ada
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* QR Code & Link Login Modal */}
                          <button
                            onClick={() => {
                              setIsNewRegistration(false);
                              setAccessModalRenter({
                                id: renter.id,
                                fullName: renter.full_name,
                                whatsappNumber: renter.whatsapp_number,
                                roomNumber: activeContract?.rooms?.room_number,
                                propertyName: activeContract?.rooms?.properties?.name,
                              });
                            }}
                            title="Buka QR Code & Link Login Langsung"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                          >
                            <QrCode className="w-3 h-3 text-blue-600" />
                            QR Login
                          </button>

                          {/* Kirim Undangan WhatsApp */}
                          <button
                            onClick={() => handleSendInviteWhatsApp(renter)}
                            title="Kirim Link & Panduan Masuk Portal via WhatsApp"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                          >
                            <Share2 className="w-3 h-3 text-emerald-600" />
                            Akses WA
                          </button>

                          {/* Salin Link Portal */}
                          <button
                            onClick={() => handleCopyPortalLink(renter.id)}
                            title="Salin Tautan Portal Anak Kos"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          >
                            {copiedId === renter.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit Akun */}
                          <button
                            onClick={() => setEditingRenter(renter)}
                            title="Edit Data Akun Anak Kos"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Selesaikan Kontrak jika ada kontrak aktif */}
                          {activeContract && (
                            <button
                              onClick={() =>
                                setConfirmTerminate({
                                  contractId: activeContract.id,
                                  roomId: activeContract.room_id,
                                  renterName: renter.full_name,
                                  roomNumber: activeContract.rooms?.room_number,
                                })
                              }
                              disabled={terminatingContractId === activeContract.id}
                              title="Selesaikan Masa Sewa / Checkout"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition disabled:opacity-50"
                            >
                              {terminatingContractId === activeContract.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                              ) : (
                                <LogOut className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Hapus Akun jika tidak ada kontrak aktif */}
                          {!activeContract && (
                            <button
                              onClick={() =>
                                setConfirmDeleteRenter({
                                  id: renter.id,
                                  name: renter.full_name,
                                })
                              }
                              disabled={deletingRenterId === renter.id}
                              title="Hapus Akun Anak Kos"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            >
                              {deletingRenterId === renter.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
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

      {/* Modal Konfirmasi Hapus Akun */}
      <ConfirmModal
        isOpen={!!confirmDeleteRenter}
        onClose={() => setConfirmDeleteRenter(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Akun Anak Kos?"
        description={`Hapus akun "${confirmDeleteRenter?.name}" secara permanen? Riwayat kontrak yang sudah selesai, tagihan, dan tiket keluhan terkait juga akan ikut dibersihkan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
        isLoading={deletingRenterId === confirmDeleteRenter?.id}
      />

      {/* Modal Konfirmasi Selesai Kontrak */}
      <ConfirmModal
        isOpen={!!confirmTerminate}
        onClose={() => setConfirmTerminate(null)}
        onConfirm={handleTerminateConfirm}
        title="Selesaikan Kontrak Sewa?"
        description={`Apakah Anda yakin ingin menyelesaikan kontrak sewa untuk "${confirmTerminate?.renterName}"? Kamar${confirmTerminate?.roomNumber ? ` (${confirmTerminate.roomNumber})` : ""} akan otomatis kembali berstatus Tersedia.`}
        confirmText="Selesaikan Sewa"
        cancelText="Batal"
        variant="warning"
        isLoading={terminatingContractId === confirmTerminate?.contractId}
      />

      {/* Modal Tambah Akun Anak Kos */}
      <CreateRenterModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        availableRooms={availableRooms}
        properties={properties}
        onSuccess={(newRenter) => {
          setIsNewRegistration(true);
          setAccessModalRenter(newRenter);
        }}
      />

      {/* Modal QR Code & Link Login Portal */}
      <RenterAccessModal
        isOpen={!!accessModalRenter}
        onClose={() => {
          setAccessModalRenter(null);
          setIsNewRegistration(false);
        }}
        renter={accessModalRenter}
        isNewRegistration={isNewRegistration}
      />

      {/* Modal Edit Akun Anak Kos */}
      {editingRenter && (
        <EditRenterModal
          isOpen={true}
          onClose={() => setEditingRenter(null)}
          renter={editingRenter}
        />
      )}

      {/* Modal Lihat Dokumen KTP */}
      {viewKtpData && (
        <ViewKtpModal
          isOpen={true}
          onClose={() => setViewKtpData(null)}
          renterName={viewKtpData.name}
          storagePath={viewKtpData.path}
        />
      )}
    </div>
  );
}
