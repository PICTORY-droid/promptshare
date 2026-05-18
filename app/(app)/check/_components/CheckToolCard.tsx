import Link from "next/link";
import Badge from "@/shared/ui/badge";

type CheckToolStatus = "사용 가능" | "준비 중" | "검토 예정";

export type CheckToolCardProps = {
  title: string;
  description: string;
  status: CheckToolStatus;
  href?: string;
  actionLabel?: string;
  variant?: "primary" | "compact" | "mini";
};

function getStatusVariant(status: CheckToolStatus) {
  if (status === "사용 가능") {
    return "success";
  }

  if (status === "검토 예정") {
    return "warning";
  }

  return "default";
}

export default function CheckToolCard({
  title,
  description,
  status,
  href,
  actionLabel,
  variant = "compact",
}: CheckToolCardProps) {
  const isPrimary = variant === "primary";
  const isMini = variant === "mini";

  const cardClassName = isPrimary
    ? "flex flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
    : isMini
      ? "rounded-2xl border border-slate-200 bg-white p-4"
      : "flex min-h-28 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4";

  const titleClassName = isPrimary
    ? "text-xl font-semibold tracking-tight text-slate-950"
    : "text-sm font-semibold text-slate-950";

  const descriptionClassName = isPrimary
    ? "mt-2 max-w-2xl text-sm leading-6 text-slate-600"
    : "mt-2 text-sm leading-6 text-slate-600";

  const content = (
    <>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={titleClassName}>{title}</h3>
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
        </div>

        <p className={descriptionClassName}>{description}</p>
      </div>

      {isPrimary && actionLabel ? (
        <span className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white sm:w-auto">
          {actionLabel}
        </span>
      ) : null}

      {isMini ? null : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <article className={cardClassName}>{content}</article>;
}