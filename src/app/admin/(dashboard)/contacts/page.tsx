'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Contact } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const toggleRead = async (id: number, isRead: boolean) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !isRead }),
      });
      setContacts(contacts.map(c =>
        c.id === id ? { ...c, isRead: !isRead } : c
      ));
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-secondary">Manage messages from your contact form</p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-tertiary rounded-2xl p-12 text-center">
          <p className="text-6xl mb-4">📬</p>
          <p className="text-secondary">No messages yet. They'll appear here when visitors contact you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-tertiary rounded-xl p-6 border ${contact.isRead ? 'border-white/10' : 'border-neon-blue/30'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">{contact.name}</h3>
                    {!contact.isRead && (
                      <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full">
                        Unread
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${contact.email}`} className="text-neon-blue hover:underline text-sm">
                    {contact.email}
                  </a>
                </div>
                <p className="text-secondary text-sm">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>

              <p className="text-secondary mb-4 whitespace-pre-wrap">{contact.message}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleRead(contact.id, contact.isRead ?? false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-secondary text-sm rounded-lg transition-colors"
                >
                  Mark as {contact.isRead ? 'Unread' : 'Read'}
                </button>
                <a
                  href={`mailto:${contact.email}`}
                  className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple text-sm rounded-lg transition-colors"
                >
                  Reply
                </a>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
