"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";
import { Building2, KeyRound, Mail, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("redirectTo", redirectTo);

    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl sm:px-10 border border-slate-100">
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-start gap-2">
          <span className="font-medium">Gagal Masuk:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Akun
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="pemilik@juragankos.com"
              className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Kata Sandi
            </label>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
              Lupa kata sandi?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
        >
          {loading ? (
            "Memproses..."
          ) : (
            <>
              Masuk ke Dashboard
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-6 text-center">
        <p className="text-sm text-slate-600">
          Belum memiliki akun pengelola?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-600">
            KamarHub
          </span>
        </div>
        <h2 className="text-center text-xl font-semibold tracking-tight text-slate-700">
          Masuk ke Portal Pemilik Kos
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Kelola aset, tagihan otomatis, dan kontrak sewa dalam satu platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Keamanan Terisolasi Multi-Tenant dengan PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}
