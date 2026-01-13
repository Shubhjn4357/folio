'use client';

import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Create sparkle element
    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      // Randomize size and direction
      const size = Math.random() * 5 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      document.body.appendChild(sparkle);

      // Animate and remove
      setTimeout(() => {
        sparkle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(0)`;
        sparkle.style.opacity = '0';
      }, 10);

      setTimeout(() => {
        sparkle.remove();
      }, 600);
    };

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;

      // Add sparkle occasionally to avoid too many DOM nodes
      if (Math.random() > 0.6) {
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

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovered ? 'hovered' : ''}`}
    />
  );
};

export default CustomCursor;

