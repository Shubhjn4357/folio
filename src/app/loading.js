'use client';

import { motion } from "framer-motion";

const SparklingLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 border-4 border-neon-purple/30 border-t-neon-blue rounded-full"
        />
        <motion.div
           animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        >
             {/* Sparkles */}
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
                  style={{
                    top: `${50 + 35 * Math.cos(i * 60 * (Math.PI / 180))}%`,
                    left: `${50 + 35 * Math.sin(i * 60 * (Math.PI / 180))}%`,
                  }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
             ))}
        </motion.div>
      </div>
      <h2 className="absolute mt-32 text-xl font-bold text-white tracking-widest animate-pulse">
        LOADING...
      </h2>
    </div>
  );
};

export default SparklingLoader;
