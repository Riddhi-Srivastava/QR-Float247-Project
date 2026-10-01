# ApexUI - Frontend Foundation & Design System

A modern, high-performance frontend architecture built with **React 18**, **TypeScript**, **Vite**, and a zero-dependency **CSS Design System**.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
front/
├── index.html                  # HTML entry point with fonts & meta tags
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── src/
    ├── main.tsx                # App entry mount
    ├── App.tsx                 # Root application component
    ├── styles/
    │   └── index.css           # Global design tokens, resets & component styles
    └── components/
        ├── Navbar.tsx          # Responsive navigation & theme toggling
        ├── Hero.tsx            # Hero section with dynamic CTAs & badges
        ├── DashboardPreview.tsx# Interactive preview window & telemetry stream
        ├── Stats.tsx           # Key metrics & SLA indicators
        ├── Features.tsx        # Responsive feature grid with micro-interactions
        ├── InteractivePlayground.tsx # Interactive UI components, forms & toast alerts
        ├── CTASection.tsx      # Call to action banner
        └── Footer.tsx          # Brand footer with links
```

## 🎨 Design System Highlights
- **CSS Custom Properties**: Fluid color scales, dark/light theme tokens, and typography variables.
- **Glassmorphism & Depth**: Multi-layer backdrop blur, ambient neon glows, and gradient borders.
- **Responsive & Accessible**: Fully adaptable from mobile (320px) to ultra-wide desktop screens.
