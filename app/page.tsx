import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <section className="mx-auto flex max-w-5xl flex-col gap-6 sm:gap-8">
        <div className="space-y-5 sm:space-y-6">
          <Badge>PromptLab v3</Badge>

          <div className="space-y-3 sm:space-y-4">
            <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
              프롬프트 작성, 저장,
              <br />
              안전한 공개 AI 작업실
            </h1>

            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              작성, 개인 보관, 공개 게시, SafeCheck, 리포트 관리를 연결합니다.
            </p>
          </div>

          <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link href="/write">
              <Button className="w-full sm:w-auto">프롬프트 작성하기</Button>
            </Link>
            <Link href="/safecheck">
              <Button variant="secondary" className="w-full sm:w-auto">
                SafeCheck 열기
              </Button>
            </Link>
            <Link href="/prompts">
              <Button variant="ghost" className="w-full sm:w-auto">
                공개 프롬프트 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}