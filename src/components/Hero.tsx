'use client';

import { useRef, useEffect } from "react";
import { styles } from "../styles";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useHandTracking } from "./HandTrackingContext";
import HandGestureGuideModal from "./HandGestureGuideModal";

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const { setShowGuide, isHandTrackingEnabled, disableHandTracking } = useHandTracking();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Vibrant Glow Animation
    tl.fromTo(nameRef.current,
      { opacity: 0, scale: 0.5, textShadow: "0 0 0px #bc13fe" },
      { opacity: 1, scale: 1, duration: 1.5, textShadow: "0 0 20px #bc13fe" }
    )
      // Type out role
      .to(roleRef.current, {
        duration: 1.5,
        text: "Creative Developer & UI/UX Designer",
        delay: 0.2,
        ease: "none",
      });

  }, []);

  return (
    <section className="relative w-full h-screen mx-auto flex flex-col justify-center items-center overflow-hidden">
      <HandGestureGuideModal />

      <div className={`${styles.paddingX} max-w-7xl w-full mx-auto flex flex-col items-start z-10`}>

        <div className="flex flex-col font-sans">
          <p className={`${styles.heroSubText} text-neon-blue`}>Hi, I'm</p>

          <h1 className={`${styles.heroHeadText} text-[var(--text-main)] relative inline-block`}>
            <span ref={nameRef} className="gradient-text">Shubham</span>
          </h1>

          <p ref={roleRef} className={`${styles.heroSubText} mt-4 text-secondary h-8`}>
            {/* Role gets typed here */}
          </p>

          {/* Let's Play Button */}
          {!isHandTrackingEnabled && (
            <button
              onClick={() => setShowGuide(true)}
              className="mt-8 py-3 px-8 bg-transparent border-2 border-neon-purple text-neon-purple font-bold rounded-full hover:bg-neon-purple hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] flex items-center gap-2 group"
            >
              <span>Let's Play</span>
              <span className="text-xl group-hover:rotate-12 transition-transform">🎮</span>
            </button>
          )}

          {/* Show Guide / Reset Button (When Tracking is ON) */}
          {isHandTrackingEnabled && (
            <button
              onClick={() => {
                disableHandTracking();
                setShowGuide(true);
              }}
              className="mt-8 py-3 px-8 bg-transparent border-2 border-neon-blue text-neon-blue font-bold rounded-full hover:bg-neon-blue hover:text-black-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] flex items-center gap-2 group"
            >
              <span>Guide / Reset</span>
              <span className="text-xl group-hover:rotate-12 transition-transform">ℹ️</span>
            </button>
          )}
        </div>

      </div>

      {/* Scroll indicator with neon glow */}
      <div className="absolute bottom-10 w-full flex justify-center items-center scroll-indicator">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2 shadow-neon">
            <div className="w-3 h-3 rounded-full bg-secondary mb-1 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
