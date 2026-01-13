'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ProjectDetails } from '@/components';

export default function ProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '0';
  const repoUrl = searchParams.get('repo') || undefined;

  return (
    <div className="relative z-0 bg-primary font-sans text-white overflow-hidden selection:bg-neon-purple selection:text-white">
      
      <ProjectDetails id={id} repoUrl={repoUrl} />
      
    </div>
  );
}

