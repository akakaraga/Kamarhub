"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createRenterAccount } from "@/app/(admin)/renters/actions";
import { 
  User, 
  Phone, 
  CreditCard, 
  DoorClosed, 
  Calendar, 
  Banknote, 
  UploadCloud, 
  Loader2, 
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Tables } from "@/types/database";

interface AvailableRoomOption extends Tables<"rooms"> {
  properties?: { name: string } | null;
}

interface CreateRenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: AvailableRoomOption[];
  onSuccess?: (renter: {
    id: string;
    fullName: string;
    whatsappNumber: string;
    roomNumber?: string | null;
  }) => void;
}

export function CreateRenterModal({
  isOpen,
  onClose,
  availableRooms,
  onSuccess,
}: CreateRenterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [assignRoomNow, setAssignRoomNow] = useState(availableRooms.length > 0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    availableRooms.length > 0 ? availableRooms[0].id : ""
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [firstDueDate, setFirstDueDate] = useState(todayStr);
  const [generateInvoice, setGenerateInvoice] = useState(true);

  function handleStartDateChange(newDate: string) {
    setStartDate(newDate);
    // If firstDueDate was same as previous startDate, sync it
    if (firstDueDate === startDate) {
      setFirstDueDate(newDate);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (!assignRoomNow) {
      formData.delete("roomId");
      formData.delete("startDate");
      formData.delete("endDate");
      formData.delete("depositAmount");
      formData.delete("firstInvoiceDueDate");
      formData.delete("generateFirstInvoice");
      formData.delete("initialAdditionalFee");
    }

    const res = await createRenterAccount(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
      if (onSuccess && res?.renter) {
        const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId);
        onSuccess({
          id: res.renter.id,
          fullName: res.renter.fullName,
          whatsappNumber: res.renter.whatsappNumber,
          roomNumber: assignRoomNow && selectedRoom ? selectedRoom.room_number : null,
        });
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Akun Anak Kos"
      description="Daftarkan akun anak kos untuk mengaktifkan akses masuk ke Portal Mandiri Anak Kos secara otomatis."
      maxWidth="xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Box: Kredensial Portal */}
      <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Akses Otomatis ke Portal Anak Kos:</span> Nomor WhatsApp yang Anda daftarkan di bawah ini akan menjadi kunci masuk bagi penghuni untuk mengakses tagihan dan lapor komplain di <strong>/portal</strong> tanpa perlu password.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Profil Penghuni */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
            Data Identitas & Akun Penghuni
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap Anak Kos <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Contoh: Dimas Aditya"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor WhatsApp (Kunci Login Portal) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor WhatsApp (Login Portal) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Digunakan anak kos untuk masuk ke Portal Mandiri.</p>
            </div>

            {/* NIK / No. KTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor Induk Kependudukan (NIK/KTP)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="idCardNumber"
                  maxLength={16}
                  placeholder="16 Digit NIK KTP (Opsional)"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Kontak Darurat */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kontak Darurat (Ortu/Wali)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="081987654321 (Ibu/Ayah)"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Upload Foto KTP */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Foto Dokumen KTP (Disimpan di Brankas Privat Aman)
              </label>
              <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileName ? fileName : "Klik untuk upload foto KTP"}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Format JPG, PNG, atau WebP (Maks 5MB)
                </span>
                <input
                  type="file"
                  name="ktpFile"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Penetapan Kamar & Kontrak Sewa (Fleksibel) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
              Penetapan Kamar & Kontrak Sewa
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={assignRoomNow}
                onChange={(e) => setAssignRoomNow(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700">Hubungkan ke Kamar Sekarang</span>
            </label>
          </div>

          {assignRoomNow ? (
            availableRooms.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2.5">
                <DoorClosed className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">Tidak ada unit kamar kosong saat ini.</div>
                  <div className="text-[11px] mt-0.5">Anda tetap bisa membuat akun anak kos ini terlebih dahulu dan menghubungkan kamar nanti.</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Pilih Kamar */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pilih Unit Kamar Kosong <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roomId"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    required={assignRoomNow}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Kamar {r.room_number} ({r.properties?.name || "Kos"}) — {r.room_type} — {formatRupiah(Number(r.base_price))}/bln
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal Mulai Sewa */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tanggal Masuk (Mulai Sewa) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      required={assignRoomNow}
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Tanggal Selesai (Opsional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tanggal Selesai (Opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Deposit Jaminan */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Uang Deposit Jaminan (Rp)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      name="depositAmount"
                      min={0}
                      defaultValue={0}
                      placeholder="0"
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Pengaturan Waktu & Jadwal Tagihan Sewa */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Waktu & Jadwal Tagihan Sewa
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-blue-600 select-none">
                      <input
                        type="checkbox"
                        name="generateFirstInvoice"
                        checked={generateInvoice}
                        onChange={(e) => setGenerateInvoice(e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      Terbitkan Tagihan Pertama Langsung
                    </label>
                  </div>

                  {generateInvoice && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Batas Waktu Pembayaran Tagihan Pertama (Jatuh Tempo) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <input
                            type="date"
                            name="firstInvoiceDueDate"
                            required={generateInvoice}
                            value={firstDueDate}
                            onChange={(e) => setFirstDueDate(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Menentukan tanggal jatuh tempo tagihan sewa perdana dan siklus pengingat WhatsApp bulanan.
                        </p>
                      </div>

                      {/* Preset Cepat Siklus Tanggal */}
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Pilihan Cepat Waktu Jatuh Tempo:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setFirstDueDate(startDate)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition ${
                              firstDueDate === startDate
                                ? "bg-blue-600 text-white border-blue-600 font-bold"
                                : "bg-white hover:bg-blue-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            Sama dg Tgl Masuk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(startDate);
                              d.setDate(d.getDate() + 3);
                              setFirstDueDate(d.toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
                          >
                            +3 Hari Masuk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(startDate);
                              d.setDate(1);
                              if (new Date(startDate).getDate() > 1) {
                                d.setMonth(d.getMonth() + 1);
                              }
                              setFirstDueDate(d.toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
                          >
                            Tgl 1 (Awal Bln)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(startDate);
                              d.setDate(5);
                              if (new Date(startDate).getDate() > 5) {
                                d.setMonth(d.getMonth() + 1);
                              }
                              setFirstDueDate(d.toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
                          >
                            Tgl 5
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(startDate);
                              d.setDate(10);
                              if (new Date(startDate).getDate() > 10) {
                                d.setMonth(d.getMonth() + 1);
                              }
                              setFirstDueDate(d.toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
                          >
                            Tgl 10
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(startDate);
                              d.setDate(25);
                              if (new Date(startDate).getDate() > 25) {
                                d.setMonth(d.getMonth() + 1);
                              }
                              setFirstDueDate(d.toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
                          >
                            Tgl 25 (Gajian)
                          </button>
                        </div>
                      </div>

                      {/* Biaya Tambahan Awal */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Biaya Tambahan Tagihan Pertama (Opsional, Rp)
                        </label>
                        <input
                          type="number"
                          name="initialAdditionalFee"
                          min={0}
                          defaultValue={0}
                          placeholder="0 (misal: listrik, parkir, admin)"
                          className="w-full px-3 py-1.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Akun anak kos akan dibuat tanpa kontrak kamar. Anda dapat menetapkan kamar sewaktu-waktu nanti.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? "Menyimpan Akun..." : "Simpan & Buat Akun Anak Kos"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
