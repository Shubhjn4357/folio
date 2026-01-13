'use client';

import { useState, useEffect } from 'react';
import { Project } from '../constants';
import { fetchProjectsFromGitHub } from '../services/github';

interface UseGitHubReposResult {
  projects: Project[];
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch GitHub repos and convert to projects
 */
export function useGitHubRepos(
  username: string,
  limit: number = 6,
  fallbackProjects: Project[] = []
): UseGitHubReposResult {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedProjects = await fetchProjectsFromGitHub(username, limit);
        
        if (isMounted) {
          if (fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch repos'));
          console.error('Error fetching GitHub repos:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRepos();

    return () => {
      isMounted = false;
    };
  }, [username, limit]);

  return { projects, loading, error };
}
