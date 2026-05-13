type CheckPageHeaderProps = {
  email: string;
};

export default function CheckPageHeader({ email }: CheckPageHeaderProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            PromptLab Check
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
            검사 작업실
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            AI에 입력하기 전 개인정보, 위험 문구, 반복 표현을 빠르게 점검합니다.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left sm:min-w-56">
          <p className="text-xs font-semibold text-slate-500">
            로그인 계정
          </p>
          <p className="mt-1 truncate text-sm font-bold text-slate-900">
            {email}
          </p>
        </div>
      </div>
    </section>
  );
}
