"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Apakah penghuni harus mengunduh aplikasi?",
    answer:
      "Tidak. Penghuni cukup membuka tautan lewat browser HP, lalu login dengan nomor WhatsApp untuk melihat tagihan, mengunggah bukti bayar, atau melapor kerusakan.",
  },
  {
    question: "Saya gaptek. Apakah sulit dipakai?",
    answer:
      "Tampilan KamarHub sederhana dan berbahasa Indonesia. Cukup 3 langkah: daftarkan kamar, masukkan nomor penghuni, lalu sistem berjalan. Tim kami juga siap membantu jika Anda butuh bantuan.",
  },
  {
    question: "Seaman apa foto KTP dan data keuangan saya?",
    answer:
      "Data dilindungi dengan PostgreSQL Row Level Security. Foto KTP disimpan di brankas privat dan hanya bisa dibuka lewat tautan rahasia yang kedaluwarsa dalam 60 detik. Hanya Anda yang punya akses.",
  },
  {
    question: "Kapan pengingat WhatsApp dikirim?",
    answer:
      "Ada tiga waktu: H-3 sebelum jatuh tempo, tepat di Hari-H, dan H+1 jika pembayaran belum diterima.",
  },
  {
    question: "Apakah paket Starter benar-benar gratis?",
    answer:
      "Ya. Starter gratis selamanya untuk hingga 10 kamar, tanpa kartu kredit dan tanpa masa percobaan.",
  },
  {
    question: "Bisakah dipakai untuk kontrakan atau paviliun?",
    answer:
      "Bisa. KamarHub cocok untuk kos, rumah kontrakan, paviliun, guesthouse, hingga ruko sewa.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden divide-y divide-slate-800 shadow-sm">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div key={idx} className="transition-colors">
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:bg-slate-800/60"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-medium text-slate-200 hover:text-white transition-colors">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 bg-slate-900/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
