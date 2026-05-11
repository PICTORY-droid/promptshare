"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

const SITE_URL = "https://promptlab.io.kr";

export async function signInWithGoogleAction() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=google_oauth_failed");
  }

  redirect(data.url);
}
