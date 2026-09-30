import type { Contact } from '@/lib/db/schema';

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Fetch all contacts for admin
 */
export async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch('/api/contact', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load contacts (${res.status})`);
  }
  const data = await res.json();
  return data.contacts || [];
}

/**
 * Toggle read state for a contact message
 */
export async function toggleReadContact(id: number, isRead: boolean): Promise<void> {
  const res = await fetch(`/api/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead: !isRead }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update contact status (${res.status})`);
  }
}

/**
 * Delete a contact message
 */
export async function deleteContact(id: number): Promise<boolean> {
  const res = await fetch(`/api/contact/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete contact (${res.status})`);
  }

  return true;
}

/**
 * Submit contact form message from visitor
 */
export async function submitContactMessage(form: ContactInput): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send message');
  }

  return data;
}
