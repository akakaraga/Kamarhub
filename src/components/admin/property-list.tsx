"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Plus, MapPin, DoorClosed, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { PropertyModal } from "./property-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteProperty } from "@/app/(admin)/properties/actions";
import { Tables } from "@/types/database";

interface PropertyListProps {
  properties: Tables<"properties">[];
}

export function PropertyList({ properties }: PropertyListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Tables<"properties"> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteProperty, setConfirmDeleteProperty] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleOpenCreate() {
    setEditingProperty(null);
    setModalOpen(true);
  }

  function handleOpenEdit(property: Tables<"properties">) {
    setEditingProperty(property);
    setModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteProperty) return;
    const { id } = confirmDeleteProperty;

    setDeletingId(id);
    setDeleteError(null);

    const res = await deleteProperty(id);
    if (res?.error) {
      setDeleteError(res.error);
    } else {
      setConfirmDeleteProperty(null);
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Properti (Gedung Kos)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola cabang dan bangunan kos Anda. Satu akun pemilik dapat mengelola multi-gedung.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Gedung Baru
        </button>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {deleteError}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Belum Ada Properti Kos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Daftarkan gedung kos pertama Anda untuk mulai mengatur kamar dan harga sewa dasar.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Gedung Properti
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{prop.name}</h3>
                      <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md">
                        {prop.total_rooms} Kamar Terdaftar
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(prop)}
                      title="Edit Gedung"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDeleteProperty({
                          id: prop.id,
                          name: prop.name,
                        })
                      }
                      disabled={deletingId === prop.id}
                      title="Hapus Gedung"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === prop.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{prop.address || "Belum ada alamat rinci"}</span>
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/rooms?property=${prop.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
                >
                  <DoorClosed className="w-3.5 h-3.5" />
                  Lihat Unit Kamar ({prop.total_rooms})
                </Link>
                <button
                  onClick={() => handleOpenEdit(prop)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Pengaturan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PropertyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        property={editingProperty}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteProperty}
        onClose={() => setConfirmDeleteProperty(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Gedung Properti?"
        description={`Apakah Anda yakin ingin menghapus gedung "${confirmDeleteProperty?.name}"? Pastikan tidak ada kamar yang masih terdaftar di gedung ini.`}
        confirmText="Hapus Gedung"
        cancelText="Batal"
        variant="danger"
        isLoading={deletingId === confirmDeleteProperty?.id}
      />
    </div>
  );
}
