export interface PromptItem {
  id: string;
  title: string;
  description?: string;
  content: string; // Markdown formatted prompt
}

export interface PromptProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  repoUrl: string;
  liveUrl?: string;
  tags: string[];
  prompts: PromptItem[];
  isFeatured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Initial seed prompt projects to showcase 4-6 projects immediately
export const INITIAL_PROMPT_PROJECTS: PromptProject[] = [
  {
    id: 'proj-liquid-dock',
    slug: 'liquid-dock-navigation',
    title: 'Liquid Dock & Magnetic Floating Navigation',
    description: 'A choreographed magnetic navbar with physics-based spring docks, dynamic stagger animations, and full-screen menu morphing.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/Shubhjn4357/folio',
    liveUrl: 'https://folio-shubhjn.vercel.app',
    tags: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Micro-interactions'],
    isFeatured: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompts: [
      {
        id: 'p1',
        title: '01 - Full System & Physics Spring Dock Blueprint',
        description: 'Complete prompt specifying spring physics, choreography, and responsive mobile docking.',
        content: `### Role & Architecture Spec
You are a senior creative frontend engineer specializing in high-end Framer Motion micro-interactions. Build a responsive, floating magnetic dock with choreographed entry staggering.

#### Motion Requirements:
1. **Entry Sequence**:
   - The middle dock capsule must drop down from \`y: -40px\` to \`y: 0\` with a spring curve (\`stiffness: 300, damping: 24\`).
   - After reaching center, smoothly translate left (\`x: -12px\`) while revealing the user brand avatar/name sliding to the right with a 0.15s stagger.
2. **Glassmorphism Aesthetic**:
   - Use CSS tokens: \`backdrop-filter: blur(20px) saturate(180%)\`, border \`rgba(255, 255, 255, 0.08)\`, and background \`rgba(15, 23, 42, 0.65)\`.
3. **Responsive Interaction**:
   - On screens < 640px, dock switches to floating bottom or compact top pill with full-screen animated menu overlay.

\`\`\`tsx
// Key Framer Motion Transition Token:
const springTransition = {
  type: "spring",
  stiffness: 320,
  damping: 26,
  mass: 0.8
};
\`\`\`
`,
      },
      {
        id: 'p2',
        title: '02 - Full-Screen Overlay & SVG Reveal Spec',
        description: 'Prompt for fullscreen menu with animated typography reveals and background blur.',
        content: `### Menu Overlay Prompt
Generate a full-screen mobile overlay using Next.js App Router and Framer Motion with:
- Staggered navigation links (\`staggerChildren: 0.08\`, \`delayChildren: 0.2\`).
- Oversized typography with subtle hover tilt and chromatic glow.
- Quick close button with rotating icon and backdrop blur transitions.
`,
      },
    ],
  },
  {
    id: 'proj-shader-universe',
    slug: 'gpu-shader-universe',
    title: 'GPU Accelerated Fragment Shader Background',
    description: 'A WebGL shader canvas rendering continuous cosmic nebula waves, dynamic theme reactivity, and zero-allocation frame loops.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/Shubhjn4357/folio',
    liveUrl: 'https://folio-shubhjn.vercel.app',
    tags: ['WebGL', 'GLSL', 'Performance', 'Canvas'],
    isFeatured: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompts: [
      {
        id: 'p1',
        title: '01 - Procedural GLSL Fragment Shader Raymarcher',
        description: 'Shader code and Canvas setup for buttery-smooth 60fps ambient visual effects.',
        content: `### GLSL Shader Canvas Spec
Create a WebGL background canvas using vanilla WebGL2 with zero external dependencies.

#### Technical Specifications:
- **Render Loop**: Use \`requestAnimationFrame\` with frame delta throttling to save GPU battery.
- **Precision**: Highp floating point precision with noise octaves (\`fbm\` fractional brownian motion).
- **Theme Uniforms**: Pass \`u_theme\` (\`0.0\` for light, \`1.0\` for dark) to seamlessly shift color palettes.
- **Resize Observer**: Handle device pixel ratio (\`window.devicePixelRatio\`) cleanly with offscreen debounce.

\`\`\`glsl
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dark;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  float d = length(uv);
  vec3 col = mix(vec3(0.02, 0.04, 0.08), vec3(0.0, 0.95, 1.0), sin(d * 4.0 - u_time) * 0.5 + 0.5);
  gl_FragColor = vec4(col, 1.0);
}
\`\`\`
`,
      },
    ],
  },
  {
    id: 'proj-telemetry-analytics',
    slug: 'telemetry-analytics-dashboard',
    title: 'Zero-Cookie Telemetry & Analytics Engine',
    description: 'Privacy-focused visitor analytics dashboard featuring real-time geographic breakdown, session depth tracking, and Recharts visualization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/Shubhjn4357/folio',
    liveUrl: 'https://folio-shubhjn.vercel.app/admin/analytics',
    tags: ['Next.js', 'Recharts', 'PostgreSQL', 'Edge API'],
    isFeatured: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompts: [
      {
        id: 'p1',
        title: '01 - Edge Analytics Collection & KPI Aggregation',
        description: 'Prompt to build privacy-conscious visitor logging with zero third-party cookies.',
        content: `### System Prompt: Privacy Telemetry Engine
Build a privacy-first web telemetry system in Next.js App Router.

#### Requirements:
1. **Collector Route**: \`POST /api/analytics\` that inspects headers (\`x-forwarded-for\`, \`user-agent\`) and generates a hashed session ID without tracking personal identifiers.
2. **Aggregation Queries**: Compute total page views, unique sessions, bounce rates (sessions with 1 view), and breakdown by device & country.
3. **Recharts Frontend**: Custom themed charts matching dark/light glass design with neon stroke gradients.
`,
      },
    ],
  },
  {
    id: 'proj-ai-prompt-studio',
    slug: 'ai-prompt-studio-showcase',
    title: 'Prompt-to-Live Engineering Showcase',
    description: 'Interactive prompt project showcase with GitHub integration, multi-prompt tabs, instant LLM copy triggers, and markdown specs.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/Shubhjn4357/folio',
    liveUrl: 'https://folio-shubhjn.vercel.app/prompts',
    tags: ['AI Engineering', 'Prompts', 'Markdown', 'Next.js'],
    isFeatured: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompts: [
      {
        id: 'p1',
        title: '01 - One-Click LLM Code Generation System Prompt',
        description: 'Optimized system prompt for Claude 3.7 & Cursor that generates complete, production-ready pages with zero back-and-forth.',
        content: `### Complete AI Coding Instruction
You are an expert full-stack developer. When given this UI architecture, write complete code with no placeholder comments, fully typed TypeScript, and modern glassmorphism styling.

#### Output Contract:
1. All files must be modular and complete.
2. Include error boundaries and loading skeletons.
3. Ensure keyboard accessibility and WCAG AA contrast.
4. Output self-contained React 18+ client components with Framer Motion transitions.
`,
      },
    ],
  },
];
