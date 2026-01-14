import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { visitors } from '@/lib/db/schema';
import { sql, desc, gte, eq, and, countDistinct } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';
import { UAParser } from 'ua-parser-js';

// POST - Track a visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, sessionId, referrer } = body;

    // Parse User Agent
    const userAgentString = request.headers.get('user-agent') || '';
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    const deviceType = result.device.type || 'desktop'; // Default to desktop if undefined (common for PCs)
    const os = result.os.name || 'Unknown';
    const browser = result.browser.name || 'Unknown';

    // Geo Info (Vercel Headers)
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
      'unknown';

    await db.insert(visitors).values({
      page: page || '/',
      userAgent: userAgentString,
      ip,
      sessionId: sessionId || 'anonymous',
      deviceType,
      os,
      browser,
      city,
      country,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 1. Total Page Views
    const totalViewsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate));
    const totalViews = Number(totalViewsRes[0]?.count || 0);

    // 2. Unique Visitors (Sessions)
    const uniqueVisitorsRes = await db
      .select({ count: sql<number>`count(distinct ${visitors.sessionId})` })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate));
    const uniqueVisitors = Number(uniqueVisitorsRes[0]?.count || 0);

    // 3. Avg Pages Per Session
    const avgPagesPerSession = uniqueVisitors > 0
      ? Math.round((totalViews / uniqueVisitors) * 10) / 10
      : 0;

    // 3. Bounce Rate Calculation
    // Sessions with only 1 page view / Total Sessions
    const bounceRateRes = await db.execute(sql`
      WITH session_counts AS (
        SELECT session_id, COUNT(*) as view_count
        FROM ${visitors}
        WHERE created_at >= ${startDate}
        GROUP BY session_id
      )
      SELECT 
        (COUNT(CASE WHEN view_count = 1 THEN 1 END) * 100.0 / COUNT(*)) as bounce_rate
      FROM session_counts
    `);
    const bounceRate = Math.round(Number(bounceRateRes.rows[0]?.bounce_rate || 0));

    // 4. Visitors by Page
    const visitorsByPage = await db
      .select({
        page: visitors.page,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate))
      .groupBy(visitors.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // 5. Visitors by Day
    const visitorsByDay = await db
      .select({
        date: sql<string>`TO_CHAR(${visitors.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate))
      .groupBy(sql`TO_CHAR(${visitors.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${visitors.createdAt}, 'YYYY-MM-DD')`);

    // 6. Device Breakdown
    const devices = await db
      .select({
        name: visitors.deviceType,
        value: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate))
      .groupBy(visitors.deviceType);

    // 7. Geo Stats (Country)
    const countries = await db
      .select({
        name: visitors.country,
        value: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate))
      .groupBy(visitors.country)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // 8. Recent Visitors
    const recentVisitors = await db
      .select()
      .from(visitors)
      .orderBy(desc(visitors.createdAt))
      .limit(20);

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      bounceRate,
      avgPagesPerSession,
      visitorsByPage,
      visitorsByDay,
      devices,
      countries,
      recentVisitors,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
