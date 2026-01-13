'use client';

import React, { createContext, useContext, useState } from 'react';

interface HandTrackingContextType {
  isHandTrackingEnabled: boolean;
  enableHandTracking: () => void;
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
}

const HandTrackingContext = createContext<HandTrackingContextType | undefined>(undefined);

export function HandTrackingProvider({ children }: { children: React.ReactNode }) {
  const [isHandTrackingEnabled, setIsHandTrackingEnabled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const enableHandTracking = () => {
    setIsHandTrackingEnabled(true);
    setShowGuide(false);
  };

  return (
    <HandTrackingContext.Provider value={{ isHandTrackingEnabled, enableHandTracking, showGuide, setShowGuide }}>
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
