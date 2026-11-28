import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatDate } from "@/lib/utils";

export interface AdminNotification {
  id: string;
  type: "payment" | "maintenance" | "overdue" | "system";
  title: string;
  message: string;
  time: string;
  link: string;
  badge?: string;
  isActionable?: boolean;
}

export async function getAdminNotifications(tenantId: string): Promise<AdminNotification[]> {
  const supabase = await createClient();
  const notifications: AdminNotification[] = [];

  // 1. Tagihan yang bukti bayarnya sudah diunggah dan butuh verifikasi pemilik
  const { data: proofInvoices } = await supabase
    .from("invoices")
    .select(`
      id,
      total_amount,
      created_at,
      payment_proof_url,
      contracts (
        rooms (room_number),
        renters (full_name)
      )
    `)
    .eq("tenant_id", tenantId)
    .eq("status", "unpaid")
    .not("payment_proof_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (proofInvoices) {
    for (const inv of proofInvoices as any[]) {
      const roomNum = inv.contracts?.rooms?.room_number ? `Kamar ${inv.contracts.rooms.room_number}` : "Kamar";
      const renterName = inv.contracts?.renters?.full_name || "Anak kos";
      notifications.push({
        id: `proof-${inv.id}`,
        type: "payment",
        title: "Bukti Transfer Perlu Diverifikasi",
        message: `${renterName} (${roomNum}) telah mengunggah bukti bayar ${formatRupiah(inv.total_amount)}. Silakan tinjau dan konfirmasi.`,
        time: formatDate(inv.created_at),
        link: "/invoices",
        badge: "Verifikasi Bayar",
        isActionable: true,
      });
    }
  }

  // 2. Tiket perbaikan fasilitas berstatus 'pending'
  const { data: pendingTickets } = await supabase
    .from("maintenance_tickets")
    .select(`
      id,
      issue_category,
      description,
      created_at,
      rooms (room_number),
      renters (full_name)
    `)
    .eq("tenant_id", tenantId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  if (pendingTickets) {
    for (const t of pendingTickets as any[]) {
      const roomNum = t.rooms?.room_number ? `Kamar ${t.rooms.room_number}` : "Unit";
      const renterName = t.renters?.full_name || "Penghuni";
      notifications.push({
        id: `ticket-${t.id}`,
        type: "maintenance",
        title: `Laporan Fasilitas: ${t.issue_category}`,
        message: `${renterName} (${roomNum}) melaporkan: "${t.description}". Butuh tindak lanjut teknisi.`,
        time: formatDate(t.created_at),
        link: "/maintenance",
        badge: "Keluhan Baru",
        isActionable: true,
      });
    }
  }

  // 3. Tagihan berstatus 'overdue' (terlambat)
  const { data: overdueInvoices } = await supabase
    .from("invoices")
    .select(`
      id,
      total_amount,
      due_date,
      created_at,
      contracts (
        rooms (room_number),
        renters (full_name)
      )
    `)
    .eq("tenant_id", tenantId)
    .eq("status", "overdue")
    .order("due_date", { ascending: false })
    .limit(5);

  if (overdueInvoices) {
    for (const inv of overdueInvoices as any[]) {
      const roomNum = inv.contracts?.rooms?.room_number ? `Kamar ${inv.contracts.rooms.room_number}` : "Kamar";
      const renterName = inv.contracts?.renters?.full_name || "Anak kos";
      notifications.push({
        id: `overdue-${inv.id}`,
        type: "overdue",
        title: "Tagihan Melewati Jatuh Tempo",
        message: `Tagihan sewa ${roomNum} (${renterName}) sebesar ${formatRupiah(inv.total_amount)} belum lunas.`,
        time: formatDate(inv.due_date),
        link: "/invoices",
        badge: "Terlambat",
        isActionable: true,
      });
    }
  }

  return notifications;
}
