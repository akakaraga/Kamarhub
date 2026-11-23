import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Phone, 
  Receipt, 
  Users, 
  Smartphone,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  BarChart3,
  Wrench,
  Lock,
  ChevronDown,
  CalendarCheck,
  FileText,
  HeartHandshake,
  BadgeCheck
} from "lucide-react";

export default function Home() {
  // Schema.org Structured Data for SEO Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "KamarHub",
        "operatingSystem": "Web Browser, Android, iOS",
        "applicationCategory": "BusinessApplication",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "128"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "description": "Paket Starter Gratis Selamanya untuk hingga 10 kamar kos"
        },
        "description": "Aplikasi manajemen kos-kosan dan kontrakan online terbaik di Indonesia dengan fitur penagihan otomatis via WhatsApp, portal anak kos tanpa unduh aplikasi, dan kuitansi digital."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apakah anak kos wajib mengunduh aplikasi di Play Store atau App Store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tidak perlu sama sekali. KamarHub menggunakan teknologi web mobile-first yang ringan. Anak kos cukup membuka tautan dari browser smartphone mereka dan login menggunakan nomor WhatsApp aktif tanpa perlu install aplikasi."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara kerja pengingat tagihan sewa otomatis lewat WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sistem KamarHub secara otomatis mengirimkan pesan pengingat tagihan dengan bahasa yang sopan dan santun pada H-3 sebelum tanggal jatuh tempo, tepat pada Hari H, serta pemberitahuan jika pembayaran terlambat."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah data KTP anak kos dan catatan keuangan saya aman?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sangat aman. Setiap akun pemilik kos memiliki sistem isolasi data terenkripsi (PostgreSQL Row Level Security). Foto KTP anak kos disimpan dalam brankas privat yang hanya dapat diakses oleh pemilik kos berwenang melalui link rahasia berwaktu singkat."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah paket Starter benar-benar gratis digunakan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, paket Starter 100% gratis selamanya untuk pemilik kos dengan kapasitas hingga 10 kamar tanpa syarat kartu kredit."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Structured Data Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Friendly Announcement Bar */}
      <div className="bg-blue-600 text-white text-xs font-medium py-2.5 px-4 text-center tracking-wide">
        🎉 <strong>Kabar Baik untuk Juragan Kos:</strong> Kini penagihan sewa bulanan bisa jalan otomatis via WhatsApp tanpa bikin canggung!
      </div>

      {/* Navbar Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5" title="KamarHub Beranda">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-500">
                KamarHub
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#fitur" className="hover:text-white transition">Fitur Utama</a>
              <a href="#cara-kerja" className="hover:text-white transition">Cara Kerja</a>
              <a href="#harga" className="hover:text-white transition">Paket Harga</a>
              <a href="#faq" className="hover:text-white transition">Tanya Jawab (FAQ)</a>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/portal"
              className="text-xs sm:text-sm font-semibold text-sky-300 hover:text-sky-200 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 shadow-sm"
              title="Akses Portal Mandiri Anak Kos"
            >
              <Smartphone className="w-4 h-4 text-sky-400" />
              Portal Anak Kos
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition hidden sm:inline"
            >
              Masuk Pengelola
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              Daftar Kos Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-16 pb-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Aplikasi Manajemen Kos & Kontrakan No. 1 di Indonesia
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2]">
          Kelola Bisnis Kos Jadi Tenang, <br />
          <span className="text-blue-500">
            Tagihan Sewa Masuk Tepat Waktu.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Tinggalkan cara lama mencatat di buku kertas dan rasa tidak enak hati saat menagih sewa. KamarHub membantu Anda memantau kamar kosong secara visual, mengirimkan pengingat WhatsApp otomatis yang santun, dan menerbitkan kuitansi digital instan.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Mulai Coba Gratis Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5 text-blue-400" />
            Lihat Demo Portal Anak Kos
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            100% Gratis untuk Kos Pemula
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" />
            Anak Kos Tanpa Unduh Aplikasi
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Data KTP & Keuangan Terenkripsi
          </div>
        </div>
      </section>

      {/* Masalah vs Solusi Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">KENAPA BUTUH KAMARHUB?</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Hentikan Masalah Rutin Mengelola Kos</h3>
            <p className="text-slate-400 text-sm mt-3">Mengelola banyak pintu kos sendirian seringkali menguras tenaga dan waktu jika masih manual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cara Lama */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-red-900/30 space-y-4">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-7 h-7 rounded-full bg-rose-950 flex items-center justify-center text-rose-400">✕</span>
                Cara Lama yang Bikin Pusing
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Sering lupa jatuh tempo:</strong> Anak kos telat bayar karena Anda lupa mengingatkan tepat waktu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Canggung saat menagih:</strong> Merasa tidak enak hati atau sungkan saat harus chat anak kos secara personal.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Kuitansi kertas tercecer:</strong> Riwayat pembayaran sering hilang, robek, atau disengketakan jumlahnya.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Laporan komplain berantakan:</strong> Laporan kran bocor atau AC mati tenggelam di antara ribuan chat WhatsApp pribadi.</span>
                </li>
              </ul>
            </div>

            {/* Cara KamarHub */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-blue-600/40 space-y-4">
              <div className="flex items-center gap-3 text-blue-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center text-blue-400">✓</span>
                Solusi Praktis dengan KamarHub
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tagihan Otomatis H-7:</strong> Tagihan sewa bulanan dibuat otomatis tanpa perlu dihitung ulang satu per satu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>WhatsApp Bot Ramah & Santun:</strong> Pesan pengingat dikirimkan otomatis oleh sistem, tidak perlu lagi rasa canggung menagih.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Kuitansi Digital Siap Cetak:</strong> Begitu pembayaran diverifikasi, kuitansi resmi langsung terbit dan tersimpan rapi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Pusat Komplain Mandiri:</strong> Anak kos lapor kerusakan via smartphone lengkap dengan foto, Anda tinggal menugaskan tukang.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja 3 Langkah Mudah */}
      <section id="cara-kerja" className="py-20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">SANGAT MUDAH DIGUNAKAN</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3 Langkah Praktis Mengelola Kos</h3>
            <p className="text-slate-400 text-sm mt-3">Tidak perlu paham teknis rumit. Siapapun bisa mulai mengoperasikan dalam waktu kurang dari 5 menit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-5">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-2">Daftarkan Kamar Kos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Masukkan nama gedung kos Anda, nomor unit kamar, tarif sewa bulanan, dan fasilitas yang tersedia.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400">
                ⏱ Butuh waktu 2 menit
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-5">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-2">Masukkan Data Penghuni</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tentukan kamar yang ditempati anak kos, masukkan nomor WhatsApp, dan tentukan tanggal siklus jatuh tempo sewa.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400">
                🔒 Data KTP tersimpan aman
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-5">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-2">Sistem Bekerja Otomatis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Duduk tenang! Sistem yang akan menerbitkan invoice, mengirimkan pengingat WhatsApp, dan mencatat arus kas masuk Anda.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400">
                💰 Arus kas tercatat rapi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-20 border-t border-slate-800/60 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">FITUR LENGKAP</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dirancang Khusus untuk Kenyamanan Pemilik & Penghuni</h3>
            <p className="text-slate-400 text-sm mt-3">Solusi menyeluruh dari awal onboarding anak kos, pembayaran sewa bulanan, hingga penanganan komplain kamar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Visual Grid Status Kamar</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pantau kondisi kamar dalam sekejap mata dengan kode warna: <strong>Hijau</strong> untuk kamar kosong siap huni, <strong>Merah</strong> untuk kamar terisi, dan <strong>Kuning</strong> untuk kamar renovasi.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Tagihan Otomatis & Kuitansi PDF</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tagihan sewa bulanan terbit otomatis 7 hari sebelum jatuh tempo. Lengkap dengan opsi tambah denda atau biaya listrik, serta kuitansi resmi siap cetak.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center font-bold text-xl">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Pengingat WhatsApp Santun</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pengingat otomatis dikirimkan ke nomor WhatsApp anak kos pada H-3, Hari-H jatuh tempo, dan peringatan ramah saat terlambat bayar. Hubungan tetap harmonis tanpa canggung.
              </p>
            </div>

            {/* Fitur 4 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600/10 text-sky-400 flex items-center justify-center font-bold text-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Portal Mandiri Anak Kos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anak kos tidak perlu download aplikasi berat di HP. Cukup buka tautan web di browser smartphone untuk melihat rincian tagihan, upload bukti transfer, dan cek kuitansi.
              </p>
            </div>

            {/* Fitur 5 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center font-bold text-xl">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Lapor Fasilitas Kamar Rusak</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kran air bocor atau AC mati? Anak kos dapat melaporkan komplain lengkap dengan foto dan tingkat urgensi langsung dari portal. Pengelola kos dapat memantau status pengerjaan teknisi.
              </p>
            </div>

            {/* Fitur 6 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center font-bold text-xl">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Brankas KTP Aman & Terenkripsi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foto identitas dan KTP anak kos disimpan dalam penyimpanan privat ber-enkripsi tinggi. Tautan akses dibuat rahasia dan kedaluwarsa otomatis dalam 60 detik demi menjaga privasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">PAKET HARGA</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Investasi Terjangkau, Manfaat Berkali Lipat</h3>
            <p className="text-slate-400 text-sm mt-3">Mulai secara gratis sekarang. Tingkatkan paket kapan saja saat kapasitas kamar kos Anda bertambah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan: Starter */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-xs text-slate-400 mt-1">Sangat cocok untuk kos pemula dengan 1 gedung.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 0</span>
                  <span className="text-xs text-slate-400"> / gratis selamanya</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hingga <strong>10 Kamar</strong> Kos</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Maksimal 1 Gedung Properti</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visual Grid Ketersediaan Kamar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pencatatan Tagihan & Kuitansi Digital</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <span className="w-4 h-4 text-center shrink-0">-</span>
                    <span>Pengingat WhatsApp Otomatis</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center block"
                >
                  Daftar Paket Starter
                </Link>
              </div>
            </div>

            {/* Plan: Pro (Most Popular) */}
            <div className="p-8 rounded-2xl bg-slate-900 border-2 border-blue-500 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Paling Diminati Juragan
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Juragan Pro</h4>
                <p className="text-xs text-blue-300 mt-1">Pilihan favorit juragan yang ingin operasional serba otomatis.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 99.000</span>
                  <span className="text-xs text-slate-400"> / bulan</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hingga <strong>50 Kamar</strong> Kos Aktif</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hingga 5 Gedung Cabang Properti</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tagihan Terbit Otomatis H-7</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pengingat WhatsApp Otomatis (H-3, Hari-H, H+1)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Portal Mandiri Anak Kos + Upload Bukti Bayar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pelaporan Kerusakan Fasilitas Kamar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Brankas Dokumen KTP Privat Terenkripsi</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition text-center block"
                >
                  Coba Gratis 14 Hari
                </Link>
              </div>
            </div>

            {/* Plan: Enterprise */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Enterprise</h4>
                <p className="text-xs text-slate-400 mt-1">Untuk operator kos skala besar, apartemen, & guesthouse.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 299.000</span>
                  <span className="text-xs text-slate-400"> / bulan</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Kamar & Gedung Tanpa Batas</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-Akun Pengelola & Staf Admin</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Jalur Pengiriman WhatsApp Prioritas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ekspor Laporan Keuangan Pajak & Excel</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Bantuan Pindahan Data dari Excel Gratis</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Layanan Bantuan 24/7 Prioritas</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center block"
                >
                  Hubungi Tim KamarHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">TANYA JAWAB (FAQ)</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Kerap Ditanyakan Pemilik Kos</h3>
            <p className="text-slate-400 text-sm mt-3">Jawaban atas pertanyaan umum seputar keamanan, kemudahan, dan fitur aplikasi KamarHub.</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Apakah anak kos harus mengunduh aplikasi dari Google Play Store atau App Store?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Tidak perlu sama sekali! KamarHub berbasis Web Mobile-First. Anak kos cukup membuka link melalui browser di smartphone mereka (Chrome, Safari, dll.) dan memasukkan nomor WhatsApp terdaftar untuk melihat tagihan sewa atau lapor kerusakan fasilitas. Sangat praktis tanpa membebani memori HP.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Bagaimana tingkat keamanan foto KTP dan catatan keuangan kos saya?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                KamarHub menerapkan perlindungan data ketat dengan enkripsi PostgreSQL Row Level Security (RLS). Foto KTP penghuni disimpan di brankas privat Supabase dan hanya dapat dilihat oleh pemilik kos sah melalui link rahasia berbatas waktu 60 detik. Pemilik kos lain tidak dapat mengakses data Anda.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Kapan pengingat tagihan WhatsApp otomatis dikirimkan ke anak kos?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Sistem KamarHub mengirimkan pesan sopan secara otomatis pada 3 momen penting: <strong>H-3</strong> sebelum tanggal jatuh tempo, tepat pada <strong>Hari-H</strong> jatuh tempo, dan peringatan ramah pada <strong>H+1</strong> jika pembayaran belum diverifikasi.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Apakah paket Starter benar-benar gratis tanpa dipungut biaya?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Ya, paket Starter 100% gratis selamanya untuk kapasitas hingga 10 kamar kos. Anda tidak diminta kartu kredit apapun saat mendaftar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Siap Membuat Pengelolaan Kos Anda Jadi Lebih Mudah?
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Daftarkan kos Anda hari ini, hentikan keterlambatan pembayaran sewa, dan berikan kemudahan terbaik untuk penghuni kos Anda.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              Mulai Daftar Kos Sekarang (Gratis)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
            >
              Masuk ke Dasbor Pengelola
            </Link>
          </div>
        </div>
      </section>

      {/* Footer SEO */}
      <footer className="border-t border-slate-800/80 py-10 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-blue-500">KamarHub</span> — Aplikasi Manajemen Kos & Properti No. 1 di Indonesia.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#fitur" className="hover:text-white transition">Fitur</a>
              <a href="#cara-kerja" className="hover:text-white transition">Cara Kerja</a>
              <a href="#harga" className="hover:text-white transition">Harga</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
              <Link href="/portal" className="text-blue-400 hover:underline">Portal Anak Kos</Link>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
            <p>© 2026 KamarHub. Seluruh hak cipta dilindungi undang-undang.</p>
            <p>Platform SaaS Otomasi Usaha Kos & Kontrakan Masa Depan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
