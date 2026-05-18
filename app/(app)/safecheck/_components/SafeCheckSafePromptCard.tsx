import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type SafeCheckSafePromptCardProps = {
  safePrompt: string;
};

export default function SafeCheckSafePromptCard({
  safePrompt,
}: SafeCheckSafePromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>안전 문장 안내</CardTitle>
        <CardDescription>
          공개 전 수정 방향입니다.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <details className="rounded-2xl bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            안전 문장 보기
          </summary>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {safePrompt}
          </p>
        </details>
      </CardContent>
    </Card>
  );
}