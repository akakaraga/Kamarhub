import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Cron Job: Auto-Invoicing Engine
 * Berjalan otomatis setiap hari pukul 00:00 (Vercel Cron / Inngest / External Trigger)
 * Mengecek kontrak aktif dan membuat invoice H-7 sebelum siklus jatuh tempo
 */

export async function GET(request: NextRequest) {
  // Verifikasi Cron Secret opsional
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Gunakan Supabase Client dengan Service Role Key untuk operasi background multi-tenant
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, serviceKey);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based

  // Periode bulan berjalan format YYYY-MM-01
  const billingMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;

  // 1. Ambil semua kontrak sewa yang aktif
  const { data: activeContracts, error: contractErr } = await supabase
    .from("contracts")
    .select(`
      id,
      tenant_id,
      room_id,
      renter_id,
      start_date,
      end_date,
      status,
      rooms (
        base_price,
        room_number
      )
    `)
    .eq("status", "active");

  if (contractErr) {
    return NextResponse.json({ error: contractErr.message }, { status: 500 });
  }

  const generatedInvoices = [];
  const skippedContracts = [];

  for (const contract of activeContracts || []) {
    // Tentukan hari jatuh tempo berdasarkan tanggal mulai kontrak (misal start_date tgl 15 -> jatuh tempo tgl 15 tiap bulan)
    const startDateObj = new Date(contract.start_date);
    const dueDay = Math.min(startDateObj.getDate(), 28); // amankan max tgl 28

    const dueDateObj = new Date(currentYear, currentMonth, dueDay);
    const dueDateStr = dueDateObj.toISOString().slice(0, 10);

    // Cek apakah invoice bulan berjalan untuk kontrak ini sudah pernah terbuat
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("contract_id", contract.id)
      .eq("billing_month", billingMonthStr)
      .maybeSingle();

    if (existingInvoice) {
      skippedContracts.push({
        contractId: contract.id,
        reason: "Invoice bulan ini sudah terbit",
      });
      continue;
    }

    // Hitung selisih hari menuju jatuh tempo
    const diffTime = dueDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Syarat auto-invoicing: H-7 sebelum jatuh tempo atau jika sudah masuk bulan berjalan
    if (diffDays <= 7) {
      const roomFee = (contract.rooms as any)?.base_price || 0;

      const { data: newInvoice, error: insertErr } = await supabase
        .from("invoices")
        .insert({
          tenant_id: contract.tenant_id,
          contract_id: contract.id,
          billing_month: billingMonthStr,
          room_fee: roomFee,
          additional_fee: 0,
          penalty_fee: 0,
          total_amount: roomFee,
          due_date: dueDateStr,
          status: "unpaid",
        })
        .select("id")
        .single();

      if (!insertErr && newInvoice) {
        generatedInvoices.push({
          invoiceId: newInvoice.id,
          contractId: contract.id,
          dueDate: dueDateStr,
          total: roomFee,
        });
      }
    } else {
      skippedContracts.push({
        contractId: contract.id,
        reason: `Belum H-7 (Sisa ${diffDays} hari)`,
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: `Auto-Invoicing selesai. ${generatedInvoices.length} tagihan baru terbuat.`,
    generatedCount: generatedInvoices.length,
    invoices: generatedInvoices,
    skipped: skippedContracts,
  });
}
