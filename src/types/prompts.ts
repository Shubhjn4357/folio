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

// Genuine real projects from GitHub (Shubhjn4357) with live URLs and production prompts
export const INITIAL_PROMPT_PROJECTS: PromptProject[] = [
  {
    id: 'proj-unicorn-ui',
    slug: 'unicorn-ui-component-library',
    title: 'Unicorn UI - 131+ Component React System',
    description: 'A modern, production-ready React component library with 131 components featuring advanced design styles including Claymorphism, Liquid Glass, Glassmorphism, Skeuomorphism, and Minimalism. Built with TypeScript, Tailwind CSS v4, and Framer Motion.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/unicorn_ui',
    repoUrl: 'https://github.com/Shubhjn4357/unicorn_ui',
    liveUrl: 'https://unicorn-ui.vercel.app',
    tags: ['React', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'UI Library'],
    isFeatured: true,
    order: 1,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Full System & 131 Component Architecture Spec',
        description: 'Complete prompt for scaffolding a modular 131-component library with 5 design aesthetics.',
        content: `### Role & Architecture Blueprint
You are an expert creative frontend systems architect. Build a comprehensive React component library named **Unicorn UI** featuring 5 aesthetic design systems:
1. **Glassmorphism**: \`backdrop-filter: blur(20px) saturate(180%)\`, subtle light borders (\`rgba(255,255,255,0.1)\`), translucent dark/light mode fills.
2. **Liquid Glass**: Chromatic dispersion, iridescent border highlights, fluid SVG displacement filters.
3. **Claymorphism**: Soft pastel pills, double-inset shadows, rounded-3xl organic curves.
4. **Skeuomorphism**: Tactile embossed buttons, debossed wells, dynamic active press depths.
5. **Minimalism**: Clean Swiss typography, stark mono labels, generous whitespace.

#### Technical Stack & Requirements:
- **Framework**: React 18+ with TypeScript in strict mode.
- **Styling**: Tailwind CSS v4 design tokens and CSS custom variables.
- **Motion**: Framer Motion layout springs (\`stiffness: 350, damping: 25\`).
- **Accessibility**: Radix-style keyboard navigation and ARIA attribute propagation.

\`\`\`tsx
// Glassmorphism Token Foundation:
export const glassCardStyles = "bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl";
\`\`\`
`,
      },
      {
        id: 'p2',
        title: '02 - Liquid Glass & Claymorphism Shader Spec',
        description: 'Prompt for generative CSS shader tokens and physics-based interaction states.',
        content: `### Interactive Token Specification
Generate self-contained UI components with interactive hover physics:
- **Button Tokens**: Dual-gradient border sweeps (\`conic-gradient\`) that follow cursor proximity.
- **Card Badges**: Translucent frosted pills with chromatic glass highlights.
- **Modal Drawers**: Spring-damped drag-to-dismiss gestures with backdrop blur transitions.
`,
      },
    ],
  },
  {
    id: 'proj-studiobucket',
    slug: 'studiobucket-youtube-automation',
    title: 'StudioBucket - YouTube Automation & Infinite Space',
    description: 'Professional-grade, industrial-scale YouTube automation platform. Provides a minimalist, immersive "Infinite Space" environment for creators to manage content empires with zero friction.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/studiobucket',
    repoUrl: 'https://github.com/Shubhjn4357/studiobucket',
    liveUrl: 'https://studiobucket.vercel.app',
    tags: ['YouTube API', 'Automation', 'Infinite Canvas', 'Next.js', 'Framer Motion'],
    isFeatured: true,
    order: 2,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Infinite Space Canvas & Channel Automation Pipeline',
        description: 'Complete prompt for an infinite zoomable workspace and content automation scheduler.',
        content: `### Creator Workspace Blueprint: StudioBucket
Build an "Infinite Space" pan-and-zoom desktop environment for content creators.

#### Specifications:
1. **Interactive Infinite Canvas**: Zoomable (\`scale: 0.2\` to \`2.5\`) and pannable workspace using matrix transforms and momentum inertia.
2. **Video Idea Cards**: Draggable glassmorphic nodes representing video drafts, script outlines, and thumbnail mockups.
3. **YouTube Data API Integration**: Real-time subscriber counters, view analytics charts, and scheduled automated uploads.
4. **Dark Mode Aesthetic**: Ultra-sleek obsidian background (\`#070a12\`) with neon violet and cyan ambient glow points.
`,
      },
    ],
  },
  {
    id: 'proj-autoreach-crm',
    slug: 'autoreach-ai-crm',
    title: 'AutoReach - Offline-First AI CRM & Sync Queue',
    description: 'Offline-first, mobile-first CRM and business automation platform powered by local AI, structured integrations (WhatsApp, SMS, Google Drive), and automated sync queues.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/AutoReach',
    repoUrl: 'https://github.com/Shubhjn4357/AutoReach',
    liveUrl: 'https://autoreach.up.railway.app',
    tags: ['AI CRM', 'Automation', 'Offline-First', 'WhatsApp API', 'Local AI'],
    isFeatured: true,
    order: 3,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Offline Sync Queue & WhatsApp Automation Engine',
        description: 'Prompt for building resilient offline-first CRM sync loops and automated message dispatches.',
        content: `### Architecture: Offline-First AI CRM
Implement an offline-first CRM data sync engine and automated lead routing system.

#### Requirements:
- **IndexedDB Local Storage**: All contacts, deals, and notes must write to IndexedDB first with optimistic UI rendering.
- **Sync Queue Engine**: Background worker that continuously monitors network connectivity (\`navigator.onLine\`) and replays pending mutations with exponential backoff.
- **WhatsApp Webhook Hub**: Automated notification triggers on lead status change using Meta Cloud API.
- **Conflict Resolution**: Last-Write-Wins (LWW) with client-server timestamp comparison.
`,
      },
    ],
  },
  {
    id: 'proj-upi-easy',
    slug: 'upi-easy-terminal',
    title: 'UPI Easy - Multi-Bank POS Terminal & Dynamic QR',
    description: 'Next-generation multi-bank business UPI, dynamic QR point-of-sale terminal, and real-time reconciliation engine built for low-latency Edge runtimes.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/upi-easy',
    repoUrl: 'https://github.com/Shubhjn4357/upi-easy',
    liveUrl: 'https://upi-easy-api.aerotech.workers.dev',
    tags: ['Fintech', 'UPI Payments', 'Cloudflare Workers', 'QR Engine', 'Edge API'],
    isFeatured: true,
    order: 4,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Dynamic UPI Intent & QR Generation Engine',
        description: 'Prompt for generating NPCI-compliant dynamic UPI payment QR codes and intent URLs.',
        content: `### Fintech Architecture: Dynamic UPI Engine
Build an edge-compatible UPI payment gateway and dynamic QR POS terminal.

#### Specifications:
1. **URI Generator**: Generate NPCI-compliant \`upi://pay\` URIs with Merchant Code (\`mc\`), Transaction Reference (\`tr\`), Transaction Note (\`tn\`), and exact amount (\`am\`).
2. **SVG QR Renderer**: High-contrast, scannable SVG QR generator with embedded logo badge.
3. **Real-Time Polling / WebSocket**: Listen for bank webhook confirmation and transition UI instantly to success state with audio chime.
`,
      },
    ],
  },
  {
    id: 'proj-vahi-billtap',
    slug: 'vahi-billtap-pos',
    title: 'BillTap (Vahi) - Fast Mobile POS & Invoicing System',
    description: 'A modern, minimalist mobile-first billing, point-of-sale invoicing system, instant receipt generator, and transaction ledger built for retail speed.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/vahi',
    repoUrl: 'https://github.com/Shubhjn4357/vahi',
    liveUrl: 'https://vahi.vercel.app',
    tags: ['React Native', 'Android', 'Mobile POS', 'Invoicing', 'TypeScript'],
    isFeatured: true,
    order: 5,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Mobile POS Quick-Billing & Receipt Generation Engine',
        description: 'Prompt for rapid keypad billing, thermal Bluetooth printing, and instant digital PDF receipts.',
        content: `### Mobile POS Architecture: BillTap
Design a rapid point-of-sale checkout system for mobile and tablet devices.

#### Core Capabilities:
- **Rapid Number-Pad Entry**: Minimal-tap price entry with automatic GST/VAT calculation and round-off rules.
- **Digital Receipt Sharing**: Generate instant WhatsApp and SMS receipts with QR invoice verification.
- **Offline Ledger**: Store offline transactions with zero data loss and background synchronization upon reconnect.
`,
      },
    ],
  },
  {
    id: 'proj-rokado',
    slug: 'rokado-financial-hub',
    title: 'Rokado - Modern Financial Ledger & Payment Hub',
    description: 'Modern financial management, invoice ledger, and payment tracking platform built for high reliability, cash-flow insights, and clean financial UX.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/rokado',
    repoUrl: 'https://github.com/Shubhjn4357/rokado',
    liveUrl: 'https://rokado-web.vercel.app',
    tags: ['Finance', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Web App'],
    isFeatured: true,
    order: 6,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Financial Analytics & Cash-Flow Ledger Architecture',
        description: 'Prompt for real-time double-entry ledger visualization and cash-flow forecasting.',
        content: `### Financial Architecture: Rokado Hub
Build a modern financial dashboard and transaction ledger with interactive visual charts.

#### Features:
- **Cash Flow Analytics**: Monthly burn rate, projected runway, and incoming accounts receivable charts.
- **Multi-Account Reconciliation**: Bank statement CSV importer with automatic categorized debit/credit matching.
- **Dark Mode UI**: Refined financial layout with high-contrast tabular typography and quick action shortcuts.
`,
      },
    ],
  },
  {
    id: 'proj-aero-player',
    slug: 'aero-player-media-suite',
    title: 'Aero Player - Low-Latency Monochromatic Media Suite',
    description: 'A high-precision, low-latency media rendering suite engineered directly on top of the Google Media3 pipeline with real-time parametric equalizer presets and custom audio delay compensation.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/Aero-Player',
    repoUrl: 'https://github.com/Shubhjn4357/Aero-Player',
    liveUrl: 'https://github.com/Shubhjn4357/Aero-Player',
    tags: ['Android', 'Jetpack Compose', 'Google Media3', 'Kotlin', 'Audio Engine'],
    isFeatured: true,
    order: 7,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - Google Media3 Pipeline & Parametric Audio Equalizer Blueprint',
        description: 'Prompt for low-latency audio rendering, MediaSession foreground service, and Jetpack Compose UI.',
        content: `### Mobile Audio Engine Blueprint: Aero Player
Build a modern Android media player application using Jetpack Compose and Google Media3 ExoPlayer.

#### Engineering Criteria:
- **Media3 ExoPlayer Pipeline**: Hardware-accelerated audio decode with gapless playback buffer.
- **Parametric Equalizer**: 10-band interactive frequency equalizer with pre-amp boost and reverb simulation.
- **Monochromatic Nothing-Style UI**: High-contrast typography, dot-matrix battery and time indicators, and tactile sliders.
`,
      },
    ],
  },
  {
    id: 'proj-nos-gallery',
    slug: 'nos-gallery-widget-workspace',
    title: 'NOS Gallery - 550+ Standalone Widget Personalization',
    description: 'Developer-grade React Native + Expo Personalization Workspace supporting 550+ standalone widgets adhering strictly to monochromatic OS aesthetics.',
    image: 'https://opengraph.githubassets.com/1/Shubhjn4357/NosGallery',
    repoUrl: 'https://github.com/Shubhjn4357/NosGallery',
    liveUrl: 'https://github.com/Shubhjn4357/NosGallery',
    tags: ['React Native', 'Expo', 'Android Widgets', 'Mobile OS', 'TypeScript'],
    isFeatured: true,
    order: 8,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    prompts: [
      {
        id: 'p1',
        title: '01 - React Native 550+ Widget Catalog & Native Bridge Spec',
        description: 'Prompt for modular Android widget packaging, wallpaper tint reactive shaders, and Expo config plugins.',
        content: `### Mobile Widget Workspace Spec: NOS Gallery
Architect a React Native & Expo workspace housing 550+ interactive widgets.

#### Core Guidelines:
- **Monochromatic Dot-Matrix Tokens**: Strict adherence to grayscale palette with red accent highlights.
- **Widget Live Preview**: Real-time interactive widget canvas with scale-to-fit phone frame preview.
- **Glance API Bridge**: Export widget configurations to native Android Jetpack Glance app widgets.
`,
      },
    ],
  },
];
