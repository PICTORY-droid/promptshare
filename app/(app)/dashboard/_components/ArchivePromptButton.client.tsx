"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { archivePromptAction, type ArchivePromptActionState } from "../actions";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";

const initialState: ArchivePromptActionState = {
  ok: true,
  message: "",
};

type ArchivePromptButtonProps = {
  promptId: string;
  disabled?: boolean;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending || disabled}
    >
      {pending ? "보관 중" : "보관"}
    </Button>
  );
}

export default function ArchivePromptButton({
  promptId,
  disabled,
}: ArchivePromptButtonProps) {
  const [state, formAction] = useActionState(archivePromptAction, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="promptId" value={promptId} />
      <SubmitButton disabled={disabled} />
      {!state.ok ? <ErrorMessage message={state.message} /> : null}
      {state.ok && state.message ? (
        <p className="text-xs text-slate-500">{state.message}</p>
      ) : null}
    </form>
  );
}