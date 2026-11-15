import { createClient } from "@/lib/supabase/server";
import { RoomList, RoomWithDetails } from "@/components/admin/room-list";
import { Tables } from "@/types/database";

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const supabase = await createClient();
  const { property: initialPropertyId } = await searchParams;

  // Fetch properties
  const { data: rawProps } = await supabase
    .from("properties")
    .select("*")
    .order("name", { ascending: true });

  const properties = (rawProps || []) as Tables<"properties">[];

  // Fetch rooms with property names
  const { data: rawRooms } = await supabase
    .from("rooms")
    .select("*, properties(name)")
    .order("room_number", { ascending: true });

  // Fetch active contracts to map renter names
  const { data: rawContracts } = await supabase
    .from("contracts")
    .select("room_id, renters(full_name)")
    .eq("status", "active");

  const contractMap = new Map<string, string>();
  if (rawContracts) {
    for (const c of rawContracts as any[]) {
      if (c.room_id && c.renters?.full_name) {
        contractMap.set(c.room_id, c.renters.full_name);
      }
    }
  }

  const rooms: RoomWithDetails[] = ((rawRooms || []) as any[]).map((r) => ({
    ...r,
    activeRenterName: contractMap.get(r.id) || null,
  }));

  return (
    <RoomList
      rooms={rooms}
      properties={properties}
      initialPropertyId={initialPropertyId}
    />
  );
}
