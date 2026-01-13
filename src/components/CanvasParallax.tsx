
'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import type { Results } from '@mediapipe/hands'; // Changed to type import

import { useHandTracking } from './HandTrackingContext';

// --- Particle System Types ---
interface ParticleType {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  speedX: number;
  speedY: number;
  parallaxFactor: number;
  color: string;
  effectiveY: number;
  reset: (initial?: boolean) => void;
  update: (scrollY: number, targetX: number, targetY: number, attracting: boolean) => void;
  draw: () => void;
}

const CanvasParallax: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null); // Use react-webcam ref

  const { isHandTrackingEnabled } = useHandTracking();
  const [showDebug, setShowDebug] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const isDev = process.env.NODE_ENV === 'development';

  // Shared State for Animation Loop
  // We use refs/vars outside state to avoid re-renders of the canvas loop
  const handState = useRef({
    x: -1000,
    y: -1000,
    isAttracting: false,
    lastY: -1000,
    lastTime: 0,
  });

  useEffect(() => {
    // --- Particle System Setup ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize Handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle Initialization
    const particles: ParticleType[] = [];
    const particleCount = 150;

    class Particle implements ParticleType {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      baseX: number = 0;
      baseY: number = 0;
      density: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      parallaxFactor: number = 0;
      color: string = '#ffffff';
      effectiveY: number = 0;
      private canvas: HTMLCanvasElement;
      private ctx: CanvasRenderingContext2D;

      constructor(canvasEl: HTMLCanvasElement, ctxEl: CanvasRenderingContext2D) {
        this.canvas = canvasEl;
        this.ctx = ctxEl;
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 3 + 1;
        this.density = (Math.random() * 30) + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.parallaxFactor = this.size * 0.1;
        const colors = ['#00f3ff', '#bc13fe', '#ff0080', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.effectiveY = this.y;
      }

      update(scrollY: number, targetX: number, targetY: number, attracting: boolean) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (attracting) {
          if (distance < 500) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (500 - distance) / 500;
            const attractionStrength = 15;
            this.speedX += forceDirectionX * force * attractionStrength * 0.1;
            this.speedY += forceDirectionY * force * attractionStrength * 0.1;
          }
        } else {
          const mouseRadius = 150;
          if (distance < mouseRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseRadius - distance) / mouseRadius;
            const repulsionStrength = 5;
            this.speedX -= forceDirectionX * force * repulsionStrength;
            this.speedY -= forceDirectionY * force * repulsionStrength;
          }
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        // Keep moving slightly
        if (Math.abs(this.speedX) < 0.1) this.speedX += (Math.random() - 0.5) * 0.5;
        if (Math.abs(this.speedY) < 0.1) this.speedY += (Math.random() - 0.5) * 0.5;

        // Wrap
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;

        // Parallax
        const parallaxY = -(scrollY * this.parallaxFactor);
        const effectiveY = (this.y + parallaxY) % this.canvas.height;
        this.effectiveY = effectiveY < 0 ? effectiveY + this.canvas.height : effectiveY;
      }

      draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.effectiveY, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.8;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.color;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx));
    }

    // --- Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear
      const scrollY = window.scrollY;

      // Read current hand state
      const { x, y, isAttracting } = handState.current;

      particles.forEach(p => {
        p.update(scrollY, x, y, isAttracting);
        p.draw();
        });

      // Debug cursor (drawn by particle system loop for smoothness)
      if (x > 0 && isHandTrackingEnabled) {
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = isAttracting ? '#ff0080' : '#00f3ff';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (showDebug) {
          ctx.fillStyle = "#00f3ff";
          ctx.font = "16px sans-serif";
          ctx.fillText(`Hand: ${Math.round(x)}, ${Math.round(y)} `, x + 20, y);
          ctx.fillText(`Pinch: ${isAttracting ? "YES" : "NO"}`, x + 20, y + 20);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHandTrackingEnabled, showDebug]); // Only run once for particle setup

  // --- Hand Tracking Effect (MediaPipe Hands - Dynamic Import) ---
  useEffect(() => {
    if (!isHandTrackingEnabled) {
      setStatus("Disabled");
      return;
    }

    let isMounted = true;
    let camera: any = null; // Type: Camera (using any for dynamic import)
    let hands: any = null; // Type: Hands (using any for dynamic import)

    const startTracking = async () => {
      setStatus("Loading MediaPipe Hands...");

      try {
        // Dynamic import to avoid SSR errors
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');

        if (!isMounted) return; // Prevent init if unmounted during import

        hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: Results) => {
          setStatus("Active - Tracking");

          // Update Logic
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const indexFinger = landmarks[8];
            const thumbTip = landmarks[4];

            const canvas = canvasRef.current;
            if (!canvas) return;

            // Coordinates are normalized 0-1
            // Mirror X
            const x = (1 - indexFinger.x) * canvas.width;
            const y = indexFinger.y * canvas.height;

            // Pinch detection
            const dx = indexFinger.x - thumbTip.x;
            const dy = indexFinger.y - thumbTip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isPinching = dist < 0.1;

            // Scroll interaction logic
            const now = Date.now();
            const timeDelta = now - handState.current.lastTime;

            // 1. Pinch to Scroll (Precise)
            if (isPinching && handState.current.isAttracting) {
              const deltaY = handState.current.lastY - y;
              if (Math.abs(deltaY) > 2) {
                window.scrollBy({ top: deltaY * 1.5, behavior: 'auto' });
              }
            } 
            // 2. Flick Up to Scroll Down (Gesture)
            else if (!isPinching && timeDelta > 0 && timeDelta < 100) {
              const velocityY = (y - handState.current.lastY) / timeDelta; // px/ms
              // Threshold: -1.5 means moving up relatively fast
              if (velocityY < -1.5) {
                window.scrollBy({ top: 400, behavior: 'smooth' });
              }
            }

            // Update shared state
            handState.current = {
              x,
              y,
              isAttracting: isPinching,
              lastY: y,
              lastTime: now
            };

          } else {
            // No hand
            handState.current.x = -1000;
            handState.current.y = -1000;
            handState.current.isAttracting = false;
          }
        });

        // Initialize Camera
        if (webcamRef.current && webcamRef.current.video) {
          camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (!isMounted || !hands) return;
              if (webcamRef.current?.video) {
                await hands.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480
          });
          if (isMounted) camera.start();
        }
      } catch (err) {
        console.error(err);
        setStatus("Error Loading Module");
      }
    };

    startTracking();

    return () => {
      isMounted = false;
      if (hands) {
        hands.close();
        hands = null;
      }
      if (camera) {
        camera.stop();
        camera = null;
      }
    };
  }, [isHandTrackingEnabled]); // Dependency on toggle


  return (
    <>
      <canvas
        ref={canvasRef}
        className="canvas-parallax bg-primary fixed inset-0 pointer-events-none z-0"
      />

      {/* Hidden React Webcam - Controlled by MediaPipe Camera Utils */}
      <Webcam
        ref={webcamRef}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: showDebug ? 320 : 0,
          height: showDebug ? 240 : 0,
          opacity: showDebug ? 1 : 0,
          visibility: showDebug ? 'visible' : 'hidden',
          pointerEvents: 'none',
          zIndex: 50,
          border: '2px solid #00f3ff',
          borderRadius: '8px',
        }}
        width={640} // Internal resolution
        height={480}
        mirrored={false} // We handle mirror manually
        videoConstraints={{ facingMode: "user" }}
      />

      {/* Debug UI & Toggle */}
      {isDev && isHandTrackingEnabled && (
        <div className="fixed bottom-5 right-5 z-[51] flex flex-col items-end gap-2">
          {showDebug && (
            <div className="bg-black/70 text-white text-xs p-2 rounded mb-1 backdrop-blur-sm border border-white/20">
              <p>Status: <span className={status.includes("Error") ? "text-red-400" : "text-neon-green"}>{status}</span></p>
              <p>Mode: MediaPipe Hands (Legacy/Stable)</p>
            </div>
          )}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/20 transition-all"
            title="Toggle Hand Tracking Debug Camera"
          >
            {showDebug ? '📷 On' : '📷 Off'}
          </button>
        </div>
      )}
    </>
  );
};

export default CanvasParallax;