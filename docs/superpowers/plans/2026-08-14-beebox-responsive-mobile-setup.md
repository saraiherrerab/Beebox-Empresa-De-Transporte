# Beebox Mobile & Desktop Responsive Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure 100% fluid responsive design across desktop, tablet, and mobile devices for both Client and Admin portals and public Landing Page.

**Architecture:** Next.js 15 App Router + Responsive Mobile Drawers.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

---

### Task 1: Add Mobile Navigation to Client Portal Layout

**Files:**
- Modify: `src/app/dashboard/layout.tsx`
- Modify: `src/components/client/Sidebar.tsx`

- [ ] **Step 1: Build mobile top bar and collapsible drawer navigation for Client Portal**

---

### Task 2: Add Mobile Navigation to Admin Portal Layout

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Build mobile top bar and collapsible drawer navigation for Admin Portal**

---

### Task 3: Audit & Optimize Landing Page Responsiveness

**Files:**
- Modify: `src/components/home/HeroCarousel.tsx`
- Modify: `src/components/home/RateCalculator.tsx`

- [ ] **Step 1: Ensure hero typography and calculator grids scale smoothly on mobile screens**

---

### Task 4: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
