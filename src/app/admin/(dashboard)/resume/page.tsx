'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileArrowDown,
  FaLink,
  FaCloudArrowUp,
  FaCheck,
  FaArrowUpRightFromSquare,
  FaCircleCheck,
  FaCircleExclamation,
  FaFilePdf,
} from 'react-icons/fa6';

export default function AdminResumePage() {
  const [currentResume, setCurrentResume] = useState<{
    resumeUrl: string;
    resumeFilename?: string;
    updatedAt?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [directUrl, setDirectUrl] = useState('');
  const [directName, setDirectName] = useState('');
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current resume data
  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/resume');
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentResume(json.data);
        if (json.data.resumeUrl && json.data.resumeUrl.startsWith('http')) {
          setDirectUrl(json.data.resumeUrl);
        }
        if (json.data.resumeFilename) {
          setDirectName(json.data.resumeFilename);
        }
      }
    } catch (err) {
      console.error('Failed to load resume info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  // Handle direct URL submit
  const handleSaveDirectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) {
      showToast('error', 'Please enter a valid URL or link.');
      return;
    }

    try {
      setIsSavingUrl(true);
      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: directUrl.trim(),
          filename: directName.trim() || 'Curriculum_Vitae.pdf',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update resume link');
      }

      setCurrentResume(json.data);
      showToast('success', 'Resume link updated successfully! The download button now points to this link.');
    } catch (err: any) {
      showToast('error', err.message || 'Error updating resume link');
    } finally {
      setIsSavingUrl(false);
    }
  };

  // Handle File Upload submit
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('error', 'Please choose a file to upload first.');
      return;
    }

    try {
      setIsUploadingFile(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (directName.trim()) {
        formData.append('filename', directName.trim());
      }

      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to upload file');
      }

      setCurrentResume(json.data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      showToast('success', 'Resume file uploaded successfully! It is now live on the site.');
    } catch (err: any) {
      showToast('error', err.message || 'Error uploading resume file');
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-blue">Profile & Assets</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Resume / CV Management
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Upload your resume file or connect an external cloud link (Google Drive, Dropbox, S3).
          </p>
        </div>

        {currentResume?.resumeUrl && (
          <a
            href={currentResume.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-wipe px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full flex items-center gap-2 self-start sm:self-auto shadow-md"
          >
            <FaFileArrowDown className="w-3.5 h-3.5" />
            <span>Test Live Download</span>
            <FaArrowUpRightFromSquare className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-mono border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <FaCircleCheck className="w-4 h-4 shrink-0" />
            ) : (
              <FaCircleExclamation className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Active Status Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue shrink-0">
              <FaFilePdf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="mono-label text-[10px] text-secondary">Current Active Resume</span>
                {currentResume?.resumeUrl ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                    Live On Site
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                    Not Configured
                  </span>
                )}
              </div>

              <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                {currentResume?.resumeFilename || 'No file name specified'}
              </h3>

              <p className="text-secondary text-xs font-mono mt-1 break-all">
                {currentResume?.resumeUrl || 'No resume link configured yet. Upload a file or paste a link below.'}
              </p>

              {currentResume?.updatedAt && (
                <p className="text-[11px] font-mono text-secondary/70 mt-2">
                  Last updated: {new Date(currentResume.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(currentResume.updatedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {currentResume?.resumeUrl && (
            <div className="flex items-center gap-3">
              <a
                href={currentResume.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-4 py-2 rounded-full text-xs font-mono text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-2 border border-black/10 dark:border-white/15"
              >
                <span>View File</span>
                <FaArrowUpRightFromSquare className="w-3 h-3 opacity-60" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Update Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option 1: Direct File Link */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                <FaLink className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">
                Connect External Link
              </h2>
            </div>
            <p className="text-secondary text-xs leading-relaxed mb-6">
              Paste a direct share link from Google Drive, Dropbox, AWS S3, Cloudflare, or any custom URL.
            </p>

            <form onSubmit={handleSaveDirectUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">
                  Direct File Link / URL *
                </label>
                <input
                  type="url"
                  required
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">
                  Display File Name
                </label>
                <input
                  type="text"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  placeholder="Shubham_Jain_Resume.pdf"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingUrl || !directUrl.trim()}
                  className="btn-wipe w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-2xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingUrl ? (
                    <span>Saving Link...</span>
                  ) : (
                    <>
                      <FaCheck className="w-3.5 h-3.5" />
                      <span>Save & Activate Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Option 2: Upload File Directly */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                <FaCloudArrowUp className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">
                Upload File Directly
              </h2>
            </div>
            <p className="text-secondary text-xs leading-relaxed mb-6">
              Upload your PDF file directly to your portfolio server. It will be stored and served locally.
            </p>

            <form onSubmit={handleFileUpload} className="space-y-4">
              {/* File Dropzone Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-black/15 dark:border-white/15 hover:border-neon-blue rounded-2xl p-6 text-center cursor-pointer transition-colors bg-black/5 dark:bg-white/5 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-secondary group-hover:text-neon-blue transition-colors mb-3">
                  <FaCloudArrowUp className="w-5 h-5" />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-xs font-mono font-medium text-[var(--text-main)]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] font-mono text-secondary mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to choose different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-mono font-medium text-[var(--text-main)]">
                      Click to browse or drop resume file
                    </p>
                    <p className="text-[11px] font-mono text-secondary mt-1">
                      Supports PDF, DOCX, DOC (up to 15MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploadingFile || !selectedFile}
                  className="btn-wipe w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-2xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploadingFile ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <FaCloudArrowUp className="w-3.5 h-3.5" />
                      <span>Upload & Deploy Resume</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
