'use client';

import { useRef, useEffect } from "react";
import { styles } from "../styles";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const nameRef = useRef(null);
  const roleRef = useRef(null);

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

      <div className={`${styles.paddingX} max-w-7xl w-full mx-auto flex flex-col items-start z-10`}>

        <div className="flex flex-col font-sans">
          <p className={`${styles.heroSubText} text-neon-blue`}>Hi, I'm</p>

          <h1 className={`${styles.heroHeadText} text-[var(--text-main)] relative inline-block`}>
            <span ref={nameRef} className="gradient-text">Shubham</span>
          </h1>

          <p ref={roleRef} className={`${styles.heroSubText} mt-4 text-secondary h-8`}>
            {/* Role gets typed here */}
          </p>
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
