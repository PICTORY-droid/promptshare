"use client";

import { useFormStatus } from "react-dom";
import Button from "@/shared/ui/button";

export default function SafeCheckSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "검사 중" : "검사하기"}
    </Button>
  );
}