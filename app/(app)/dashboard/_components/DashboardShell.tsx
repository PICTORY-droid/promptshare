import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import StatCard from "@/shared/ui/stat-card";
import DashboardPromptCard from "./DashboardPromptCard";

type DashboardShellProps = {
  email: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
};

export default function DashboardShell({
  email,
  prompts,
  promptLoadMessage,
}: DashboardShellProps) {
  return (
    <PageShell>
      <PageHeader
        badge="개인 메뉴"
        title="PromptLab 대시보드"
        description="내가 작성한 프롬프트, 공개 상태, 보관 상태, SafeCheck 연결 흐름을 관리합니다."
        meta={<>로그인 계정: {email}</>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="로그인 계정"
          description="현재 접속 중인 계정입니다."
          value={<span className="block break-all text-base">{email}</span>}
        />

        <StatCard
          title="내 프롬프트"
          description="현재 저장된 프롬프트 개수입니다."
          value={prompts.length}
          helperText="초안, 게시, 보관 상태를 포함합니다."
        />

        <StatCard
          title="AI SafeCheck"
          description="저장 전 안전 검사와 리포트를 확인합니다."
          value="ON"
          helperText="검사 원문은 저장하지 않고 점수, 판정, 위험 카테고리만 기록합니다."
        />
      </div>

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>내 프롬프트 목록</CardTitle>
              <CardDescription>
                내가 작성한 프롬프트를 확인하고 수정, 보관, 복구합니다.
              </CardDescription>
            </div>

            <Link href="/write">
              <Button className="w-full sm:w-auto">새 프롬프트 작성</Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
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
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {prompts.map((prompt) => (
                <DashboardPromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
