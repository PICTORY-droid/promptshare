import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";
import DashboardPromptListRows from "./DashboardPromptListRows";

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
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>프롬프트 목록</CardTitle>

          <Link href="/write">
            <Button className="whitespace-nowrap">새 작성</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {promptLoadMessage ? (
          <EmptyState
            title="프롬프트를 불러오지 못했습니다"
            description={promptLoadMessage}
          />
        ) : prompts.length === 0 ? (
          <EmptyState
            title="저장된 프롬프트 없음"
            description="프롬프트를 작성하면 여기에 표시됩니다."
            action={
              <Link href="/write">
                <Button>첫 프롬프트 작성</Button>
              </Link>
            }
          />
        ) : (
          <DashboardPromptListRows prompts={prompts} />
        )}
      </CardContent>
    </Card>
  );
}