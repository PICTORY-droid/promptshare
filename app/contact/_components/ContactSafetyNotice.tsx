import { Card, CardContent } from "@/shared/ui/card";

export default function ContactSafetyNotice() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">
            문의 전 확인사항
          </p>

          <p className="text-sm leading-6 text-slate-600">
            문의 내용에는 주민등록번호, 비밀번호, 결제정보, 고객 개인정보,
            회사기밀 원문을 입력하지 마세요. 계정·데이터 삭제 요청은 로그인에
            사용한 이메일과 함께 접수해 주세요.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}