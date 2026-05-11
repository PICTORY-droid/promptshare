import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import PromptForm from "./PromptForm.client";
import WriteSafeCheckPanel from "./WriteSafeCheckPanel.client";

type WriteShellProps = {
  email: string;
  userId: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  email,
  userId,
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
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
                제목, 카테고리, 사용 목적, 본문, 예시, 공개 범위를 입력한 뒤 Supabase에 저장합니다.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <PromptForm
                categories={categories}
                categoryLoadMessage={categoryLoadMessage}
              />
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>저장 전 AI SafeCheck</CardTitle>
                <CardDescription>
                  왼쪽 프롬프트 본문을 복사해 붙여넣고 저장 전 위험 요소를 검사합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WriteSafeCheckPanel />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>공개 범위와 상태 안내</CardTitle>
                <CardDescription>
                  저장한 프롬프트가 어디에 보이는지 결정하는 기준입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm leading-6 text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-950">비공개 + 초안</p>
                    <p className="mt-1">
                      개인 작업용입니다. 다른 사용자에게 보이지 않고, 본인 대시보드에서만 관리합니다.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-950">공개 + 게시</p>
                    <p className="mt-1">
                      다른 사용자도 공개 프롬프트 목록에서 볼 수 있습니다.
                    </p>
                  </div>

                  <p>
                    처음 저장할 때는 비공개, 초안을 권장합니다. 검토가 끝난 프롬프트만 공개, 게시로 바꾸세요.
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
