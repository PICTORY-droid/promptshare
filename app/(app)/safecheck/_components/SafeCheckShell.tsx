import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Textarea from "@/shared/ui/textarea";

type SafeCheckShellProps = {
  email: string;
  userId: string;
};

export default function SafeCheckShell({ email, userId }: SafeCheckShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            AI SafeCheck
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab 내부의 프롬프트 저장 전 안전 검사 화면입니다. 다음 단계에서
            개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현 detector를
            연결합니다.
          </p>
          <p className="text-xs text-slate-500">
            로그인 계정: {email} · {userId}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>검사할 프롬프트</CardTitle>
              <CardDescription>
                외부 AI에 입력하거나 PromptLab에 저장하기 전에 안전성을 점검합니다.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    프롬프트 본문
                  </span>
                  <Textarea placeholder="검사할 프롬프트를 입력하세요. 실제 검사 엔진은 다음 단계에서 연결합니다." />
                </label>

                <Button disabled>검사 기능 연결 예정</Button>
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>검사 결과</CardTitle>
                <CardDescription>
                  위험 점수, 판정, 탐지 근거, 안전 문장을 표시할 영역입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-800">
                    아직 검사 결과가 없습니다.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    검사 엔진 연결 후 입력 가능, 수정 필요, 입력 금지 판정을 표시합니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>검사 카테고리</CardTitle>
                <CardDescription>
                  PromptLab v3에서 우선 연결할 위험 항목입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>개인정보</li>
                  <li>회사기밀</li>
                  <li>계약정보</li>
                  <li>저작권 위험</li>
                  <li>허위·과장 표현</li>
                  <li>창작자용 모방 위험</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>저장 원칙</CardTitle>
                <CardDescription>
                  검사 결과는 원문이 아니라 메타데이터 중심으로 저장합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>검사 원문 속 민감정보는 저장하지 않습니다.</li>
                  <li>점수, 판정, 위험 카테고리만 저장합니다.</li>
                  <li>안전 문장과 정책 버전만 리포트에 남깁니다.</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
