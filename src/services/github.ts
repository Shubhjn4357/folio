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
  owner: {
    login: string;
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
export async function fetchUserRepos(username: string, limit: number = 12): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.status}`);
  }
  
  return response.json();
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
 * Fetch and parse README to find the first image
 */
export async function fetchReadmeImage(
  owner: string, 
  repo: string, 
  branch: string = 'main'
): Promise<string | null> {
  try {
    const response = await fetch(
      `${RAW_GITHUB_BASE}/${owner}/${repo}/${branch}/README.md`
    );
    
    if (!response.ok) return null;
    
    const readmeText = await response.text();
    
    // Find markdown image: ![]()
    const mdImageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
    // Find HTML image: <img src="..." />
    const htmlImageMatch = readmeText.match(/<img[^>]+src=["'](.*?)["']/);
    
    let imageUrl = mdImageMatch?.[1] || htmlImageMatch?.[1] || null;
    
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Convert relative path to absolute
      const cleanPath = imageUrl.replace(/^(\.\/|\/)/, '');
      imageUrl = `${RAW_GITHUB_BASE}/${owner}/${repo}/${branch}/${cleanPath}`;
    }
    
    return imageUrl;
  } catch {
    return null;
  }
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
  // Fetch image in parallel with processing
  const imagePromise = fetchReadmeImage(repo.owner.login, repo.name, repo.default_branch);
  
  // Map topics to tags with colors
  const tags: Tag[] = repo.topics.slice(0, 4).map((topic, i) => ({
    name: topic,
    color: TAG_COLORS[i % TAG_COLORS.length]
  }));
  
  // Add default tag if no topics
  if (tags.length === 0) {
    tags.push({ name: 'code', color: 'blue-text-gradient' });
  }
  
  const image = await imagePromise;
  
  return {
    name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
    description: repo.description || 'A project from my GitHub portfolio.',
    tags,
    image: image || '/placeholder-project.svg',
    source_code_link: repo.html_url
  };
}

/**
 * Fetch multiple repos and convert to projects with Promise.all optimization
 */
export async function fetchProjectsFromGitHub(
  username: string, 
  limit: number = 6
): Promise<Project[]> {
  const repos = await fetchUserRepos(username, limit * 2);
  
  // Filter out config repos and those without descriptions
  const validRepos = repos
    .filter(repo => !repo.name.includes('.github') && repo.description)
    .slice(0, limit);
  
  // Convert all repos to projects in parallel
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
  
  // Fetch repo details and image in parallel
  const [details, image] = await Promise.all([
    fetchRepoDetails(owner, repo),
    fetchReadmeImage(owner, repo)
  ]);
  
  // Map topics to tags
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
    image: image || '/placeholder-project.svg',
    source_code_link: details.htmlUrl
  };
}
