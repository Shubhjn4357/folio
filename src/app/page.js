'use client';

import { useEffect } from "react";
import Lenis from "lenis";
import dynamic from 'next/dynamic';

const Experience = dynamic(() => import('../components/Experience'), {
    ssr: false,
});

import {
    Navbar,
    Hero,
    About,
    ParallaxSection,
    CanvasParallax,
    CustomCursor,
    Works,
    Contact,
    Footer,
} from "../components";

export default function Home() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="relative z-0 bg-primary font-sans text-white overflow-hidden selection:bg-neon-purple selection:text-white">
            <CustomCursor />
            <CanvasParallax />
            <Navbar />
            <main className="relative z-10">
                <Hero />
                <About />
                <ParallaxSection />
                <Experience />
                <Works />
                <div className="relative z-0">
                    <Contact />
                </div>
            </main>
            <Footer />
        </div>
    );
}
