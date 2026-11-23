/**
 * WhatsApp Notification Service (Fonnte / Watzap Integration)
 * Untuk pengiriman notifikasi tagihan otomatis (H-3, Hari H, H+1) dan tiket perbaikan
 */

interface SendWAMessageParams {
  to: string; // Nomor WhatsApp (e.g. "081234567890" or "6281234567890")
  message: string;
}

export async function sendWhatsAppMessage({ to, message }: SendWAMessageParams): Promise<{
  success: boolean;
  message?: string;
  response?: any;
}> {
  // Format nomor HP ke 62
  const formattedNumber = to.replace(/^0/, "62").replace(/[^0-9]/g, "");

  const fonnteToken = process.env.FONNTE_API_TOKEN;
  const watzapKey = process.env.WATZAP_API_KEY;

  // 1. Integrasi Fonnte (API WhatsApp Lokal Populer di Indonesia)
  if (fonnteToken) {
    try {
      const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: fonnteToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formattedNumber,
          message: message,
          countryCode: "62",
        }),
      });

      const data = await res.json();
      return { success: data.status === true, response: data };
    } catch (err: any) {
      console.error("Fonnte WhatsApp Error:", err.message);
      return { success: false, message: err.message };
    }
  }

  // 2. Integrasi Watzap (Alternatif API Lokal)
  if (watzapKey) {
    try {
      const res = await fetch("https://api.watzap.id/v1/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: watzapKey,
          number_key: process.env.WATZAP_NUMBER_KEY,
          phone_no: formattedNumber,
          message: message,
        }),
      });

      const data = await res.json();
      return { success: data.status === "200", response: data };
    } catch (err: any) {
      console.error("Watzap WhatsApp Error:", err.message);
      return { success: false, message: err.message };
    }
  }

  // Fallback Dev Mode (Simulasi / Log Console saat API Token belum diisi di .env.local)
  console.log(`[WhatsApp DEV Simulator] To: ${formattedNumber}`);
  console.log(`[WhatsApp DEV Simulator] Content:\n${message}\n`);

  return {
    success: true,
    message: "Simulasi berhasil (Token WhatsApp belum dikonfigurasi di .env)",
  };
}

/**
 * Template Pesan WhatsApp Penagihan & Notifikasi
 */
export const WhatsAppTemplates = {
  // H-3 Pengingat Jatuh Tempo
  dueReminderH3: (params: {
    renterName: string;
    roomNumber: string;
    propertyName: string;
    amount: string;
    dueDate: string;
    portalUrl: string;
  }) => `Halo Kak *${params.renterName}*! 👋

Ini adalah pengingat ramah dari manajemen *${params.propertyName}*.
Tagihan sewa untuk *Kamar ${params.roomNumber}* akan jatuh tempo dalam *3 hari* lagi.

📋 *Rincian Tagihan:*
• Unit: Kamar ${params.roomNumber}
• Jatuh Tempo: ${params.dueDate}
• Total Tagihan: *${params.amount}*

Silakan unggah bukti transfer melalui Portal Anak Kos:
🔗 ${params.portalUrl}

Terima kasih atas kerja samanya! 🙏`,

  // Hari H Jatuh Tempo
  dueToday: (params: {
    renterName: string;
    roomNumber: string;
    propertyName: string;
    amount: string;
    portalUrl: string;
  }) => `Halo Kak *${params.renterName}*! 📢

Hari ini adalah *tanggal jatuh tempo pembayaran sewa* untuk *Kamar ${params.roomNumber} (${params.propertyName})*.

💵 *Total Pembayaran:* *${params.amount}*

Mohon segera melakukan transfer dan konfirmasi bukti bayar melalui link portal mandiri berikut:
🔗 ${params.portalUrl}

Abaikan pesan ini jika Kakak sudah melakukan pembayaran. Terima kasih! 🙏`,

  // H+1 Keterlambatan Pembayaran
  overdueH1: (params: {
    renterName: string;
    roomNumber: string;
    propertyName: string;
    amount: string;
    penalty: string;
    portalUrl: string;
  }) => `Pemberitahuan Keterlambatan Sewa ⚠️

Yth. Kak *${params.renterName}* (*Kamar ${params.roomNumber} - ${params.propertyName}*),
Tagihan sewa Kakak telah melewati tanggal jatuh tempo kemarin.

⚠️ *Status Tagihan: Terlambat / Overdue*
• Tagihan Pokok: ${params.amount}
${params.penalty ? `• Denda Keterlambatan: ${params.penalty}\n` : ""}
Mohon segera melunasi tagihan untuk menghindari penambahan denda harian.
Unggah bukti transfer di portal berikut:
🔗 ${params.portalUrl}

Jika ada kendala pembayaran, silakan hubungi pengelola kos. Terima kasih.`,

  // Update Status Tiket Maintenance
  maintenanceUpdated: (params: {
    renterName: string;
    roomNumber: string;
    category: string;
    status: string;
  }) => `Update Perbaikan Fasilitas 🛠️

Halo Kak *${params.renterName}*, laporan keluhan Kakak untuk *Kamar ${params.roomNumber}* (*${params.category}*) saat ini berstatus:
📌 *${params.status.toUpperCase()}*

Tim teknisi kami sedang/telah menangani permasalahan tersebut. Terima kasih atas laporannya! 🙏`,
};
