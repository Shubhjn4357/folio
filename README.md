# Folio - Next-Gen Interactive Developer Portfolio & AI Prompt Hub

<img src="./public/thumbnail.png" alt="Folio Portfolio Thumbnail" width="100%" />

A cutting-edge developer portfolio and engineering playground built with **Next.js 16 (App Router)**, **TypeScript**, **Framer Motion**, and **Tailwind CSS**. Features an AI-ready **Prompt Projects Library**, a comprehensive **Admin CMS & Analytics Dashboard**, dynamic **Resume Distribution**, fluid shaders, and modern glassmorphic aesthetics.

---

## ✨ Key Features

### 🚀 AI Prompt Projects Hub
- **Modular System Prompts**: Curated, production-grade prompts paired with live open-source projects. Copy ready-to-use architecture, motion specs, and design tokens directly into Claude, Cursor, or ChatGPT.
- **Explore All Projects (`/prompts`)**: Public showcase with tag-based filtering, instant real-time search, and responsive cards with zero-scrollbar toolbar design.
- **Deep-Dive Prompt View (`/prompts/[slug]`)**: Rich Markdown instructions, component breakdowns, GitHub repository links, and live preview buttons.
- **Homepage Integration (`/#prompts`)**: Featured prompt project cards with high-contrast copy actions and 3-step workflow guidance.

### 🎮 Interactive Experience & Design System
- **Modern Glassmorphism**: Tailored HSL color palettes, subtle glowing borders, glass pills, and dark mode depth.
- **Fluid Motion & Scroll**: High-performance animations powered by **Framer Motion**, **GSAP**, and **Lenis** smooth scrolling.
- **3D Parallax & Custom Cursor**: Particle canvas background reactive to cursor movements and magnetic interaction states.
- **Zero-Flicker Skeleton Loading**: Dedicated skeleton components (`Skeleton.tsx`) and Next.js `loading.tsx` streaming across both public and admin routes.

### 🛠️ Comprehensive Admin CMS (`/admin`)
- **Prompt Project Manager (`/admin/prompts`)**:
  - Live GitHub repository selector with auto-fill (slug, description, topics, live homepage, and README screenshot detection).
  - Multi-prompt builder with live Markdown preview and custom thumbnail upload.
- **Dynamic Resume Management (`/admin/resume`)**:
  - Automatic Google Drive URL conversion to direct-download and preview links.
  - Multi-tier persistent storage (`data/settings.json` + `public/resume-settings.json`).
  - Dedicated `/api/resume?download=true` 307 redirect endpoint for zero dead links.
- **Blog CMS (`/admin/blogs`)**:
  - Full authoring system with instant draft/publish toggling and Markdown support.
- **Inquiry Inbox (`/admin/contacts`)**:
  - Review, track, and manage incoming messages from the contact form.

### 📊 Real-Time Analytics (`/admin/analytics`)
- **Traffic Overview**: Unique visitors, total sessions, bounce rate, and average session depth.
- **Route Intelligence**: Path-by-path metrics to pinpoint top-trafficked pages.
- **Client Fingerprinting**: Automated parsing for device type, operating system, browser engine, and geolocation (country & city).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Glassmorphism System |
| **Motion & Scroll** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com/gsap/) + [Lenis](https://lenis.darkroom.engineering/) |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team/) + [Neon Serverless PostgreSQL](https://neon.tech/) |
| **Authentication** | [Jose](https://github.com/panva/jose) (JWT) + [Bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Charts & Metrics** | [Recharts](https://recharts.org/) + [UAParser.js](https://github.com/faisalman/ua-parser-js) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome 6, Simple Icons) |

---

## 📂 Project Architecture

```bash
src/
├── app/
│   ├── (public)/                 # Public portfolio & discovery pages
│   │   ├── page.tsx              # Landing page (Hero, Work, Prompts, Contact)
│   │   ├── prompts/              # /prompts library & /prompts/[slug] details
│   │   ├── project/              # Project archive & individual views
│   │   ├── blog/                 # Blog archive & individual posts
│   │   └── loading.tsx           # Route-level suspense skeletons
│   ├── admin/                    # Admin portal
│   │   ├── (dashboard)/          # Protected views (prompts, resume, blogs, analytics)
│   │   │   ├── prompts/          # GitHub repo picker & Prompt manager
│   │   │   ├── resume/           # Resume link & file configuration
│   │   │   ├── blogs/            # Blog post editor & publisher
│   │   │   ├── analytics/        # Visitor metrics dashboard
│   │   │   └── contacts/         # Form submissions & leads
│   │   └── login/                # Secure JWT authentication
│   └── api/                      # Route handlers
│       ├── admin/                # Protected admin endpoints (upload, github-repos, prompts)
│       ├── resume/               # Dynamic resume download & 307 redirect
│       ├── blogs/                # Blog CRUD endpoints
│       └── analytics/            # Event logging & aggregation
├── components/
│   ├── ui/                       # Reusable UI (Skeleton, CustomSelect, MarkdownRenderer)
│   ├── prompts/                  # Prompt cards, copy actions, search toolbar
│   ├── CanvasParallax.tsx        # 3D interactive particle background
│   └── Contact.tsx               # Dynamic CV download button & contact form
├── lib/
│   ├── db/                       # Drizzle schema, client, and migrations
│   ├── prompts.ts                # Prompt project repository & default seeds
│   └── settings.ts               # Dynamic settings and multi-tier storage
└── types/                        # Core TypeScript definitions (prompts, db, analytics)
```

---

## 📦 Getting Started

### Prerequisites

- **Node.js 18.17+** or **Node.js 20+**
- A **PostgreSQL database** (e.g. [Neon](https://neon.tech))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubhjn4357/folio.git
   cd folio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Neon / PostgreSQL Database URL
   DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

   # Admin Authentication
   JWT_SECRET="your-super-secure-random-jwt-secret-key"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="your-strong-admin-password"

   # Optional: GitHub Personal Access Token (for higher rate limits on repo imports)
   # GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
   ```

4. **Initialize Database Schema:**
   ```bash
   npx drizzle-kit push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Available Scripts

- `npm run dev` - Start development server with Turbopack.
- `npm run build` - Build production bundle.
- `npm run start` - Start production server.
- `npm run lint` - Run Next.js ESLint verification.
- `npx drizzle-kit studio` - Open Drizzle database visualizer.

---

## 👤 Author

**Shubham Jain**
- GitHub: [@Shubhjn4357](https://github.com/Shubhjn4357)
- LinkedIn: [Shubham Jain](https://linkedin.com/in/shubham-jain-b46999135/)

---

## 📄 License

Distributed under the [MIT License](LICENSE).
