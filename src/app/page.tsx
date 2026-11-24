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
  TrendingUp, 
  Banknote, 
  Smile, 
  Shield, 
  Layers, 
  ChevronRight,
  Send,
  MessageSquare,
  FileCheck2,
  CalendarCheck2
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
          "ratingCount": "156"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "description": "Paket Starter Gratis Selamanya untuk hingga 10 kamar kos"
        },
        "description": "Aplikasi manajemen kos dan kontrakan online terbaik di Indonesia. Otomatiskan penagihan sewa bulanan lewat WhatsApp, cek status kamar kosong, kuitansi digital instan, dan portal anak kos tanpa unduh aplikasi."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apakah anak kos wajib mengunduh aplikasi di Play Store atau App Store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tidak perlu sama sekali. KamarHub menggunakan teknologi web mobile-first yang sangat ringan. Anak kos cukup membuka link melalui browser smartphone mereka dan langsung login menggunakan nomor WhatsApp aktif tanpa perlu install aplikasi yang membebani memori HP."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara kerja pengingat tagihan sewa otomatis lewat WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sistem KamarHub secara otomatis mengirimkan pesan pengingat tagihan dengan bahasa yang ramah dan sopan pada H-3 sebelum tanggal jatuh tempo, tepat pada Hari H, serta pemberitahuan santun jika pembayaran melewati batas jatuh tempo."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah data KTP anak kos dan catatan keuangan saya aman?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sangat aman. Setiap akun pemilik kos memiliki sistem isolasi data terenkripsi (PostgreSQL Row Level Security). Foto KTP anak kos disimpan dalam brankas privat yang hanya dapat diakses oleh pemilik kos berwenang melalui link rahasia berwaktu singkat 60 detik."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah paket Starter benar-benar gratis digunakan selamanya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, paket Starter 100% gratis selamanya untuk pemilik kos dengan kapasitas hingga 10 kamar tanpa syarat kartu kredit."
            }
          },
          {
            "@type": "Question",
            "name": "Bisakah KamarHub digunakan untuk mengelola rumah kontrakan atau paviliun sewa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tentu saja bisa! KamarHub dapat digunakan untuk mengelola kos-kosan, rumah kontrakan, paviliun, guesthouse, maupun ruko sewa dengan sistem pencatatan kontrak dan penagihan berkala."
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

      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 text-center tracking-wide">
        ⚡ <strong>Solusi Cerdas Juragan Kos:</strong> Uang sewa masuk tepat waktu, bebas dari rasa canggung saat menagih penghuni!
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
              <a href="#keunggulan" className="hover:text-white transition">Keunggulan</a>
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

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
          Kelola Banyak Pintu Kos Tanpa Lelah. <br />
          <span className="text-blue-500">
            Tagihan Masuk Otomatis, Kamar Terisi Lebih Cepat.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Tinggalkan buku catatan berantakan dan rasa sungkan saat menagih uang sewa. <strong>KamarHub</strong> adalah asisten digital yang membantu Anda memantau kamar kosong secara visual, mengirimkan pengingat WhatsApp otomatis yang santun, memverifikasi bukti transfer, hingga menerbitkan kuitansi digital resmi.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Mulai Gratis Sekarang (Siap dalam 2 Menit)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5 text-blue-400" />
            Coba Portal Mandiri Anak Kos
          </Link>
        </div>

        {/* UX Micro-Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            100% Gratis Selamanya untuk Kos Pemula
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" />
            Anak Kos Masuk Tanpa Download Aplikasi
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Data KTP & Keuangan Terenkripsi Aman
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="border-y border-slate-800/80 bg-slate-900/90 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-500">98%</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Pembayaran Tepat Waktu</div>
            <p className="text-[11px] text-slate-400">Pengingat WhatsApp terjadwal otomatis mencegah anak kos terlambat bayar</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">0 Jam</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Waktu Terbuang Menagih</div>
            <p className="text-[11px] text-slate-400">Sistem bekerja otomatis, Anda bebas dari rasa canggung atau sungkan</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-400">3 Detik</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Cek Status Semua Kamar</div>
            <p className="text-[11px] text-slate-400">Peta visual warna hijau, merah, kuning langsung terlihat jelas di HP</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Kuitansi Digital Otomatis</div>
            <p className="text-[11px] text-slate-400">Bukti lunas resmi terbit instan begitu transfer disetujui, siap unduh / cetak</p>
          </div>
        </div>
      </section>

      {/* Masalah vs Solusi Section (Keunggulan) */}
      <section id="keunggulan" className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">KENAPA JURAGAN KOS MEMILIH KAMARHUB?</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tinggalkan Cara Lama yang Menguras Waktu & Energi</h3>
            <p className="text-slate-400 text-sm mt-3">Bisnis kos seharusnya memberikan penghasilan pasif yang menenangkan, bukan menambah beban pikiran sehari-hari.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cara Lama (Pain Points) */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-red-900/30 space-y-5">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 text-base">✕</span>
                Cara Lama yang Bikin Pusing
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Sering lupa tanggal sewa:</strong> Anak kos menunggak berminggu-minggu karena Anda lupa mengecek tanggal jatuh tempo satu per satu.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Sungkan & canggung menagih:</strong> Mengetuk pintu kamar atau chat pribadi sering terasa tidak enak hati dan merusak keakraban.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Catatan di buku sering tercecer:</strong> Kuitansi kertas hilang, basah, atau nominal tagihan yang diperdebatkan saat pindah.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Galeri HP penuh bukti transfer:</strong> Repot mencocokkan struk mutasi bank satu per satu secara manual.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Komplain fasilitas tenggelam:</strong> Aduan AC bocor atau lampu mati terlewat di antara ribuan chat WhatsApp pribadi.</span>
                </li>
              </ul>
            </div>

            {/* Cara KamarHub (Peace of Mind) */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-blue-600/40 space-y-5">
              <div className="flex items-center gap-3 text-blue-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 text-base">✓</span>
                Kenyamanan Bersama KamarHub
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tagihan Otomatis H-7:</strong> Tagihan bulanan langsung dibuat oleh sistem lengkap dengan rincian biaya sewa dan denda jika ada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>WhatsApp Bot Ramah & Santun:</strong> Pengingat otomatis dikirim pada H-3, Hari-H, dan H+1 tanpa rasa canggung atau tersinggung.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Kuitansi Resmi Digital Otomatis:</strong> Langsung terbit saat pembayaran disetujui, tersimpan aman di cloud selamanya.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Verifikasi Bukti Bayar 1 Klik:</strong> Anak kos upload foto bukti bayar di portal, Anda cukup verifikasi dengan sekali klik.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Pusat Tiket Komplain Terpusat:</strong> Keluhan kerusakan fasilitas tercatat rapi beserta foto, Anda tinggal menugaskan teknisi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-20 border-t border-slate-800/60 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">FITUR LENGKAP & PRAKTIS</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Semua Kebutuhan Pengelolaan Kos dalam Satu Layar</h3>
            <p className="text-slate-400 text-sm mt-3">Dibangun khusus mengikuti alur operasional bisnis kos nyata di Indonesia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Visual Grid Status Kamar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ketahui kondisi seluruh kamar dalam hitungan detik. Warna <strong>Hijau</strong> untuk kamar kosong siap huni, <strong>Merah</strong> untuk kamar terisi sewa aktif, dan <strong>Kuning</strong> untuk unit dalam perbaikan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Cek okupansi kos secara real-time
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
                  <Receipt className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Tagihan Otomatis & Kuitansi PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sistem otomatis menerbitkan invoice bulanan pada H-7 sebelum jatuh tempo. Anda juga bisa menambahkan biaya listrik token, air galon, atau denda keterlambatan secara transparan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Nomor kuitansi resmi otomatis
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center font-bold text-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Pengingat WhatsApp yang Santun</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  KamarHub mengirimkan pesan WhatsApp pengingat dengan bahasa yang sopan dan profesional pada H-3, Hari-H jatuh tempo, dan peringatan keterlambatan sewa tanpa perlu Anda ketik manual.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Menagih tanpa rasa canggung
              </div>
            </div>

            {/* Fitur 4 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-600/10 text-sky-400 flex items-center justify-center font-bold text-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Portal Mandiri Khusus Anak Kos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Anak kos tidak perlu download aplikasi berat di HP. Cukup buka tautan web di browser smartphone untuk melihat rincian tagihan, upload foto struk transfer, dan unduh kuitansi resmi.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-sky-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Login no. HP tanpa password
              </div>
            </div>

            {/* Fitur 5 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center font-bold text-xl">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Pusat Komplain Fasilitas Kamar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AC bocor, genteng rembes, atau lampu mati? Anak kos melapor lewat portal lengkap dengan foto dan tingkat urgensi. Pengelola kos dapat memantau proses penanganan teknisi hingga tuntas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Fasilitas terawat, anak kos betah
              </div>
            </div>

            {/* Fitur 6 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center font-bold text-xl">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Brankas KTP Aman & Terenkripsi</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Foto KTP penghuni kos tersimpan aman dalam brankas digital ber-enkripsi tinggi. Tautan akses dibuat rahasia dan kedaluwarsa otomatis dalam 60 detik untuk menjaga privasi penghuni.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Standar privasi perbankan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja 3 Langkah Mudah */}
      <section id="cara-kerja" className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">LANGKAH MUDAH & PRAKTIS</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Mulai Otomasi Kos Anda dalam 3 Langkah</h3>
            <p className="text-slate-400 text-sm mt-3">Tidak perlu keahlian teknis rumit. Siapapun bisa mulai mengoperasikan KamarHub dalam waktu kurang dari 3 menit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-2">Daftarkan Gedung & Kamar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Masukkan nama kos, nomor kamar, tarif sewa bulanan, dan fasilitas yang tersedia. Anda bisa menambah unit baru kapan saja.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Setup selesai dalam 2 menit
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-2">Masukkan Data Penghuni</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pilih kamar anak kos, masukkan nama dan nomor WhatsApp aktif, serta tetapkan tanggal siklus jatuh tempo pembayaran sewa.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Data KTP tersimpan privat
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-2">Biarkan Sistem yang Bekerja</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Duduk tenang! KamarHub akan menerbitkan tagihan H-7, mengirim WhatsApp pengingat, dan mencatat arus kas masuk Anda secara rapi.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" /> Uang sewa masuk tepat waktu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-24 border-t border-slate-800/80 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">PAKET HARGA TRANSPARAN</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Investasi Sangat Hemat, Nilai Balik Berlipat</h3>
            <p className="text-slate-400 text-sm mt-3">Mulai secara gratis sekarang juga. Anda bisa upgrade kapanpun saat kapasitas kamar kos Anda bertambah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan: Starter */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-xs text-slate-400 mt-1">Sangat pas untuk pemilik kos pemula dengan 1 gedung.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 0</span>
                  <span className="text-xs text-slate-400"> / gratis selamanya</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hingga <strong>10 Kamar</strong> Kos Aktif</span>
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
                  Daftar Paket Starter Gratis
                </Link>
              </div>
            </div>

            {/* Plan: Pro (Most Popular) */}
            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-blue-500 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Paling Diminati Juragan
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Juragan Pro</h4>
                <p className="text-xs text-blue-300 mt-1">Pilihan utama juragan yang ingin operasional berjalan serba otomatis.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 99.000</span>
                  <span className="text-xs text-slate-400"> / bulan</span>
                  <div className="text-[11px] text-emerald-400 font-medium mt-1">Hanya Rp 3.300 / hari untuk ketenangan bisnis Anda</div>
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
                  Coba Gratis 14 Hari Sekarang
                </Link>
              </div>
            </div>

            {/* Plan: Enterprise */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
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
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">TANYA JAWAB (FAQ)</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Kerap Ditanyakan Pemilik Kos</h3>
            <p className="text-slate-400 text-sm mt-3">Jawaban atas pertanyaan umum seputar kemudahan, keamanan, dan cara kerja KamarHub.</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Apakah anak kos harus mengunduh aplikasi dari Google Play Store atau App Store?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Tidak perlu sama sekali! KamarHub berbasis Web Mobile-First. Anak kos cukup membuka link melalui browser di smartphone mereka (Chrome, Safari, dll.) dan memasukkan nomor WhatsApp terdaftar untuk melihat tagihan sewa atau lapor kerusakan fasilitas. Sangat praktis tanpa membebani memori HP anak kos.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Bagaimana jika saya belum terbiasa menggunakan aplikasi teknologi (gaptek)?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                KamarHub didesain dengan tampilan bahasa Indonesia yang sangat sederhana, bersih, dan mudah dipahami siapa saja. Cukup 3 langkah mudah: daftarkan kamar, masukkan nomor anak kos, dan sistem akan langsung bekerja otomatis. Tim kami juga siap membantu Anda jika ada kendala.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Bagaimana tingkat keamanan foto KTP dan catatan keuangan kos saya?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                KamarHub menerapkan perlindungan data ketat dengan enkripsi PostgreSQL Row Level Security (RLS). Foto KTP penghuni disimpan di brankas privat Supabase dan hanya dapat dilihat oleh pemilik kos sah melalui link rahasia berbatas waktu 60 detik. Pemilik kos lain tidak dapat mengakses data Anda.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Kapan pengingat tagihan WhatsApp otomatis dikirimkan ke anak kos?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Sistem KamarHub mengirimkan pesan sopan secara otomatis pada 3 momen penting: <strong>H-3</strong> sebelum tanggal jatuh tempo, tepat pada <strong>Hari-H</strong> jatuh tempo, dan peringatan ramah pada <strong>H+1</strong> jika pembayaran belum diverifikasi.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Apakah paket Starter benar-benar gratis tanpa dipungut biaya apapun?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Ya, paket Starter 100% gratis selamanya untuk kapasitas hingga 10 kamar kos. Anda tidak diminta kartu kredit apapun saat mendaftar.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                Bisakah KamarHub digunakan untuk rumah kontrakan atau paviliun sewa?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                Sangat bisa! KamarHub dapat digunakan untuk mengelola kos-kosan, rumah kontrakan, paviliun keluarga, guesthouse, maupun ruko sewa dengan sistem pencatatan kontrak dan penagihan berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saatnya Mengubah Bisnis Kos Anda Jadi Lebih Modern & Nyaman
          </h2>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Hentikan keterlambatan pembayaran sewa dan hilangkan stres menagih. Daftar sekarang dalam 2 menit, rasakan kemudahan pengelolaan kos otomatis tanpa biaya di awal.
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
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
              <a href="#keunggulan" className="hover:text-white transition">Keunggulan</a>
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
