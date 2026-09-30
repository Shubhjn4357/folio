'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-black/[0.08] dark:bg-white/[0.08] backdrop-blur-sm';

  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// 1. Project / Repository Card Skeleton
export const ProjectCardSkeleton: React.FC = () => (
  <div className="glass-panel p-5 rounded-3xl w-full border border-black/5 dark:border-white/5 space-y-4">
    <Skeleton className="w-full h-48 sm:h-52 rounded-2xl" />
    <div className="space-y-2 pt-1">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
    </div>
    <div className="flex flex-wrap gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-lg" />
      <Skeleton className="h-6 w-20 rounded-lg" />
      <Skeleton className="h-6 w-14 rounded-lg" />
    </div>
    <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
      <Skeleton className="h-8 w-24 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

// 2. Prompt Card Skeleton
export const PromptCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-3xl p-5 border border-black/5 dark:border-white/5 flex flex-col justify-between h-full space-y-4">
    <div className="space-y-3">
      <Skeleton className="w-full h-48 sm:h-52 rounded-2xl" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
    </div>
    <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
      <Skeleton className="h-7 w-28 rounded-full" />
      <div className="flex gap-1.5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

// 3. Prompt Detail Page Skeleton
export const PromptDetailSkeleton: React.FC = () => (
  <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
    {/* Breadcrumb back link */}
    <Skeleton className="h-8 w-44 rounded-full" />

    {/* Header banner */}
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-black/5 dark:border-white/5 space-y-4">
      <Skeleton className="h-4 w-32 rounded-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <Skeleton className="h-4 w-3/4 max-w-xl" />
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>

    {/* Main 2-column detail grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (Preview Card) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-black/5 dark:border-white/5 space-y-4">
          <Skeleton className="w-full h-64 rounded-2xl" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 flex-1 rounded-2xl" />
            <Skeleton className="h-10 flex-1 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Right Column (Prompt Content & Specs) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-32 w-full rounded-2xl mt-4" />
            <Skeleton className="h-4 w-5/6 mt-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 4. Project Details Skeleton
export const ProjectDetailsSkeleton: React.FC = () => (
  <div className="relative z-0 min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-8 w-36 rounded-full" />
    <Skeleton className="w-full h-[40vh] sm:h-[50vh] rounded-3xl" />
    <div className="space-y-4 max-w-3xl">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-md" />
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  </div>
);

// 5. Blog Card Skeleton
export const BlogCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="h-4 w-16 rounded-full" />
    </div>
    <Skeleton className="h-7 w-4/5" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="pt-2 flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  </div>
);

// 6. Blog Detail Page Skeleton
export const BlogDetailSkeleton: React.FC = () => (
  <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-4xl mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-8 w-36 rounded-full" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-32 rounded-full" />
      <Skeleton className="h-12 w-11/12" />
      <Skeleton className="h-4 w-48" />
    </div>
    <Skeleton className="w-full h-80 rounded-3xl" />
    <div className="space-y-4 pt-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-28 w-full rounded-2xl my-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

// 7. Admin Dashboard Skeleton
export const AdminDashboardSkeleton: React.FC = () => (
  <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-8 w-60" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-2xl" />
        <Skeleton className="h-10 w-32 rounded-2xl" />
      </div>
    </div>

    {/* 4 Metric KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-9 rounded-2xl" />
          </div>
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>

    {/* 2 Big Action / Table Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-4">
        <Skeleton className="h-6 w-44" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full ml-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

// 8. Admin Table / List Skeleton
export const AdminTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
    <div className="flex justify-between items-center pb-6 border-b border-black/5 dark:border-white/5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-8 w-56" />
      </div>
      <Skeleton className="h-10 w-32 rounded-2xl" />
    </div>

    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 9. Admin Resume Page Skeleton
export const AdminResumeSkeleton: React.FC = () => (
  <div className="space-y-8 max-w-5xl mx-auto animate-pulse">
    <div className="space-y-2 pb-6 border-b border-black/5 dark:border-white/5">
      <Skeleton className="h-4 w-32 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>

    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-10 w-full rounded-2xl" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-2xl mt-4" />
      </div>
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-2xl mt-4" />
      </div>
    </div>
  </div>
);

// 10. Admin Analytics Skeleton
export const AdminAnalyticsSkeleton: React.FC = () => (
  <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
    <div className="flex justify-between items-center pb-6 border-b border-black/5 dark:border-white/5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-8 w-60" />
      </div>
      <Skeleton className="h-9 w-40 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/5 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      ))}
    </div>

    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  </div>
);

export default Skeleton;
