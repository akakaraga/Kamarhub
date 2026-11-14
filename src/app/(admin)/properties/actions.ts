"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProperty(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  if (!name || name.trim() === "") {
    return { error: "Nama properti kos wajib diisi." };
  }

  const { error } = await (supabase.from("properties") as any).insert({
    tenant_id: user.id,
    name: name.trim(),
    address: address ? address.trim() : null,
    total_rooms: 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  if (!name || name.trim() === "") {
    return { error: "Nama properti kos wajib diisi." };
  }

  const { error } = await (supabase.from("properties") as any)
    .update({
      name: name.trim(),
      address: address ? address.trim() : null,
    })
    .eq("id", id)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // Check if there are active rooms
  const { data: rooms } = await (supabase.from("rooms") as any)
    .select("id")
    .eq("property_id", id)
    .eq("tenant_id", user.id);

  if (rooms && rooms.length > 0) {
    return {
      error: `Gedung ini masih memiliki ${rooms.length} kamar. Silakan hapus atau pindahkan kamar terlebih dahulu.`,
    };
  }

  const { error } = await (supabase.from("properties") as any)
    .delete()
    .eq("id", id)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}
