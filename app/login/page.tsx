import LoginForm from "./_components/LoginForm.client";

export default function LoginPage() {
  return (
    <main className="bg-slate-50 px-6 pb-28 pt-8 sm:py-16">
      <section className="mx-auto flex max-w-md flex-col gap-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold text-slate-500">PromptLab Auth</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            PromptLab 로그인
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            프롬프트 저장, AI SafeCheck 검사, 관리자 정책 설정을 사용하려면
            로그인이 필요합니다.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}