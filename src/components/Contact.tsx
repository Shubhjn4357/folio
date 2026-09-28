'use client';

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "../hoc";
import { FaEnvelope, FaFileArrowDown, FaCheck } from "react-icons/fa6";

export const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [resumeFilename, setResumeFilename] = useState<string>('resume.pdf');

  useEffect(() => {
    let isMounted = true;
    async function loadResume() {
      try {
        const res = await fetch('/api/resume');
        const json = await res.json();
        if (isMounted) {
          if (json.url) {
            setResumeUrl(json.url);
            setDownloadUrl(json.downloadUrl || json.url);
          }
          if (json.filename) {
            setResumeFilename(json.filename);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic resume info:', err);
      }
    }
    loadResume();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again or reach out directly via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" id="contact">
      <div className="glass-card rounded-3xl p-6 sm:p-12 border border-black/10 dark:border-white/10 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-neon-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="mono-label text-neon-blue">Contact & Inquiries</span>
              <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[var(--text-main)] mt-2 leading-tight">
                Let's talk about your project.
              </h2>
              <p className="mt-4 text-secondary text-sm sm:text-base leading-relaxed">
                Have an idea, project, or full-time opportunity in mind? Send a note and let's craft something remarkable together.
              </p>

              {/* Status Pill */}
              <div className="mt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 w-fit">
                <span className="mono-label text-[10px]">I'll reply soon.</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
              <a
                href="mailto:shubhjn4357@gmail.com"
                className="glass-pill px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-mono text-secondary hover:text-[var(--text-main)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-neon-purple w-4 h-4" />
                  <span>shubhjn4357@gmail.com</span>
                </div>
                <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
              </a>

              <a
                href={downloadUrl || resumeUrl || '#'}
                onClick={(e) => {
                  const target = downloadUrl || resumeUrl;
                  if (!target) {
                    e.preventDefault();
                    alert('Resume has not been configured yet. You can upload or link it in Admin > Resume / CV.');
                  }
                }}
                target={(downloadUrl || resumeUrl).startsWith('http') ? '_blank' : undefined}
                rel={(downloadUrl || resumeUrl).startsWith('http') ? 'noopener noreferrer' : undefined}
                download={(downloadUrl || resumeUrl).startsWith('http') ? undefined : resumeFilename}
                className="glass-pill px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-mono text-secondary hover:text-[var(--text-main)] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FaFileArrowDown className="text-neon-blue w-4 h-4" />
                  <span>Download Curriculum Vitae</span>
                </div>
                <span className="opacity-40 group-hover:opacity-100 transition-opacity">
                  {resumeUrl.endsWith('.pdf')
                    ? 'PDF'
                    : resumeUrl.includes('drive.google')
                    ? 'DRIVE ↗'
                    : resumeUrl.startsWith('http')
                    ? 'LINK ↗'
                    : 'DOWNLOAD'}
                </span>
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 relative"
            >
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-2xl text-center p-6 border border-emerald-500/30"
                  >
                    <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                      <FaCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-display font-semibold text-[var(--text-main)] mb-1">Message Received</h4>
                    <p className="text-secondary text-sm mb-5 max-w-xs">
                      Thanks for reaching out! I will review your note and respond shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider uppercase"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="mono-label text-[11px] text-secondary">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="mono-label text-[11px] text-secondary">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    required
                    className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="mono-label text-[11px] text-secondary">Project Details</label>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and goals..."
                  required
                  className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-wipe mt-2 py-3.5 px-8 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-full shadow-lg hover:shadow-xl self-start disabled:opacity-50 transition-all"
              >
                {loading ? "Sending..." : "Submit Inquiry →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
