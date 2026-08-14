# Beebox Frontend Setup & Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Structure the frontend repository for Beebox Empresa de Transporte using Next.js 15+, React 19, TypeScript, and Tailwind CSS, complete with domain components, parcel tracking dashboard, rate calculator, and brand styling.

**Architecture:** Next.js App Router inside `src/app` with a modular component architecture (`src/components/{ui,layout,home,tracking}`). Shared domain types live in `src/types` and mock data / constants live in `src/constants`. Tailwind CSS utilities are augmented with a `cn()` helper in `src/lib/utils.ts`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS, Lucide React, `clsx`, `tailwind-merge`.

## Global Constraints
- Node version: 22.x
- Package manager: `npm`
- Strict TypeScript types (`noImplicitAny`, `@/*` path alias mapped to `./src/*`)
- Fully responsive UI (mobile drawer, desktop navbar, responsive grids)
- Zero build errors or unhandled promises

---

### Task 1: Initialize Next.js 15+ App Router Project & Tailwind CSS Config

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `src/lib/utils.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` in `src/lib/utils.ts`

- [ ] **Step 1: Create package.json with dependencies**

Write `package.json`:
```json
{
  "name": "beebox-empresa-de-transporte",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "next": "^15.1.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json and next.config.ts**

Write `tsconfig.json` with `@/*` path alias pointing to `./src/*`.
Write `next.config.ts`.

- [ ] **Step 3: Setup Tailwind CSS and PostCSS config**

Configure `postcss.config.mjs` and `tailwind.config.ts` featuring Beebox brand colors (`navy`, `amber`, `cyan`).

- [ ] **Step 4: Create `src/lib/utils.ts` helper**

```typescript
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Write `src/app/globals.css` and `src/app/layout.tsx`**

Configure `@tailwind base; @tailwind components; @tailwind utilities;` in `globals.css` with dark grid patterns and custom scrollbar styling. Set root layout with metadata for Beebox.

- [ ] **Step 6: Install node_modules and verify TS compiler**

Run `npm install` and `npx tsc --noEmit`.

---

### Task 2: Domain Types & Constants Setup

**Files:**
- Create: `src/types/index.ts`
- Create: `src/constants/index.ts`

**Interfaces:**
- Produces: `Shipment`, `TrackingEvent`, `ServiceOption`, `FleetVehicle`, `RateQuote` interfaces in `src/types/index.ts`.
- Produces: `MOCK_SHIPMENTS`, `SERVICES_LIST`, `FLEET_LIST`, `NAV_LINKS` in `src/constants/index.ts`.

- [ ] **Step 1: Create `src/types/index.ts`**

Define domain models for parcel tracking, delivery timeline, transport services, fleet management, and shipping estimates.

- [ ] **Step 2: Create `src/constants/index.ts`**

Populate company details (phone `+56 9 8765 4321`, email `contacto@beebox.cl`, headquarters in Santiago), mock tracking database (`BEE-98234-CL`, `BEE-45102-CL`), list of services, and fleet catalog.

---

### Task 3: Base UI Primitives & Layout Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `cn()` from `src/lib/utils.ts`, `NAV_LINKS` from `src/constants/index.ts`.
- Produces: `Button`, `Card`, `Badge`, `Input`, `Navbar`, `Footer` reusable components.

- [ ] **Step 1: Create atomic UI primitives**

Build `Button.tsx` (variants: primary, amber, outline, ghost), `Card.tsx` (glassmorphism hover effect), `Badge.tsx` (status styling), and `Input.tsx` (icon support).

- [ ] **Step 2: Create `Navbar.tsx`**

Include top announcement bar (contact number, operational status), Beebox brand logo with Hexagon/Bee icon, navigation links, mobile hamburger drawer, and "Rastrear Envío" CTA button.

- [ ] **Step 3: Create `Footer.tsx`**

Include company overview, service links, coverage areas (Santiago, Valparaíso, Concepción, Antofagasta), contact info, newsletter input, and copyright bar.

---

### Task 4: Interactive Business Components & Pages

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/TrackingWidget.tsx`
- Create: `src/components/home/ServiceCards.tsx`
- Create: `src/components/home/FleetShowcase.tsx`
- Create: `src/components/home/RateCalculator.tsx`
- Create: `src/components/tracking/StatusTimeline.tsx`
- Create: `src/components/tracking/ParcelDetailsCard.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/rastreo/page.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create `TrackingWidget.tsx` & `HeroSection.tsx`**

Hero section with dynamic background, logistics metrics (e.g. +50,000 envíos entregados, 99.4% a tiempo), and quick tracking input form.

- [ ] **Step 2: Create `ServiceCards.tsx`, `FleetShowcase.tsx`, and `RateCalculator.tsx`**

Build interactive cards for transport services, fleet tab switcher, and rate calculator calculating price based on distance & volume.

- [ ] **Step 3: Build `src/app/page.tsx` homepage**

Assemble Navbar, HeroSection, ServiceCards, RateCalculator, FleetShowcase, Testimonials/Stats, and Footer.

- [ ] **Step 4: Build `src/app/rastreo/page.tsx` tracking dashboard**

Page accepting `?codigo=BEE-98234-CL` query parameter or search form to view interactive package status timeline (Recogido -> En Centro de Distribución -> En Tránsito -> En Reparto -> Entregado).

- [ ] **Step 5: Create `loading.tsx` & `not-found.tsx`**

Clean loading pulse skeleton and custom 404 page for invalid tracking code or route.

---

### Task 5: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Build project**
`npm run build`

- [ ] **Step 3: Commit code to git**
`git add . && git commit -m "feat: complete initial Beebox frontend architecture with Next.js, React, TypeScript, Tailwind and tracking dashboard"`
