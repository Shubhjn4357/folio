'use client';

import { BlogCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
      {/* Back button pill */}
      <Skeleton className="h-8 w-36 rounded-full" />

      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-96 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
