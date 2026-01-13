'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHandTracking } from './HandTrackingContext';

const HandGestureGuideModal = () => {
  const { showGuide, setShowGuide, enableHandTracking } = useHandTracking();

  if (!showGuide) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowGuide(false)}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-tertiary border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-blue/30 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Control with your <span className="gradient-text">Hands</span> 👋
          </h2>

          <div className="space-y-6 text-secondary mb-8">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
              <span className="text-3xl">👆</span>
              <div>
                <h3 className="text-white font-bold">Move Cursor</h3>
                <p className="text-sm">Move your open hand to guide the particles.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
              <span className="text-3xl">✊</span>
              <div>
                <h3 className="text-white font-bold">Attract Particles</h3>
                <p className="text-sm">Make a fist (pinch) to create a black hole effect.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
              <span className="text-3xl">↕️</span>
              <div>
                <h3 className="text-white font-bold">Scroll Page</h3>
                <p className="text-sm">Make a fist and move your hand up/down to scroll.</p>
              </div>
            </div>
            
             <p className="text-xs text-center opacity-60 mt-4">
              *Requires camera permission. Your video is processed locally and never sent to any server.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowGuide(false)}
              className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={enableHandTracking}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/40 transition-shadow"
            >
              Allow & Play 🎮
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HandGestureGuideModal;
