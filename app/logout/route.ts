import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  const response = NextResponse.redirect(
    new URL("/login", "https://promptlab.io.kr"),
  );

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}
