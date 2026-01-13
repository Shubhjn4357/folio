'use client';

import { useEffect } from "react";
import Lenis from "lenis";

import {

    Hero,
    About,
    ParallaxSection,
    CanvasParallax,

    Works,
    Contact,

} from "@/components";

export default function Home() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
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

            <main className="relative z-10">
                <Hero />
                <About />
                <ParallaxSection />
                <CanvasParallax />
                <Works />
                <div className="relative z-0">
                    <Contact />
                </div>
            </main>

        </div>
    );
}
