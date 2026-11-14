# Product Requirements Document (PRD)

**Nama Produk:** KamarHub (SaaS Manajemen Kos & Properti)  
**Fase:** Minimum Viable Product (MVP)  
**Model Bisnis:** B2B2C (Software as a Service)  
**Platform:** Web Application (Desktop untuk Admin, Mobile-Web untuk Penghuni)

---

## 1. Ringkasan Eksekutif
KamarHub adalah platform SaaS berbasis multi-tenant yang dirancang untuk mendigitalkan dan mengotomatiskan operasional bisnis kos-kosan menengah ke atas. 
Produk ini memecahkan masalah inefisiensi pencatatan manual, meminimalisir keterlambatan pembayaran sewa melalui sistem penagihan otomatis (*auto-invoicing*), dan menyediakan portal mandiri bagi penghuni untuk melacak tagihan serta melaporkan kerusakan fasilitas.
Dengan menggunakan satu basis data yang terisolasi secara aman (*Row Level Security* / RLS), aplikasi ini dapat disewakan kepada ratusan pemilik kos yang berbeda secara bersamaan.

---

## 2. Tujuan & Metrik Keberhasilan (KPI)
### Tujuan Utama:
- Menghilangkan gesekan psikologis saat menagih sewa melalui notifikasi WhatsApp/Email otomatis.
- Menyatukan data aset (kamar), data penghuni (KTP), dan riwayat transaksi dalam satu dasbor terpusat.
- Menyediakan pengalaman tingkat perhotelan (*hospitality-grade*) bagi anak kos.

### Metrik Keberhasilan (MVP):
- **Akurasi Penagihan:** 100% tagihan (termasuk denda/biaya tambahan) terbuat secara otomatis pada tanggal jatuh tempo.
- **Isolasi Data (Security):** 0 insiden kebocoran data silang antar-pemilik kos.
- **Adopsi Penghuni:** Minimal 80% penghuni kos menggunakan portal mobile untuk melihat tagihan atau melapor keluhan.

---

## 3. Profil Pengguna (User Personas)
1. **Pemilik / Pengelola Kos (Admin SaaS)**
   - *Karakteristik:* Memiliki 1 hingga 5 properti kos, sibuk, kurang mahir dengan perangkat lunak akuntansi kompleks, dan sering lupa mencatat pengeluaran perbaikan.
   - *Kebutuhan Utama:* Dasbor visual untuk melihat kamar mana yang kosong/menunggak, dan laporan laba-rugi otomatis.
2. **Penghuni / Anak Kos (End-User)**
   - *Karakteristik:* Mahasiswa atau pekerja kantoran, sangat mengandalkan smartphone, menginginkan transparansi tagihan (biaya sewa vs listrik).
   - *Kebutuhan Utama:* Portal yang mudah diakses (tanpa perlu install aplikasi berat di App Store/Play Store) untuk melihat rincian tagihan bulanan dan melaporkan AC/air yang bermasalah.

---

## 4. Arsitektur & Spesifikasi Teknis
| Komponen | Teknologi Pilihan | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend & UI** | Next.js (App Router), Tailwind, Shadcn UI | SEO-friendly untuk landing page SaaS, komponen UI modern dan mobile-responsive. |
| **Backend & Database** | Supabase (PostgreSQL) | Memiliki Row Level Security (RLS) bawaan yang wajib untuk keamanan data Multi-Tenant SaaS. |
| **Penyimpanan Berkas** | Supabase Storage | Mengamankan unggahan foto KTP penghuni dan foto bukti transfer. |
| **Otomatisasi Tagihan** | Cron Jobs (Vercel / Inngest) | Menjalankan fungsi pengecekan jatuh tempo setiap hari pada pukul 00:00. |
| **Notifikasi Pesan** | Fonnte / Watzap (API Lokal) | Jauh lebih efektif mengirim tagihan via WhatsApp ke orang Indonesia daripada email. |

---

## 5. Kebutuhan Fungsional (Functional Requirements)

### Modul Admin (Pemilik Kos)
- **Manajemen Multi-Properti:** Satu akun Pemilik dapat menambahkan >1 bangunan kos (misal: Kos A, Kos B) dan mengelompokkan kamar per bangunan.
- **Manajemen Aset (Kamar):** Menyimpan tipe kamar (AC/Non-AC), harga dasar, dan menampilkan status kamar (*Available*, *Occupied*, *Maintenance*) dalam grid visual.
- **Onboarding Penghuni (Kontrak):** Membuat kontrak sewa baru, menyimpan foto KTP penghuni secara privat, dan mencatat besaran uang deposit/jaminan.
- **Pembuatan Tagihan Khusus (Manual Override):** Menambahkan denda atau biaya tambahan (misal: bawa kulkas pribadi) ke tagihan bulan berjalan.
- **Laporan & Dasbor:** Menampilkan total piutang, *occupancy rate*, dan grafik pendapatan bulanan.

### Modul Penghuni (Portal Mobile-Web)
- **Akses Tanpa Sandi (Magic Link / OTP):** Masuk via nomor WhatsApp atau email tanpa sandi rumit.
- **Rincian Tagihan (Invoice):** Rincian jelas (Sewa Dasar + Tambahan + Denda) beserta status pembayaran (*Unpaid*/*Paid*).
- **Unggah Bukti Bayar:** Unggah foto struk transfer untuk diverifikasi admin.
- **Tiket Pemeliharaan (Maintenance):** Membuat tiket keluhan (Air, Listrik, Bangunan, AC, Kunci) + foto bukti kerusakan.

### Modul Otomatisasi (Background System)
- **Auto-Invoicing:** Membuat baris data `invoices` baru pada H-7 sebelum tanggal jatuh tempo kontrak.
- **Auto-Reminder:** Mengirim pesan pengingat ke WhatsApp penghuni pada H-3, Hari H, dan H+1 keterlambatan.

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Keamanan Multi-Tenant (Absolute Requirement):** Setiap query ke basis data (SELECT, INSERT, UPDATE, DELETE) harus divalidasi oleh kebijakan `auth.uid() = tenant_id` di tingkat PostgreSQL (RLS).
- **Desain Responsif:** Portal penghuni mobile-first; Dasbor admin data-dense desktop/tablet.
- **Perlindungan Data Pribadi (PDP):** URL foto KTP tidak boleh publik (Private Storage Bucket), hanya diakses melalui signed URL berbatas waktu bagi admin login.

---

## 7. Skema Database (DBML)
```dbml
// SAAS CORE (MULTI-TENANCY)
Table tenants {
  id uuid [primary key, note: 'ID Akun Pemilik Kos (Admin SaaS, matches auth.users.id)']
  full_name varchar [not null]
  company_name varchar [note: 'Contoh: Juragan Kos Group']
  email varchar [unique, not null]
  phone_number varchar
  subscription_plan varchar [default: 'free', note: 'Enum: free, pro, enterprise']
  created_at timestamp [default: 'now()']
}

// ASSET MANAGEMENT (PROPERTI & KAMAR)
Table properties {
  id uuid [primary key, default: 'gen_random_uuid()']
  tenant_id uuid [not null, note: 'RLS: Milik siapa kos ini?']
  name varchar [not null, note: 'Contoh: Kos Mawar, Kos Melati']
  address text
  total_rooms integer [default: 0]
  created_at timestamp [default: 'now()']
}

Table rooms {
  id uuid [primary key, default: 'gen_random_uuid()']
  property_id uuid [not null]
  tenant_id uuid [not null, note: 'Untuk kemudahan filter keamanan RLS']
  room_number varchar [not null, note: 'Contoh: 101, 102A']
  room_type varchar [note: 'Contoh: AC, Non-AC, VIP']
  base_price decimal(12,2) [not null, note: 'Harga sewa dasar bulanan']
  status varchar [default: 'available', note: 'Enum: available, occupied, maintenance']
  created_at timestamp [default: 'now()']
}

// TENANT LIFECYCLE (PENGHUNI & KONTRAK)
Table renters {
  id uuid [primary key, default: 'gen_random_uuid()']
  tenant_id uuid [not null, note: 'Bapak kos mana yang menginput data ini?']
  full_name varchar [not null]
  whatsapp_number varchar [not null]
  id_card_number varchar [note: 'Nomor NIK KTP']
  id_card_url text [note: 'Link URL foto KTP di Supabase Storage']
  emergency_contact varchar [note: 'Nomor darurat keluarga']
  created_at timestamp [default: 'now()']
}

Table contracts {
  id uuid [primary key, default: 'gen_random_uuid()']
  tenant_id uuid [not null]
  room_id uuid [not null]
  renter_id uuid [not null]
  start_date date [not null]
  end_date date [note: 'Kosong jika perpanjangan otomatis tiap bulan']
  deposit_amount decimal(12,2) [default: 0, note: 'Uang jaminan saat masuk']
  status varchar [default: 'active', note: 'Enum: active, ended, cancelled']
  created_at timestamp [default: 'now()']
}

// BILLING & FINANCE (TAGIHAN & KEUANGAN)
Table invoices {
  id uuid [primary key, default: 'gen_random_uuid()']
  tenant_id uuid [not null]
  contract_id uuid [not null]
  billing_month date [not null, note: 'Tagihan untuk periode bulan apa']
  room_fee decimal(12,2) [not null]
  additional_fee decimal(12,2) [default: 0, note: 'Contoh: Tambahan bawa TV/Kulkas']
  penalty_fee decimal(12,2) [default: 0, note: 'Denda keterlambatan bayar']
  total_amount decimal(12,2) [not null]
  due_date date [not null]
  status varchar [default: 'unpaid', note: 'Enum: unpaid, paid, overdue']
  payment_proof_url text [note: 'Foto bukti transfer jika manual']
  paid_at timestamp
  created_at timestamp [default: 'now()']
}

// OPERATIONS (KELUHAN & MAINTENANCE)
Table maintenance_tickets {
  id uuid [primary key, default: 'gen_random_uuid()']
  tenant_id uuid [not null]
  room_id uuid [not null]
  renter_id uuid [not null]
  issue_category varchar [not null, note: 'Enum: Listrik, Air, AC, Kunci, Lainnya']
  description text [not null]
  photo_url text [note: 'Bukti kerusakan']
  status varchar [default: 'pending', note: 'Enum: pending, in_progress, resolved']
  created_at timestamp [default: 'now()']
}

// RELATIONSHIPS
Ref: properties.tenant_id > tenants.id
Ref: rooms.property_id > properties.id
Ref: rooms.tenant_id > tenants.id
Ref: renters.tenant_id > tenants.id
Ref: contracts.tenant_id > tenants.id
Ref: contracts.room_id > rooms.id
Ref: contracts.renter_id > renters.id
Ref: invoices.tenant_id > tenants.id
Ref: invoices.contract_id > contracts.id
Ref: maintenance_tickets.tenant_id > tenants.id
Ref: maintenance_tickets.room_id > rooms.id
Ref: maintenance_tickets.renter_id > renters.id
```
