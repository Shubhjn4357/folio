'use client';

import React, { useRef, useEffect, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useHandTracking } from './HandTrackingContext';

// ... interface ParticleType (same as before) ...
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isHandTrackingEnabled } = useHandTracking();

  useEffect(() => {
    const canvas = canvasRef.current;
    // Video ref might be null if tracking not enabled yet, handled in second effect or by condition

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // ... rest of init ...

    const video = videoRef.current;
    let animationFrameId: number;
    let handLandmarker: HandLandmarker | null = null;
    let lastVideoTime = -1;

    // Hand Interaction State
    let handX = -1000;
    let handY = -1000;
    let lastHandY = -1000;
    let isAttracting = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // --- Particle System Setup ---
    const particles: ParticleType[] = [];
    const particleCount = 150; // Increased count for better effect

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
        this.speedX = (Math.random() - 0.5) * 2; // Faster natural movement
        this.speedY = (Math.random() - 0.5) * 2;
        this.parallaxFactor = this.size * 0.1;

        const colors = ['#00f3ff', '#bc13fe', '#ff0080', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.effectiveY = this.y;
      }

      update(scrollY: number, targetX: number, targetY: number, attracting: boolean) {
        // 1. Hand Interaction Physics
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (attracting) {
          // Black Hole Effect (Strong Attraction)
          if (distance < 500) { // Attraction range
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (500 - distance) / 500;
            const attractionStrength = 15; // Strong pull

            this.speedX += forceDirectionX * force * attractionStrength * 0.1;
            this.speedY += forceDirectionY * force * attractionStrength * 0.1;
          }
        } else {
          // Mouse/Open Hand Repulsion/Flow (Subtle interaction)
          const mouseRadius = 150;
          if (distance < mouseRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseRadius - distance) / mouseRadius;
            const repulsionStrength = 5;

            // Push away
            this.speedX -= forceDirectionX * force * repulsionStrength;
            this.speedY -= forceDirectionY * force * repulsionStrength;
          }
        }

        // 2. Natural Movement & Friction
        this.x += this.speedX;
        this.y += this.speedY;

        // Friction to stabilize speed over time
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        // Keep moving
        if (Math.abs(this.speedX) < 0.1) this.speedX += (Math.random() - 0.5) * 0.5;
        if (Math.abs(this.speedY) < 0.1) this.speedY += (Math.random() - 0.5) * 0.5;

        // 3. Parallax & Screen Wrapping
        // Wrap physics position to keep them in "world" bounds
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;

        // Calculate visual position with parallax
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

    // --- MediaPipe Initialization (Conditional) ---
    const initMediaPipe = async () => {
      if (!isHandTrackingEnabled) return; // Don't load if disabled

      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        startWebcam();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
      }
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // NOTE: videoRef might be current in callback, but simpler to use closure if safe
        // However, we need to make sure 'video' var is updated if ref changed, but ref object stable.
        // We will assume video element exists if enabled.
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            setIsLoaded(true);
          });
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (isHandTrackingEnabled) {
      initMediaPipe();
    }

    // --- Animation Loop ---
    const animate = () => {
      const scrollY = window.scrollY;

      // 1. Process Hand Tracking (Only if enabled and ready)
      // Check videoRef.current dynamically inside loop to be safe
      const currentVideo = videoRef.current;

      if (isHandTrackingEnabled && handLandmarker && currentVideo && currentVideo.currentTime !== lastVideoTime && isLoaded) {
        lastVideoTime = currentVideo.currentTime;
        const results = handLandmarker.detectForVideo(currentVideo, performance.now());

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];

          // Use Index Finger Tip (8) as cursor position
          // Coordinates are 0-1, so multiply by canvas dimensions
          // X is mirrored for webcam, so 1 - x
          const indexFinger = landmarks[8];
          const thumbTip = landmarks[4];

          const videoRatioX = canvas.width;
          const videoRatioY = canvas.height;

          handX = (1 - indexFinger.x) * videoRatioX;
          handY = indexFinger.y * videoRatioY;

          // Gesture Detection: Pinch (Thumb close to Index)
          // Simple euclidean distance in normalized coords
          const dx = indexFinger.x - thumbTip.x;
          const dy = indexFinger.y - thumbTip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Threshold for "pinch/closed hand" (experimentally around 0.1)
          const newIsAttracting = dist < 0.1;

          // Scroll Logic: Grab and Drag
          if (newIsAttracting && isAttracting) {
            // Only scroll if we were already attracting (holding the pinch)
            // to avoid jumps on the initial pinch frame
            const deltaY = lastHandY - handY;

            // Apply scroll with some sensitivity factor
            if (Math.abs(deltaY) > 2) { // Deadzone to reduce jitter
              window.scrollBy({
                top: deltaY * 1.5, // 1.5x speed multiplier for responsiveness
                behavior: 'auto' // Instant scroll for direct manipulation feel
              });
            }
          }

          isAttracting = newIsAttracting;
          lastHandY = handY;
        } else {
          // Reset if no hand found
          handX = -1000;
          handY = -1000;
          isAttracting = false;
        }
      } else if (!isHandTrackingEnabled) {
        // Reset hand state if disabled
        handX = -1000;
        handY = -1000;
        isAttracting = false;
      }

      // 2. Draw & Update
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      particles.forEach(p => {
        p.update(scrollY, handX, handY, isAttracting);
        p.draw();
      });

      // Optional: Draw debug cursor for hand
      if (handX > 0 && isHandTrackingEnabled) {
        ctx.beginPath();
        ctx.arc(handX, handY, 15, 0, Math.PI * 2);
        ctx.strokeStyle = isAttracting ? '#ff0080' : '#00f3ff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      // Clean up video stream if active
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (handLandmarker) {
        handLandmarker.close();
      }
    };
  }, [isHandTrackingEnabled]); // Re-run effect when tracking toggles

  return (
    <>
      <canvas
        ref={canvasRef}
        className="canvas-parallax bg-primary fixed inset-0 pointer-events-none z-0"
      />
      {/* Hidden Video for MediaPipe */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 1, width: 1 }}
      />
    </>
  );
};

export default CanvasParallax;

