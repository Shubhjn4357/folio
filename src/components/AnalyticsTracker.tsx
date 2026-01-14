'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  useEffect(() => {
    // Session Management
    let sessionId = localStorage.getItem('analytics_session_id');
    const sessionExpiry = localStorage.getItem('analytics_session_expiry');
    const now = Date.now();

    if (!sessionId || !sessionExpiry || now > parseInt(sessionExpiry)) {
      sessionId = uuidv4();
      localStorage.setItem('analytics_session_id', sessionId);
    }

    // Refresh expiry (30 mins from now)
    localStorage.setItem('analytics_session_expiry', (now + 30 * 60 * 1000).toString());

    // Track Pageview
    const trackPageview = async () => {
      try {
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: url,
            sessionId,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error('Analytics Error:', error);
      }
    };

    trackPageview();

  }, [pathname, searchParams]);

  return null;
}
