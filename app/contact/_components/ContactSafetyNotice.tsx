import { Card, CardContent } from "@/shared/ui/card";

export default function ContactSafetyNotice() {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <details>
          <summary className="cursor-pointer list-none">
            <p className="text-sm font-semibold text-slate-800">
              문의 전 확인사항
            </p>
          </summary>

        </details>
      </CardContent>
    </Card>
  );
}