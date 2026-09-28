'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Contact } from '@/lib/db/schema';
import { FaTrash, FaEnvelope, FaCheck, FaReply } from 'react-icons/fa6';

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="pb-6 border-b border-black/5 dark:border-white/5">
        <span className="mono-label text-neon-blue">Inquiries</span>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
          Client Messages
        </h1>
        <p className="text-secondary text-xs sm:text-sm mt-1">
          Review, reply to, and manage submissions from your portfolio contact form.
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-neon-purple">
            <FaEnvelope className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mb-1">No Messages Yet</h3>
          <p className="text-secondary text-xs">
            Client messages will appear here as soon as someone submits your contact form.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`glass-card rounded-3xl p-6 transition-all ${
                  contact.isRead
                    ? 'border-black/5 dark:border-white/5'
                    : 'border-neon-blue/30 shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-black/5 dark:border-white/5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                        {contact.name}
                      </h3>
                      {!contact.isRead && (
                        <span className="px-2.5 py-0.5 bg-neon-blue/15 text-neon-blue text-[10px] font-mono rounded-full font-semibold">
                          Unread
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-xs font-mono text-neon-purple hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <p className="text-xs font-mono text-secondary">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <p className="text-secondary text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                  {contact.message}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => toggleRead(contact.id, contact.isRead ?? false)}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors flex items-center gap-2"
                  >
                    <FaCheck className="w-3 h-3 text-neon-blue" />
                    <span>Mark as {contact.isRead ? 'Unread' : 'Read'}</span>
                  </button>

                  <a
                    href={`mailto:${contact.email}`}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-neon-purple hover:bg-neon-purple/10 transition-colors flex items-center gap-2"
                  >
                    <FaReply className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 ml-auto"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
