type CheckPageHeaderProps = {
  email: string;
};

export default function CheckPageHeader({ email }: CheckPageHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">
            PromptLab Check
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">
            검사 작업실
          </h1>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            AI 입력 전 위험 문구를 빠르게 점검합니다.
          </p>
        </div>

        <div className="hidden max-w-52 shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-right sm:block">
          <p className="text-[11px] font-semibold text-slate-500">
            로그인
          </p>
          <p className="mt-0.5 truncate text-xs font-bold text-slate-900">
            {email}
          </p>
        </div>
      </div>
    </section>
  );
}