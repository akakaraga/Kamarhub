"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Otomatis konfirmasi email jika akun belum terverifikasi di Supabase Auth
  if (error && error.message.toLowerCase().includes("email not confirmed")) {
    try {
      const adminClient = createAdminClient();
      const { data: userList } = await adminClient.auth.admin.listUsers();
      const targetUser = userList?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (targetUser) {
        await adminClient.auth.admin.updateUserById(targetUser.id, {
          email_confirm: true,
        });

        // Coba login kembali setelah dikonfirmasi
        const retry = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = retry.error;
      }
    } catch (e) {
      console.warn("Auto-confirm on login error:", e);
    }
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;
  const phone = formData.get("phone") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        company_name: companyName,
        phone_number: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const adminClient = createAdminClient();

    // 1. Otomatis konfirmasi email agar tidak terblokir "Email not confirmed"
    await adminClient.auth.admin.updateUserById(data.user.id, {
      email_confirm: true,
    });

    // 2. Upsert profil ke public.tenants menggunakan admin client
    await (adminClient.from("tenants") as any).upsert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      company_name: companyName || null,
      phone_number: phone || null,
      subscription_plan: "free",
    });

    // 3. Login otomatis untuk membuat sesi aktif pada cookie browser
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
