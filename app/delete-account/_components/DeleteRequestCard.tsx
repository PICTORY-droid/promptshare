import Link from "next/link";
import { Card, CardContent } from "@/shared/ui/card";
import Button from "@/shared/ui/button";
import DeleteAccountButton from "./DeleteAccountButton.client";

type DeleteRequestCardProps = {
  isLoggedIn: boolean;
};

export default function DeleteRequestCard({
  isLoggedIn,
}: DeleteRequestCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            계정 탈퇴
          </p>

          <p className="text-sm leading-6 text-slate-600">
            탈퇴하면 PromptLab에 저장된 프롬프트와 SafeCheck 기록이 삭제됩니다.
            삭제 후 같은 계정으로 다시 로그인해도 기존 데이터는 복구되지 않습니다.
          </p>

          {isLoggedIn ? (
            <DeleteAccountButton />
          ) : (
            <Link href="/login" className="block">
              <Button className="w-full">로그인 후 계정 탈퇴</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}