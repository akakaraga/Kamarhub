import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, CheckCircle2, Zap, Phone, Receipt, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Kamar<span className="text-blue-500">Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Masuk Admin
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              Daftar Kos Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          SaaS Multi-Tenant Kos-Kosan Masa Depan
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Otomatiskan Penagihan Kos. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
            Hilangkan Stres Menagih Sewa.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl">
          KamarHub mendigitalkan operasional kos-kosan menengah ke atas: auto-invoicing terjadwal, notifikasi tagihan WhatsApp, dan portal mandiri penghuni tanpa perlu install aplikasi berat.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Mulai Coba Sekarang (Gratis)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            Masuk ke Dasbor
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Auto-Invoicing Terjadwal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tagihan bulanan, denda, dan biaya tambahan dibuat otomatis H-7 sebelum jatuh tempo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Isolasi Data Mutlak</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dilindungi oleh PostgreSQL Row Level Security (RLS) di setiap baris query data pemilik kos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Portal Mandiri & WhatsApp</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penghuni dapat melihat rincian tagihan, upload struk bayar, dan melapor kerusakan via smartphone.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © 2026 KamarHub. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
