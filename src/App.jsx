import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { ThemeProvider } from "./context/ThemeContext";
import {
  Navbar,
  Hero,
  About,
  ParallaxSection,
  CanvasParallax, // New Import
  CustomCursor,
  Experience,
  Works,
  Contact,
  Footer,
  ProjectDetails
} from "./components";

const App = () => {
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
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative z-0 bg-primary font-sans text-white overflow-hidden selection:bg-neon-purple selection:text-white">
          <CustomCursor />
          <CanvasParallax />

          <Routes>
            <Route path="/" element={
              <>
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
              </>
            } />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
