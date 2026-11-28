"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { onboardRenter } from "@/app/(admin)/renters/actions";
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
  Receipt,
  Clock 
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Tables } from "@/types/database";

interface AvailableRoomOption extends Tables<"rooms"> {
  properties?: { name: string } | null;
}

interface OnboardRenterModalProps {
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

export function OnboardRenterModal({
  isOpen,
  onClose,
  availableRooms,
  onSuccess,
}: OnboardRenterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [firstInvoiceDueDate, setFirstInvoiceDueDate] = useState(todayStr);
  const [billingCycle, setBillingCycle] = useState("entry_date");
  const [customDueDay, setCustomDueDay] = useState(1);
  const [generateFirstInvoice, setGenerateFirstInvoice] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    availableRooms[0]?.id || ""
  );
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositDisplay, setDepositDisplay] = useState<string>("");

  function handleDepositChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanDigits = e.target.value.replace(/\D/g, "");
    if (!cleanDigits) {
      setDepositAmount(0);
      setDepositDisplay("");
      return;
    }
    const numericValue = parseInt(cleanDigits, 10);
    setDepositAmount(numericValue);
    setDepositDisplay(new Intl.NumberFormat("id-ID").format(numericValue));
  }

  const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId);
  const selectedRoomPrice = Number(selectedRoom?.base_price) || 0;

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
      setFirstInvoiceDueDate(computedDate.toISOString().split("T")[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await onboardRenter(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
      if (onSuccess && res?.renter) {
        const roomId = formData.get("roomId") as string;
        const selectedRoom = availableRooms.find((r) => r.id === roomId);
        onSuccess({
          id: res.renter.id,
          fullName: res.renter.fullName,
          whatsappNumber: res.renter.whatsappNumber,
          roomNumber: selectedRoom ? selectedRoom.room_number : null,
        });
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboarding Penghuni & Buat Kontrak Baru"
      description="Daftarkan identitas anak kos, hubungkan ke kamar kosong, dan catat uang jaminan."
      maxWidth="xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {availableRooms.length === 0 ? (
        <div className="text-center py-8">
          <DoorClosed className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Tidak Ada Kamar Tersedia</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Seluruh unit kamar saat ini berstatus terisi atau sedang dalam perbaikan. Daftarkan kamar baru terlebih dahulu.
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
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            1. Data Identitas Penghuni
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Contoh: Rian Pratama"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor WhatsApp */}
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
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Nomor NIK KTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor NIK KTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="idCardNumber"
                  placeholder="3201xxxxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Kontak Darurat */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kontak Darurat (Keluarga)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="081987654321 (Ibu Kandung)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Upload Foto KTP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Foto KTP (Tersimpan Privat / PDP Compliant)
            </label>
            <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs text-slate-600 font-medium">
                {fileName || "Klik untuk mengunggah foto KTP (JPG, PNG, WebP)"}
              </span>
              <input
                type="file"
                name="ktpFile"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 pt-2">
            2. Detail Kontrak & Kamar
          </div>

          {/* Unit Kamar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Pilih Kamar Kosong <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DoorClosed className="w-4 h-4" />
              </div>
              <select
                name="roomId"
                required
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Kamar {r.room_number} - {r.properties?.name || "Kos"} ({r.room_type || "Standard"}) - {formatRupiah(Number(r.base_price))}/bln
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Tanggal Mulai */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mulai Sewa <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={startDate}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setStartDate(newStart);
                  if (billingCycle === "entry_date") {
                    setFirstInvoiceDueDate(newStart);
                  }
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Selesai (Opsional)
              </label>
              <input
                type="date"
                name="endDate"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Uang Deposit */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Uang Jaminan / Deposit (Rp)
                </label>
                {depositAmount > 0 && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    Rp {depositDisplay}
                  </span>
                )}
              </div>
              <input type="hidden" name="depositAmount" value={depositAmount} />
              <input
                type="text"
                inputMode="numeric"
                value={depositDisplay}
                onChange={handleDepositChange}
                placeholder="0 (Contoh: 300.000)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Info Pemotongan Tagihan Pertama dengan Deposit / DP */}
          {depositAmount > 0 && (
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2">
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

          {/* Section: Pengaturan Waktu & Jadwal Tagihan */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1.5">
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
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Batas pembayaran sewa pertama untuk anak kos ini.
                  </p>
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
                    <option value="25">Setiap Tanggal 25 Tiap Bulan (Gajian)</option>
                    <option value="custom">Pilih Tanggal Tertentu (1 - 28)...</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Jadwal jatuh tempo rutin pada bulan-bulan berikutnya.
                  </p>
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
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Tagihan langsung aktif di portal anak kos. Begitu anak kos scan QR Code, mereka dapat langsung melihat tagihan & transfer pembayaran.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              Aktifkan Kontrak & Penghuni
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
