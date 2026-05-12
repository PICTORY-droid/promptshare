import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";

const lastUpdated = "2026-05-12";

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
      <CardContent className="p-5 sm:p-6">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>

          <ul className="space-y-1.5 text-sm leading-6 text-slate-600">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
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
        description="PromptLab은 개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 적법하게 처리하고, 처리 목적에 필요한 범위 안에서 최소한의 정보를 관리합니다"
        meta={<>최종 업데이트: {lastUpdated}</>}
      />

      <Card className="border-emerald-100 bg-emerald-50">
        <CardContent className="p-5 sm:p-6">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <CardTitle className="text-emerald-950">핵심 원칙</CardTitle>
              <CardDescription className="text-emerald-800">
                SafeCheck 검사 원문은 리포트에 저장하지 않습니다
              </CardDescription>
            </div>
            <p className="text-sm leading-7 text-emerald-900">
              PromptLab은 사용자가 직접 저장한 프롬프트와 SafeCheck 검사 기록을 구분하여 처리합니다.
              사용자가 저장한 프롬프트 본문은 서비스 제공을 위해 저장될 수 있으나, SafeCheck 리포트에는 검사 원문, 고객명, 전화번호, 이메일 원문, 회사기밀, 계약조건 원문을 저장하지 않습니다.
              리포트에는 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각만 저장합니다
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-5">
        <PolicySection
          title="1. 처리하는 개인정보 항목"
          description="PromptLab은 서비스 제공에 필요한 범위에서 다음 정보를 처리할 수 있습니다"
          items={[
            "회원 식별 정보: Supabase Auth 또는 소셜 로그인 과정에서 이메일 주소, 소셜 로그인 식별자, 로그인 세션 정보가 처리될 수 있습니다",
            "프롬프트 데이터: 사용자가 직접 저장한 프롬프트 제목, 사용 목적, 본문, 예시 입력, 예시 출력, 안전 주의사항, 공개 범위, 게시 상태가 저장될 수 있습니다",
            "SafeCheck 기록: 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각이 저장될 수 있습니다",
            "문의 정보: Contact 페이지를 통해 사용자가 입력한 이름, 이메일, 문의 유형, 문의 내용, 답변 동의 여부가 처리될 수 있습니다",
            "기술 정보: 서비스 안정성 확인을 위해 접속 로그, 브라우저 정보, 기기 정보, 오류 로그, 시스템 로그, 서비스 이용 흐름 정보가 Vercel, Supabase, Tally, Google Analytics 등 외부 서비스에서 처리될 수 있습니다",
          ]}
        />

        <PolicySection
          title="2. 저장하지 않는 정보"
          description="SafeCheck 리포트와 문의 내용에는 민감한 원문을 입력하지 않는 것을 원칙으로 합니다"
          items={[
            "SafeCheck 리포트에는 검사 원문 프롬프트를 저장하지 않습니다",
            "SafeCheck 리포트에는 고객명, 전화번호, 이메일 원문을 저장하지 않습니다",
            "SafeCheck 리포트에는 회사기밀, 내부자료, 계약조건 원문을 저장하지 않습니다",
            "SafeCheck 리포트에는 상담기록, 진료기록 같은 민감한 원문을 저장하지 않습니다",
            "PromptLab은 Supabase service_role key를 클라이언트에 노출하지 않습니다",
          ]}
        />

        <PolicySection
          title="3. 개인정보 처리 목적"
          description="처리한 정보는 아래 목적의 범위 안에서만 사용합니다"
          items={[
            "사용자 로그인, 계정 식별, 세션 유지",
            "사용자별 프롬프트 생성, 조회, 수정, 보관, 복구",
            "프롬프트 공개 여부와 게시 상태 관리",
            "SafeCheck 위험 검사 결과 제공",
            "SafeCheck 검사 기록 조회",
            "Contact 문의 접수, 답변, 오류 확인, 서비스 개선",
            "부정 이용 방지, 보안 점검, 서비스 안정성 확보",
            "서비스 이용 흐름 분석과 화면 사용성 개선",
          ]}
        />

        <PolicySection
          title="4. 보유 및 이용 기간"
          description="개인정보는 처리 목적 달성에 필요한 기간 동안만 보유합니다"
          items={[
            "계정 정보는 회원이 서비스를 이용하는 기간 동안 보유하며, 계정 삭제 또는 삭제 요청 시 지체 없이 삭제하는 것을 원칙으로 합니다",
            "사용자가 저장한 프롬프트 데이터는 사용자가 직접 삭제하거나 계정 삭제를 요청할 때까지 보유될 수 있습니다",
            "SafeCheck 검사 기록은 서비스 내 기록 확인을 위해 보유될 수 있으며, 삭제 요청이 있는 경우 확인 후 삭제할 수 있습니다",
            "Contact 문의 정보는 문의 처리와 이력 확인을 위해 필요한 기간 동안 보유될 수 있습니다",
            "접속 로그, 오류 로그, 사용 분석 정보는 서비스 안정성 확인과 개선에 필요한 기간 동안 외부 서비스의 보존 정책에 따라 처리될 수 있습니다",
            "법령상 보관 의무, 분쟁 대응, 보안 사고 조사 등 정당한 사유가 있는 경우 해당 목적에 필요한 범위에서 일정 기간 보관할 수 있습니다",
          ]}
        />

        <PolicySection
          title="5. 개인정보의 파기"
          description="보유 목적이 끝난 개인정보는 안전한 방법으로 파기합니다"
          items={[
            "전자 파일 형태의 개인정보는 복구하기 어려운 방법으로 삭제합니다",
            "외부 서비스에 저장된 정보는 해당 서비스의 관리 기능, 보존 정책, 백업 정책에 따라 삭제 또는 비식별 처리될 수 있습니다",
            "백업 또는 로그에 남은 정보는 보안과 안정성 확보를 위한 보관 기간이 지난 뒤 순차적으로 삭제될 수 있습니다",
          ]}
        />

        <PolicySection
          title="6. 제3자 서비스 및 처리위탁"
          description="PromptLab은 서비스 운영을 위해 다음 외부 서비스를 사용할 수 있습니다"
          items={[
            "Supabase: 사용자 인증, 데이터베이스 저장, 세션 관리",
            "Vercel: 웹 애플리케이션 배포, 호스팅, 기본 접속 로그와 오류 로그 처리",
            "Google OAuth: Google 계정 로그인 제공",
            "Kakao OAuth: Kakao 계정 로그인 제공",
            "Google Analytics: 접속 통계, 서비스 이용 흐름, 기기·브라우저 정보 등 사용 분석",
            "Tally: Contact 문의 폼 제공과 문의 내용 접수",
            "외부 서비스는 각 서비스의 보안 정책과 개인정보 처리방침에 따라 데이터를 처리할 수 있습니다",
          ]}
        />

        <PolicySection
          title="7. 정보주체의 권리"
          description="사용자는 본인의 개인정보에 대해 열람, 수정, 삭제, 처리정지를 요청할 수 있습니다"
          items={[
            "사용자는 본인이 작성한 프롬프트를 조회, 수정, 보관할 수 있습니다",
            "사용자는 공개 상태의 프롬프트를 비공개 또는 초안 상태로 변경할 수 있습니다",
            "계정 또는 저장 데이터 삭제가 필요한 경우 Contact 페이지 또는 개인정보 문의 이메일로 요청할 수 있습니다",
            "요청 내용이 본인 확인, 법령상 보관 의무, 보안 사고 조사, 분쟁 대응과 관련되는 경우 처리에 필요한 확인 절차가 진행될 수 있습니다",
            "로그아웃을 통해 현재 브라우저의 로그인 세션을 종료할 수 있습니다",
          ]}
        />

        <PolicySection
          title="8. 안전성 확보 조치"
          description="PromptLab은 개인정보 보호를 위해 기술적·관리적 조치를 적용합니다"
          items={[
            "로그인한 사용자만 본인 프롬프트를 관리할 수 있도록 서버에서 사용자 정보를 확인합니다",
            "공개 프롬프트 화면에는 작성자 이메일, 사용자 ID, 작성 날짜를 노출하지 않습니다",
            "SafeCheck block 판정 프롬프트는 저장을 차단합니다",
            "SafeCheck review 판정 프롬프트는 비공개 초안 저장만 허용합니다",
            "민감한 키와 환경변수는 코드 저장소에 직접 저장하지 않습니다",
            "서비스 운영 중 발견된 오류와 보안 문제는 필요한 범위에서 점검하고 수정합니다",
          ]}
        />

        <PolicySection
          title="9. 입력 금지 정보"
          description="사용자는 서비스 이용 중 아래 정보를 입력하지 않아야 합니다"
          items={[
            "주민등록번호, 여권번호, 운전면허번호 등 고유식별정보",
            "비밀번호, 인증번호, 결제정보, 카드번호, 계좌 비밀번호",
            "고객명, 전화번호, 이메일, 주소 등 실제 고객 개인정보 원문",
            "진료기록, 상담기록, 민감한 건강정보, 범죄 관련 정보, 정치·종교 등 민감정보 원문",
            "회사기밀, 내부자료, 계약조건, 미공개 사업전략, 제3자에게 공개할 권한이 없는 자료",
            "사용자가 입력 금지 정보를 임의로 입력하여 발생한 문제는 사용자의 입력 행위와 서비스 이용 방식에 따라 처리될 수 있습니다",
          ]}
        />

        <PolicySection
          title="10. 자동 수집 장치와 로그"
          description="서비스 안정성 확인과 이용 흐름 분석을 위해 기본적인 기술 정보가 처리될 수 있습니다"
          items={[
            "PromptLab은 자체적으로 광고 식별자 또는 위치정보를 수집하지 않습니다",
            "Vercel, Supabase, Tally, Google Analytics 등 외부 서비스가 접속 로그, 브라우저 정보, 기기 정보, 오류 로그, 서비스 이용 흐름 정보를 처리할 수 있습니다",
            "Google Analytics는 서비스 이용 통계와 화면 이용 흐름을 파악하기 위해 쿠키 또는 유사 기술을 사용할 수 있습니다",
            "브라우저 쿠키 또는 로컬 저장소는 로그인 세션 유지, 서비스 동작, 사용자 경험 개선을 위해 사용될 수 있습니다",
            "사용자는 브라우저 설정을 통해 쿠키를 제한할 수 있으나, 이 경우 로그인 또는 일부 기능이 정상적으로 동작하지 않을 수 있습니다",
          ]}
        />

        <PolicySection
          title="11. 처리방침의 변경"
          description="개인정보 처리방침은 서비스 변경, 법령 개정, 운영 정책 변경에 따라 수정될 수 있습니다"
          items={[
            "개인정보 처리방침이 변경되는 경우 본 페이지의 최종 업데이트 일자를 갱신합니다",
            "중요한 변경이 있는 경우 서비스 화면, 공지, 또는 적절한 방법으로 안내할 수 있습니다",
            "변경된 처리방침은 본 페이지에 게시된 시점부터 적용됩니다",
          ]}
        />

        <PolicySection
          title="12. 문의 및 개인정보 관련 연락처"
          description="개인정보 관련 문의, 삭제 요청, 고충 처리는 아래 연락처로 요청할 수 있습니다"
          items={[
            "서비스명: PromptLab",
            "제작·운영: PICTORY-DROID, Seoin Kim",
            "운영 사이트: https://promptlab.io.kr",
            "개인정보 문의: pictory-droid@gmail.com",
            "Contact: https://promptlab.io.kr/contact",
          ]}
        />
      </div>
    </PageShell>
  );
}