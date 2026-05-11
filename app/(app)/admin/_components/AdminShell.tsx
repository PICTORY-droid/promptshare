import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

type AdminShellProps = {
  email: string;
  userId: string;
};

export default function AdminShell({ email, userId }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            관리자 정책 설정
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab v3의 AI SafeCheck 정책을 관리하는 화면입니다.
            사용자별 금지어와 원문 저장 정책을 Supabase에 저장하는 구조로 확장합니다.
          </p>
          <p className="text-xs text-slate-500">
            로그인 계정: {email} · {userId}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>SafeCheck 정책</CardTitle>
              <CardDescription>
                현재는 UI 골격만 만들고, 다음 단계에서 Supabase 저장 로직을 연결합니다.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">정책 이름</span>
                  <Input placeholder="예: 기본 보안 정책" />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">금지어 목록</span>
                  <Textarea placeholder="회사명, 내부 프로젝트명, 거래처명 등 AI 입력 전에 차단할 단어를 줄바꿈으로 입력합니다." />
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    원문 저장 정책
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    PromptLab v3는 검사 원문 속 민감정보를 저장하지 않는 방향으로 설계합니다.
                    리포트에는 점수, 판정, 위험 카테고리, 안전 문장, 정책 버전만 저장합니다.
                  </p>
                </div>

                <Button disabled>정책 저장 기능 연결 예정</Button>
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>보안 원칙</CardTitle>
                <CardDescription>
                  AI SafeCheck 정책 저장 시 지켜야 할 기준입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>service_role key는 사용하지 않습니다.</li>
                  <li>검사 원문 속 민감정보는 저장하지 않습니다.</li>
                  <li>사용자별 정책은 RLS로 분리합니다.</li>
                  <li>환경변수 누락 시 무한로딩하지 않습니다.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>다음 연결 작업</CardTitle>
                <CardDescription>
                  정책 CRUD 단계에서 구현할 항목입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>promptlab_safecheck_policies 테이블 생성</li>
                  <li>사용자별 정책 조회</li>
                  <li>사용자별 정책 저장</li>
                  <li>금지어 기반 SafeCheck detector 연결</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
