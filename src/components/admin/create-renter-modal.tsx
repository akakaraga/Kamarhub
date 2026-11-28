"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { createRenterAccount } from "@/app/(admin)/renters/actions";
import {
  User,
  Phone,
  CreditCard,
  Building2,
  DoorClosed,
  Calendar,
  Banknote,
  UploadCloud,
  Loader2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Receipt,
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
  properties?: { id: string; name: string }[];
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
  properties,
  onSuccess,
}: CreateRenterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [assignRoomNow, setAssignRoomNow] = useState(availableRooms.length > 0);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    availableRooms.length > 0 ? availableRooms[0].id : ""
  );

  // Compute available properties for filtering
  const propertyOptions = properties && properties.length > 0
    ? properties
    : Array.from(
        new Map(
          availableRooms
            .filter((r) => r.property_id && r.properties?.name)
            .map((r) => [r.property_id, { id: r.property_id, name: r.properties!.name }])
        ).values()
      );

  // Filter rooms based on selected property
  const filteredRooms = selectedPropertyId === "all"
    ? availableRooms
    : availableRooms.filter((r) => r.property_id === selectedPropertyId);

  function handlePropertyChange(propId: string) {
    setSelectedPropertyId(propId);
    const roomsInProp = propId === "all"
      ? availableRooms
      : availableRooms.filter((r) => r.property_id === propId);
    if (roomsInProp.length > 0) {
      setSelectedRoomId(roomsInProp[0].id);
    } else {
      setSelectedRoomId("");
    }
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [firstInvoiceDueDate, setFirstInvoiceDueDate] = useState(todayStr);
  const [billingCycle, setBillingCycle] = useState("entry_date");
  const [customDueDay, setCustomDueDay] = useState(1);
  const [generateFirstInvoice, setGenerateFirstInvoice] = useState(true);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId);
  const selectedRoomPrice = Number(selectedRoom?.base_price) || 0;

  // Helper sync when billing cycle changes
  function handleCycleChange(val: string) {
    setBillingCycle(val);
    if (!startDate) return;

    const startObj = new Date(startDate);
    const y = startObj.getFullYear();
    const m = startObj.getMonth();

    if (val === "entry_date") {
      setFirstInvoiceDueDate(startDate);
    } else if (val === "1" || val === "5" || val === "10" || val === "20" || val === "25") {
      const day = parseInt(val, 10);
      const computedDate = new Date(y, m, day);
      // Format YYYY-MM-DD
      const dateStr = computedDate.toISOString().split("T")[0];
      setFirstInvoiceDueDate(dateStr);
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
      formData.delete("billingCycle");
      formData.delete("generateFirstInvoice");
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
                  placeholder="Dimas Aditya"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor WhatsApp (Kunci Login Portal) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  required
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* NIK / No. KTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                NIK KTP
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
                Kontak Darurat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Upload Foto KTP */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Foto Dokumen KTP
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
                {/* 1. Pilih Gedung / Cabang Kos */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Gedung Kos <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                    >
                      <option value="all">Semua Gedung Kos</option>
                      {propertyOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Pilih Unit Kamar Kosong (berdasarkan gedung yang dipilih) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Pilih Unit Kamar Kosong <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {filteredRooms.length} kamar kosong
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DoorClosed className="w-4 h-4" />
                    </div>
                    <select
                      name="roomId"
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      required={assignRoomNow && filteredRooms.length > 0}
                      disabled={filteredRooms.length === 0}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {filteredRooms.length === 0 ? (
                        <option value="" disabled>
                          Tidak ada kamar kosong di kos ini
                        </option>
                      ) : (
                        filteredRooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            Kamar {r.room_number} ({r.properties?.name || "Kos"}) — {r.room_type} — {formatRupiah(Number(r.base_price))}/bln
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Info jika tidak ada kamar kosong di gedung yang dipilih */}
                {filteredRooms.length === 0 && (
                  <div className="sm:col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Gedung kos ini saat ini tidak memiliki unit kamar berstatus Tersedia. Silakan pilih gedung kos lain atau pilih <strong>Semua Gedung Kos</strong>.</span>
                  </div>
                )}

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
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartDate(newStart);
                        if (billingCycle === "entry_date") {
                          setFirstInvoiceDueDate(newStart);
                        }
                      }}
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
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>

                  {/* Info Pemotongan Tagihan Pertama dengan Deposit / DP */}
                  {depositAmount > 0 && (
                    <div className="mt-2.5 p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2">
                      <div className="text-xs font-bold text-blue-950 flex items-center justify-between">
                        <span>Penyesuaian Tagihan Pertama:</span>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                          Dipotong Deposit/DP
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Harga Sewa Kamar:</span>
                          <span className="font-semibold text-slate-900">{formatRupiah(selectedRoomPrice)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Dipotong Deposit / DP di Awal:</span>
                          <span>- {formatRupiah(depositAmount)}</span>
                        </div>
                        <div className="pt-1.5 border-t border-blue-200 flex justify-between font-bold text-xs">
                          <span className="text-slate-800">Total Tagihan Pertama:</span>
                          <span className="text-blue-700 font-extrabold text-sm">
                            {formatRupiah(Math.max(0, selectedRoomPrice - depositAmount))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section: Pengaturan Waktu & Jadwal Tagihan */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Pengaturan Waktu & Jadwal Tagihan
                    </span>
                  </div>

                  <div className="space-y-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Tanggal Jatuh Tempo Tagihan Pertama */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Jatuh Tempo Tagihan Pertama <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <input
                            type="date"
                            name="firstInvoiceDueDate"
                            value={firstInvoiceDueDate}
                            onChange={(e) => setFirstInvoiceDueDate(e.target.value)}
                            required={assignRoomNow}
                            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Siklus Tagihan Bulanan */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Siklus Jatuh Tempo Bulanan
                        </label>
                        <select
                          name="billingCycle"
                          value={billingCycle}
                          onChange={(e) => handleCycleChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="entry_date">
                            Sesuai Tanggal Masuk (Tiap tgl {new Date(startDate || Date.now()).getDate() || "masuk"})
                          </option>
                          <option value="1">Setiap Tanggal 1 Tiap Bulan</option>
                          <option value="5">Setiap Tanggal 5 Tiap Bulan</option>
                          <option value="10">Setiap Tanggal 10 Tiap Bulan</option>
                          <option value="20">Setiap Tanggal 20 Tiap Bulan</option>
                          <option value="25">Setiap Tanggal 25 Tiap Bulan</option>
                          <option value="custom">Pilih Tanggal Tertentu (1 - 28)</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom Due Day Input */}
                    {billingCycle === "custom" && (
                      <div className="pt-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Pilih Tanggal Jatuh Tempo Setiap Bulan (Tanggal 1 - 28)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            name="customDueDay"
                            min={1}
                            max={28}
                            value={customDueDay}
                            onChange={(e) => {
                              const d = Math.max(1, Math.min(28, Number(e.target.value) || 1));
                              setCustomDueDay(d);
                              const startObj = new Date(startDate);
                              const computed = new Date(startObj.getFullYear(), startObj.getMonth(), d);
                              setFirstInvoiceDueDate(computed.toISOString().split("T")[0]);
                            }}
                            className="w-32 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <span className="text-xs text-slate-600">tiap bulan</span>
                        </div>
                      </div>
                    )}

                    {/* Toggle: Terbitkan Tagihan Pertama Sekarang */}
                    <div className="pt-2 border-t border-blue-200/60">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="generateFirstInvoice"
                          checked={generateFirstInvoice}
                          onChange={(e) => setGenerateFirstInvoice(e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            Terbitkan Tagihan Sewa Bulan Pertama Sekarang
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
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
