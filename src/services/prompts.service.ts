import { PromptProject, PromptItem } from '@/types/prompts';

export interface GitHubRepoItem {
  id: number;
  name: string;
  displayName: string;
  description: string;
  html_url: string;
  topics: string[];
  homepage: string;
  language?: string;
  default_branch: string;
  stargazers_count: number;
}

export interface PromptProjectPayload {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  repoUrl?: string;
  liveUrl?: string;
  tags?: string[] | string;
  image?: string;
  prompts: PromptItem[];
  isFeatured?: boolean;
  order?: number;
}

/**
 * Fetch all public prompt projects
 */
export async function fetchPublicPromptProjects(): Promise<PromptProject[]> {
  const res = await fetch('/api/prompt-projects', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load prompt projects (${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch a single public prompt project by slug
 */
export async function fetchPublicPromptProjectBySlug(slug: string): Promise<PromptProject | null> {
  const res = await fetch(`/api/prompt-projects/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to load prompt project (${res.status})`);
  }
  const json = await res.json();
  return json.data || null;
}

/**
 * Fetch all prompt projects for admin dashboard
 */
export async function fetchAdminPromptProjects(): Promise<PromptProject[]> {
  const res = await fetch('/api/admin/prompt-projects', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch admin prompt projects (${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Save (create or update) a prompt project
 */
export async function savePromptProject(payload: PromptProjectPayload): Promise<PromptProject> {
  const res = await fetch('/api/admin/prompt-projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Failed to save prompt project (${res.status})`);
  }

  return json.data;
}

/**
 * Delete a prompt project
 */
export async function deletePromptProject(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/prompt-projects?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || `Failed to delete prompt project (${res.status})`);
  }

  return true;
}

/**
 * Upload an image file for a prompt project
 */
export async function uploadProjectImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.url) {
    throw new Error(json.error || 'Failed to upload image');
  }

  return json.url;
}

/**
 * Fetch GitHub repos for quick selection in admin
 */
export async function fetchGitHubReposForAdmin(username: string = 'Shubhjn4357'): Promise<GitHubRepoItem[]> {
  const res = await fetch(`/api/admin/github-repos?username=${encodeURIComponent(username)}`, {
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Failed to fetch GitHub repos (${res.status})`);
  }

  return json.data || [];
}

/**
 * Fetch preview image from a GitHub repository README
 */
export async function fetchRepoPreviewImage(
  repoName: string,
  branch: string = 'main',
  username: string = 'Shubhjn4357'
): Promise<string | null> {
  const res = await fetch(
    `/api/admin/github-repos?username=${encodeURIComponent(username)}&repo=${encodeURIComponent(repoName)}&branch=${encodeURIComponent(branch)}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.image || null;
}
