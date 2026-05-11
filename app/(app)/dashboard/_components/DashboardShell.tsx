import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import DashboardPromptCard from "./DashboardPromptCard";

type DashboardShellProps = {
  email: string;
  userId: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
};

export default function DashboardShell({
  email,
  userId,
  prompts,
  promptLoadMessage,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            PromptLab 대시보드
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            로그인한 사용자의 프롬프트 작성, 저장, 공개 상태, SafeCheck 연결 흐름을
            관리하는 화면입니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>로그인 계정</CardTitle>
              <CardDescription>현재 Supabase Auth 세션 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="break-all text-sm font-semibold text-slate-950">{email}</p>
              <p className="mt-2 break-all text-xs text-slate-500">{userId}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>내 프롬프트</CardTitle>
              <CardDescription>현재 저장된 프롬프트 개수입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-950">{prompts.length}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                초안, 게시, 보관 상태를 포함합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI SafeCheck</CardTitle>
              <CardDescription>저장 전 안전 검사 연결 예정 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                다음 단계에서 프롬프트 저장 전 위험 요소 검사를 연결합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>내 프롬프트 목록</CardTitle>
                <CardDescription>
                  내가 작성한 프롬프트를 확인하고 상세 페이지로 이동합니다.
                </CardDescription>
              </div>

              <Link href="/write">
                <Button>새 프롬프트 작성</Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {promptLoadMessage ? (
              <EmptyState
                title="내 프롬프트를 불러오지 못했습니다"
                description={promptLoadMessage}
              />
            ) : prompts.length === 0 ? (
              <EmptyState
                title="아직 저장한 프롬프트가 없습니다"
                description="프롬프트 작성 화면에서 첫 프롬프트를 저장하세요."
                action={
                  <Link href="/write">
                    <Button>첫 프롬프트 작성하기</Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {prompts.map((prompt) => (
                  <DashboardPromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
