import fs from 'fs';
import path from 'path';
import { db, isDbConfigured } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface SettingsData {
  resumeUrl: string;
  resumeFilename?: string;
  updatedAt?: string;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');
const PUBLIC_SETTINGS_FILE = path.join(process.cwd(), 'public', 'resume-settings.json');

/**
 * Convert any Google Drive sharing, document, or preview URL into a direct download URL
 */
export function formatGoogleDriveUrl(url: string, mode: 'download' | 'view' = 'download'): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();

  if (clean.includes('drive.google.com') || clean.includes('docs.google.com')) {
    // Pattern 1: /file/d/FILE_ID or /document/d/FILE_ID or /d/FILE_ID
    const match1 = clean.match(/(?:\/file\/d\/|\/document\/d\/|\/d\/)([a-zA-Z0-9_-]+)/);
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

// Helper to ensure directory exists
function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read local settings file fallback (checks data/settings.json then public/resume-settings.json)
function readLocalSettings(): SettingsData {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed?.resumeUrl) return parsed;
    }
  } catch (err) {
    console.warn('Failed to read data/settings.json:', err);
  }

  try {
    if (fs.existsSync(PUBLIC_SETTINGS_FILE)) {
      const content = fs.readFileSync(PUBLIC_SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed?.resumeUrl) return parsed;
    }
  } catch (err) {
    console.warn('Failed to read public/resume-settings.json:', err);
  }

  return {
    resumeUrl: '',
    resumeFilename: '',
    updatedAt: '',
  };
}

// Write local settings file to both data/settings.json and public/resume-settings.json
function writeLocalSettings(data: SettingsData) {
  try {
    ensureDir(SETTINGS_FILE);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write data/settings.json:', err);
  }

  try {
    ensureDir(PUBLIC_SETTINGS_FILE);
    fs.writeFileSync(PUBLIC_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write public/resume-settings.json:', err);
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
          if (parsed?.url || parsed?.resumeUrl) {
            return {
              resumeUrl: parsed.url || parsed.resumeUrl,
              resumeFilename: parsed.filename || parsed.resumeFilename || 'Curriculum_Vitae.pdf',
              updatedAt: record.updatedAt?.toISOString() || new Date().toISOString(),
            };
          }
        } catch {
          if (record.value.trim()) {
            return {
              resumeUrl: record.value.trim(),
              resumeFilename: 'Curriculum_Vitae.pdf',
              updatedAt: record.updatedAt?.toISOString() || new Date().toISOString(),
            };
          }
        }
      }
    } catch (err) {
      console.warn('Error reading resume from DB, falling back to local storage:', err);
    }
  }

  // 2. Fall back to local file settings (data/settings.json or public/resume-settings.json)
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
    resumeFilename: 'Curriculum_Vitae.pdf',
    updatedAt: '',
  };
}

/**
 * Update the active resume URL
 */
export async function saveResumeSettings(url: string, filename: string = 'Curriculum_Vitae.pdf'): Promise<SettingsData> {
  const payload: SettingsData = {
    resumeUrl: url.trim(),
    resumeFilename: filename.trim() || 'Curriculum_Vitae.pdf',
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

      const jsonValue = JSON.stringify({ url: payload.resumeUrl, filename: payload.resumeFilename });

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
