"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MaintenanceCategory, MaintenanceStatus } from "@/types/database";

export async function updateTicketStatus(ticketId: string, status: MaintenanceStatus) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const { error } = await (supabase.from("maintenance_tickets") as any)
    .update({ status })
    .eq("id", ticketId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  revalidatePath("/portal/dashboard");
  return { success: true };
}

export async function createAdminTicket(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const roomId = formData.get("roomId") as string;
  const category = formData.get("category") as MaintenanceCategory;
  const description = (formData.get("description") as string)?.trim();

  if (!roomId) {
    return { error: "Unit kamar wajib dipilih." };
  }

  if (!category) {
    return { error: "Kategori kendala wajib dipilih." };
  }

  if (!description) {
    return { error: "Deskripsi perbaikan wajib diisi." };
  }

  // Cari renter aktif untuk kamar tersebut jika ada
  const { data: activeContract } = await (supabase.from("contracts") as any)
    .select("renter_id")
    .eq("room_id", roomId)
    .eq("status", "active")
    .maybeSingle();

  const renterId = activeContract?.renter_id || null;

  const { error } = await (supabase.from("maintenance_tickets") as any).insert({
    tenant_id: user.id,
    room_id: roomId,
    renter_id: renterId,
    issue_category: category,
    description: description,
    status: "pending",
  });

  if (error) {
    return { error: `Gagal mencatat tiket: ${error.message}` };
  }

  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTicket(ticketId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const { error } = await (supabase.from("maintenance_tickets") as any)
    .delete()
    .eq("id", ticketId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getMaintenancePhotoSignedUrl(storagePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  if (storagePath.startsWith("http")) {
    return { signedUrl: storagePath };
  }

  // Verifikasi kepemilikan tiket oleh landlord
  const { data: ticket } = await (supabase.from("maintenance_tickets") as any)
    .select("id")
    .eq("tenant_id", user.id)
    .eq("photo_url", storagePath)
    .maybeSingle();

  if (!ticket) {
    return { error: "Akses ditolak atau foto kerusakan tidak ditemukan pada akun Anda." };
  }

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase.storage
    .from("maintenance-photos")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: "Gagal mengambil foto kerusakan." };
  }

  return { signedUrl: data.signedUrl };
}
