'use client';

import { PromptCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function PromptsLoading() {
  return (
    <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header & Back Link Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-44 rounded-full" />
        <div className="pb-6 border-b border-black/5 dark:border-white/5 space-y-3">
          <Skeleton className="h-4 w-48 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-80 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>

      {/* Filter and Search Controls Skeleton */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>

      {/* Prompts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
