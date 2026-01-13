'use client';

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { styles } from "../styles";

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(textRef.current, { y: -100 }, 0)
      .to(imageRef.current, { y: 100 }, 0);

  }, []);

  return (
    <section ref={containerRef} className={`${styles.padding} relative w-full h-[100vh] overflow-hidden flex items-center justify-center`}>
      {/* Background doodles or lines */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle, #bc13fe 1px, transparent 1px)',
        backgroundSize: '118px 118px'
      }} />

      <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center max-w-7xl mx-auto">
        <div ref={textRef} className="flex-1">
          <h2 className={`${styles.sectionHeadText} text-white`}>Infinite<br /><span className="gradient-text">Possibilities.</span></h2>
          <p className={`${styles.sectionSubText} mt-4 text-secondary`}>
            Crafting immersive experiences with modern web technologies.
          </p>
        </div>

        <div ref={imageRef} className="flex-1 flex justify-center">
          {/* Placeholder for a parallax drawing/image */}
          <div className="w-64 h-64 border-2 border-neon-blue rounded-full flex items-center justify-center shadow-neon bg-white-100/50 dark:bg-black-100/50 backdrop-blur-sm">
            <span className="text-4xl font-bold text-neon-pink">Future.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
