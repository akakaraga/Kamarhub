"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginRenter } from "./actions";
import { 
  Building2, 
  Phone, 
  ArrowRight, 
  Sparkles,
  QrCode,
  Loader2
} from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || searchParams.get("p") || "";
  const autoParam = searchParams.get("auto") === "1" || searchParams.get("auto") === "true";

  const [phone, setPhone] = useState(phoneParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQrLogin, setIsQrLogin] = useState(autoParam && Boolean(phoneParam));

  // Auto-login trigger if accessed via QR Code / short link with auto=1
  useEffect(() => {
    if (phoneParam) {
      setPhone(phoneParam);
      if (autoParam) {
        setIsQrLogin(true);
        setLoading(true);
        const formData = new FormData();
        formData.set("phone", phoneParam);

        loginRenter(formData)
          .then((res) => {
            if (res?.error) {
              setError(res.error);
              setLoading(false);
              setIsQrLogin(false);
            } else if (res?.success) {
              window.location.href = "/portal/dashboard";
            }
          })
          .catch((err) => {
            console.error("Auto login error:", err);
            setError("Gagal melakukan login otomatis. Silakan coba tekan tombol Masuk.");
            setLoading(false);
            setIsQrLogin(false);
          });
      }
    }
  }, [phoneParam, autoParam]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await loginRenter(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      window.location.href = "/portal/dashboard";
    }
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-xs text-slate-400">
          Masuk ke portal mandiri kos untuk melihat tagihan sewa, kirim bukti bayar, dan lapor keluhan fasilitas.
        </p>
      </div>

      {/* QR Code Auto-Login Banner */}
      {isQrLogin && loading && (
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-xs font-medium flex items-center gap-2.5 animate-pulse">
          <QrCode className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Memverifikasi akses otomatis via QR Code...</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Nomor WhatsApp Terdaftar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Gunakan nomor WhatsApp untuk dapat masuk ke portal.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memverifikasi Akun...
            </>
          ) : (
            <>
              Masuk ke Portal
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function RenterPortalLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-md mx-auto w-full pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-blue-500 text-lg">
            KamarHub
          </span>
        </div>
        <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30">
          Portal Anak Kos
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <Suspense fallback={
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-800/80 rounded-3xl border border-slate-700/80 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            Memuat portal...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 pb-2">
        Dilindungi oleh sistem isolasi data privasi KamarHub SaaS
      </div>
    </div>
  );
}
