"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/server/db/supabase-browser";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Input from "@/shared/ui/input";

function getBrowserOrigin() {
  if (typeof window === "undefined") {
    return "https://promptlab.io.kr";
  }

  return window.location.origin;
}

export default function MagicLinkLoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleMagicLinkSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setIsPending(true);

    const supabase = createSupabaseBrowserClient();
    const origin = getBrowserOrigin();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setIsPending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("로그인 링크를 이메일로 보냈습니다. 최신 이메일만 열어주세요.");
  }

  return (
    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">이메일</span>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />
      </label>

      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}

      {message ? (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "전송 중" : "이메일 로그인 링크 받기"}
      </Button>
    </form>
  );
}