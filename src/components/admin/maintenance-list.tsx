"use client";

import { useState } from "react";
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DoorClosed, 
  User, 
  Image as ImageIcon,
  Loader2,
  Trash2,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { 
  updateTicketStatus, 
  createAdminTicket, 
  deleteTicket,
  getMaintenancePhotoSignedUrl 
} from "@/app/(admin)/maintenance/actions";
import { formatDate } from "@/lib/utils";
import { MaintenanceCategory, MaintenanceStatus, Tables } from "@/types/database";

export interface TicketWithDetails extends Tables<"maintenance_tickets"> {
  rooms?: {
    room_number: string;
    properties?: {
      name: string;
    } | null;
  } | null;
  renters?: {
    full_name: string;
    whatsapp_number: string;
  } | null;
}

interface MaintenanceListProps {
  tickets: TicketWithDetails[];
  rooms: Tables<"rooms">[];
}

export function MaintenanceList({ tickets, rooms }: MaintenanceListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewPhotoUrl, setViewPhotoUrl] = useState<{
    path: string;
    ticketDesc: string;
  } | null>(null);

  const [signedPhoto, setSignedPhoto] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const desc = t.description.toLowerCase();
    const renterName = t.renters?.full_name?.toLowerCase() || "";
    const roomNum = t.rooms?.room_number?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();

    const matchesSearch = desc.includes(q) || renterName.includes(q) || roomNum.includes(q);
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || t.issue_category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const countPending = tickets.filter((t) => t.status === "pending").length;
  const countInProgress = tickets.filter((t) => t.status === "in_progress").length;
  const countResolved = tickets.filter((t) => t.status === "resolved").length;

  async function handleStatusChange(ticketId: string, status: MaintenanceStatus) {
    setUpdatingId(ticketId);
    setActionError(null);
    const res = await updateTicketStatus(ticketId, status);
    if (res?.error) {
      setActionError(res.error);
    }
    setUpdatingId(null);
  }

  async function handleDelete(ticketId: string) {
    if (!confirm("Hapus tiket pemeliharaan ini?")) return;
    setUpdatingId(ticketId);
    setActionError(null);
    const res = await deleteTicket(ticketId);
    if (res?.error) {
      setActionError(res.error);
    }
    setUpdatingId(null);
  }

  async function handleOpenPhoto(storagePath: string, desc: string) {
    setViewPhotoUrl({ path: storagePath, ticketDesc: desc });
    setLoadingPhoto(true);
    setSignedPhoto(null);

    const res = await getMaintenancePhotoSignedUrl(storagePath);
    if (res?.signedUrl) {
      setSignedPhoto(res.signedUrl);
    }
    setLoadingPhoto(false);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tiket Keluhan & Pemeliharaan (Maintenance)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pantau laporan fasilitas rusak dari anak kos (AC, Air, Listrik) dan perbarui progres pengerjaan teknisi.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Catat Tiket Perbaikan
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {actionError}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Menunggu Tindakan (Pending)
            </span>
            <div className="text-xl font-black text-rose-600 mt-1">
              {countPending} Tiket
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dalam Pengerjaan (In Progress)
            </span>
            <div className="text-xl font-black text-blue-600 mt-1">
              {countInProgress} Tiket
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selesai Diperbaiki (Resolved)
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {countResolved} Tiket
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "pending"
                ? "bg-rose-600 text-white"
                : "text-rose-700 hover:bg-rose-50 bg-rose-50/50"
            }`}
          >
            Pending ({countPending})
          </button>
          <button
            onClick={() => setSelectedStatus("in_progress")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "in_progress"
                ? "bg-blue-600 text-white"
                : "text-blue-700 hover:bg-blue-50 bg-blue-50/50"
            }`}
          >
            Diproses ({countInProgress})
          </button>
          <button
            onClick={() => setSelectedStatus("resolved")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedStatus === "resolved"
                ? "bg-emerald-600 text-white"
                : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
            }`}
          >
            Selesai ({countResolved})
          </button>
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="AC">AC</option>
            <option value="Air">Air / Pipa</option>
            <option value="Listrik">Listrik</option>
            <option value="Kunci">Kunci / Pintu</option>
            <option value="Bangunan">Bangunan</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari deskripsi / kamar..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tickets Display */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Tidak Ada Tiket Keluhan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Semua fasilitas kamar kos dalam kondisi baik dan tidak ada kendala yang belum tertangani.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => {
            const isPending = ticket.status === "pending";
            const isInProgress = ticket.status === "in_progress";
            const isResolved = ticket.status === "resolved";

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {ticket.issue_category}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        Kamar {ticket.rooms?.room_number || "-"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(ticket.id)}
                      disabled={updatingId === ticket.id}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Hapus Tiket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 font-medium mt-3 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Penghuni: <strong className="text-slate-600">{ticket.renters?.full_name || "Umum"}</strong></span>
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>

                  {ticket.photo_url && (
                    <div className="mt-2.5">
                      <button
                        onClick={() => handleOpenPhoto(ticket.photo_url!, ticket.description)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Lihat Foto Kerusakan
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Status Select */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Status Pengerjaan:
                  </label>
                  <select
                    value={ticket.status}
                    disabled={updatingId === ticket.id}
                    onChange={(e) =>
                      handleStatusChange(ticket.id, e.target.value as MaintenanceStatus)
                    }
                    className={`w-full text-xs font-bold py-1.5 px-3 rounded-lg border focus:outline-none transition ${
                      isPending
                        ? "bg-rose-50 text-rose-800 border-rose-300"
                        : isInProgress
                        ? "bg-blue-50 text-blue-800 border-blue-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    <option value="pending">⏳ Pending (Menunggu Teknisi)</option>
                    <option value="in_progress">🔧 In Progress (Sedang Dikerjakan)</option>
                    <option value="resolved">✅ Resolved (Selesai)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Buat Tiket Manual oleh Admin */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Catat Tiket Perbaikan Baru"
        description="Buat catatan perbaikan fasilitas kamar kos."
        maxWidth="md"
      >
        <form
          action={async (formData) => {
            await createAdminTicket(formData);
            setCreateModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Pilih Unit Kamar <span className="text-red-500">*</span>
            </label>
            <select
              name="roomId"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Kamar {r.room_number} ({r.room_type || "Standard"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Kategori Kerusakan <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="AC">AC / Pendingin</option>
              <option value="Air">Air / Pipa</option>
              <option value="Listrik">Listrik / Lampu</option>
              <option value="Kunci">Kunci / Pintu</option>
              <option value="Bangunan">Bangunan / Tembok</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Deskripsi Masalah <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Jelaskan detail perbaikan yang diperlukan..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition"
            >
              Simpan Tiket
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Foto Kerusakan */}
      {viewPhotoUrl && (
        <Modal
          isOpen={Boolean(viewPhotoUrl)}
          onClose={() => setViewPhotoUrl(null)}
          title="Foto Bukti Kerusakan Fasilitas"
          description={viewPhotoUrl.ticketDesc}
          maxWidth="md"
        >
          <div className="space-y-4">
            {loadingPhoto ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                Mengambil foto kerusakan terenkripsi...
              </div>
            ) : signedPhoto ? (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signedPhoto}
                    alt="Foto Kerusakan"
                    className="max-h-64 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Penyimpanan Aman (Signed URL)
                  </span>
                  <a
                    href={signedPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Buka Ukuran Asli
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                Gagal memuat foto kerusakan.
              </div>
            )}

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewPhotoUrl(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
