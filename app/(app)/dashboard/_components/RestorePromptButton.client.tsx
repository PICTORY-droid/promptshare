"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { restorePromptAction, type RestorePromptActionState } from "../actions";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";

const initialState: RestorePromptActionState = {
  ok: true,
  message: "",
};

type RestorePromptButtonProps = {
  promptId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "복구 중" : "보관 취소"}
    </Button>
  );
}

export default function RestorePromptButton({
  promptId,
}: RestorePromptButtonProps) {
  const [state, formAction] = useActionState(restorePromptAction, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="promptId" value={promptId} />
      <SubmitButton />
      {!state.ok ? <ErrorMessage message={state.message} /> : null}
      {state.ok && state.message ? (
        <p className="text-xs text-slate-500">{state.message}</p>
      ) : null}
    </form>
  );
}