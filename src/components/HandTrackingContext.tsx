'use client';

import React, { createContext, useContext, useState } from 'react';

interface HandTrackingContextType {
  isHandTrackingEnabled: boolean;
  enableHandTracking: () => void;
  disableHandTracking: () => void;
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
}

const HandTrackingContext = createContext<HandTrackingContextType | undefined>(undefined);

export function HandTrackingProvider({ children }: { children: React.ReactNode }) {
  const [isHandTrackingEnabled, setIsHandTrackingEnabled] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const enableHandTracking = () => {
    setIsHandTrackingEnabled(true);
    setShowGuide(false);
  };

  const disableHandTracking = () => {
    setIsHandTrackingEnabled(false);
  };

  return (
    <HandTrackingContext.Provider value={{ isHandTrackingEnabled, enableHandTracking, disableHandTracking, showGuide, setShowGuide }}>
      {children}
    </HandTrackingContext.Provider>
  );
}

export function useHandTracking() {
  const context = useContext(HandTrackingContext);
  if (context === undefined) {
    throw new Error('useHandTracking must be used within a HandTrackingProvider');
  }
  return context;
}
