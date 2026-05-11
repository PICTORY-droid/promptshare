import Badge from "@/shared/ui/badge";
import SafeCheckForm from "./SafeCheckForm.client";

type SafeCheckShellProps = {
  email: string;
};

export default function SafeCheckShell({ email }: SafeCheckShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>AI SafeCheck</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            프롬프트 안전 검사
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab에 저장하거나 공개하기 전, 프롬프트 본문에 포함된 개인정보,
            회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.
          </p>
          <p className="text-xs text-slate-500">로그인 계정: {email}</p>
        </div>

        <SafeCheckForm />
      </section>
    </main>
  );
}
