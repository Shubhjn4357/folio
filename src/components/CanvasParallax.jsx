import React, { useRef, useEffect } from 'react';

const CanvasParallax = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Star/Bubble config
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Parallax factor based on size (bigger = closer = faster)
        this.parallaxFactor = this.size * 0.1; 
        
        // Vibrant Colors
        const colors = ['#00f3ff', '#bc13fe', '#ff0080', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(scrollY) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply scroll Parallax
        const parallaxY = -(scrollY * this.parallaxFactor);
        
        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        
        // Vertical wrap logic with parallax offset
        const effectiveY = (this.y + parallaxY) % canvas.height;
        this.effectiveY = effectiveY < 0 ? effectiveY + canvas.height : effectiveY;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.effectiveY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    // Init particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
      const scrollY = window.scrollY;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Make background slightly transparent to create trails? No, sticking to clean.
      // ctx.fillStyle = 'rgba(5, 8, 22, 0.2)';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(scrollY);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="canvas-parallax bg-primary"
    />
  );
};

export default CanvasParallax;
