"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function onboardRenter(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  // Renter profile fields
  const fullName = formData.get("fullName") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const idCardNumber = formData.get("idCardNumber") as string;
  const emergencyContact = formData.get("emergencyContact") as string;
  const ktpFile = formData.get("ktpFile") as File | null;

  // Contract fields
  const roomId = formData.get("roomId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const depositAmount = Number(formData.get("depositAmount")) || 0;

  if (!fullName || fullName.trim() === "") {
    return { error: "Nama lengkap penghuni wajib diisi." };
  }

  if (!whatsappNumber || whatsappNumber.trim() === "") {
    return { error: "Nomor WhatsApp wajib diisi." };
  }

  if (!roomId) {
    return { error: "Pilih unit kamar untuk penghuni ini." };
  }

  if (!startDate) {
    return { error: "Tanggal mulai sewa wajib ditentukan." };
  }

  // 1. Check if room is available
  const { data: room, error: roomError } = await (supabase.from("rooms") as any)
    .select("status, room_number")
    .eq("id", roomId)
    .eq("tenant_id", user.id)
    .single();

  if (roomError || !room) {
    return { error: "Kamar yang dipilih tidak ditemukan." };
  }

  if (room.status === "occupied") {
    return { error: `Kamar ${room.room_number} saat ini sudah terisi penghuni lain.` };
  }

  // 2. Upload KTP photo to private storage if provided
  let idCardUrl: string | null = null;
  if (ktpFile && ktpFile.size > 0) {
    const fileExt = ktpFile.name.split(".").pop();
    const cleanFileName = `${user.id}/${Date.now()}_ktp.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ktp-documents")
      .upload(cleanFileName, ktpFile, {
        contentType: ktpFile.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn("KTP upload warning:", uploadError.message);
      // We still allow onboarding even if storage bucket is not configured yet
    } else {
      idCardUrl = uploadData.path;
    }
  }

  // 3. Insert into public.renters
  const { data: renter, error: renterError } = await (supabase.from("renters") as any)
    .insert({
      tenant_id: user.id,
      full_name: fullName.trim(),
      whatsapp_number: whatsappNumber.trim(),
      id_card_number: idCardNumber ? idCardNumber.trim() : null,
      id_card_url: idCardUrl,
      emergency_contact: emergencyContact ? emergencyContact.trim() : null,
    })
    .select("id")
    .single();

  if (renterError || !renter) {
    return { error: `Gagal mendaftarkan data penghuni: ${renterError?.message}` };
  }

  // 4. Insert into public.contracts
  const { error: contractError } = await (supabase.from("contracts") as any).insert({
    tenant_id: user.id,
    room_id: roomId,
    renter_id: renter.id,
    start_date: startDate,
    end_date: endDate || null,
    deposit_amount: depositAmount,
    status: "active",
  });

  if (contractError) {
    return { error: `Gagal membuat kontrak sewa: ${contractError.message}` };
  }

  // 5. Update room status to occupied
  await (supabase.from("rooms") as any)
    .update({ status: "occupied" })
    .eq("id", roomId)
    .eq("tenant_id", user.id);

  revalidatePath("/renters");
  revalidatePath("/rooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function terminateContract(contractId: string, roomId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // Update contract status to ended
  const { error: contractError } = await (supabase.from("contracts") as any)
    .update({ status: "ended" })
    .eq("id", contractId)
    .eq("tenant_id", user.id);

  if (contractError) {
    return { error: contractError.message };
  }

  // Update room status back to available
  await (supabase.from("rooms") as any)
    .update({ status: "available" })
    .eq("id", roomId)
    .eq("tenant_id", user.id);

  revalidatePath("/renters");
  revalidatePath("/rooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getKtpSignedUrl(storagePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // Generate a temporary 1-hour signed URL for private bucket
  const { data, error } = await supabase.storage
    .from("ktp-documents")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: "Gagal mengambil foto KTP privat." };
  }

  return { signedUrl: data.signedUrl };
}
