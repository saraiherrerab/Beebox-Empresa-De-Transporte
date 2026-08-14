# Beebox Landing Page CMS Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete 7-section Landing Page CMS Manager in `/admin/cms` matching every module of the public homepage (`/`).

**Architecture:** Next.js 15 App Router. Multi-tab interactive form editor with real-time feedback and state persistence.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

---

### Task 1: Build Full Landing Page CMS Manager (`/admin/cms/page.tsx`)

**Files:**
- Modify: `src/app/admin/cms/page.tsx`

- [ ] **Step 1: Implement 7-section multi-tab CMS editor in `/admin/cms`**
Tabs: Hero Carousel, Métricas, Promociones Activas, ¿Cómo Funciona?, Quiénes Somos (Misión/Visión), Cobertura Internacional, Footer & Contacto.

---

### Task 2: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
