import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const lastUpdated = "2026-05-11";

function PolicySection({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader className="p-5 sm:p-6">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <ul className="space-y-2 text-sm leading-6 text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader
        badge="Privacy Policy"
        title="개인정보 처리방침"
        description="PromptLab은 프롬프트 작성, 저장, SafeCheck 검사, 리포트 확인을 제공하는 서비스입니다. 사용자의 개인정보와 민감한 입력 원문을 최소한으로 처리하는 것을 원칙으로 합니다."
        meta={<>최종 업데이트: {lastUpdated}</>}
      />

      <Card className="border-emerald-100 bg-emerald-50">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-emerald-950">
            핵심 원칙
          </CardTitle>
          <CardDescription className="text-emerald-800">
            PromptLab은 SafeCheck 검사 원문을 리포트에 저장하지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <p className="text-sm leading-7 text-emerald-900">
            SafeCheck 리포트에는 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각만 저장합니다.
            검사 원문 프롬프트, 고객명, 전화번호, 이메일 원문, 회사기밀, 내부자료, 계약조건 원문은 저장하지 않습니다.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-5">
        <PolicySection
          title="1. 수집하는 정보"
          description="서비스 제공을 위해 필요한 최소한의 정보만 처리합니다."
          items={[
            "Supabase Auth 로그인 과정에서 이메일 주소와 소셜 로그인 식별 정보가 처리될 수 있습니다.",
            "사용자가 직접 저장한 프롬프트 제목, 사용 목적, 본문, 예시 입력, 예시 출력, 안전 주의사항이 저장될 수 있습니다.",
            "SafeCheck 리포트에는 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각이 저장됩니다.",
            "서비스 개선과 오류 확인을 위해 Vercel, Supabase에서 기본적인 접속 로그나 시스템 로그가 처리될 수 있습니다.",
          ]}
        />

        <PolicySection
          title="2. 저장하지 않는 정보"
          description="SafeCheck의 원문 미저장 원칙입니다."
          items={[
            "SafeCheck 검사 원문 프롬프트는 리포트에 저장하지 않습니다.",
            "고객명, 전화번호, 이메일 원문은 SafeCheck 리포트에 저장하지 않습니다.",
            "회사기밀, 내부자료, 계약조건 원문은 SafeCheck 리포트에 저장하지 않습니다.",
            "상담기록, 진료기록 같은 민감한 원문은 SafeCheck 리포트에 저장하지 않습니다.",
            "Supabase service_role key는 클라이언트에 노출하지 않습니다.",
          ]}
        />

        <PolicySection
          title="3. 정보 이용 목적"
          items={[
            "사용자 로그인과 계정 식별",
            "사용자별 프롬프트 생성, 조회, 수정, 보관, 복구",
            "프롬프트 공개 여부와 게시 상태 관리",
            "SafeCheck 위험 검사 결과 제공",
            "SafeCheck 리포트 조회",
            "서비스 오류 확인과 안정성 개선",
          ]}
        />

        <PolicySection
          title="4. 제3자 서비스"
          description="PromptLab은 운영을 위해 다음 외부 서비스를 사용합니다."
          items={[
            "Supabase, 사용자 인증과 데이터베이스 저장을 위해 사용합니다.",
            "Google OAuth, Google 계정 로그인을 위해 사용합니다.",
            "Kakao OAuth, Kakao 계정 로그인을 위해 사용합니다.",
            "Vercel, 웹 애플리케이션 배포와 호스팅을 위해 사용합니다.",
          ]}
        />

        <PolicySection
          title="5. 사용자의 권리"
          items={[
            "사용자는 본인이 작성한 프롬프트를 수정하거나 보관할 수 있습니다.",
            "사용자는 공개 상태의 프롬프트를 비공개 또는 초안 상태로 변경할 수 있습니다.",
            "계정 또는 저장 데이터 삭제가 필요한 경우 운영자에게 요청할 수 있습니다.",
            "로그아웃을 통해 현재 브라우저의 로그인 세션을 종료할 수 있습니다.",
          ]}
        />

        <PolicySection
          title="6. 보안 관리"
          items={[
            "로그인한 사용자만 본인 프롬프트를 관리할 수 있도록 서버에서 사용자 정보를 확인합니다.",
            "공개 프롬프트 화면에는 작성자 이메일, 사용자 ID, 작성 날짜를 노출하지 않습니다.",
            "SafeCheck block 판정 프롬프트는 저장을 차단합니다.",
            "SafeCheck review 판정 프롬프트는 비공개 초안 저장만 허용합니다.",
            "민감한 키와 환경변수는 코드 저장소에 직접 저장하지 않습니다.",
          ]}
        />

        <PolicySection
          title="7. 문의"
          items={[
            "서비스 운영자: PromptLab",
            "문의 이메일: oceanlumes@gmail.com",
            "운영 사이트: https://promptlab.io.kr",
          ]}
        />
      </div>
    </PageShell>
  );
}
