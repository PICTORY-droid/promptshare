import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

type WriteShellProps = {
  email: string;
  userId: string;
};

export default function WriteShell({ email, userId }: WriteShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            프롬프트 작성
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab v3의 프롬프트 작성 화면입니다. 저장 전 AI SafeCheck로
            개인정보, 회사기밀, 저작권 위험, 허위·과장 표현을 검사하는 구조로
            확장합니다.
          </p>
          <p className="text-xs text-slate-500">
            로그인 계정: {email} · {userId}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>프롬프트 정보</CardTitle>
              <CardDescription>
                제목, 카테고리, 사용 목적, 본문을 입력합니다. 실제 저장은 Prompt
                CRUD 단계에서 연결합니다.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">제목</span>
                  <Input placeholder="예: 고객 응대 이메일 작성 프롬프트" />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">카테고리</span>
                  <Input placeholder="예: 업무, 글쓰기, 마케팅, 음악 생성" />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">사용 목적</span>
                  <Input placeholder="이 프롬프트를 어떤 상황에서 쓰는지 적어주세요." />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">프롬프트 본문</span>
                  <Textarea placeholder="AI에게 입력할 프롬프트를 작성하세요. 저장 전 AI SafeCheck 검사를 연결할 예정입니다." />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">예시 입력</span>
                  <Textarea
                    className="min-h-28"
                    placeholder="프롬프트 사용 예시 입력값을 작성하세요."
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">예시 출력</span>
                  <Textarea
                    className="min-h-28"
                    placeholder="예상되는 출력 형태를 작성하세요."
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <Button disabled>저장 기능 연결 예정</Button>
                  <Button variant="secondary" disabled>
                    AI SafeCheck 연결 예정
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI SafeCheck</CardTitle>
                <CardDescription>
                  저장 전 검사 모듈이 연결될 영역입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-800">
                    아직 검사 결과가 없습니다.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    다음 단계에서 프롬프트 본문을 검사하고 위험 점수, 판정,
                    탐지 근거, 안전 문장을 표시합니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>작성 기준</CardTitle>
                <CardDescription>
                  v3에서는 양보다 품질을 우선합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>고품질 프롬프트만 저장합니다.</li>
                  <li>개인정보와 회사기밀을 포함하지 않습니다.</li>
                  <li>저작권 위험이 있는 요청은 수정합니다.</li>
                  <li>사용 목적과 예시를 함께 작성합니다.</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
