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
  ChevronDown
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        🚀 <span className="font-bold">KamarHub v2.0 Telah Rilis:</span> Nikmati otomasi WhatsApp reminder, portal anak kos tanpa unduh app, & analitik arus kas real-time!
      </div>

      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kamar<span className="text-blue-500">Hub</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#fitur" className="hover:text-white transition">Fitur Utama</a>
              <a href="#harga" className="hover:text-white transition">Paket Harga</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/portal"
              className="text-xs sm:text-sm font-semibold text-sky-300 hover:text-sky-200 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 shadow-sm"
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
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
          Otomatiskan Penagihan Kos. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
            Hilangkan Stres Menagih Sewa.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          KamarHub mendigitalkan seluruh siklus kos-kosan: mulai dari visual grid status kamar, tagihan otomatis H-7, pengingat WhatsApp santun, kuitansi digital instan, hingga portal anak kos tanpa unduh aplikasi.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5 text-blue-400" />
            Portal Anak Kos
          </Link>
        </div>

        {/* Value Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            PostgreSQL Row Level Security (RLS)
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Cron Auto-Invoicing Terjadwal H-7
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-400" />
            WhatsApp Bot Terintegrasi
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-20 border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">FITUR UNGGULAN</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Semua yang Dibutuhkan Juragan Kos Modern</h3>
            <p className="text-slate-400 text-sm mt-3">Tinggalkan buku catatan kertas dan obrolan chat tagihan yang canggung. Semua terkendali dalam 1 sistem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Visual Grid Kamar & Okupansi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pantau ketersediaan kamar secara visual dengan kode warna cerdas: hijau untuk kosong, merah untuk terisi, dan kuning untuk dalam perbaikan servis.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Auto-Invoicing & Kuitansi PDF</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invoice bulanan dan denda sewa di-generate otomatis 7 hari sebelum jatuh tempo. Lengkap dengan kuitansi digital resmi berformat cetak instan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xl">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Pengingat WhatsApp Otomatis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notifikasi santun dikirimkan otomatis ke nomor WA penghuni pada H-3, tanggal jatuh tempo, dan peringatan keterlambatan tanpa admin repot mengetik ulang.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Portal Mandiri Anak Kos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anak kos cukup memasukkan nomor HP untuk melihat riwayat tagihan sewa, mengunggah bukti transfer, dan memantau status verifikasi pembayaran.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xl">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Pusat Tiket Kerusakan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Penghuni dapat melaporkan keluhan fasilitas (AC rusak, genteng bocor, pipa mampet) lengkap dengan foto, dan melacak progres teknisi langsung di portal.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Privat Vault KTP Terenkripsi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foto identitas KTP penghuni disimpan aman di bucket privat ber-enkripsi dengan link bertanda tangan (Signed URL) kedaluwarsa otomatis 60 detik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">PAKET BERLANGGANAN</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Investasi Hemat untuk Bisnis Kos Profesional</h3>
            <p className="text-slate-400 text-sm mt-3">Pilih paket yang sesuai dengan kapasitas dan jumlah cabang gedung kos Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan: Starter */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-xs text-slate-400 mt-1">Cocok untuk pemilik kos pemula & 1 gedung kecil.</p>
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
                    <span>Maksimal 1 Lokasi Gedung Properti</span>
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
                    <span>Otomasi Pengingat WhatsApp (Manual)</span>
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
            <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-900/30 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Paling Diminati
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Juragan Pro</h4>
                <p className="text-xs text-blue-200 mt-1">Pilihan utama juragan kos aktif yang ingin serba otomatis.</p>
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
                    <span>Hingga 5 Gedung Properti Cabang</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Auto-Invoicing Terjadwal H-7 Otomatis</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Otomasi WhatsApp Reminder (H-3 & Jatuh Tempo)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Portal Mandiri Anak Kos + Upload Struk Bayar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pusat Komplain Fasilitas Kamar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Privat Vault KTP Terenkripsi RLS</span>
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
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
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
                    <span><strong>Kamar & Properti Tanpa Batas</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-Staff Admin & Hak Akses Tim</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated WhatsApp Gateway Priority</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ekspor Laporan Keuangan Pajak & Excel</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Bantuan Migrasi Data dari Excel Gratis</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SLA Dukungan 24/7 Prioritas</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center block"
                >
                  Hubungi Tim Penjualan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="komparasi" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white tracking-tight">Tabel Perbandingan Fitur Paket</h3>
            <p className="text-slate-400 text-xs mt-2">Pilih solusi yang paling efisien untuk kebutuhan operasional kos Anda.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Fitur Sistem</th>
                  <th className="py-3 px-4 font-semibold text-center">Starter</th>
                  <th className="py-3 px-4 font-semibold text-center text-blue-400">Juragan Pro</th>
                  <th className="py-3 px-4 font-semibold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Maksimal Kamar Kos</td>
                  <td className="py-3.5 px-4 text-center">10 Kamar</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-400">50 Kamar</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Maksimal Gedung Properti</td>
                  <td className="py-3.5 px-4 text-center">1 Gedung</td>
                  <td className="py-3.5 px-4 text-center">5 Gedung</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Visual Status Kamar (Grid)</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Auto-Invoicing Terjadwal H-7</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Pengingat WhatsApp Otomatis (Fonnte/Watzap)</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Portal Anak Kos Tanpa Password</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Pelaporan Kerusakan Fasilitas</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Multi-Staff Admin & Hak Akses</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">-</td>
                  <td className="py-3.5 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">PERTANYAAN UMUM</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Kerap Ditanyakan Pemilik Kos</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Apakah anak kos harus mengunduh aplikasi di Google Play Store atau App Store?
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-6">
                Tidak perlu sama sekali! KamarHub menyediakan Web Portal Mobile-First yang ringan. Penghuni cukup membuka tautan dari browser smartphone mereka dan memasukkan nomor HP untuk melihat rincian tagihan, upload bukti transfer, atau melapor kerusakan fasilitas.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Bagaimana tingkat keamanan data KTP dan identitas pribadi anak kos?
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-6">
                Data identitas dan foto KTP disimpan dalam bucket privat Supabase Storage berenkripsi. Akses dilindungi oleh aturan PostgreSQL Row Level Security (RLS) dan link bertanda tangan (Signed URL) yang kedaluwarsa otomatis dalam 60 detik, sehingga hanya pemilik kos yang berhak yang bisa mengaksesnya.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Kapan pengingat tagihan WhatsApp otomatis dikirimkan?
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-6">
                Sistem cron engine KamarHub secara terjadwal mengecek seluruh tagihan berjalan setiap hari: mengirimkan notifikasi santun pada H-3 sebelum tanggal jatuh tempo, notifikasi pada Hari H jatuh tempo, serta pengingat tagihan terlambat pada H+1.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Apakah saya bisa mencoba secara gratis terlebih dahulu?
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-6">
                Ya! Paket Starter kami sepenuhnya gratis untuk Anda gunakan mengelola hingga 10 kamar tanpa batasan waktu dan tanpa perlu kartu kredit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Siap Mengubah Manajemen Kos Anda Menjadi Otomatis?
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Daftarkan kos Anda sekarang, kurangi penundaan pembayaran sewa, dan berikan pengalaman kos bintang lima bagi penghuni Anda.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              Mulai Daftar Kos Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
            >
              Masuk ke Dasbor Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-300">KamarHub</span> — Platform Otomasi Kos & Properti Multi-Tenant.
          </div>
          <div>
            © 2026 KamarHub. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
