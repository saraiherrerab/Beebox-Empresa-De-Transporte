# Beebox Demo Auth Page & Header Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `/login` into an instant demo selector with 2 buttons (Cliente & Admin CMS), integrate Auth buttons into the Landing Header Navbar, simplify `/registro`, and complete PDF audit checks.

**Architecture:** Next.js 15 App Router + `AuthContext.tsx` session management.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

---

### Task 1: Update Landing Header Navbar (`src/components/layout/Navbar.tsx`)

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Increase logo size and add Iniciar Sesión / Registrarse buttons in top header**

---

### Task 2: Build Simplified Demo Login View (`src/app/login/page.tsx`)

**Files:**
- Modify: `src/app/login/page.tsx`

- [ ] **Step 1: Replace standard inputs with 2 instant access demo buttons (Cliente & Admin CMS)**

---

### Task 3: Build Simplified Demo Register View (`src/app/registro/page.tsx`)

**Files:**
- Modify: `src/app/registro/page.tsx`

- [ ] **Step 1: Build instant demo registration flow generating suite code and redirecting to `/dashboard`**

---

### Task 4: Complete PDF Audit Checklist Verification

**Files:**
- Modify: `src/app/dashboard/paquetes/page.tsx`

- [ ] **Step 1: Confirm "Estatus" label and "Pies Cúbicos" column in packages table**

---

### Task 5: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
