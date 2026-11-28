import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { getAdminNotifications } from "@/lib/notifications";
import { Tables } from "@/types/database";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch tenant profile & active notifications in parallel
  const [rawTenantResult, notifications] = await Promise.all([
    supabase.from("tenants").select("*").eq("id", user.id).single(),
    getAdminNotifications(user.id),
  ]);

  const tenant = rawTenantResult.data as Tables<"tenants"> | null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        companyName={tenant?.company_name || "KamarHub Property"}
        subscriptionPlan={tenant?.subscription_plan || "free"}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          userEmail={user.email}
          userName={tenant?.full_name || user.email?.split("@")[0]}
          companyName={tenant?.company_name || undefined}
          notifications={notifications}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
