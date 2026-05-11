import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type AdminShellProps = {
  email: string;
};

export default function AdminShell({ email }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Admin</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            관리자 설정
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab의 프롬프트 공개 기준, SafeCheck 정책, 리포트 보안 기준을 관리하는 화면입니다.
          </p>
          <p className="text-xs text-slate-500">로그인 계정: {email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>프롬프트 공개 기준</CardTitle>
              <CardDescription>
                기본 운영 기준입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                <li>기본 저장은 비공개와 초안을 권장합니다.</li>
                <li>공개 목록에는 공개 + 게시 상태만 표시합니다.</li>
                <li>보관된 프롬프트는 공개 목록에서 제외합니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SafeCheck 저장 정책</CardTitle>
              <CardDescription>
                저장과 공개 전 검사 기준입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                <li>allow 판정은 저장할 수 있습니다.</li>
                <li>review 판정은 비공개 + 초안 저장만 허용합니다.</li>
                <li>block 판정은 저장을 차단합니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>원문 미저장 원칙</CardTitle>
              <CardDescription>
                SafeCheck 리포트 보안 기준입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                <li>검사 원문은 저장하지 않습니다.</li>
                <li>고객명, 전화번호, 이메일 원문은 저장하지 않습니다.</li>
                <li>점수, 판정, 위험 카테고리, 안전 문장 안내만 저장합니다.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>현재 구현된 관리 범위</CardTitle>
            <CardDescription>
              이 화면은 현재 구현된 정책을 사용자에게 명확히 보여주는 용도입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  적용 중인 기능
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>Supabase Auth 로그인 보호</li>
                  <li>Prompt CRUD, 보관, 복구</li>
                  <li>SafeCheck 검사와 저장 차단 정책</li>
                  <li>SafeCheck 리포트 저장과 원문 미저장 안내</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  운영 원칙
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>공개 전에 안전 검사를 먼저 권장합니다.</li>
                  <li>개인 작업용 프롬프트는 대시보드에서만 관리합니다.</li>
                  <li>공개 화면에는 작성자 식별 정보와 날짜를 노출하지 않습니다.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
