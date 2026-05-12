"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AD_USAGE_LIMIT,
  AD_USAGE_STORAGE_KEY,
} from "@/features/ads/constants/ad-policy";
import type { AdGateState } from "@/features/ads/types/ad.types";

function getStoredUsageCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  const storedValue = window.localStorage.getItem(AD_USAGE_STORAGE_KEY);
  const parsedValue = Number.parseInt(storedValue ?? "0", 10);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function getRemainingCount(usageCount: number) {
  const remainder = usageCount % AD_USAGE_LIMIT;

  if (remainder === 0) {
    return AD_USAGE_LIMIT;
  }

  return AD_USAGE_LIMIT - remainder;
}

export function useUsageGate() {
  const [state, setState] = useState<AdGateState>({
    isReady: false,
    usageCount: 0,
    remainingCount: AD_USAGE_LIMIT,
    shouldShowGate: false,
  });

  useEffect(() => {
    const usageCount = getStoredUsageCount();

    setState({
      isReady: true,
      usageCount,
      remainingCount: getRemainingCount(usageCount),
      shouldShowGate: false,
    });
  }, []);

  const registerUse = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextUsageCount = getStoredUsageCount() + 1;
    window.localStorage.setItem(
      AD_USAGE_STORAGE_KEY,
      String(nextUsageCount),
    );

    setState({
      isReady: true,
      usageCount: nextUsageCount,
      remainingCount: getRemainingCount(nextUsageCount),
      shouldShowGate:
        nextUsageCount > 0 && nextUsageCount % AD_USAGE_LIMIT === 0,
    });
  }, []);

  const closeGate = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      shouldShowGate: false,
    }));
  }, []);

  const markAdViewed = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AD_USAGE_STORAGE_KEY, "0");
    }

    setState({
      isReady: true,
      usageCount: 0,
      remainingCount: AD_USAGE_LIMIT,
      shouldShowGate: false,
    });
  }, []);

  return {
    ...state,
    registerUse,
    closeGate,
    markAdViewed,
  };
}