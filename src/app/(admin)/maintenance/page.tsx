import { createClient } from "@/lib/supabase/server";
import { MaintenanceList, TicketWithDetails } from "@/components/admin/maintenance-list";
import { Tables } from "@/types/database";

export default async function MaintenancePage() {
  const supabase = await createClient();

  // Fetch all maintenance tickets with room, property & renter details
  const { data: rawTickets } = await (supabase.from("maintenance_tickets") as any)
    .select(`
      *,
      rooms (
        room_number,
        properties (
          name
        )
      ),
      renters (
        full_name,
        whatsapp_number
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch rooms for admin ticket creation
  const { data: rawRooms } = await (supabase.from("rooms") as any)
    .select("*")
    .order("room_number", { ascending: true });

  const tickets = (rawTickets || []) as TicketWithDetails[];
  const rooms = (rawRooms || []) as Tables<"rooms">[];

  return <MaintenanceList tickets={tickets} rooms={rooms} />;
}
