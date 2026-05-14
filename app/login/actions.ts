"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

function getRequestOrigin() {
  const requestHeaders = headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "https://promptlab.io.kr";
  }

  return `${protocol}://${host}`;
}

export async function signInWithGoogleAction() {
  const supabase = await createSupabaseServerClient();
  const origin = getRequestOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=google_oauth_failed");
  }

  redirect(data.url);
}

export async function signInWithKakaoAction() {
  const supabase = await createSupabaseServerClient();
  const origin = getRequestOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=kakao_oauth_failed");
  }

  redirect(data.url);
}