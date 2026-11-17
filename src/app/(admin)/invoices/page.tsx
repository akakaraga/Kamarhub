import { createClient } from "@/lib/supabase/server";
import { InvoiceList, InvoiceWithDetails } from "@/components/admin/invoice-list";
import { ActiveContractOption } from "@/components/admin/create-invoice-modal";
import { Tables } from "@/types/database";

export default async function InvoicesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch tenant profile for company name
  const { data: tenant } = await (supabase.from("tenants") as any)
    .select("company_name")
    .eq("id", user?.id)
    .single();

  // Fetch properties for filter
  const { data: rawProps } = await (supabase.from("properties") as any)
    .select("*")
    .order("name", { ascending: true });

  const properties = (rawProps || []) as Tables<"properties">[];

  // Fetch invoices with contract, renter, room, and property details
  const { data: rawInvoices } = await (supabase.from("invoices") as any)
    .select(`
      *,
      contracts (
        id,
        room_id,
        renter_id,
        start_date,
        renters (
          full_name,
          whatsapp_number
        ),
        rooms (
          room_number,
          room_type,
          base_price,
          properties (
            id,
            name,
            address
          )
        )
      )
    `)
    .order("due_date", { ascending: false });

  // Fetch active contracts for manual invoice creation
  const { data: rawContracts } = await (supabase.from("contracts") as any)
    .select(`
      id,
      room_id,
      renter_id,
      start_date,
      renters (
        full_name,
        whatsapp_number
      ),
      rooms (
        room_number,
        base_price,
        properties (
          name
        )
      )
    `)
    .eq("status", "active")
    .order("start_date", { ascending: false });

  const invoices = (rawInvoices || []) as InvoiceWithDetails[];
  const activeContracts = (rawContracts || []) as ActiveContractOption[];

  return (
    <InvoiceList
      invoices={invoices}
      activeContracts={activeContracts}
      properties={properties}
      companyName={tenant?.company_name || undefined}
    />
  );
}
