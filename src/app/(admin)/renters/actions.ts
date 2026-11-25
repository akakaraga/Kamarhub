"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  // Optional contract & billing fields
  const roomId = formData.get("roomId") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const depositAmount = Number(formData.get("depositAmount")) || 0;
  const firstInvoiceDueDate = (formData.get("firstInvoiceDueDate") as string | null) || startDate;
  const generateFirstInvoice = formData.get("generateFirstInvoice") !== "false" && formData.get("generateFirstInvoice") !== "off";
  const initialAdditionalFee = Number(formData.get("initialAdditionalFee")) || 0;

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
  }

  // Upload KTP photo to private storage if provided
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

    // If initial invoice generation is enabled, create first invoice with the owner-configured due date
    if (generateFirstInvoice && firstInvoiceDueDate) {
      const { data: roomData } = await (supabase.from("rooms") as any)
        .select("base_price")
        .eq("id", roomId)
        .eq("tenant_id", user.id)
        .single();

      const roomFee = roomData ? Number(roomData.base_price) : 0;
      const totalAmount = roomFee + initialAdditionalFee;
      const billingMonth = `${startDate.slice(0, 7)}-01`;

      const { error: invoiceError } = await (supabase.from("invoices") as any).insert({
        tenant_id: user.id,
        contract_id: contract.id,
        billing_month: billingMonth,
        room_fee: roomFee,
        additional_fee: initialAdditionalFee,
        penalty_fee: 0,
        total_amount: totalAmount,
        due_date: firstInvoiceDueDate,
        status: "unpaid",
      });

      if (invoiceError) {
        console.warn("Initial invoice creation warning:", invoiceError.message);
      }
    }
  }

  revalidatePath("/renters");
  revalidatePath("/rooms");
  revalidatePath("/invoices");
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

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ktp-documents")
      .upload(cleanFileName, ktpFile, {
        contentType: ktpFile.type,
        upsert: true,
      });

    if (!uploadError && uploadData) {
      updateData.id_card_url = uploadData.path;
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

  // Cek apakah ada kontrak aktif
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

  const { error } = await (supabase.from("renters") as any)
    .delete()
    .eq("id", renterId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: `Gagal menghapus akun: ${error.message}` };
  }

  revalidatePath("/renters");
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

  // Generate temporary 1-hour signed URL for private bucket
  const { data, error } = await supabase.storage
    .from("ktp-documents")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: "Gagal mengambil foto KTP privat." };
  }

  return { signedUrl: data.signedUrl };
}
