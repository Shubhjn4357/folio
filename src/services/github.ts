'use client';

import { Project, Tag } from '../constants';

const GITHUB_API_BASE = 'https://api.github.com';
const RAW_GITHUB_BASE = 'https://raw.githubusercontent.com';

// Color palette for tags
const TAG_COLORS = [
  'blue-text-gradient',
  'green-text-gradient',
  'pink-text-gradient',
  'orange-text-gradient',
  'violet-text-gradient'
];

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  default_branch: string;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  homepage?: string | null;
  updated_at?: string;
  pushed_at?: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
}

export interface RepoDetails {
  name: string;
  description: string;
  topics: string[];
  defaultBranch: string;
  htmlUrl: string;
  owner: string;
}

/**
 * Fetch public repositories for a GitHub user
 */
export async function fetchUserRepos(username: string, limit: number = 30): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${limit}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.status}`);
    }
    
    return response.json();
  } catch (err) {
    console.error("fetchUserRepos error:", err);
    return [];
  }
}

/**
 * Fetch details for a specific repository
 */
export async function fetchRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repo details: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    name: data.name,
    description: data.description || '',
    topics: data.topics || [],
    defaultBranch: data.default_branch || 'main',
    htmlUrl: data.html_url,
    owner: data.owner.login
  };
}

/**
 * Fetch and parse README to find a genuine project screenshot or cover image,
 * with resilient branch fallback and GitHub OpenGraph preview card.
 */
export async function fetchReadmeImage(
  owner: string, 
  repo: string, 
  branch: string = 'main'
): Promise<string> {
  const openGraphFallback = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  const branchesToTry = Array.from(new Set([branch, 'main', 'master', 'dev', 'gh-pages'])).filter(Boolean);

  let readmeText: string | null = null;
  let usedBranch = branch || 'main';

  for (const b of branchesToTry) {
    for (const fileName of ['README.md', 'readme.md', 'README.markdown']) {
      try {
        const response = await fetch(`${RAW_GITHUB_BASE}/${owner}/${repo}/${b}/${fileName}`);
        if (response.ok) {
          readmeText = await response.text();
          usedBranch = b;
          break;
        }
      } catch {
        // continue trying
      }
    }
    if (readmeText) break;
  }

  if (!readmeText) {
    return openGraphFallback;
  }

  try {
    // Match both markdown images ![alt](url) and HTML <img src="url" />
    const imageRegex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)|<img[^>]+src=["']([^"']+)["']/gi;
    const candidates: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(readmeText)) !== null) {
      const rawUrl = match[1] || match[2];
      if (!rawUrl) continue;

      // Filter out badge/shield SVGs and stats counters
      if (/shields\.io|badgen\.net|badge|travis-ci|circleci|codecov|hitcounter|visitor|komarev|github-readme-stats|actions\/workflows/i.test(rawUrl)) {
        continue;
      }

      let fullUrl = rawUrl.trim();
      if (!fullUrl.startsWith('http')) {
        const cleanPath = fullUrl.replace(/^(\.\/|\/)/, '');
        fullUrl = `${RAW_GITHUB_BASE}/${owner}/${repo}/${usedBranch}/${cleanPath}`;
      } else if (fullUrl.includes('github.com') && fullUrl.includes('/blob/')) {
        fullUrl = fullUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }

      candidates.push(fullUrl);
    }

    if (candidates.length > 0) {
      // Prioritize preview, screenshot, banner, cover, mockup images
      const preview = candidates.find(c => /preview|screenshot|banner|demo|cover|mockup|ui|assets/i.test(c)) || candidates[0];
      return preview;
    }
  } catch {
    // fallback
  }

  return openGraphFallback;
}

/**
 * Parse GitHub URL to extract owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlParts = url.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    
    if (!owner || !repo) return null;
    
    return { owner, repo };
  } catch {
    return null;
  }
}

/**
 * Convert GitHub repo to Project format with parallel fetching
 */
export async function repoToProject(repo: GitHubRepo): Promise<Project> {
  const imagePromise = fetchReadmeImage(repo.owner.login, repo.name, repo.default_branch);
  
  // Combine topics and primary language into tags
  const rawTags = [...(repo.topics || [])];
  if (repo.language && !rawTags.map(t => t.toLowerCase()).includes(repo.language.toLowerCase())) {
    rawTags.unshift(repo.language);
  }

  const tags: Tag[] = rawTags.slice(0, 4).map((topic, i) => ({
    name: topic,
    color: TAG_COLORS[i % TAG_COLORS.length]
  }));
  
  if (tags.length === 0) {
    tags.push({ name: 'code', color: 'blue-text-gradient' });
  }
  
  const image = await imagePromise;
  
  return {
    name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
    description: repo.description || 'Open-source project on GitHub engineered with modern design principles.',
    tags,
    image: image || `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`,
    source_code_link: repo.html_url
  };
}

/**
 * Fetch top repos and convert to projects with Promise.all
 */
export async function fetchProjectsFromGitHub(
  username: string, 
  limit: number = 6
): Promise<Project[]> {
  const repos = await fetchUserRepos(username, Math.max(limit * 2, 20));
  
  const validRepos = repos
    .filter(repo => !repo.name.includes('.github'))
    .slice(0, limit);
  
  const projects = await Promise.all(validRepos.map(repoToProject));
  return projects;
}

/**
 * Fetch ALL repos for user to display on /project archive page
 */
export async function fetchAllProjectsFromGitHub(
  username: string
): Promise<Project[]> {
  const repos = await fetchUserRepos(username, 100);
  const validRepos = repos.filter(repo => !repo.name.includes('.github'));
  const projects = await Promise.all(validRepos.map(repoToProject));
  return projects;
}

/**
 * Fetch full project details from GitHub URL
 */
export async function fetchProjectFromGitHubUrl(githubUrl: string): Promise<Project | null> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) return null;
  
  const { owner, repo } = parsed;
  
  const [details, image] = await Promise.all([
    fetchRepoDetails(owner, repo),
    fetchReadmeImage(owner, repo)
  ]);
  
  const tags: Tag[] = details.topics.slice(0, 6).map((topic, i) => ({
    name: topic,
    color: TAG_COLORS[i % TAG_COLORS.length]
  }));
  
  if (tags.length === 0) {
    tags.push({ name: 'code', color: 'blue-text-gradient' });
  }
  
  return {
    name: details.name.replace(/-/g, ' ').replace(/_/g, ' '),
    description: details.description || 'A project from my GitHub portfolio.',
    tags,
    image: image || `https://opengraph.githubassets.com/1/${owner}/${repo}`,
    source_code_link: details.htmlUrl
  };
}
