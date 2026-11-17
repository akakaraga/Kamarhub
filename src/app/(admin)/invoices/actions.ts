"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { InvoiceStatus } from "@/types/database";

export async function createManualInvoice(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid. Silakan masuk kembali." };
  }

  const contractId = formData.get("contractId") as string;
  const billingMonth = formData.get("billingMonth") as string;
  const dueDate = formData.get("dueDate") as string;
  const roomFee = Number(formData.get("roomFee"));
  const additionalFee = Number(formData.get("additionalFee")) || 0;
  const penaltyFee = Number(formData.get("penaltyFee")) || 0;

  if (!contractId) {
    return { error: "Kontrak sewa / penghuni wajib dipilih." };
  }

  if (!billingMonth) {
    return { error: "Periode bulan tagihan wajib ditentukan." };
  }

  if (!dueDate) {
    return { error: "Tanggal jatuh tempo tagihan wajib diisi." };
  }

  if (isNaN(roomFee) || roomFee < 0) {
    return { error: "Biaya sewa kamar tidak valid." };
  }

  const totalAmount = roomFee + additionalFee + penaltyFee;

  // Format billing_month as YYYY-MM-01
  const formattedBillingMonth = `${billingMonth.slice(0, 7)}-01`;

  const { error } = await (supabase.from("invoices") as any).insert({
    tenant_id: user.id,
    contract_id: contractId,
    billing_month: formattedBillingMonth,
    due_date: dueDate,
    room_fee: roomFee,
    additional_fee: additionalFee,
    penalty_fee: penaltyFee,
    total_amount: totalAmount,
    status: "unpaid",
  });

  if (error) {
    return { error: `Gagal membuat tagihan: ${error.message}` };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateInvoiceFees(
  invoiceId: string,
  additionalFee: number,
  penaltyFee: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // Fetch current room_fee
  const { data: currentInvoice, error: fetchError } = await (
    supabase.from("invoices") as any
  )
    .select("room_fee")
    .eq("id", invoiceId)
    .eq("tenant_id", user.id)
    .single();

  if (fetchError || !currentInvoice) {
    return { error: "Tagihan tidak ditemukan." };
  }

  const totalAmount =
    Number(currentInvoice.room_fee) + Number(additionalFee) + Number(penaltyFee);

  const { error: updateError } = await (supabase.from("invoices") as any)
    .update({
      additional_fee: additionalFee,
      penalty_fee: penaltyFee,
      total_amount: totalAmount,
    })
    .eq("id", invoiceId)
    .eq("tenant_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function verifyPayment(invoiceId: string, targetStatus: "paid" | "unpaid") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const isPaid = targetStatus === "paid";

  const { error } = await (supabase.from("invoices") as any)
    .update({
      status: targetStatus,
      paid_at: isPaid ? new Date().toISOString() : null,
    })
    .eq("id", invoiceId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: `Gagal memperbarui status: ${error.message}` };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const { error } = await (supabase.from("invoices") as any)
    .delete()
    .eq("id", invoiceId)
    .eq("tenant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getPaymentProofSignedUrl(storagePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: "Gagal mengambil foto bukti transfer privat." };
  }

  return { signedUrl: data.signedUrl };
}
