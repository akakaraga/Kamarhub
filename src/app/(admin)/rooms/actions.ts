"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RoomStatus } from "@/types/database";

export async function createRoom(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const propertyId = formData.get("propertyId") as string;
  const roomNumber = formData.get("roomNumber") as string;
  const roomType = formData.get("roomType") as string;
  const basePrice = Number(formData.get("basePrice"));
  const status = (formData.get("status") as RoomStatus) || "available";

  if (!propertyId) {
    return { error: "Gedung properti wajib dipilih." };
  }

  if (!roomNumber || roomNumber.trim() === "") {
    return { error: "Nomor kamar wajib diisi." };
  }

  if (isNaN(basePrice) || basePrice < 0) {
    return { error: "Harga sewa dasar tidak valid." };
  }

  const { error } = await (supabase.from("rooms") as any).insert({
    property_id: propertyId,
    tenant_id: user.id,
    room_number: roomNumber.trim(),
    room_type: roomType ? roomType.trim() : "Standard",
    base_price: basePrice,
    status: status,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: `Nomor kamar "${roomNumber}" sudah ada di gedung ini.` };
    }
    return { error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateRoom(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const propertyId = formData.get("propertyId") as string;
  const roomNumber = formData.get("roomNumber") as string;
  const roomType = formData.get("roomType") as string;
  const basePrice = Number(formData.get("basePrice"));
  const status = formData.get("status") as RoomStatus;

  if (!roomNumber || roomNumber.trim() === "") {
    return { error: "Nomor kamar wajib diisi." };
  }

  if (isNaN(basePrice) || basePrice < 0) {
    return { error: "Harga sewa dasar tidak valid." };
  }

  const { error } = await (supabase.from("rooms") as any)
    .update({
      property_id: propertyId,
      room_number: roomNumber.trim(),
      room_type: roomType ? roomType.trim() : "Standard",
      base_price: basePrice,
      status: status,
    })
    .eq("id", id)
    .eq("tenant_id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: `Nomor kamar "${roomNumber}" sudah terdaftar di gedung ini.` };
    }
    return { error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateRoomStatus(id: string, status: RoomStatus) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const { error } = await (supabase.from("rooms") as any)
    .update({ status })
    .eq("id", id)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRoom(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // Check if room has active contract
  const { data: activeContract } = await (supabase.from("contracts") as any)
    .select("id")
    .eq("room_id", id)
    .eq("status", "active")
    .maybeSingle();

  if (activeContract) {
    return {
      error: "Kamar tidak dapat dihapus karena masih memiliki kontrak sewa aktif.",
    };
  }

  const { error } = await (supabase.from("rooms") as any)
    .delete()
    .eq("id", id)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}
