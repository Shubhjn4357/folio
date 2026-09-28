'use client';

import React, { createContext, useContext } from 'react';

interface HandTrackingContextType {
  isHandTrackingEnabled: boolean;
  enableHandTracking: () => void;
  disableHandTracking: () => void;
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
}

const HandTrackingContext = createContext<HandTrackingContextType>({
  isHandTrackingEnabled: false,
  enableHandTracking: () => {},
  disableHandTracking: () => {},
  showGuide: false,
  setShowGuide: () => {},
});

export function HandTrackingProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useHandTracking() {
  return useContext(HandTrackingContext);
}
