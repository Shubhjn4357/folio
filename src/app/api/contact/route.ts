import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';

// POST - Submit a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert into database
    const [newContact] = await db.insert(contacts).values({
      name,
      email,
      message,
    }).returning();

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!', id: newContact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Fetch all contacts (admin only)
export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all contacts ordered by newest first
    const allContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));

    return NextResponse.json({ contacts: allContacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
