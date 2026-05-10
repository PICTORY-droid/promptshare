import { cn } from "@/shared/lib/cn";

type ErrorMessageProps = {
  title?: string;
  message: string;
  className?: string;
};

export default function ErrorMessage({
  title = "오류가 발생했습니다",
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
        className,
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
