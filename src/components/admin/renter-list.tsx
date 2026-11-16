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
  ExternalLink
} from "lucide-react";
import { OnboardRenterModal } from "./onboard-renter-modal";
import { ViewKtpModal } from "./view-ktp-modal";
import { terminateContract } from "@/app/(admin)/renters/actions";
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
}

export function RenterList({ renters, availableRooms }: RenterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [viewKtpData, setViewKtpData] = useState<{
    name: string;
    path: string | null;
  } | null>(null);
  const [terminatingContractId, setTerminatingContractId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  async function handleTerminate(contractId: string, roomId: string, renterName: string) {
    if (
      !confirm(
        `Apakah Anda yakin ingin menyelesaikan kontrak sewa untuk "${renterName}"? Kamar akan otomatis kembali berstatus Tersedia.`
      )
    ) {
      return;
    }

    setTerminatingContractId(contractId);
    setActionError(null);

    const res = await terminateContract(contractId, roomId);
    if (res?.error) {
      setActionError(res.error);
    }
    setTerminatingContractId(null);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Penghuni & Kontrak Sewa
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manajemen identitas KTP, nomor kontak darurat, uang jaminan, dan masa aktif sewa anak kos.
          </p>
        </div>
        <button
          onClick={() => setOnboardModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Onboard Penghuni Baru
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {actionError}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, WhatsApp, atau nomor kamar..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Terdaftar: <span className="font-bold text-slate-900">{renters.length}</span>
        </div>
      </div>

      {/* Table List */}
      {renters.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Penghuni Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Daftarkan penghuni pertama Anda untuk mengaktifkan kontrak sewa kamar dan penerbitan invoice otomatis.
          </p>
          <button
            onClick={() => setOnboardModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Onboard Penghuni Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase font-bold text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Penghuni & NIK</th>
                  <th className="px-5 py-3.5">Kamar Disewa</th>
                  <th className="px-5 py-3.5">Kontak WhatsApp</th>
                  <th className="px-5 py-3.5">Periode Kontrak</th>
                  <th className="px-5 py-3.5">Deposit Jaminan</th>
                  <th className="px-5 py-3.5 text-center">Dokumen KTP</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
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
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          NIK: {renter.id_card_number || "Belum dicatat"}
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
                          <span className="text-[11px] text-slate-400 italic">
                            Tidak ada kontrak aktif
                          </span>
                        )}
                      </td>

                      {/* WhatsApp & Emergency */}
                      <td className="px-5 py-4">
                        <a
                          href={`https://wa.me/${renter.whatsapp_number.replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {renter.whatsapp_number}
                        </a>
                        {renter.emergency_contact && (
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                            Darurat: {renter.emergency_contact}
                          </div>
                        )}
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
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Lihat KTP
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Tanpa Foto
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        {activeContract && room ? (
                          <button
                            onClick={() =>
                              handleTerminate(
                                activeContract.id,
                                activeContract.room_id,
                                renter.full_name
                              )
                            }
                            disabled={terminatingContractId === activeContract.id}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition disabled:opacity-50"
                          >
                            {terminatingContractId === activeContract.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <LogOut className="w-3.5 h-3.5" />
                            )}
                            Akhiri Sewa
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Selesai</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard Modal */}
      <OnboardRenterModal
        isOpen={onboardModalOpen}
        onClose={() => setOnboardModalOpen(false)}
        availableRooms={availableRooms}
      />

      {/* View KTP Modal */}
      {viewKtpData && (
        <ViewKtpModal
          isOpen={Boolean(viewKtpData)}
          onClose={() => setViewKtpData(null)}
          renterName={viewKtpData.name}
          storagePath={viewKtpData.path}
        />
      )}
    </div>
  );
}
