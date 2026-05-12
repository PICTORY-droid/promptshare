import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PromptForm from "./PromptForm.client";
import WriteSafeCheckPanel from "./WriteSafeCheckPanel.client";

type WriteShellProps = {
  email: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  email,
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
        <div className="space-y-3">
          <Badge>개인 작성</Badge>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            프롬프트 작성
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            프롬프트를 저장하기 전 SafeCheck로 개인정보,
            <br />
            회사기밀, 저작권 위험, 과장 표현 확인합니다
          </p>
          <p className="break-all text-xs text-slate-500">로그인 계정: {email}</p>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-5 sm:p-6">
            <CardTitle>저장 전 SafeCheck</CardTitle>
            <CardDescription>
              작성한 프롬프트 본문을 저장하기 전 검사
              <br />
              Write 저장 전 점검용
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <WriteSafeCheckPanel />
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:gap-6">
          <Card>
            <CardHeader className="p-5 sm:p-6">
              <CardTitle>프롬프트 정보</CardTitle>
              <CardDescription>
                제목과 사용 목적은 나중에 찾기 쉽게, 본문과 예시는 실제 사용자가 바로 따라 쓸 수 있게 작성하세요
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <PromptForm
                categories={categories}
                categoryLoadMessage={categoryLoadMessage}
              />
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-5 sm:gap-6">
            <Card>
              <CardHeader className="p-5 sm:p-6">
                <CardTitle>공개 범위와 상태 안내</CardTitle>
                <CardDescription>
                  저장한 프롬프트가 본인에게만 보일지,
                  <br />
                  공개 목록에 보일지 결정합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <div className="space-y-4 text-sm leading-6 text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-950">비공개 + 초안</p>
                    <p className="mt-1">비공개 개인 작업용</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-950">공개 + 게시</p>
                    <p className="mt-1">
                      공개 프롬프트 목록에 표시됩니다
                      <br />
                      SafeCheck 검사 후 설정하세요
                    </p>
                  </div>

                  <p>
                    처음 저장시 비공개, 초안 권장
                    <br />
                    검토가 끝난 프롬프트만 공개, 게시로
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 sm:p-6">
                <CardTitle>작성 기준</CardTitle>
                <CardDescription>
                  저장하기 전에 아래 기준을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>AI의 역할과 작업 목표를 먼저 적기</li>
                  <li>원하는 말투, 형식, 분량을 구체적으로</li>
                  <li>개인정보, 회사기밀, 실제 고객 정보 금지</li>
                  <li>출력 예시를 함께 작성-재사용 용도</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}