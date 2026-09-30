export interface ResumeSettingsData {
  resumeUrl: string | null;
  resumeFilename: string;
  downloadUrl?: string | null;
  updatedAt?: string;
}

/**
 * Fetch current resume configuration for admin
 */
export async function fetchAdminResume(): Promise<ResumeSettingsData> {
  const res = await fetch('/api/admin/resume', { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok || !json.data) {
    throw new Error(json.error || `Failed to fetch resume settings (${res.status})`);
  }
  return json.data;
}

/**
 * Save direct resume link (Google Drive, Dropbox, cloud storage, etc.)
 */
export async function updateResumeDirectUrl(url: string, filename?: string): Promise<ResumeSettingsData> {
  const res = await fetch('/api/admin/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: url.trim(),
      filename: filename?.trim() || 'Curriculum_Vitae.pdf',
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Failed to update resume link (${res.status})`);
  }

  return json.data;
}

/**
 * Upload a resume PDF/document file
 */
export async function uploadResumeFile(file: File, filename?: string): Promise<ResumeSettingsData> {
  const formData = new FormData();
  formData.append('file', file);
  if (filename && filename.trim()) {
    formData.append('filename', filename.trim());
  }

  const res = await fetch('/api/admin/resume', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Failed to upload resume file (${res.status})`);
  }

  return json.data;
}

/**
 * Fetch public resume configuration for visitor download
 */
export async function fetchPublicResume(): Promise<{ url: string | null; filename: string; downloadUrl?: string | null }> {
  const res = await fetch('/api/resume', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch public resume (${res.status})`);
  }
  return res.json();
}
