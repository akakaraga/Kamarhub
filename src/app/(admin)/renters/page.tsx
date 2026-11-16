import { createClient } from "@/lib/supabase/server";
import { RenterList, RenterWithContract } from "@/components/admin/renter-list";

export default async function RentersPage() {
  const supabase = await createClient();

  // Fetch renters with their contracts and room info
  const { data: rawRenters } = await supabase
    .from("renters")
    .select(`
      *,
      contracts (
        id,
        room_id,
        start_date,
        end_date,
        deposit_amount,
        status,
        rooms (
          room_number,
          room_type,
          properties (
            name
          )
        )
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch available rooms for onboarding dropdown
  const { data: rawAvailableRooms } = await supabase
    .from("rooms")
    .select("*, properties(name)")
    .eq("status", "available")
    .order("room_number", { ascending: true });

  const renters = (rawRenters || []) as RenterWithContract[];
  const availableRooms = (rawAvailableRooms || []) as any[];

  return <RenterList renters={renters} availableRooms={availableRooms} />;
}
