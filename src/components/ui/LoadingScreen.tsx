'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  minDuration?: number; // Minimum time to show loading screen
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDuration = 1500 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Ensure minimum display time for smooth animation
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Give time for exit animation before unmounting
      setTimeout(() => setIsLoading(false), 800);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* Top Panel */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-primary flex items-end justify-center pb-20"
            initial={{ y: 0 }}
            animate={{ y: isExiting ? '-100%' : 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold gradient-text">Shubham Jain</h1>
            </motion.div>
          </motion.div>

          {/* Bottom Panel */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-primary flex items-start justify-center pt-20"
            initial={{ y: 0 }}
            animate={{ y: isExiting ? '100%' : 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-secondary text-sm">Good things take Time....</p>
            </motion.div>
          </motion.div>

          {/* Center Loader */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isExiting ? 0 : 1,
              scale: isExiting ? 0.8 : 1
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Circular Loader Container */}
            <div className="relative w-24 h-24">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-neon-purple/20 blur-xl animate-pulse" />

              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderTopColor: '#00f3ff',
                  borderRightColor: '#bc13fe',
                  boxShadow: '0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(188, 19, 254, 0.1)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  bottom: '8px',
                  border: '2px solid transparent',
                  borderBottomColor: '#bc13fe',
                  borderLeftColor: '#00f3ff',
                  boxShadow: '0 0 15px rgba(188, 19, 254, 0.3)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  bottom: '16px',
                  border: '2px solid transparent',
                  borderTopColor: '#ff0080',
                  borderRightColor: '#00f3ff',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center pulsing dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #00f3ff, #bc13fe, #ff0080)',
                    boxShadow: '0 0 20px rgba(188, 19, 254, 0.6), 0 0 40px rgba(0, 243, 255, 0.4)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative horizontal line */}
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(188, 19, 254, 0.4), transparent)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isExiting ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

