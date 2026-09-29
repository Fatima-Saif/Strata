# Acme Enterprise SaaS Dashboard

A robust, production-ready SaaS dashboard built with Next.js 14, React, Tailwind CSS, and Framer Motion. This project serves as a comprehensive portfolio piece demonstrating advanced frontend architecture, responsive design, data visualization, and accessibility standards.

## 🚀 Features

- **Advanced Data Visualization**: Built with Recharts and customized for theming, featuring Revenue, Retention, Conversion Funnels, and Cohort analyses.
- **Enterprise-Grade Tables**: Built with `@tanstack/react-table` supporting multi-column sorting, fuzzy filtering, pagination, and actionable row dialogs.
- **Kanban Boards**: Drag-and-drop project management using `@dnd-kit/core`.
- **Global Command Palette**: A Linear-style `Cmd+K` command palette utilizing `cmdk` for fast, keyboard-first navigation and entity search.
- **Role-Based Access Control (RBAC)**: A mock permission store that dynamically hides/disables UI components based on the user's role (Admin, Manager, Developer, Viewer).
- **Responsive & Accessible**: Mobile-first design with bottom navigation on small screens, strict WCAG touch target compliance, and full ARIA labeling.
- **Motion Design**: Polished micro-interactions and route transitions powered by `framer-motion` and CSS spring physics.
- **Reporting Engine**: A dynamic Report Builder with PDF generation and export capabilities.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router) + React
- **Styling**: Tailwind CSS + `clsx` / `tailwind-merge`
- **Components**: Radix UI primitives (via shadcn/ui)
- **Animation**: Framer Motion
- **State Management**: Zustand & React Query (`@tanstack/react-query`)
- **Data Visualization**: Recharts & react-simple-maps
- **Drag & Drop**: `@dnd-kit`
- **Testing**: Vitest & Playwright

## ⚡ Quick Start (Local Setup in < 5 mins)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "sass project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   *(Note: Use `--legacy-peer-deps` if you encounter React 19 / RC dependency conflicts with certain charting libraries).*

3. **Environment Variables**
   Create a `.env.local` file in the root directory and add the necessary mock secrets (optional for local testing, required for true auth providers):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📐 Architecture Decisions

- **Mock API Layer**: To ensure the dashboard is fully demo-able without requiring a backend, all data is fetched via simulated API endpoints (`lib/api`) with artificial network latency. This data is cached and managed by React Query to demonstrate loading skeletons and error boundaries.
- **Code Splitting**: Heavy dependencies like Recharts are dynamically imported (`next/dynamic`) to keep the initial JS bundle lean and maximize Lighthouse performance scores.
- **CSS-First Animations**: While Framer Motion is used for complex orchestration (like the Command Palette and layout animations), generic UI states (hover lifts, dialog openings) rely on custom `cubic-bezier` CSS transitions for maximum performance.

## 🧪 Testing

This project includes both unit/component tests and End-to-End flows.

- **Run Unit Tests**: `npm run test` (Powered by Vitest)
- **Run E2E Tests**: `npx playwright test` (Requires running `npx playwright install` first)

## 📦 Deployment

This project is configured for seamless deployment on Vercel. 
Simply push to your main branch or create a Pull Request to trigger a preview deployment. Ensure `NEXT_PUBLIC_APP_URL` is configured in your Vercel project settings.
