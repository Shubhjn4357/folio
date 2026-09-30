'use client';

import { ProjectCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function AllProjectsLoading() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-36 rounded-full" />
        <div className="pb-6 border-b border-black/5 dark:border-white/5 space-y-3">
          <Skeleton className="h-4 w-40 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-80 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>

      {/* Tabs & Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full sm:w-64 rounded-full" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
