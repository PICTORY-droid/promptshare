import Link from "next/link";

type CheckToolStatus = "사용 가능" | "준비 중" | "검토 예정";

export type CheckToolCardProps = {
  title: string;
  description: string;
  status: CheckToolStatus;
  href?: string;
  variant?: "primary" | "compact" | "mini";
};

export default function CheckToolCard({
  title,
  description,
  status,
  href,
  variant = "compact",
}: CheckToolCardProps) {
  const isPrimary = variant === "primary";
  const isMini = variant === "mini";
  const isReady = status === "사용 가능";

  const cardClassName = isPrimary
    ? "flex items-center justify-between gap-4 rounded-2xl border border-slate-950 bg-white p-4"
    : isMini
      ? "flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
      : "flex min-h-20 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3";

  const titleClassName = isPrimary
    ? "text-xl font-bold tracking-[-0.03em] text-slate-950"
    : isMini
      ? "text-xs font-bold text-slate-800"
      : "text-sm font-bold text-slate-950";

  const descriptionClassName = isPrimary
    ? "mt-1 max-w-xl text-sm leading-5 text-slate-600"
    : isMini
      ? "hidden text-[11px] text-slate-500 sm:block"
      : "mt-1 text-xs leading-4 text-slate-500";

  const statusClassName = isReady
    ? "rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-white"
    : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500";

  const content = (
    <>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={titleClassName}>{title}</h3>
          {!isMini ? <span className={statusClassName}>{status}</span> : null}
        </div>

        <p className={descriptionClassName}>{description}</p>
      </div>

      {isPrimary ? (
        <span className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-bold text-white">
          바로 검사
        </span>
      ) : null}

      {isMini ? (
        <span className="shrink-0 text-[11px] font-semibold text-slate-400">
          {status}
        </span>
      ) : null}
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