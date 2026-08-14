# Design Specification: Beebox Empresa de Transporte - Frontend Repository

## 1. Context & Objectives
Repository for **Beebox Empresa de Transporte**, a logistics and transport company web application. 
The goal is to structure a modern, high-performance, and visually stunning frontend codebase using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**, pre-configured with reusable UI components, routing, domain types, and brand theme.

## 2. Tech Stack & Dependencies
- **Core Framework**: Next.js 15+ (App Router)
- **UI Engine**: React 19
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS with custom brand colors & glassmorphism utilities
- **Icons**: Lucide React
- **Utilities**: `clsx`, `tailwind-merge` (`cn` helper)

## 3. Directory Architecture
```
Beebox-Empresa-De-Transporte/
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs / tailwind.config.ts
├── tsconfig.json
├── README.md
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx         # Root layout with Fonts, Navbar, Footer, Providers
    │   ├── page.tsx           # Beebox Homepage (Hero, Tracking, Services, Fleet, Testimonials, CTA)
    │   ├── globals.css        # Tailwind directives, CSS variables, glassmorphism & gradients
    │   ├── loading.tsx        # Global fallback loading spinner / skeleton
    │   ├── not-found.tsx      # Custom 404 page for invalid tracking or routes
    │   └── rastreo/
    │       └── page.tsx       # Parcel tracking interactive dashboard
    ├── components/
    │   ├── ui/                # Atomic UI primitives (Button, Card, Input, Badge, Container)
    │   ├── layout/            # Navbar, Footer, MobileNav
    │   ├── home/              # HeroSection, TrackingWidget, ServiceCards, FleetShowcase, StatsCounter
    │   └── tracking/          # StatusTimeline, ParcelDetailsCard
    ├── lib/
    │   └── utils.ts           # Tailwind `cn()` helper function
    ├── types/
    │   └── index.ts           # Shipment, TrackingStatus, ServiceOption, FleetItem interfaces
    └── constants/
        └── index.ts           # Company links, mock tracking database, services list
```

## 4. Brand Design & Aesthetics
- **Primary Color**: Deep Navy / Charcoal (`#0F172A`, `#1E293B`) for stability & professional logistics.
- **Accent Color**: Honey Gold / Vibrant Amber (`#F59E0B`, `#EAB308`, `#FCD34D`) representing the "Bee" identity & urgency.
- **Secondary Accent**: Electric Cyan (`#06B6D4`) for live tracking status & active indicators.
- **Backgrounds**: Sleek Dark & Light balanced theme with subtle grid patterns and glassmorphic cards (`backdrop-blur-md`).
- **Typography**: Inter font for high legibility across mobile & desktop.

## 5. Included Features & Initial Components
1. **Interactive Parcel Tracking**: Users can enter a tracking code (e.g. `BEE-98234-CL`) and view real-time status updates (Collected, In Transit, Customs, Out for Delivery, Delivered).
2. **Services Showcase**: Express Shipping, Heavy Cargo, Interurban Freight, Warehousing & Last Mile.
3. **Interactive Fleet Showcase**: Display of Beebox transport vehicles (vans, trucks, refrigerated cargo).
4. **Instant Rate / Shipping Calculator Component**: Quick estimate form for origin, destination, and package weight.
5. **Responsive Navigation & Mobile Drawer**: Header with contact info, status checker shortcut, and request quote CTA.

## 6. Verification Plan
- Type check: `npx tsc --noEmit`
- Next.js build test: `npm run build`
- Dev server execution: `npm run dev`
