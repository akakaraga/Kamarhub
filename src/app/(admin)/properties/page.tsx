import { createClient } from "@/lib/supabase/server";
import { PropertyList } from "@/components/admin/property-list";
import { Tables } from "@/types/database";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: rawProps } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  const properties = (rawProps || []) as Tables<"properties">[];

  return <PropertyList properties={properties} />;
}
