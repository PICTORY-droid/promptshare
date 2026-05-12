import { AD_USAGE_LIMIT } from "@/features/ads/constants/ad-policy";

export default function AdNotice() {
  return (
    <p className="text-xs leading-5 text-slate-500">
      SafeCheck {AD_USAGE_LIMIT}회 사용 후 광고 안내가 표시됩니다. 현재는 실제 광고
      송출 없이 안내 구조만 적용됩니다.
    </p>
  );
}