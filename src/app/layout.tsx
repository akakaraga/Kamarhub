import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kamarhub.com"),
  title: {
    default: "KamarHub - Aplikasi Manajemen Kos & Penagihan Sewa Otomatis No. 1 di Indonesia",
    template: "%s | KamarHub",
  },
  description:
    "Kelola kos-kosan dan kontrakan jadi lebih mudah, rapi, dan otomatis. Dilengkapi pengingat tagihan WhatsApp otomatis, visual kamar kosong, kuitansi digital instan, dan portal anak kos tanpa unduh aplikasi.",
  keywords: [
    "aplikasi manajemen kos",
    "software kelola kos",
    "aplikasi pengelola kosan",
    "pengingat tagihan kos whatsapp",
    "kuitansi sewa kos digital",
    "pembukuan usaha kos",
    "sistem manajemen properti kos",
    "portal anak kos",
    "kamarhub",
  ],
  authors: [{ name: "KamarHub Team" }],
  creator: "KamarHub",
  publisher: "KamarHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kamarhub.com",
    title: "KamarHub - Aplikasi Manajemen Kos & Penagihan Sewa Otomatis No. 1 di Indonesia",
    description:
      "Tinggalkan catatan kertas dan canggung saat menagih sewa! KamarHub mengotomatiskan tagihan bulanan lewat WhatsApp, cek okupansi kamar real-time, dan portal mandiri anak kos.",
    siteName: "KamarHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "KamarHub - Solusi Pintar Pengelolaan Kos & Kontrakan",
    description:
      "Otomatiskan penagihan kos lewat WhatsApp, pantau kamar kosong, dan terbitkan kuitansi digital instan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
