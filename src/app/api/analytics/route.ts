import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { visitors } from '@/lib/db/schema';
import { sql, desc, gte } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';

// POST - Track a visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page } = body;

    // Get visitor info from headers
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const referrer = request.headers.get('referer') || '';

    await db.insert(visitors).values({
      page: page || '/',
      userAgent,
      ip,
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

    // Get total visitors
    const totalVisitors = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate));

    // Get visitors by page
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

    // Get visitors by day
    const visitorsByDay = await db
      .select({
        date: sql<string>`DATE(${visitors.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.createdAt, startDate))
      .groupBy(sql`DATE(${visitors.createdAt})`)
      .orderBy(sql`DATE(${visitors.createdAt})`);

    // Get recent visitors
    const recentVisitors = await db
      .select()
      .from(visitors)
      .orderBy(desc(visitors.createdAt))
      .limit(20);

    return NextResponse.json({
      totalVisitors: totalVisitors[0]?.count || 0,
      visitorsByPage,
      visitorsByDay,
      recentVisitors,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
