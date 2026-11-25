"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Modal } from "@/components/ui/modal";
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Send, 
  ExternalLink, 
  Smartphone, 
  Sparkles,
  ShieldCheck,
  DoorClosed
} from "lucide-react";

export interface RenterAccessData {
  id: string;
  fullName: string;
  whatsappNumber: string;
  roomNumber?: string | null;
  propertyName?: string | null;
}

interface RenterAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  renter: RenterAccessData | null;
  isNewRegistration?: boolean;
}

export function RenterAccessModal({
  isOpen,
  onClose,
  renter,
  isNewRegistration = false,
}: RenterAccessModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const cleanPhone = renter?.whatsappNumber.replace(/[^0-9]/g, "") || "";
  const normalizedWa = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  // Direct login URL with auto-login parameter
  const origin = typeof window !== "undefined" ? window.location.origin : "https://kamarhub.com";
  const loginUrl = renter
    ? `${origin}/portal?phone=${encodeURIComponent(renter.whatsappNumber)}&auto=1`
    : "";

  useEffect(() => {
    if (!loginUrl || !isOpen) return;

    QRCode.toDataURL(loginUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0f172a", // slate-900
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [loginUrl, isOpen]);

  if (!renter) return null;

  function handleCopy() {
    if (!loginUrl) return;
    navigator.clipboard.writeText(loginUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadQr() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    const safeName = renter?.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "penghuni";
    link.href = qrDataUrl;
    link.download = `kamarhub-qr-${safeName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleSendWhatsApp() {
    if (!renter) return;
    const message = encodeURIComponent(
      `Halo Kak ${renter.fullName}! 👋\n\n` +
      `Akun Portal Mandiri Kos Anda di KamarHub telah aktif.\n\n` +
      `👉 *Link Login Langsung (Auto-Login):*\n${loginUrl}\n\n` +
      `📱 *Atau Masuk via Nomor WhatsApp:*\n${renter.whatsappNumber}\n\n` +
      `Melalui portal ini, Anda dapat:\n` +
      `• Melihat tagihan sewa & kuitansi lunas\n` +
      `• Mengunggah bukti transfer pembayaran\n` +
      `• Melaporkan kerusakan fasilitas (AC, air, lampu)\n\n` +
      `Cukup klik link di atas atau scan QR Code yang disediakan pengelola. Tanpa perlu download aplikasi!`
    );

    window.open(`https://wa.me/${normalizedWa}?text=${message}`, "_blank");
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !qrDataUrl || !renter) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code Akses Portal - ${renter.fullName}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
              padding: 40px 20px;
              color: #0f172a;
            }
            .card {
              max-width: 420px;
              margin: 0 auto;
              border: 2px solid #0f172a;
              border-radius: 20px;
              padding: 30px 24px;
            }
            .brand {
              font-size: 22px;
              font-weight: 800;
              color: #2563eb;
              margin-bottom: 4px;
            }
            .sub {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 24px;
            }
            .qr-box {
              background: #ffffff;
              padding: 16px;
              display: inline-block;
              border: 1px solid #cbd5e1;
              border-radius: 16px;
              margin-bottom: 20px;
            }
            .qr-box img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .name {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 4px;
            }
            .room {
              font-size: 14px;
              color: #2563eb;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .phone {
              font-size: 13px;
              color: #475569;
              margin-bottom: 20px;
            }
            .instructions {
              font-size: 12px;
              color: #64748b;
              border-top: 1px dashed #cbd5e1;
              padding-top: 16px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">KamarHub</div>
            <div class="sub">Portal Mandiri Akses Penghuni Kos</div>
            
            <div class="name">${renter.fullName}</div>
            ${renter.roomNumber ? `<div class="room">Kamar ${renter.roomNumber}${renter.propertyName ? ` • ${renter.propertyName}` : ""}</div>` : ""}
            <div class="phone">ID WhatsApp: ${renter.whatsappNumber}</div>

            <div class="qr-box">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>

            <div class="instructions">
              <strong>Cara Masuk:</strong><br/>
              1. Buka kamera HP Anda lalu arahkan ke QR Code di atas.<br/>
              2. Ketuk link yang muncul untuk langsung masuk ke Portal Mandiri Anda.<br/>
              3. Pantau tagihan, unggah bukti bayar, dan lapor kerusakan fasilitas.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNewRegistration ? "Akun Penghuni Berhasil Didaftarkan!" : "QR Code & Link Login Penghuni"}
      description={
        isNewRegistration
          ? "Kirimkan kode QR atau link login berikut kepada anak kos agar langsung dapat mengakses portal."
          : "Gunakan QR code atau tautan langsung untuk memudahkan penghuni masuk ke portal tanpa input manual."
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Success Alert Banner for New Registration */}
        {isNewRegistration && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Akun anak kos aktif! Kunci login otomatis telah siap dibagikan.</span>
          </div>
        )}

        {/* Resident Summary Info */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Nama Anak Kos</div>
            <div className="text-sm font-bold text-slate-900">{renter.fullName}</div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
              <span>{renter.whatsappNumber}</span>
              {renter.roomNumber && (
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                  <DoorClosed className="w-3 h-3" />
                  Kamar {renter.roomNumber}
                </span>
              )}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {renter.fullName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="text-center p-5 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center justify-center gap-1.5">
            <QrCode className="w-4 h-4" />
            QR Code Login Instan
          </div>

          <div className="inline-block p-3.5 bg-white rounded-2xl shadow-xl">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code Akses ${renter.fullName}`}
                className="w-48 h-48 sm:w-52 sm:h-52 mx-auto block rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Menyiapkan QR Code...
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Arahkan kamera HP ke QR Code ini untuk membuka portal dan login secara otomatis tanpa mengetik nomor.
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Unduh Gambar (PNG)
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              Cetak QR
            </button>
          </div>
        </div>

        {/* Short / Direct Link Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Tautan Login Langsung (Short / Direct Link)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={loginUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-mono select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Penghuni cukup membuka link ini lewat browser HP untuk langsung masuk.
          </p>
        </div>

        {/* Primary Actions: Send WhatsApp & Close */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Link via WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  );
}
