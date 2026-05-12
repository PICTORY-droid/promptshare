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
          <Badge>Policy</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            운영 기준
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab에서 프롬프트를 저장하고 공개할 때 적용하는 기본 기준입니다.
            이 화면은 설정 변경 화면이 아니라 현재 서비스에 적용된 정책을 확인하는 페이지입니다.
          </p>
          <p className="text-xs text-slate-500">현재 로그인 계정: {email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>프롬프트 공개 기준</CardTitle>
              <CardDescription>
                공개 목록에 표시되는 기준입니다.
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
              <CardTitle>SafeCheck 저장 기준</CardTitle>
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
              <CardTitle>리포트 보안 원칙</CardTitle>
              <CardDescription>
                SafeCheck 검사 기록의 원문 미저장 기준입니다.
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
            <CardTitle>운영 기준 요약</CardTitle>
            <CardDescription>
              PromptLab에서 프롬프트와 SafeCheck 결과를 관리할 때 적용하는 기본 원칙입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  프롬프트 관리
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>개인 작업용 프롬프트는 비공개 초안으로 보관합니다.</li>
                  <li>공개할 프롬프트는 SafeCheck 검사 후 게시합니다.</li>
                  <li>더 이상 사용하지 않는 프롬프트는 보관 처리합니다.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  보안 관리
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>공개 화면에는 작성자 식별 정보를 노출하지 않습니다.</li>
                  <li>SafeCheck 리포트에는 검사 원문을 저장하지 않습니다.</li>
                  <li>위험 판정이 있는 프롬프트는 공개 전에 수정합니다.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}