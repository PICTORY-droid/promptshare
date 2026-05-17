import Link from "next/link";
import { Card, CardContent } from "@/shared/ui/card";

const requestSteps = [
  "Contact 페이지에서 삭제 요청을 남깁니다.",
  "로그인에 사용한 이메일 주소를 적습니다.",
  "문의 내용에 계정·데이터 삭제 요청이라고 적습니다.",
];

export default function DeleteRequestCard() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            삭제 요청 방법
          </p>

          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {requestSteps.map((step) => (
              <li key={step} className="break-keep">
                {step}
              </li>
            ))}
          </ol>

          <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            <Link
              href="/contact"
              className="font-semibold text-slate-900 underline underline-offset-4"
            >
              Contact
            </Link>
            페이지로 이동해 삭제 요청을 남겨주세요.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}