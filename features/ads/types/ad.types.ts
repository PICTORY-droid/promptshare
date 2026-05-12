export type AdGateAction = "view_ad" | "dismiss";

export type AdGateState = {
  isReady: boolean;
  usageCount: number;
  remainingCount: number;
  shouldShowGate: boolean;
};