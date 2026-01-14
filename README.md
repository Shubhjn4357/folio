# Folio - Next-Gen Interactive Portfolio
<img src="./public/thumbnail.png" alt="Folio Thumbnail" width="100%" />

A cutting-edge developer portfolio built with **Next.js 16**, featuring AI-powered **Hand Gesture Navigation**, a custom **Admin Dashboard**, and a robust **Analytics System**. Designed to be immersive, performant, and functionally rich.

## 🚀 Features

### 🎮 Interactive Experience
-   **Hand Gesture Control**: Navigate scrolling and interactions using hand gestures via **MediaPipe**.
    -   *Pinch* to scroll precisely.
    -   *Flick Up* to scroll down rapidly.
-   **3D Parallax Effects**: Mouse-reactive particle background and depth effects.
-   **Custom Cursor**: Dynamic cursor interactions with magnetic effects.

### 📊 Advanced Analytics
-   **Real-Time Dashboard**: Visualize traffic, unique visitors, and bounce rates.
-   **Route Metrics**: Track "Average Session Depth" and "Most Visited Routes".
-   **Device Intelligence**: Automatic detection of User Devices, OS, Browsers, and Geo-location.

### 🛠️ Admin Dashboard
-   **CMS**: Manage Blog posts and Project details directly from the admin panel.
-   **Contact Management**: View and reply to messages from the contact form.
-   **Secure Access**: Protected routes for administrative control.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + Turbopack
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + SCSS
-   **Animations**: [GSAP](https://greensock.com/gsap/) + [Framer Motion](https://www.framer.com/motion/)
-   **Database**: [Drizzle ORM](https://orm.drizzle.team/) + Neon (PostgreSQL)
-   **AI/ML**: [MediaPipe Hands](https://developers.google.com/mediapipe) (Gesture Recognition)

## 📦 Getting Started

### Prerequisites

-   Node.js 18+ installed.
-   A PostgreSQL database (e.g., Neon).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shubhjn4357/folio.git
    cd folio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

    # Vercel (Optional, for Geo Analytics locally)
    # BLOB_READ_WRITE_TOKEN=...
    ```
    JWT_SECRET=your_secret_key
    ADMIN_USERNAME=your_admin_username
    ADMIN_PASSWORD=your_admin_password
    ```
4.  **Database Migration**
    Push the schema to your database:
    ```bash
    npx drizzle-kit push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (public)/       # Public portfolio routes
│   ├── admin/          # Admin dashboard (protected)
│   ├── api/            # Next.js API Routes (Analytics, Auth)
│   └── layout.tsx      # Root layout with providers
├── components/
│   ├── CanvasParallax  # 3D Particle System & MediaPipe Logic
│   ├── AnalyticsTracker # Client-side tracking component
│   └── dashboard/      # Admin UI components
├── lib/
│   ├── db/             # Drizzle Schema & Config
│   └── auth.ts         # Authentication utilities
└── styles/             # Global SCSS
```

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes (`git commit -m 'Add NewFeature'`)
4.  Push to the Branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.

## 👤 Author

**Shubham Jain**
-   Website: [shubhamjain](https://shubham-jain.vercel.app)
-   GitHub: [@Shubhjn4357](https://github.com/Shubhjn4357)
