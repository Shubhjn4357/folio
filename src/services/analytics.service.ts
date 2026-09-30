export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgPagesPerSession: number;
  visitorsByPage: Array<{ page: string; count: number }>;
  visitorsByDay: Array<{ date: string; count: number }>;
  devices: Array<{ name: string; value: number }>;
  countries: Array<{ name: string; value: number }>;
  recentVisitors: Array<{
    id: number;
    page: string;
    userAgent: string;
    city: string;
    country: string;
    deviceType: string;
    browser: string;
    os: string;
    createdAt: string;
  }>;
}

/**
 * Fetch analytics data aggregated over a number of days
 */
export async function fetchAnalytics(days: number = 30): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics?days=${days}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics (${res.status})`);
  }
  return res.json();
}
