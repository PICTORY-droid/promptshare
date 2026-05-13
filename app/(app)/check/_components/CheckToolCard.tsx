import Link from "next/link";

type CheckToolStatus = "사용 가능" | "준비 중" | "검토 예정";

export type CheckToolCardProps = {
  title: string;
  description: string;
  status: CheckToolStatus;
  href?: string;
  variant?: "primary" | "secondary";
};

export default function CheckToolCard({
  title,
  description,
  status,
  href,
  variant = "secondary",
}: CheckToolCardProps) {
  const isPrimary = variant === "primary";
  const isReady = status === "사용 가능";

  const cardClassName = isPrimary
    ? "flex flex-col gap-4 rounded-3xl border border-slate-900 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
    : "flex min-h-36 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4";

  const content = (
    <>
      <div>
        <div className="flex items-center gap-2">
          <h3
            className={
              isPrimary
                ? "text-xl font-bold tracking-[-0.03em] text-slate-950"
                : "text-sm font-bold text-slate-950"
            }
          >
            {title}
          </h3>
          <span
            className={
              isReady
                ? "rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-white"
                : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
            }
          >
            {status}
          </span>
        </div>

        <p
          className={
            isPrimary
              ? "mt-2 max-w-2xl text-sm leading-6 text-slate-600"
              : "mt-2 line-clamp-3 text-xs leading-5 text-slate-500"
          }
        >
          {description}
        </p>
      </div>

      {isPrimary ? (
        <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white">
          바로 검사하기
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

  return (
    <article className={cardClassName}>
      {content}
    </article>
  );
}
