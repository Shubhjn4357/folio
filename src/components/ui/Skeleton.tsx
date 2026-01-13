'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-tertiary/50';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could add custom wave animation
    none: ''
  };
  
  const style: React.CSSProperties = {
    width: width,
    height: height
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const ProjectCardSkeleton: React.FC = () => (
  <div className="glass-panel p-5 rounded-2xl sm:w-[360px] w-full">
    <Skeleton className="w-full h-[230px] mb-5" />
    <Skeleton className="h-7 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-14" />
    </div>
  </div>
);

export const ProjectDetailsSkeleton: React.FC = () => (
  <div className="relative z-0 bg-primary min-h-screen">
    {/* Hero Image Skeleton */}
    <div className="w-full h-[50vh] relative">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-10 left-0 w-full px-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-12 w-2/3" />
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-[2]">
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          
          <Skeleton className="h-7 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex-1">
          <div className="bg-tertiary p-8 rounded-2xl">
            <Skeleton className="h-6 w-32 mb-5" />
            <div className="flex flex-wrap gap-2 mb-8">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-6 w-24 mb-5" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
