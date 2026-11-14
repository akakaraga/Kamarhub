import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KamarHub - SaaS Manajemen Kos & Properti",
  description: "Platform SaaS multi-tenant otomatisasi operasional dan penagihan kos-kosan menengah ke atas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
