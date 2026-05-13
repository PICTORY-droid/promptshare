import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";
import DeleteInfoSection from "./DeleteInfoSection";

const lastUpdated = "2026-05-13";

const summaryCards = [
  {
    title: "PromptLab 연결 삭제",
    description:
      "Google, Kakao, 이메일 Magic Link로 만든 PromptLab 서비스 연결 삭제를 요청합니다.",
  },
  {
    title: "저장 데이터 삭제",
    description:
      "저장 프롬프트, SafeCheck 기록, 문의 기록 등 PromptLab에 저장된 데이터를 삭제 요청합니다.",
  },
  {
    title: "일부 보관 가능",
    description:
      "법적 의무, 보안, 분쟁 대응에 필요한 최소 정보는 정해진 기간 동안 보관될 수 있습니다.",
  },
];

export default function DeleteAccountShell() {
  return (
    <PageShell>
      <PageHeader
        badge="Account & Data Deletion"
        title="계정·데이터 삭제"
        description="Google 또는 Kakao 계정을 삭제하는 페이지가 아닙니다. PromptLab 연결과 저장 데이터를 삭제 요청하는 페이지입니다."
        meta={<>최종 업데이트: {lastUpdated}</>}
      />

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 sm:p-6">
          <div className="space-y-2">
            <CardTitle className="text-amber-950">
              먼저 확인해 주세요
            </CardTitle>
            <CardDescription className="text-amber-900">
              이 페이지는 Google 계정, Kakao 계정, 이메일 계정 자체를 삭제하는
              곳이 아닙니다. PromptLab 서비스에 연결된 계정 정보와 저장
              데이터의 삭제 요청을 안내합니다.
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <section
        aria-label="계정 및 데이터 삭제 요약"
        className="grid gap-3 sm:grid-cols-3"
      >
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-4 sm:p-5">
              <div className="space-y-1.5">
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 sm:gap-5">
        <DeleteInfoSection
          title="삭제 요청 방법"
          description="아래 경로로 PromptLab 연결·데이터 삭제를 요청할 수 있습니다."
          items={[
            "Contact 페이지에서 삭제 요청을 남깁니다.",
            "문의 내용에 로그인에 사용한 이메일 주소를 함께 적습니다.",
            "요청 내용에 계정·데이터 삭제 요청이라고 적습니다.",
            "개인정보 문의 메일로 직접 요청할 수도 있습니다.",
            "본인 확인이 필요한 경우 추가 확인 절차가 진행될 수 있습니다.",
          ]}
        />

        <DeleteInfoSection
          title="삭제 대상"
          description="요청 처리 시 아래 정보가 삭제 대상에 포함될 수 있습니다."
          items={[
            "PromptLab 서비스 계정 연결 정보",
            "Supabase Auth 사용자 정보 삭제 요청",
            "저장한 프롬프트 제목과 본문",
            "SafeCheck 검사 기록 중 사용자 계정과 연결된 기록",
            "Contact를 통해 접수된 문의 기록 중 삭제 요청 대상 정보",
            "PromptLab 서비스 이용과 연결된 관련 데이터",
          ]}
        />

        <DeleteInfoSection
          title="삭제 대상이 아닌 것"
          description="PromptLab에서 삭제할 수 없는 외부 계정입니다."
          items={[
            "Google 계정 자체",
            "Kakao 계정 자체",
            "이메일 계정 자체",
            "Google 또는 Kakao 서비스에 별도로 저장된 정보",
            "사용자가 외부 서비스에 직접 저장한 데이터",
          ]}
        />

        <DeleteInfoSection
          title="SafeCheck 원문 보관 기준"
          description="PromptLab은 민감한 원문 저장을 최소화하는 방향으로 운영합니다."
          items={[
            "SafeCheck는 민감한 원문 저장을 기본으로 하지 않습니다.",
            "검사 결과와 리포트에는 점수, 위험 카테고리, 안전 문장 안내, 정책 버전 등 필요한 정보만 저장될 수 있습니다.",
            "고객명, 전화번호, 이메일, 회사기밀, 계약조건 같은 민감한 원문은 저장하지 않는 것을 원칙으로 합니다.",
            "저장된 기록이 있는 경우 삭제 요청 대상에 포함됩니다.",
          ]}
        />

        <DeleteInfoSection
          title="일부 데이터 보관 기준"
          description="일부 정보는 법적 의무, 보안, 분쟁 대응을 위해 제한적으로 보관될 수 있습니다."
          items={[
            "법령상 보관 의무가 있는 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다.",
            "부정 이용 방지, 보안 사고 조사, 서비스 안정성 확인에 필요한 로그는 필요한 기간 동안 보관될 수 있습니다.",
            "분쟁 대응이나 권리 보호에 필요한 최소 정보는 해당 목적이 끝날 때까지 보관될 수 있습니다.",
            "보관 기간이 끝난 정보는 복구하기 어려운 방식으로 삭제됩니다.",
          ]}
        />

        <DeleteInfoSection
          title="접수 경로"
          description="삭제 요청은 아래 경로로 접수합니다."
          items={[
            "Contact: https://promptlab.io.kr/contact",
            "개인정보 문의: pictory-droid@gmail.com",
            "서비스명: PromptLab",
            "제작·운영: PICTORY-DROID, Seoin Kim",
            "운영 사이트: https://promptlab.io.kr",
          ]}
        />
      </div>
    </PageShell>
  );
}