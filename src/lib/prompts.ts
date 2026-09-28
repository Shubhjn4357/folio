import fs from 'fs';
import path from 'path';
import { db, isDbConfigured } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { PromptItem, PromptProject, INITIAL_PROMPT_PROJECTS } from '@/types/prompts';
export type { PromptItem, PromptProject };
export { INITIAL_PROMPT_PROJECTS };

const PROMPTS_FILE = path.join(process.cwd(), 'data', 'prompt-projects.json');

// Helper to ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(PROMPTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read local prompt projects file
function readLocalProjects(): PromptProject[] {
  try {
    ensureDataDir();
    if (fs.existsSync(PROMPTS_FILE)) {
      const content = fs.readFileSync(PROMPTS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read prompt projects file:', err);
  }

  // Fallback to initial seeds and write
  try {
    writeLocalProjects(INITIAL_PROMPT_PROJECTS);
  } catch {
    // ignore
  }
  return INITIAL_PROMPT_PROJECTS;
}

// Write local prompt projects file
function writeLocalProjects(projects: PromptProject[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write prompt projects file:', err);
  }
}

/**
 * Get all prompt projects
 */
export async function getPromptProjects(): Promise<PromptProject[]> {
  // 1. Try DB settings key 'prompt_projects' if DB is configured
  if (isDbConfigured) {
    try {
      const [record] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'prompt_projects'))
        .limit(1);

      if (record?.value) {
        const parsed = JSON.parse(record.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('DB read error for prompt_projects, using local storage:', err);
    }
  }

  // 2. Return local file projects
  return readLocalProjects();
}

/**
 * Get a single prompt project by slug
 */
export async function getPromptProjectBySlug(slug: string): Promise<PromptProject | null> {
  const all = await getPromptProjects();
  const normalized = slug.toLowerCase().trim();
  return all.find((p) => p.slug.toLowerCase().trim() === normalized) || null;
}

/**
 * Save / Upsert a prompt project
 */
export async function savePromptProject(
  projectData: Omit<PromptProject, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<PromptProject> {
  const all = await getPromptProjects();
  const now = new Date().toISOString();

  let targetProject: PromptProject;

  if (projectData.id) {
    // Update existing
    const index = all.findIndex((p) => p.id === projectData.id);
    if (index !== -1) {
      targetProject = {
        ...all[index],
        ...projectData,
        id: projectData.id,
        updatedAt: now,
      };
      all[index] = targetProject;
    } else {
      targetProject = {
        ...projectData,
        id: projectData.id,
        createdAt: now,
        updatedAt: now,
      };
      all.push(targetProject);
    }
  } else {
    // Create new
    const newId = `prompt-proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    targetProject = {
      ...projectData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(targetProject);
  }

  // Persist locally
  writeLocalProjects(all);

  // Sync with DB if configured
  if (isDbConfigured) {
    try {
      const jsonValue = JSON.stringify(all);
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'prompt_projects'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: jsonValue, updatedAt: new Date() })
          .where(eq(settings.key, 'prompt_projects'));
      } else {
        await db.insert(settings).values({
          key: 'prompt_projects',
          value: jsonValue,
        });
      }
    } catch (err) {
      console.warn('DB upsert error for prompt_projects:', err);
    }
  }

  return targetProject;
}

/**
 * Delete a prompt project by id
 */
export async function deletePromptProject(id: string): Promise<boolean> {
  const all = await getPromptProjects();
  const filtered = all.filter((p) => p.id !== id);

  if (filtered.length === all.length) {
    return false; // not found
  }

  writeLocalProjects(filtered);

  if (isDbConfigured) {
    try {
      await db
        .update(settings)
        .set({ value: JSON.stringify(filtered), updatedAt: new Date() })
        .where(eq(settings.key, 'prompt_projects'));
    } catch (err) {
      console.warn('DB delete sync error:', err);
    }
  }

  return true;
}
