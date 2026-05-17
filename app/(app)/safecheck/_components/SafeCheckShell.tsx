import Badge from "@/shared/ui/badge";
import SafeCheckForm from "./SafeCheckForm.client";

type SafeCheckShellProps = {
  email: string;
};

export default function SafeCheckShell({ email }: SafeCheckShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 sm:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <div className="space-y-2">
          <Badge>AI SafeCheck</Badge>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              프롬프트 안전 검사
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              저장하거나 공개하기 전 개인정보, 회사기밀, 계약정보, 저작권 위험,
              허위·과장 표현을 점검합니다.
            </p>
          </div>

          <p className="break-all text-xs text-slate-500">
            로그인 계정: {email}
          </p>
        </div>

        <SafeCheckForm />
      </section>
    </main>
  );
}