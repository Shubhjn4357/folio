'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_dark;

out vec4 fragColor;

// Simplex noise helpers
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractional Brownian Motion with domain warping
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 4; i++) {
    f += w * snoise(p);
    p *= 2.02;
    w *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 st = (uv - 0.5) * aspect;
  
  // Mouse interaction distance and displacement
  vec2 mouseSt = (u_mouse - 0.5) * aspect;
  float dist = length(st - mouseSt);
  float mouseInfluence = smoothstep(0.45, 0.0, dist);
  
  // Domain warping with time and mouse push
  vec2 q = vec2(
    fbm(st * 1.5 + vec2(0.0, u_time * 0.08)),
    fbm(st * 1.5 + vec2(5.2, u_time * 0.06))
  );
  
  // Interactive swirl around cursor
  vec2 dir = st - mouseSt;
  vec2 swirl = vec2(-dir.y, dir.x) * mouseInfluence * 0.35;
  
  vec2 r = vec2(
    fbm(st * 2.0 + 4.0 * q + swirl + vec2(1.7, 9.2) + u_time * 0.05),
    fbm(st * 2.0 + 4.0 * q + swirl + vec2(8.3, 2.8) + u_time * 0.05)
  );
  
  float f = fbm(st + 3.0 * r);
  
  // Color palette definitions
  // Cyan: #00f3ff -> vec3(0.0, 0.95, 1.0)
  // Violet: #bc13fe -> vec3(0.74, 0.07, 0.99)
  // Rose/Magenta: #fc4778 -> vec3(0.99, 0.28, 0.47)
  vec3 colCyan = vec3(0.0, 0.95, 1.0);
  vec3 colViolet = vec3(0.74, 0.07, 0.99);
  vec3 colRose = vec3(0.99, 0.28, 0.47);
  
  vec3 colorA = mix(colCyan, colViolet, clamp(f * f * 2.0, 0.0, 1.0));
  vec3 colorB = mix(colViolet, colRose, clamp(length(q), 0.0, 1.0));
  vec3 fluidColor = mix(colorA, colorB, clamp(length(r.x), 0.0, 1.0));
  
  // Add luminous pointer glow
  fluidColor += colRose * mouseInfluence * 0.45;
  
  // Base background blending based on dark/light mode
  vec3 darkBase = vec3(0.024, 0.035, 0.08); // Obsidian dark
  vec3 lightBase = vec3(0.97, 0.975, 0.985); // Modern clean white
  vec3 baseColor = mix(lightBase, darkBase, u_dark);
  
  // Final alpha intensity of the shader waves
  float intensity = mix(0.12, 0.28, u_dark);
  vec3 finalColor = mix(baseColor, fluidColor, clamp(f * f * f * 1.5 + mouseInfluence * 0.25, 0.0, 1.0) * intensity);
  
  // Subtle vignette
  float vignette = 1.0 - smoothstep(0.5, 1.4, length(st));
  finalColor *= mix(0.92, 1.0, vignette);

  fragColor = vec4(finalColor, 1.0);
}
`;

export const ShaderBackground: React.FC = () => {
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDarkMode } = useTheme();

  // Mouse coords with fluid easing
  const mouseState = useRef({
    targetX: 0.5,
    targetY: 0.5,
    currentX: 0.5,
    currentY: 0.5,
    screenX: -9999,
    screenY: -9999,
    isHovering: false,
  });

  // 1. WebGL Shader Setup
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return;

    // Compile shader
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uDark = gl.getUniformLocation(program, 'u_dark');

    let animId: number;
    let startTime = performance.now();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Cap device pixel ratio at 1.5 to guarantee silky 60fps on retina
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const render = (time: number) => {
      // Ease mouse coordinates for liquid inertia
      const ms = mouseState.current;
      ms.currentX += (ms.targetX - ms.currentX) * 0.08;
      ms.currentY += (ms.targetY - ms.currentY) * 0.08;

      const elapsed = (time - startTime) * 0.001;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, ms.currentX, 1.0 - ms.currentY);
      gl.uniform1f(uDark, isDarkMode ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [isDarkMode]);

  // 2. Interactive Dot Matrix & Fluid Trail Overlay (thinkingods style)
  useEffect(() => {
    const canvas = dotCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Mouse move tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseState.current.targetX = e.clientX / window.innerWidth;
      mouseState.current.targetY = e.clientY / window.innerHeight;
      mouseState.current.screenX = e.clientX;
      mouseState.current.screenY = e.clientY;
      mouseState.current.isHovering = true;
    };

    const onMouseLeave = () => {
      mouseState.current.isHovering = false;
      mouseState.current.screenX = -9999;
      mouseState.current.screenY = -9999;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Trail points for the fluid comet glow
    const trail: Array<{ x: number; y: number }> = [];
    const MAX_TRAIL = 24;
    let animId: number;
    let px = -9999;
    let py = -9999;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const ms = mouseState.current;
      px += (ms.screenX - px) * 0.12;
      py += (ms.screenY - py) * 0.12;

      if (ms.isHovering) {
        trail.push({ x: px, y: py });
      }
      while (trail.length > MAX_TRAIL) trail.shift();
      if (!ms.isHovering && trail.length > 0) trail.shift();

      // Draw soft luminous comet tail
      ctx.globalCompositeOperation = isDarkMode ? 'screen' : 'source-over';
      trail.forEach((pt, i) => {
        const t = (i + 1) / trail.length;
        const rad = 25 + t * 75;
        const alpha = isDarkMode ? 0.05 * t : 0.03 * t;
        const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
        gradient.addColorStop(0, `rgba(252, 71, 120, ${alpha * 2.5})`);
        gradient.addColorStop(0.5, `rgba(188, 19, 254, ${alpha * 1.2})`);
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive Displaced Dot Grid
      const gap = 24;
      const reach = 140;
      const push = 18;
      const dotBaseColor = isDarkMode ? '240, 245, 255' : '30, 41, 59';
      const baseAlpha = isDarkMode ? 0.08 : 0.06;

      ctx.globalCompositeOperation = 'source-over';
      const hx = trail.length ? trail[trail.length - 1].x : -9999;
      const hy = trail.length ? trail[trail.length - 1].y : -9999;

      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          let ox = 0;
          let oy = 0;
          let a = baseAlpha;
          let r = 1.0;

          const dx = x - hx;
          const dy = y - hy;
          const dist = Math.hypot(dx, dy);

          if (dist < reach) {
            const f = Math.pow(1 - dist / reach, 2);
            const ang = Math.atan2(dy, dx);
            ox = Math.cos(ang) * f * push;
            oy = Math.sin(ang) * f * push;
            a += f * 0.22;
            r = 1.0 + f * 0.8;
          }

          ctx.beginPath();
          ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dotBaseColor}, ${a})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden select-none">
      {/* Dynamic WebGL GLSL Fluid Shader */}
      <canvas
        ref={glCanvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      {/* Interactive Dot Matrix & Fluid Comet Trail */}
      <canvas
        ref={dotCanvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

// Aliased export to seamlessly replace CanvasParallax without breaking imports
export const CanvasParallax = ShaderBackground;

export default ShaderBackground;
