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

          <p className="mt-2 text-sm leading-6 text-slate-600">
            문의 내용에는 주민등록번호, 비밀번호, 결제정보, 고객 개인정보,
            회사기밀 원문을 입력하지 마세요. 계정·데이터 삭제 요청은 로그인에
            사용한 이메일과 함께 접수해 주세요.
          </p>
        </details>
      </CardContent>
    </Card>
  );
}