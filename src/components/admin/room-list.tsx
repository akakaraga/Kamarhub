"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  DoorClosed, 
  Plus, 
  Building2, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  User, 
  Loader2,
  Filter
} from "lucide-react";
import { RoomModal } from "./room-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { updateRoomStatus, deleteRoom } from "@/app/(admin)/rooms/actions";
import { formatRupiah } from "@/lib/utils";
import { Tables, RoomStatus } from "@/types/database";

export interface RoomWithDetails extends Tables<"rooms"> {
  properties?: { name: string } | null;
  activeRenterName?: string | null;
}

interface RoomListProps {
  rooms: RoomWithDetails[];
  properties: Tables<"properties">[];
  initialPropertyId?: string;
}

export function RoomList({ rooms, properties, initialPropertyId }: RoomListProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialPropertyId || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Tables<"rooms"> | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDeleteRoom, setConfirmDeleteRoom] = useState<{ id: string; roomNumber: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchProperty =
      selectedPropertyId === "all" || r.property_id === selectedPropertyId;
    const matchStatus =
      selectedStatus === "all" || r.status === selectedStatus;
    return matchProperty && matchStatus;
  });

  // Counters
  const countAvailable = rooms.filter((r) => r.status === "available").length;
  const countOccupied = rooms.filter((r) => r.status === "occupied").length;
  const countMaintenance = rooms.filter((r) => r.status === "maintenance").length;

  function handleOpenCreate() {
    setEditingRoom(null);
    setModalOpen(true);
  }

  function handleOpenEdit(room: Tables<"rooms">) {
    setEditingRoom(room);
    setModalOpen(true);
  }

  async function handleQuickStatusChange(id: string, newStatus: RoomStatus) {
    setUpdatingId(id);
    setErrorMessage(null);
    const res = await updateRoomStatus(id, newStatus);
    if (res?.error) {
      setErrorMessage(res.error);
    }
    setUpdatingId(null);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteRoom) return;
    const { id } = confirmDeleteRoom;
    setUpdatingId(id);
    setErrorMessage(null);
    const res = await deleteRoom(id);
    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      setConfirmDeleteRoom(null);
    }
    setUpdatingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Unit Kamar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            List status kamar: Hijau (Tersedia), Merah (Terisi), dan Kuning (Perbaikan).
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            disabled={properties.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Unit Kamar
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {errorMessage}
        </div>
      )}

      {/* Status Summary & Filter Bars */}
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
            Semua ({rooms.length})
          </button>
          <button
            onClick={() => setSelectedStatus("available")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "available"
                ? "bg-emerald-600 text-white"
                : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Tersedia ({countAvailable})
          </button>
          <button
            onClick={() => setSelectedStatus("occupied")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "occupied"
                ? "bg-rose-600 text-white"
                : "text-rose-700 hover:bg-rose-50 bg-rose-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Terisi ({countOccupied})
          </button>
          <button
            onClick={() => setSelectedStatus("maintenance")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "maintenance"
                ? "bg-amber-600 text-white"
                : "text-amber-700 hover:bg-amber-50 bg-amber-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Perbaikan ({countMaintenance})
          </button>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
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
        </div>
      </div>

      {/* Room Grid Display */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Gedung Properti</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Daftarkan gedung kos Anda terlebih dahulu sebelum menambahkan unit kamar.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Ke Halaman Properti
          </Link>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <DoorClosed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Tidak Ada Kamar yang Sesuai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Tidak ditemukan unit kamar untuk filter gedung atau status yang dipilih.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Kamar Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredRooms.map((room) => {
            const isAvailable = room.status === "available";
            const isOccupied = room.status === "occupied";
            const isMaintenance = room.status === "maintenance";

            return (
              <div
                key={room.id}
                className={`relative rounded-xl border p-4 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  isAvailable
                    ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                    : isOccupied
                    ? "bg-rose-50/40 border-rose-200 hover:border-rose-300"
                    : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                }`}
              >
                {/* Header Card */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          {room.room_number}
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isAvailable
                              ? "bg-emerald-500"
                              : isOccupied
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[130px]">
                        {room.properties?.name || "Gedung Kos"}
                      </span>
                    </div>

                    {/* Edit / Delete quick buttons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        title="Edit Kamar"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDeleteRoom({
                            id: room.id,
                            roomNumber: room.room_number,
                          })
                        }
                        disabled={updatingId === room.id}
                        title="Hapus Kamar"
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-white/80 rounded transition disabled:opacity-50"
                      >
                        {updatingId === room.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="mt-2.5">
                    <span className="text-xs font-semibold text-slate-700 bg-white/70 px-2 py-0.5 rounded border border-slate-200/60 inline-block">
                      {room.room_type || "Standard"}
                    </span>
                  </div>

                  {/* Occupant if active */}
                  {isOccupied && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-800 bg-rose-100/60 px-2 py-1 rounded-md">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-semibold">
                        {room.activeRenterName || "Penghuni Aktif"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Price & Status Switcher */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-medium text-slate-500">Sewa/Bulan:</span>
                    <span className="text-xs font-bold text-slate-900">
                      {formatRupiah(Number(room.base_price))}
                    </span>
                  </div>

                  {/* Quick Status Select */}
                  <select
                    value={room.status}
                    disabled={updatingId === room.id}
                    onChange={(e) =>
                      handleQuickStatusChange(room.id, e.target.value as RoomStatus)
                    }
                    className={`w-full text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none transition ${
                      isAvailable
                        ? "bg-emerald-100/70 text-emerald-800 border-emerald-300"
                        : isOccupied
                        ? "bg-rose-100/70 text-rose-800 border-rose-300"
                        : "bg-amber-100/70 text-amber-800 border-amber-300"
                    }`}
                  >
                    <option value="available">🟢 Tersedia</option>
                    <option value="occupied">🔴 Terisi</option>
                    <option value="maintenance">🟡 Perbaikan</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        properties={properties}
        room={editingRoom}
        defaultPropertyId={
          selectedPropertyId !== "all" ? selectedPropertyId : undefined
        }
      />

      {/* Modal Konfirmasi Hapus Kamar */}
      <ConfirmModal
        isOpen={!!confirmDeleteRoom}
        onClose={() => setConfirmDeleteRoom(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Unit Kamar?"
        description={`Apakah Anda yakin ingin menghapus unit kamar "${confirmDeleteRoom?.roomNumber}" secara permanen? Pastikan tidak ada kontrak aktif pada kamar ini.`}
        confirmText="Hapus Kamar"
        cancelText="Batal"
        variant="danger"
        isLoading={updatingId === confirmDeleteRoom?.id}
      />
    </div>
  );
}
