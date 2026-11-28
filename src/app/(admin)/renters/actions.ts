"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Onboard Penghuni Baru sekaligus Kontrak Kamar
 */
export async function onboardRenter(formData: FormData) {
  return createRenterAccount(formData);
}

/**
 * Tambah Akun Anak Kos (dengan atau tanpa penetapan kamar langsung)
 */
export async function createRenterAccount(formData: FormData) {
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

  // Optional contract fields
  const roomId = formData.get("roomId") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const rawDeposit = formData.get("depositAmount")?.toString().replace(/\D/g, "") || "0";
  const depositAmount = Number(rawDeposit) || 0;

  if (!fullName || fullName.trim() === "") {
    return { error: "Nama lengkap anak kos wajib diisi." };
  }

  if (!whatsappNumber || whatsappNumber.trim() === "") {
    return { error: "Nomor WhatsApp / HP akun wajib diisi." };
  }

  // Check if room is selected and available
  if (roomId && roomId !== "none" && roomId.trim() !== "") {
    if (!startDate) {
      return { error: "Tanggal mulai sewa wajib ditentukan jika kamar dipilih." };
    }

    const { data: room, error: roomError } = await (supabase.from("rooms") as any)
      .select("status, room_number, base_price")
      .eq("id", roomId)
      .eq("tenant_id", user.id)
      .single();

    if (roomError || !room) {
      return { error: "Kamar yang dipilih tidak ditemukan." };
    }

    if (room.status === "occupied") {
      return { error: `Kamar ${room.room_number} saat ini sudah terisi penghuni lain.` };
    }
  }

  // Upload KTP photo to private storage if provided
  let idCardUrl: string | null = null;
  if (ktpFile && ktpFile.size > 0) {
    const fileExt = ktpFile.name.split(".").pop();
    const cleanFileName = `${user.id}/${Date.now()}_ktp.${fileExt}`;

    const adminSupabase = createAdminClient();
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("ktp-documents")
      .upload(cleanFileName, ktpFile, {
        contentType: ktpFile.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("KTP upload error:", uploadError.message);
      return { error: `Gagal mengunggah foto KTP: ${uploadError.message}` };
    } else {
      idCardUrl = uploadData.path;
    }
  }

  // Insert into public.renters
  const { data: renter, error: renterError } = await (supabase.from("renters") as any)
    .insert({
      tenant_id: user.id,
      full_name: fullName.trim(),
      whatsapp_number: whatsappNumber.trim(),
      id_card_number: idCardNumber ? idCardNumber.trim() : null,
      id_card_url: idCardUrl,
      emergency_contact: emergencyContact ? emergencyContact.trim() : null,
    })
    .select("id, full_name, whatsapp_number")
    .single();

  if (renterError || !renter) {
    return { error: `Gagal mendaftarkan akun anak kos: ${renterError?.message}` };
  }

  // If roomId is assigned, create the contract
  if (roomId && roomId !== "none" && roomId.trim() !== "" && startDate) {
    const { data: contract, error: contractError } = await (supabase.from("contracts") as any)
      .insert({
        tenant_id: user.id,
        room_id: roomId,
        renter_id: renter.id,
        start_date: startDate,
        end_date: endDate || null,
        deposit_amount: depositAmount,
        status: "active",
      })
      .select("id")
      .single();

    if (contractError || !contract) {
      return { error: `Akun dibuat, tetapi gagal membuat kontrak sewa: ${contractError?.message}` };
    }

    // Update room status to occupied
    await (supabase.from("rooms") as any)
      .update({ status: "occupied" })
      .eq("id", roomId)
      .eq("tenant_id", user.id);

    // Pengaturan Waktu & Jadwal Tagihan Pertama yang Ditetapkan Pemilik
    const firstInvoiceDueDate = (formData.get("firstInvoiceDueDate") as string) || startDate;
    const generateFirstInvoice = 
      formData.get("generateFirstInvoice") === "on" || 
      formData.get("generateFirstInvoice") === "true";

    if (generateFirstInvoice && contract) {
      const { data: roomData } = await (supabase.from("rooms") as any)
        .select("base_price")
        .eq("id", roomId)
        .single();

      const baseRoomPrice = Number(roomData?.base_price) || 0;
      const billingMonth = `${startDate.slice(0, 7)}-01`;

      // Opsi 3: Deposit / Uang Muka di awal otomatis memotong tagihan sewa bulan pertama
      const roomFee = depositAmount > 0 
        ? Math.max(0, baseRoomPrice - depositAmount) 
        : baseRoomPrice;
      const additionalFee = 0;
      const totalAmount = roomFee;

      const { error: invoiceError } = await (supabase.from("invoices") as any).insert({
        tenant_id: user.id,
        contract_id: contract.id,
        billing_month: billingMonth,
        room_fee: roomFee,
        additional_fee: additionalFee,
        penalty_fee: 0,
        total_amount: totalAmount,
        due_date: firstInvoiceDueDate,
        status: "unpaid",
      });

      if (invoiceError) {
        console.warn("Gagal menerbitkan tagihan pertama otomatis:", invoiceError.message);
      }
    }
  }

  revalidatePath("/invoices");
  revalidatePath("/renters");
  revalidatePath("/rooms");
  revalidatePath("/dashboard");
  return {
    success: true,
    renter: {
      id: renter.id,
      fullName: renter.full_name || fullName.trim(),
      whatsappNumber: renter.whatsapp_number || whatsappNumber.trim(),
    }
  };
}

/**
 * Edit / Update Akun Anak Kos
 */
export async function updateRenterAccount(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const renterId = formData.get("renterId") as string;
  const fullName = formData.get("fullName") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const idCardNumber = formData.get("idCardNumber") as string;
  const emergencyContact = formData.get("emergencyContact") as string;
  const ktpFile = formData.get("ktpFile") as File | null;

  if (!renterId) {
    return { error: "ID Akun anak kos tidak ditemukan." };
  }

  if (!fullName || fullName.trim() === "") {
    return { error: "Nama lengkap anak kos wajib diisi." };
  }

  if (!whatsappNumber || whatsappNumber.trim() === "") {
    return { error: "Nomor WhatsApp / HP wajib diisi." };
  }

  const updateData: any = {
    full_name: fullName.trim(),
    whatsapp_number: whatsappNumber.trim(),
    id_card_number: idCardNumber ? idCardNumber.trim() : null,
    emergency_contact: emergencyContact ? emergencyContact.trim() : null,
  };

  // Upload new KTP photo if provided
  if (ktpFile && ktpFile.size > 0) {
    const fileExt = ktpFile.name.split(".").pop();
    const cleanFileName = `${user.id}/${Date.now()}_ktp.${fileExt}`;

    const adminSupabase = createAdminClient();
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("ktp-documents")
      .upload(cleanFileName, ktpFile, {
        contentType: ktpFile.type,
        upsert: true,
      });

    if (!uploadError && uploadData) {
      updateData.id_card_url = uploadData.path;
    } else if (uploadError) {
      console.error("Update KTP upload error:", uploadError.message);
      return { error: `Gagal mengunggah foto KTP baru: ${uploadError.message}` };
    }
  }

  const { error: updateError } = await (supabase.from("renters") as any)
    .update(updateData)
    .eq("id", renterId)
    .eq("tenant_id", user.id);

  if (updateError) {
    return { error: `Gagal memperbarui akun anak kos: ${updateError.message}` };
  }

  revalidatePath("/renters");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Hapus Akun Anak Kos (hanya jika tidak ada kontrak aktif)
 */
export async function deleteRenterAccount(renterId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // 1. Cek apakah ada kontrak aktif
  const { data: activeContracts } = await (supabase.from("contracts") as any)
    .select("id")
    .eq("renter_id", renterId)
    .eq("tenant_id", user.id)
    .eq("status", "active");

  if (activeContracts && activeContracts.length > 0) {
    return {
      error:
        "Akun anak kos ini masih memiliki kontrak sewa kamar aktif. Selesaikan kontrak sewa terlebih dahulu sebelum menghapus akun.",
    };
  }

  // 2. Ambil info KTP penghuni untuk membersihkan file di storage jika ada
  const { data: renterData } = await (supabase.from("renters") as any)
    .select("id_card_url")
    .eq("id", renterId)
    .eq("tenant_id", user.id)
    .single();

  // 3. Hapus tiket keluhan / maintenance yang terkait dengan penghuni ini (karena FK ON DELETE RESTRICT)
  const { error: ticketDeleteError } = await (supabase.from("maintenance_tickets") as any)
    .delete()
    .eq("renter_id", renterId)
    .eq("tenant_id", user.id);

  if (ticketDeleteError) {
    return { error: `Gagal membersihkan riwayat keluhan penghuni: ${ticketDeleteError.message}` };
  }

  // 4. Hapus riwayat kontrak yang sudah selesai / berakhir (karena FK ON DELETE RESTRICT)
  // Invoice yang terhubung ke kontrak tersebut otomatis terhapus via ON DELETE CASCADE
  const { error: contractDeleteError } = await (supabase.from("contracts") as any)
    .delete()
    .eq("renter_id", renterId)
    .eq("tenant_id", user.id);

  if (contractDeleteError) {
    return { error: `Gagal membersihkan riwayat kontrak sewa: ${contractDeleteError.message}` };
  }

  // 5. Hapus data penghuni dari tabel renters
  const { error } = await (supabase.from("renters") as any)
    .delete()
    .eq("id", renterId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: `Gagal menghapus akun: ${error.message}` };
  }

  // 6. Hapus dokumen KTP dari storage privat jika ada
  if (renterData?.id_card_url) {
    await supabase.storage
      .from("ktp-documents")
      .remove([renterData.id_card_url]);
  }

  revalidatePath("/renters");
  revalidatePath("/invoices");
  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Selesaikan / Terminasi Kontrak Sewa Kamar
 */
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

/**
 * Ambil Temporary Signed URL untuk Dokumen KTP Privat
 */
export async function getKtpSignedUrl(storagePath: string) {
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

  // Verifikasi kepemilikan data penghuni oleh landlord
  const { data: renter } = await (supabase.from("renters") as any)
    .select("id")
    .eq("tenant_id", user.id)
    .eq("id_card_url", storagePath)
    .maybeSingle();

  if (!renter) {
    return { error: "Akses ditolak atau dokumen KTP tidak ditemukan pada akun Anda." };
  }

  const adminSupabase = createAdminClient();
  // Generate temporary 1-hour signed URL for private bucket
  const { data, error } = await adminSupabase.storage
    .from("ktp-documents")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: "Gagal mengambil foto KTP privat." };
  }

  return { signedUrl: data.signedUrl };
}
