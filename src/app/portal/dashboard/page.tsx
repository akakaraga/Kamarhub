import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { RenterPortalView } from "@/components/portal/renter-portal-view";

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceKey);
}

export default async function RenterDashboardPage() {
  const cookieStore = await cookies();
  const renterId = cookieStore.get("kamarhub_renter_id")?.value;

  if (!renterId) {
    redirect("/portal");
  }

  const supabase = getAdminSupabase();

  // 1. Fetch renter info
  const { data: renter, error: renterErr } = await supabase
    .from("renters")
    .select("*")
    .eq("id", renterId)
    .single();

  if (renterErr || !renter) {
    redirect("/portal");
  }

  // 2. Fetch active contract, room, property & tenant info
  const { data: contract } = await supabase
    .from("contracts")
    .select(`
      id,
      room_id,
      tenant_id,
      start_date,
      end_date,
      deposit_amount,
      status,
      rooms (
        id,
        room_number,
        room_type,
        base_price,
        properties (
          id,
          name,
          address
        )
      ),
      tenants (
        id,
        full_name,
        company_name,
        phone_number
      )
    `)
    .eq("renter_id", renterId)
    .eq("status", "active")
    .maybeSingle();

  // 3. Fetch invoices for this contract
  let invoices: any[] = [];
  if (contract?.id) {
    const { data: rawInvoices } = await supabase
      .from("invoices")
      .select("*")
      .eq("contract_id", contract.id)
      .order("due_date", { ascending: false });

    invoices = rawInvoices || [];
  }

  // 4. Fetch maintenance tickets
  const { data: rawTickets } = await supabase
    .from("maintenance_tickets")
    .select("*")
    .eq("renter_id", renterId)
    .order("created_at", { ascending: false });

  const tickets = rawTickets || [];

  return (
    <RenterPortalView
      renter={renter}
      contract={contract}
      invoices={invoices}
      tickets={tickets}
    />
  );
}
