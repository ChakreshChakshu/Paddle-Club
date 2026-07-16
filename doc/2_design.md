# Design System & UI/UX Design

The Paddle Club Agra utilizes a premium, high-fidelity design system that bridges dynamic sports energy with high-end garden cafe aesthetics. The interface is optimized to feel responsive, sleek, and interactive.

## Core Design Philosophy

*   **Dark Mode First**: The interface uses a deep, dark slate foundation (`bg-brand-dark` / slate text) to mimic premium sports club applications, allowing neon courts and warm cafe accents to stand out.
*   **Contextual Branding Colors**:
    *   **Court Context**: Dominated by Teal and Neon Lime (`brand-court` / `#00b4d8` and `#39ff14`). This represents championship play, energy, and evening floodlit sports.
    *   **Cafe Context**: Dominated by Warm Coffee Amber and Toast Cream (`brand-cafe` / `#d9a05b`). This invokes the warm, aromatic, organic, open-air garden feel of Cafe Brio.
*   **Glassmorphism & Depth**: Multi-layer cards (`bg-brand-dark-card/60 backdrop-blur`) and glowing background orbs create depth.

---

## Typography & Grids

*   **Headings**: Premium sans-serif headings with high weights (e.g., `font-display font-bold`) used for titles.
*   **Body**: Inter or Roboto clean sans-serif for numbers, metadata, and description fields, ensuring high legibility on mobile screens.
*   **Bento Grid Layouts**: Used to represent status boards, statistics, and live indicators. This keeps details dense yet easily readable.

---

## Key UI Components & UX Features

### 1. The Hero Video & Gradient Masking
The landing page implements a full-bleed, auto-playing video of pickleball action. To keep text legible, a custom horizontal gradient mask is applied:
*   Left side: Deep opaque slate-black (`brand-dark/95`) fading to transparency on the right.
*   This anchors the typography and interactive elements without obscuring the background video.

### 2. Micro-Animations & Dynamic Feedback
To make the application feel responsive and alive:
*   **Typewriter Effects**: The hero title types out sports and social taglines dynamically.
*   **Scale Feedback**: Buttons scale down slightly upon tapping (`active:scale-95`) and enlarge on hover (`hover:scale-105`).
*   **Live Status Indicators**: Pulse animations (e.g., a green pulsing dot next to "3 Courts Available" or "AI Booking Active") signal active real-time systems.

### 3. Mobile-First Customer Interface
The Customer PWA is specifically locked and padded to mimic a native mobile dashboard (`max-w-md mx-auto border-x`). It implements a sticky header for quick system badges, simple card-based slot toggling, and a fixed bottom tab bar for thumb-friendly navigation.

### 4. Shared UI System (`@paddle-club/ui`)
Visual controls are shared to prevent divergence:
*   `Button.tsx`: Exports standard styles (`primary` for sports, `secondary` for cafe, `outline` for system actions).
*   `Card.tsx`: Standardizes padding, rounded borders, and glass backdrop blurs across all dashboards.
