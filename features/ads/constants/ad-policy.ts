export const AD_USAGE_LIMIT = 5;

export const AD_USAGE_STORAGE_KEY = "promptlab:safecheck-usage-count";

export const AD_GATE_COPY = {
  title: "광고 안내",
  description:
    "SafeCheck를 5회 사용했습니다. 실제 광고 연결 전까지는 안내 모달만 표시됩니다.",
  primaryAction: "광고 보기",
  secondaryAction: "나중에 보기",
  notice:
    "현재는 광고 송출 코드 없이 구조만 준비한 상태입니다. 기능 사용은 계속 가능합니다.",
} as const;