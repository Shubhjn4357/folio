import fs from 'fs';
import path from 'path';
import { db, isDbConfigured } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface SettingsData {
  resumeUrl: string;
  resumeFilename?: string;
  updatedAt?: string;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

/**
 * Convert any Google Drive sharing or view URL into a direct download URL
 */
export function formatGoogleDriveUrl(url: string, mode: 'download' | 'view' = 'download'): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  if (clean.includes('drive.google.com')) {
    // Pattern 1: /file/d/FILE_ID/
    const match1 = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    // Pattern 2: id=FILE_ID
    const match2 = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = (match1 && match1[1]) || (match2 && match2[1]);
    if (fileId) {
      if (mode === 'download') {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
      return `https://drive.google.com/file/d/${fileId}/view`;
    }
  }
  return clean;
}

// Helper to ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read local settings file fallback
function readLocalSettings(): SettingsData {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Failed to read local settings file:', err);
  }
  return {
    resumeUrl: '',
    resumeFilename: '',
    updatedAt: '',
  };
}

// Write local settings file fallback
function writeLocalSettings(data: SettingsData) {
  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local settings file:', err);
  }
}

/**
 * Get the current active resume URL and details
 */
export async function getResumeSettings(): Promise<SettingsData> {
  // 1. Try fetching from Database if configured
  if (isDbConfigured) {
    try {
      const [record] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'resume_url'))
        .limit(1);

      if (record?.value) {
        try {
          const parsed = JSON.parse(record.value);
          return {
            resumeUrl: parsed.url || record.value,
            resumeFilename: parsed.filename || 'resume.pdf',
            updatedAt: record.updatedAt?.toISOString() || new Date().toISOString(),
          };
        } catch {
          return {
            resumeUrl: record.value,
            resumeFilename: 'resume.pdf',
            updatedAt: record.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('Error reading resume from DB, falling back to local storage:', err);
    }
  }

  // 2. Fall back to local file settings
  const local = readLocalSettings();
  if (local.resumeUrl) {
    return local;
  }

  // 3. Fallback: check if /public/resume.pdf exists
  const publicResume = path.join(process.cwd(), 'public', 'resume.pdf');
  if (fs.existsSync(publicResume)) {
    return {
      resumeUrl: '/resume.pdf',
      resumeFilename: 'resume.pdf',
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    resumeUrl: '',
    resumeFilename: '',
    updatedAt: '',
  };
}

/**
 * Update the active resume URL
 */
export async function saveResumeSettings(url: string, filename: string = 'resume.pdf'): Promise<SettingsData> {
  const payload: SettingsData = {
    resumeUrl: url,
    resumeFilename: filename,
    updatedAt: new Date().toISOString(),
  };

  // Always write to local storage as fallback
  writeLocalSettings(payload);

  // If DB configured, upsert into settings table
  if (isDbConfigured) {
    try {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'resume_url'))
        .limit(1);

      const jsonValue = JSON.stringify({ url, filename });

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: jsonValue, updatedAt: new Date() })
          .where(eq(settings.key, 'resume_url'));
      } else {
        await db.insert(settings).values({
          key: 'resume_url',
          value: jsonValue,
        });
      }
    } catch (err) {
      console.warn('Failed to save resume in DB:', err);
    }
  }

  return payload;
}
