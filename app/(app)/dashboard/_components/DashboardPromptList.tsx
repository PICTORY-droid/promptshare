import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";
import DashboardPromptViewToggle from "./DashboardPromptViewToggle.client";

type DashboardPromptListProps = {
  prompts: Prompt[];
  promptLoadMessage: string | null;
};

export default function DashboardPromptList({
  prompts,
  promptLoadMessage,
}: DashboardPromptListProps) {
  return (
    <Card>
      <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>내 프롬프트</CardTitle>
            <CardDescription>
              그리드 또는 리스트로 관리합니다.
            </CardDescription>
          </div>

          <Link href="/write">
            <Button className="whitespace-nowrap">작성</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        {promptLoadMessage ? (
          <EmptyState
            title="내 프롬프트를 불러오지 못했습니다"
            description={promptLoadMessage}
          />
        ) : prompts.length === 0 ? (
          <EmptyState
            title="저장한 프롬프트가 없습니다"
            description="첫 프롬프트를 작성하세요."
            action={
              <Link href="/write">
                <Button>작성하기</Button>
              </Link>
            }
          />
        ) : (
          <DashboardPromptViewToggle prompts={prompts} />
        )}
      </CardContent>
    </Card>
  );
}