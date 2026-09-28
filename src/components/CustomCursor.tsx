'use client';

import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Create sparkle element
    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.borderRadius = '50%';
      sparkle.style.backgroundColor = 'rgba(121, 40, 202, 0.4)';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.zIndex = '9998';
      sparkle.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

      // Randomize size and direction
      const size = Math.random() * 4 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      document.body.appendChild(sparkle);

      // Animate and remove
      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40}px) scale(0)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 500);
    };

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;

      // Add sparkle occasionally to avoid too many DOM nodes
      if (Math.random() > 0.75) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    // Hover detection
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovered(true);
      }
    };

    const onMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-5 h-5 rounded-full border border-black/30 dark:border-white/40 pointer-events-none z-[9999] hidden md:block transition-[width,height,background-color] duration-150 ${
        isHovered ? 'scale-150 bg-black/10 dark:bg-white/10' : ''
      }`}
    />
  );
};

export default CustomCursor;

