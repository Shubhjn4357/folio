import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';

// GET - Fetch single contact by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contactId = parseInt(id);

    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId));

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

// PATCH - Mark contact as read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contactId = parseInt(id);
    const body = await request.json();

    const [updated] = await db
      .update(contacts)
      .set({ isRead: body.isRead })
      .where(eq(contacts.id, contactId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact: updated });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE - Delete a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contactId = parseInt(id);

    const [deleted] = await db
      .delete(contacts)
      .where(eq(contacts.id, contactId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
