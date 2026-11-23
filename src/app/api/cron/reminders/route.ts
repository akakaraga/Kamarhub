import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppMessage, WhatsAppTemplates } from "@/lib/whatsapp";
import { formatRupiah, formatDate } from "@/lib/utils";

/**
 * Cron Job: Auto-Reminder WhatsApp Engine
 * Berjalan harian untuk mengirim pesan pengingat ke WhatsApp anak kos:
 * - H-3 sebelum tanggal jatuh tempo
 * - Hari H jatuh tempo pembayaran
 * - H+1 keterlambatan (Overdue)
 */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, serviceKey);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portalUrl = `${appUrl}/portal`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ambil seluruh tagihan yang belum lunas
  const { data: unpaidInvoices, error: fetchErr } = await supabase
    .from("invoices")
    .select(`
      id,
      total_amount,
      penalty_fee,
      due_date,
      status,
      contracts (
        renters (
          full_name,
          whatsapp_number
        ),
        rooms (
          room_number,
          properties (
            name
          )
        )
      )
    `)
    .in("status", ["unpaid", "overdue"]);

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  const sentLogs = [];

  for (const inv of unpaidInvoices || []) {
    const renter = (inv.contracts as any)?.renters;
    const room = (inv.contracts as any)?.rooms;
    const property = room?.properties;

    if (!renter?.whatsapp_number) continue;

    const dueDate = new Date(inv.due_date);
    dueDate.setHours(0, 0, 0, 0);

    // Selisih hari = dueDate - today
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let templateMessage: string | null = null;
    let reminderType: string = "";

    if (diffDays === 3) {
      // Kasus H-3
      reminderType = "H-3 Reminder";
      templateMessage = WhatsAppTemplates.dueReminderH3({
        renterName: renter.full_name,
        roomNumber: room?.room_number || "-",
        propertyName: property?.name || "Kos",
        amount: formatRupiah(Number(inv.total_amount)),
        dueDate: formatDate(inv.due_date),
        portalUrl,
      });
    } else if (diffDays === 0) {
      // Kasus Hari H
      reminderType = "Due Today";
      templateMessage = WhatsAppTemplates.dueToday({
        renterName: renter.full_name,
        roomNumber: room?.room_number || "-",
        propertyName: property?.name || "Kos",
        amount: formatRupiah(Number(inv.total_amount)),
        portalUrl,
      });
    } else if (diffDays === -1) {
      // Kasus H+1 Keterlambatan
      reminderType = "H+1 Overdue";
      templateMessage = WhatsAppTemplates.overdueH1({
        renterName: renter.full_name,
        roomNumber: room?.room_number || "-",
        propertyName: property?.name || "Kos",
        amount: formatRupiah(Number(inv.total_amount)),
        penalty: Number(inv.penalty_fee) > 0 ? formatRupiah(Number(inv.penalty_fee)) : "",
        portalUrl,
      });

      // Update status invoice menjadi overdue jika belum
      if (inv.status !== "overdue") {
        await supabase.from("invoices").update({ status: "overdue" }).eq("id", inv.id);
      }
    }

    if (templateMessage) {
      const waResult = await sendWhatsAppMessage({
        to: renter.whatsapp_number,
        message: templateMessage,
      });

      sentLogs.push({
        invoiceId: inv.id,
        renter: renter.full_name,
        phone: renter.whatsapp_number,
        type: reminderType,
        success: waResult.success,
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: `Reminder scanner selesai. ${sentLogs.length} pesan diproses.`,
    sentCount: sentLogs.length,
    logs: sentLogs,
  });
}
