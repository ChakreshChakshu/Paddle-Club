---
name: The Paddle Club
description: Premium pickleball & social dining destination in Agra — where competitive play meets artisan comfort
colors:
  olive-energy: "#9b9f60"
  olive-energy-light: "#c3c69f"
  olive-energy-dark: "#5d6039"
  neon-lime: "#ffff33"
  social-taupe: "#8c7e73"
  social-taupe-light: "#bab2ab"
  social-taupe-dark: "#544c45"
  brand-dark: "#18180c"
  brand-dark-card: "#222211"
  brand-dark-border: "#444422"
  ink: "#f6f6ee"
  corporate-blue: "#3b82f6"
  corporate-blue-deep: "#6366f1"
  accent-amber: "#d97706"
  accent-rose: "#f43f5e"
  accent-sky: "#0ea5e9"
typography:
  display:
    fontFamily: "Space Grotesk, Outfit, sans-serif"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "0.625rem"
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  section: "5rem"
  component: "2rem"
  element: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.olive-energy}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.lg}"
    padding: "12px 32px"
  button-cafe:
    backgroundColor: "{colors.accent-amber}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.xl}"
    padding: "16px 32px"
  button-corporate:
    backgroundColor: "{colors.corporate-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "16px 32px"
  card:
    backgroundColor: "{colors.brand-dark-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "#0c0c06"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
  nav-pill:
    backgroundColor: "{colors.brand-dark-card}"
    textColor: "#cbd5e1"
    rounded: "{rounded.pill}"
---

# Design System: The Paddle Club

## 1. Overview

**Creative North Star: "The Arena Lounge"**

This is the visual language of a premium sports club that happens to have a world-class cafe — not a cafe that happens to have courts. The system channels competitive energy through refined, dark-toned aesthetics: olive-tinged blacks that feel like walking into a members' club after hours, lime accents that pulse like court lighting, and warm taupe that softens the social spaces. Every surface breathes confidence and exclusivity without stiffness.

The design rejects all traces of generic sports facility websites (stock-photo grids, dense text walls, beige booking forms) and AI-generated SaaS defaults (purple gradients, cream backgrounds, glassmorphism on everything). It is firmly, unapologetically dark — light mode would dilute the brand's identity. Depth comes from tonal layering (opacity-shifted dark surfaces) and selective shadows, not from drop shadows or blur.

**Key Characteristics:**
- Olive-black body with warm undertone (never cold gray or pure black)
- Three distinct accent palettes that share the same dark DNA: lime (courts), amber (cafe), blue (corporate)
- Display type in Space Grotesk with tight tracking and extrabold weights
- Generous whitespace between sections, tight density within booking forms
- Purposeful motion — entrance reveals and scroll triggers, not decorative loops

## 2. Colors

The palette is built on a dark olive-black foundation with three domain-specific accents. Warmth comes from the olive undertone in darks, not from cream or beige backgrounds.

### Primary
- **Olive Energy** (#9b9f60): The core brand accent — used for court CTAs, checkmarks, icons, the "P" logo mark, and active states on court booking flows. Its muted saturation avoids neon flash while staying visible on dark backgrounds.
- **Olive Energy Light** (#c3c69f): Hover states, secondary text accents, and the logo highlight on "CLUB" in the navbar.
- **Olive Energy Dark** (#5d6039): Deep accent for gradients, hover underlays, and the shadow tint on the logo.

### Secondary
- **Social Taupe** (#8c7e73): The cafe brand accent — used for the "Cafe Brio" section heading, coffee icons, and the warm human tone that distinguishes the dining experience from the sport energy.
- **Social Taupe Light** (#bab2ab): Subtle hover states and light text within cafe contexts.

### Tertiary
- **Corporate Blue** (#3b82f6): The professional/event accent — used for the corporate booking page, RFP forms, and event package highlights. Reserved exclusively for the `/corporate` route.
- **Corporate Blue Deep** (#6366f1): Gradient endpoints on corporate page backgrounds.

### Accent (Page-Specific)
- **Accent Amber** (#d97706): Cafe Brio reservation buttons, dish pricing, and the "Reserve a Table" CTA. Active only on `/cafe`.
- **Accent Rose** (#f43f5e): Badminton arena accent — badges, buttons, and the active booking border on badminton court cards. Active only within the badminton context on `/courts`.
- **Accent Sky** (#0ea5e9): Skyball arena accent — badges, buttons, and the active booking border on skyball court cards. Active only within the skyball context on `/courts`.
- **Neon Lime** (#ffff33): Pickleball ball accent — a high-visibility pop used sparingly on pickleball-specific badges and the `brand-court.lime` token. Never used for body text or large surfaces.

### Neutral
- **Brand Dark** (#18180c): The body background. Olive-black with warm undertone — this is NOT `#000000` and NOT cold gray. It is the brand.
- **Brand Dark Card** (#222211): Elevated surface for cards, modals, and the navbar backdrop. One step lighter than the body.
- **Brand Dark Border** (#444422): Divider lines, card borders, and input strokes. Olive-tinted, never pure gray.
- **Ink** (#f6f6ee): Primary text color. Warm off-white that reads clearly on the dark background without harsh contrast.

**The Olive-Black Rule.** The body background is never pure black (#000000) and never cold gray (#111827). Brand Dark (#18180c) is the floor. All neutrals are tinted toward its olive hue.

**The One-Domain-Accent Rule.** Each page uses exactly one accent palette: courts = lime, cafe = amber, corporate = blue. Mixing accents within a page (e.g., an amber button on the courts page) is forbidden. The multi-accent system works because the domains are visually separated by route, not by section.

## 3. Typography

**Display Font:** Space Grotesk (with Outfit fallback)
**Body Font:** Plus Jakarta Sans (with Inter and system-ui fallback)

**Character:** Space Grotesk is geometric with a slight industrial edge — tight, confident, and built for display sizes. Plus Jakarta Sans is a humanist sans-serif with warm proportions that softens the body text against the dark background. Together they balance sport energy with lounge comfort.

### Hierarchy
- **Display** (700 weight, clamp(2.25rem, 5vw, 4rem), line-height 1): Hero headlines across all pages — "The Courts", "Cafe Brio", "Corporate Bookings". Always tracking-tight, always extrabold.
- **Headline** (700 weight, 2.25rem, line-height 1.1): Section headers — "Signature Offerings", "Booking Desk", "Elite Corporate Packages". Tight tracking.
- **Title** (700 weight, 1.25rem, line-height 1.3): Card titles, dish names, court names. Bold with tight tracking.
- **Body** (400 weight, 0.875-1rem, line-height 1.6): Descriptions, paragraphs, form labels. Max width 65ch for readability.
- **Label** (600 weight, 0.625rem, letter-spacing 0.1em, uppercase): Section eyebrows, step indicators, spec labels ("FACILITY RATE", "FLOOR SYSTEM"). Used sparingly — maximum 1 per 3 sections.

**The Eyebrow Restraint Rule.** Small uppercase tracking labels (like "Championship Play" or "Social & Dine") appear at most once per three sections. Overuse kills the premium feel and becomes AI grammar. When in doubt, drop the eyebrow — the headline alone carries the section.

## 4. Elevation

The system uses tonal layering rather than shadows for most depth. Surfaces are flat at rest; shadows appear only on interactive elements (buttons, cards on hover) and booking summary panels.

### Shadow Vocabulary
- **Ambient glow** (`box-shadow: 0 20px 60px rgba(0,0,0,0.5)`): The booking summary card — the "live invoice" panel that floats right of the form. Provides subtle lift without looking like a material card.
- **Accent tint** (`box-shadow: 0 8px 24px rgba(155,159,96,0.15)`): Court CTA buttons only — a lime-tinted glow that signals interactivity. Never used on non-court elements.
- **Card border** (`border: 1px solid rgba(68,68,34,0.3)`): The primary depth cue for cards and containers. Border color shifts on hover (to the domain accent) rather than adding shadow.

**The Tonal-Layering Rule.** Depth on dark backgrounds is conveyed through opacity shifts on surfaces (e.g., `bg-brand-dark-card/80` vs `bg-brand-dark-card/95`), not through drop shadows. Shadows are reserved for two use cases: the booking summary panel (ambient glow) and CTA buttons (accent tint).

## 5. Components

### Buttons
- **Shape:** Gently rounded (16px radius for large CTAs, pill for nav elements)
- **Primary (Courts):** Olive Energy background (#9b9f60), dark text, 12px 32px padding. On hover: lighter olive with a subtle scale-up. Focus: olive ring.
- **Cafe CTA:** Accent Amber (#d97706) background, dark text, pill shape (24px radius), 16px 32px padding. On hover: brighter amber.
- **Corporate CTA:** Corporate Blue (#3b82f6) background, white text, pill shape. On hover: lighter blue.
- **Specular Button (Hero):** Custom WebGL-effect button with animated shine border. Used only on the homepage hero "Book Court Session" CTA. The shine follows mouse proximity and pulses at 0.3 speed.
- **Ghost / Navbar CTA:** Transparent background with border, text in slate-300. On hover: fills with domain accent color.

### Chips / Tags
- **Style:** Small pills (9px font, uppercase, tracking-wider) with colored border and tinted background.
- **Court badges:** Lime-tinted background (`bg-lime-500/10`), lime text, lime border. Used on "Championship Surface", "High Impact & Speed", "BWF Approved Court".
- **Dietary tags:** Same structure but amber-tinted. Used on dish cards ("High Protein", "Post-Workout Fuel").
- **State:** Always static; never interactive. Informational only.

### Cards / Containers
- **Corner Style:** 24px radius (rounded-3xl) for major containers; 16px for inner cards
- **Background:** Brand Dark Card (#222211) or transparent dark with border
- **Shadow Strategy:** Border-first (1px olive-tinted border). Ambient shadow only on the booking summary panel.
- **Internal Padding:** 24-48px depending on card size; booking forms use 48-56px

### Inputs / Fields
- **Style:** Near-black background (#0c0c06), olive-tinted border (Brand Dark Border), 24px radius, 14px 16px padding
- **Focus:** Border shifts to domain accent (olive for courts, amber for cafe, blue for corporate) with a 1px ring of the same color
- **Icons:** Lucide icons positioned inside the input with left padding, 16px, in slate-500
- **Placeholder:** Slate-500 text at 12px — readable against the dark input background

### Navigation
- **Style:** Floating pill navbar with glassmorphic dark backdrop (95% opacity with 16px blur). Fixed to viewport top with 16px top margin. Rounded-full shape.
- **Typography:** 12px bold labels with Lucide icons. Active/hover state fills with a subtle dark card background.
- **Mobile:** Full-screen dark drawer with card-style navigation items. Each item gets an icon, title, and description.
- **Scroll behavior:** Navbar darkens on scroll (opacity shifts from 80% to 95%).

### Booking Summary Panel (Signature)
The right-column "live invoice" card on every booking form. Olive-accented left border (1px, solid, domain accent color). Shows real-time selections as the user fills the form. Submit button at the bottom changes from disabled (neutral-900) to active (domain accent) when all fields are complete. Glassmorphic backdrop on the entire panel.

### Expandable Gallery (Homepage Courts)
Horizontal scroll gallery with expand-to-full-view on click. Court images in a horizontal strip that expands to reveal a grid layout. Uses CSS transform for smooth expansion. No carousel — scroll-snap for breadth.

## 6. Do's and Don'ts

### Do:
- **Do** use the domain accent color exclusively within its route: olive on `/courts`, amber on `/cafe`, blue on `/corporate`. The multi-accent system works because routes are visually isolated.
- **Do** use tonal layering (opacity shifts on Brand Dark) to create depth. `bg-brand-dark-card/80` behind `bg-brand-dark-card/95` creates hierarchy without shadows.
- **Do** keep the eyebrow restraint: maximum 1 small uppercase tracking label per 3 sections. The headline alone is enough for most sections.
- **Do** use Space Grotesk extrabold (700) for all display and headline text. The weight carries the premium feel.
- **Do** maintain the warm olive undertone in all dark surfaces. Every neutral should feel like it belongs to the same dark family as Brand Dark (#18180c).
- **Do** implement full loading/empty/error states on all booking forms — this is a real booking flow, not a demo.
- **Do** use Framer Motion for entrance animations (fade-in + translate-up on scroll-into-view). Keep transitions under 600ms with ease-out curves.

### Don't:
- **Don't** use pure black (#000000) for any surface. Brand Dark (#18180c) is the floor. The olive undertone IS the brand.
- **Don't** mix accent colors across routes. An amber button on the courts page or a lime badge on the corporate page is a system violation.
- **Don't** use purple gradients, neon accents, glassmorphism as decoration, or cream/sand/beige backgrounds. These are explicitly listed as anti-references in PRODUCT.md.
- **Don't** use Inter as the display font. Space Grotesk is the brand voice; Inter is a fallback at most.
- **Don't** add drop shadows to cards as decoration. Border-first is the depth strategy. Shadows are reserved for the booking summary panel and CTA buttons only.
- **Don't** put an eyebrow label above every section header. This is the single most common AI tell and violates the eyebrow restraint.
- **Don't** use stock photos for court or cafe imagery. The public/ directory contains real facility photos — use them.
- **Don't** implement light mode. The dark olive aesthetic IS the brand. Light mode dilutes it.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards or list items. The booking summary panel's left border is the one legitimate exception.
