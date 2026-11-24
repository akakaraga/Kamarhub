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
        "description": "Aplikasi manajemen kos & kontrakan. Tagihan kos tertagih sendiri, kamar lebih cepat terisi. Otomasi pengingat WhatsApp, periksa bukti transfer, dan kuitansi digital otomatis."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apakah penghuni harus mengunduh aplikasi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tidak. Penghuni cukup membuka tautan lewat browser HP, lalu login dengan nomor WhatsApp untuk melihat tagihan, mengunggah bukti bayar, atau melapor kerusakan."
            }
          },
          {
            "@type": "Question",
            "name": "Saya gaptek. Apakah sulit dipakai?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tampilan KamarHub sederhana dan berbahasa Indonesia. Cukup 3 langkah: daftarkan kamar, masukkan nomor penghuni, lalu sistem berjalan. Tim kami juga siap membantu jika Anda butuh bantuan."
            }
          },
          {
            "@type": "Question",
            "name": "Seaman apa foto KTP dan data keuangan saya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Data dilindungi dengan PostgreSQL Row Level Security. Foto KTP disimpan di brankas privat dan hanya bisa dibuka lewat tautan rahasia yang kedaluwarsa dalam 60 detik. Hanya Anda yang punya akses."
            }
          },
          {
            "@type": "Question",
            "name": "Kapan pengingat WhatsApp dikirim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ada tiga waktu: H-3 sebelum jatuh tempo, tepat di Hari-H, dan H+1 jika pembayaran belum diterima."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah paket Starter benar-benar gratis?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya. Starter gratis selamanya untuk hingga 10 kamar, tanpa kartu kredit dan tanpa masa percobaan."
            }
          },
          {
            "@type": "Question",
            "name": "Bisakah dipakai untuk kontrakan atau paviliun?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bisa. KamarHub cocok untuk kos, rumah kontrakan, paviliun, guesthouse, hingga ruko sewa."
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
        Pemilik kos baru? Daftar hari ini dan kelola hingga 10 kamar secara gratis.
      </div>

      {/* Navbar Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5" title="KamarHub">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-500">
                KamarHub
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#fitur" className="hover:text-white transition">Fitur</a>
              <a href="#cara" className="hover:text-white transition">Cara Kerja</a>
              <a href="#harga" className="hover:text-white transition">Harga</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-1.5"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              Daftar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-16 pb-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          Aplikasi manajemen kos & kontrakan
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
          Tagihan kos tertagih sendiri. <br />
          <span className="text-blue-500">
            Kamar lebih cepat terisi.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Tinggalkan buku catatan dan rasa sungkan saat menagih. KamarHub mengirim pengingat WhatsApp yang sopan, memeriksa bukti transfer, dan menerbitkan kuitansi digital secara otomatis.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Mulai Gratis, Siap dalam 2 Menit →
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5 text-blue-400" />
            Lihat Portal Penghuni
          </Link>
        </div>

        {/* 3 Checkmarks */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-500 font-bold" />
            <span><strong>Gratis</strong> untuk 10 kamar pertama</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-500 font-bold" />
            <span><strong>Penghuni</strong> tanpa unduh aplikasi</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-500 font-bold" />
            <span><strong>Data KTP</strong> & keuangan terenkripsi</span>
          </div>
        </div>
      </section>

      {/* 4 Metrics Section */}
      <section className="border-y border-slate-800/80 bg-slate-900/90 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-500">H-7</div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Tagihan terkirim otomatis sebelum jatuh tempo
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-500">0 menit</div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Waktu Anda untuk menagih manual
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-500">3 detik</div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Cek status semua kamar dari HP
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-500">1 klik</div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Verifikasi bukti transfer
            </p>
          </div>
        </div>
      </section>

      {/* Kenapa KamarHub Section */}
      <section id="keunggulan" className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Kenapa KamarHub</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Berhenti mencatat. Biarkan sistem yang bekerja.</h3>
            <p className="text-slate-400 text-sm mt-3">Usaha kos seharusnya jadi penghasilan yang tenang, bukan tambahan beban pikiran.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cara lama */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h4 className="text-base font-bold text-rose-400 tracking-wide uppercase">
                Cara lama
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Lupa tanggal jatuh tempo.</strong> Kamar menunggak berminggu-minggu sebelum Anda sadar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Sungkan menagih.</strong> Chat pribadi sering terasa canggung dan tidak digubris.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Catatan buku mudah rusak.</strong> Kuitansi kertas hilang, basah, atau nominalnya keliru.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Bukti transfer menumpuk.</strong> Anda mencocokkan mutasi bank satu per satu.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold text-base">•</span>
                  <span><strong>Keluhan tenggelam.</strong> Laporan AC bocor hilang di antara ratusan chat.</span>
                </li>
              </ul>
            </div>

            {/* Dengan KamarHub */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-blue-600/40 space-y-5">
              <h4 className="text-base font-bold text-blue-400 tracking-wide uppercase">
                Dengan KamarHub
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Tagihan terbit otomatis.</strong> Lengkap dengan rincian sewa dan denda bila ada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Pengingat WhatsApp sopan.</strong> Terkirim di H-3, Hari-H, dan H+1 tanpa Anda mengetik.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Kuitansi digital resmi.</strong> Terbit otomatis dan tersimpan aman di cloud.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Verifikasi sekali klik.</strong> Penghuni unggah bukti, Anda tinggal setujui.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Tiket keluhan terpusat.</strong> Lengkap dengan foto, mudah dipantau sampai selesai.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-20 border-t border-slate-800/60 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Fitur</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Semua kebutuhan kos dalam satu layar</h3>
            <p className="text-slate-400 text-sm mt-3">Dirancang untuk cara kerja pemilik kos dan kontrakan di Indonesia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  📊
                </div>
                <h4 className="text-lg font-bold text-white">Peta status kamar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lihat semua kamar sekilas. Hijau untuk terisi, merah untuk menunggak, kuning untuk kosong.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Data real-time
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  🧾
                </div>
                <h4 className="text-lg font-bold text-white">Tagihan & kuitansi PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invoice terbit otomatis, termasuk listrik, air, dan biaya tambahan. Kuitansi langsung dibuat saat lunas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Tanpa input ulang
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  💬
                </div>
                <h4 className="text-lg font-bold text-white">Pengingat WhatsApp</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pesan bernada sopan dan profesional dikirim sebelum dan sesudah jatuh tempo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Tagih tanpa sungkan
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  📱
                </div>
                <h4 className="text-lg font-bold text-white">Portal khusus penghuni</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penghuni cukup buka tautan di browser untuk lihat tagihan, unggah bukti bayar, dan lapor kerusakan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Login lewat nomor HP
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  🛠️
                </div>
                <h4 className="text-lg font-bold text-white">Laporan kerusakan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AC bocor atau lampu mati? Penghuni lapor lewat portal dengan foto, Anda pantau sampai tuntas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Fasilitas terawat
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-2xl">
                  🔒
                </div>
                <h4 className="text-lg font-bold text-white">Brankas KTP aman</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Foto KTP penghuni disimpan terenkripsi dan hanya bisa dibuka oleh Anda.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Privasi terjaga
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section id="cara" className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Cara kerja</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Mulai dalam 3 langkah, kurang dari 5 menit</h3>
            <p className="text-slate-400 text-sm mt-3">Tidak perlu keahlian teknis. Siapa pun bisa mengatur KamarHub.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-2">Daftarkan gedung & kamar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Isi nama kos, nomor kamar, tarif sewa, dan fasilitas. Unit baru bisa ditambah kapan saja.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-2">Tambahkan penghuni</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pilih kamar, masukkan nama dan nomor WhatsApp, lalu tentukan tanggal jatuh tempo.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl mb-5 shadow-md shadow-blue-500/20">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-2">Biarkan sistem bekerja</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tagihan, pengingat, dan kuitansi berjalan otomatis. Uang masuk tercatat rapi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harga Section */}
      <section id="harga" className="py-24 border-t border-slate-800/80 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Harga</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Harga jelas, tanpa biaya tersembunyi</h3>
            <p className="text-slate-400 text-sm mt-3">Mulai gratis hari ini. Upgrade hanya saat kamar Anda bertambah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-xs text-slate-400 mt-1">Untuk pemilik kos pemula dengan 1 gedung.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 0</span>
                  <span className="text-xs text-slate-400"> / selamanya</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Hingga 10 kamar aktif</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>1 gedung properti</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Peta status kamar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Tagihan & kuitansi digital</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Pengingat WhatsApp otomatis</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center block"
                >
                  Daftar Starter Gratis
                </Link>
              </div>
            </div>

            {/* Juragan Pro */}
            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-blue-500 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                PALING POPULER
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Juragan Pro</h4>
                <p className="text-xs text-blue-300 mt-1">Pilihan utama pemilik kos yang ingin semuanya berjalan otomatis.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 99.000</span>
                  <span className="text-xs text-slate-400"> / bulan</span>
                  <div className="text-[11px] text-blue-400 font-medium mt-1">Hanya sekitar Rp 3.300 per hari</div>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Hingga 50 kamar aktif</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Hingga 5 gedung</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Pengingat WhatsApp (H-3, Hari-H, H+1)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Portal penghuni & unggah bukti bayar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Laporan kerusakan fasilitas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Brankas KTP terenkripsi</span>
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

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Enterprise</h4>
                <p className="text-xs text-slate-400 mt-1">Untuk operator kos skala besar, apartemen, dan guesthouse.</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-white">Rp 299.000</span>
                  <span className="text-xs text-slate-400"> / bulan</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Kamar & gedung tanpa batas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Multi-akun pengelola & staf</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Dukungan prioritas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Ekspor laporan keuangan (PDF & Excel)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Bantuan migrasi data dari Excel</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 font-bold" />
                    <span>Bantuan 24/7</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center block"
                >
                  Hubungi Tim Kami
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">FAQ</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pertanyaan yang sering ditanyakan</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Apakah penghuni harus mengunduh aplikasi?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tidak. Penghuni cukup membuka tautan lewat browser HP, lalu login dengan nomor WhatsApp untuk melihat tagihan, mengunggah bukti bayar, atau melapor kerusakan.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Saya gaptek. Apakah sulit dipakai?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tampilan KamarHub sederhana dan berbahasa Indonesia. Cukup 3 langkah: daftarkan kamar, masukkan nomor penghuni, lalu sistem berjalan. Tim kami juga siap membantu jika Anda butuh bantuan.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Seaman apa foto KTP dan data keuangan saya?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Data dilindungi dengan PostgreSQL Row Level Security. Foto KTP disimpan di brankas privat dan hanya bisa dibuka lewat tautan rahasia yang kedaluwarsa dalam 60 detik. Hanya Anda yang punya akses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Kapan pengingat WhatsApp dikirim?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ada tiga waktu: H-3 sebelum jatuh tempo, tepat di Hari-H, dan H+1 jika pembayaran belum diterima.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Apakah paket Starter benar-benar gratis?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ya. Starter gratis selamanya untuk hingga 10 kamar, tanpa kartu kredit dan tanpa masa percobaan.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm">
                Bisakah dipakai untuk kontrakan atau paviliun?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Bisa. KamarHub cocok untuk kos, rumah kontrakan, paviliun, guesthouse, hingga ruko sewa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saatnya kelola kos dengan lebih tenang
          </h2>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Tidak ada lagi tagihan terlambat dan catatan berantakan. Daftar dalam 2 menit, gratis.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              Daftar Gratis Sekarang →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
            >
              Masuk ke Dasbor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-blue-500">KamarHub</span> — Aplikasi manajemen kos & properti.
            </div>
            <div className="text-slate-400">
              Platform untuk pemilik kos di Indonesia
            </div>
          </div>
          <div className="pt-4 border-t border-slate-900 text-[11px] text-slate-600 text-center sm:text-left">
            © 2026 KamarHub. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
