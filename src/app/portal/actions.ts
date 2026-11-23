"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Helper client dengan Service Role Key untuk bypass RLS pada portal penghuni berbasis WhatsApp
function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceKey);
}

/**
 * Login Penghuni via Nomor WhatsApp (Akses Tanpa Sandi / Passwordless)
 */
export async function loginRenter(formData: FormData) {
  const phone = (formData.get("phone") as string)?.trim();

  if (!phone) {
    return { error: "Nomor WhatsApp wajib diisi." };
  }

  // Normalisasi nomor telepon
  const rawClean = phone.replace(/[^0-9]/g, "");
  const normalizedVariants = [
    phone,
    rawClean,
    rawClean.startsWith("0") ? "62" + rawClean.slice(1) : "0" + rawClean.slice(2),
  ];

  const supabase = getAdminSupabase();

  // Cari data penghuni di database
  const { data: renters, error } = await supabase
    .from("renters")
    .select("id, full_name, whatsapp_number")
    .in("whatsapp_number", normalizedVariants);

  if (error || !renters || renters.length === 0) {
    return {
      error: "Nomor WhatsApp tidak terdaftar di sistem kos mana pun. Silakan hubungi pengelola kos Anda.",
    };
  }

  const renter = renters[0];

  // Simpan sesi penghuni di cookie HTTP-only aman selama 30 hari
  const cookieStore = await cookies();
  cookieStore.set("kamarhub_renter_id", renter.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
    path: "/",
  });

  redirect("/portal/dashboard");
}

/**
 * Logout Penghuni
 */
export async function logoutRenter() {
  const cookieStore = await cookies();
  cookieStore.delete("kamarhub_renter_id");
  redirect("/portal");
}

/**
 * Unggah Bukti Transfer Pembayaran oleh Penghuni
 */
export async function uploadPaymentProof(formData: FormData) {
  const cookieStore = await cookies();
  const renterId = cookieStore.get("kamarhub_renter_id")?.value;

  if (!renterId) {
    return { error: "Sesi telah berakhir. Silakan masuk kembali." };
  }

  const invoiceId = formData.get("invoiceId") as string;
  const proofFile = formData.get("proofFile") as File | null;

  if (!invoiceId) {
    return { error: "ID Tagihan tidak ditemukan." };
  }

  if (!proofFile || proofFile.size === 0) {
    return { error: "Silakan pilih foto bukti transfer terlebih dahulu." };
  }

  const supabase = getAdminSupabase();

  // 1. Upload ke Supabase Storage bucket payment-proofs
  const fileExt = proofFile.name.split(".").pop() || "jpg";
  const filePath = `receipts/${renterId}/${Date.now()}_proof.${fileExt}`;

  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from("payment-proofs")
    .upload(filePath, proofFile, {
      contentType: proofFile.type,
      upsert: true,
    });

  if (uploadErr) {
    console.error("Upload receipt error:", uploadErr.message);
    return { error: `Gagal mengunggah berkas: ${uploadErr.message}` };
  }

  // 2. Simpan URL bukti transfer di baris invoice terkait
  const { error: updateErr } = await supabase
    .from("invoices")
    .update({
      payment_proof_url: uploadData.path,
    })
    .eq("id", invoiceId);

  if (updateErr) {
    return { error: `Gagal memperbarui status tagihan: ${updateErr.message}` };
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Buat Tiket Laporan Kerusakan (Maintenance Ticket) oleh Penghuni
 */
export async function createMaintenanceTicket(formData: FormData) {
  const cookieStore = await cookies();
  const renterId = cookieStore.get("kamarhub_renter_id")?.value;

  if (!renterId) {
    return { error: "Sesi telah berakhir. Silakan masuk kembali." };
  }

  const category = formData.get("category") as any;
  const description = (formData.get("description") as string)?.trim();
  const photoFile = formData.get("photoFile") as File | null;

  if (!category) {
    return { error: "Pilih kategori kerusakan fasilitas." };
  }

  if (!description) {
    return { error: "Jelaskan permasalahan atau kerusakan yang dialami." };
  }

  const supabase = getAdminSupabase();

  // Ambil data kontrak aktif untuk mendapatkan tenant_id dan room_id
  const { data: contract, error: contractErr } = await supabase
    .from("contracts")
    .select("tenant_id, room_id")
    .eq("renter_id", renterId)
    .eq("status", "active")
    .maybeSingle();

  if (contractErr || !contract) {
    return { error: "Tidak ditemukan kontrak sewa aktif untuk akun Anda." };
  }

  // Upload foto kerusakan jika ada
  let photoUrl: string | null = null;
  if (photoFile && photoFile.size > 0) {
    const fileExt = photoFile.name.split(".").pop() || "jpg";
    const filePath = `damage/${renterId}/${Date.now()}_damage.${fileExt}`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from("maintenance-photos")
      .upload(filePath, photoFile, {
        contentType: photoFile.type,
        upsert: true,
      });

    if (!uploadErr && uploadData) {
      photoUrl = uploadData.path;
    }
  }

  // Buat baris tiket pemeliharaan baru
  const { error: insertErr } = await supabase.from("maintenance_tickets").insert({
    tenant_id: contract.tenant_id,
    room_id: contract.room_id,
    renter_id: renterId,
    issue_category: category,
    description: description,
    photo_url: photoUrl,
    status: "pending",
  });

  if (insertErr) {
    return { error: `Gagal membuat tiket keluhan: ${insertErr.message}` };
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}
