import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";
import DeleteInfoSection from "./DeleteInfoSection";

const lastUpdated = "2026-05-12";

export default function DeleteAccountShell() {
  return (
    <PageShell>
      <PageHeader
        badge="Account & Data Deletion"
        title="계정 및 데이터 삭제 요청"
        description="PromptLab 계정과 관련 데이터 삭제를 요청하는 방법을 안내합니다"
        meta={<>최종 업데이트: {lastUpdated}</>}
      />

      <Card className="border-emerald-100 bg-emerald-50">
        <CardContent className="p-5 sm:p-6">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <CardTitle className="text-emerald-950">
                PromptLab 계정 삭제 안내
              </CardTitle>
              <CardDescription className="text-emerald-800">
                앱 이름: PromptLab · 제작·운영: PICTORY-DROID, Seoin Kim
              </CardDescription>
            </div>

            <p className="text-sm leading-7 text-emerald-900">
              사용자는 PromptLab 계정과 저장 데이터의 삭제를 요청할 수 있습니다.
              삭제 요청은 Contact 페이지 또는 개인정보 문의 이메일을 통해 접수합니다.
              본인 확인이 필요한 경우 추가 확인 절차가 진행될 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-5">
        <DeleteInfoSection
          title="1. 계정 삭제 요청 방법"
          description="아래 절차에 따라 계정 삭제를 요청할 수 있습니다"
          items={[
            "Contact 페이지로 이동합니다: https://promptlab.io.kr/contact",
            "문의 유형에서 계정 또는 개인정보 관련 내용을 선택하거나 기타 문의로 작성합니다",
            "문의 내용에 계정 삭제 요청이라고 적고, 로그인에 사용한 이메일 주소를 함께 입력합니다",
            "개인정보 문의 이메일로 직접 요청할 수도 있습니다: pictory-droid@gmail.com",
            "요청 접수 후 본인 확인이 필요한 경우 추가 확인 절차가 진행될 수 있습니다",
          ]}
        />

        <DeleteInfoSection
          title="2. 삭제될 수 있는 데이터"
          description="계정 삭제 요청이 처리되면 아래 데이터가 삭제 대상에 포함될 수 있습니다"
          items={[
            "PromptLab 계정 식별 정보",
            "로그인에 사용된 이메일 주소와 소셜 로그인 식별 정보",
            "사용자가 저장한 프롬프트 제목, 본문, 예시 입력, 예시 출력, 안전 주의사항",
            "프롬프트 공개 범위, 게시 상태, 보관 상태 등 프롬프트 관리 정보",
            "SafeCheck 검사 기록 중 사용자 계정과 연결된 기록",
            "Contact를 통해 접수된 문의 기록 중 삭제 요청 대상에 해당하는 정보",
          ]}
        />

        <DeleteInfoSection
          title="3. 저장하지 않는 SafeCheck 원문"
          description="SafeCheck 리포트에는 민감한 검사 원문을 저장하지 않는 것을 원칙으로 합니다"
          items={[
            "SafeCheck 리포트에는 검사 원문 프롬프트를 저장하지 않습니다",
            "SafeCheck 리포트에는 고객명, 전화번호, 이메일 원문을 저장하지 않습니다",
            "SafeCheck 리포트에는 회사기밀, 내부자료, 계약조건 원문을 저장하지 않습니다",
            "SafeCheck 리포트에는 상담기록, 진료기록 같은 민감한 원문을 저장하지 않습니다",
            "리포트에는 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각 중심으로 저장될 수 있습니다",
          ]}
        />

        <DeleteInfoSection
          title="4. 보관될 수 있는 데이터와 기간"
          description="일부 정보는 보안, 법적 의무, 분쟁 대응을 위해 제한적으로 보관될 수 있습니다"
          items={[
            "법령상 보관 의무가 있는 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다",
            "부정 이용 방지, 보안 사고 조사, 서비스 안정성 확인에 필요한 로그는 필요한 기간 동안 보관될 수 있습니다",
            "분쟁 대응, 권리 보호, 약관 위반 조사에 필요한 최소 정보는 해당 목적이 끝날 때까지 보관될 수 있습니다",
            "외부 서비스의 백업 또는 시스템 로그에 남은 정보는 각 서비스의 보존 정책에 따라 순차적으로 삭제될 수 있습니다",
            "삭제 요청 처리 후에도 법적·보안상 필요한 최소 정보는 완전 삭제가 지연될 수 있습니다",
          ]}
        />

        <DeleteInfoSection
          title="5. 계정 삭제 없이 일부 데이터 삭제 요청"
          description="계정을 삭제하지 않고 일부 데이터만 삭제하도록 요청할 수 있습니다"
          items={[
            "저장한 프롬프트 일부 또는 전체 삭제를 요청할 수 있습니다",
            "SafeCheck 기록 삭제를 요청할 수 있습니다",
            "Contact 문의 기록 삭제를 요청할 수 있습니다",
            "삭제 요청 시 어떤 데이터를 삭제하려는지 구체적으로 적어야 합니다",
            "일부 데이터 삭제 요청도 Contact 페이지 또는 개인정보 문의 이메일로 접수합니다",
          ]}
        />

        <DeleteInfoSection
          title="6. 삭제 요청 접수 경로"
          description="계정 또는 데이터 삭제 요청은 아래 경로로 접수합니다"
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