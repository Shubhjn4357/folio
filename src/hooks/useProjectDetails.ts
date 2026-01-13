'use client';

import { useState, useEffect } from 'react';
import { Project } from '../constants';
import { fetchProjectFromGitHubUrl } from '../services/github';

interface UseProjectDetailsResult {
  project: Project | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch project details from GitHub
 */
export function useProjectDetails(
  repoUrl: string | undefined,
  fallbackProject: Project | null = null
): UseProjectDetailsResult {
  const [project, setProject] = useState<Project | null>(fallbackProject);
  const [loading, setLoading] = useState(!!repoUrl);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (!repoUrl || !repoUrl.includes('github.com')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const fetchedProject = await fetchProjectFromGitHubUrl(repoUrl);
        
        if (isMounted && fetchedProject) {
          setProject(fetchedProject);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch project'));
          console.error('Error fetching project details:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [repoUrl]);

  return { project, loading, error };
}
