"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAccountAction,
  type DeleteAccountActionState,
} from "../actions";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";

const initialState: DeleteAccountActionState = {
  ok: false,
  message: "",
};

export default function DeleteAccountButton() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteAccountAction,
    initialState,
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (state.ok) {
      router.replace("/logout");
    }
  }, [router, state.ok]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isConfirmed) {
      return;
    }

    event.preventDefault();

    const confirmed = window.confirm(
      "계정 탈퇴를 진행할까요? 저장한 프롬프트와 SafeCheck 기록이 삭제되며 되돌릴 수 없습니다.",
    );

    if (!confirmed) {
      return;
    }

    setIsConfirmed(true);

    requestAnimationFrame(() => {
      event.currentTarget.requestSubmit();
    });
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-3">
      {state.message && !state.ok ? <ErrorMessage message={state.message} /> : null}

      <Button
        type="submit"
        variant="secondary"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "탈퇴 처리 중" : "계정 탈퇴"}
      </Button>
    </form>
  );
}