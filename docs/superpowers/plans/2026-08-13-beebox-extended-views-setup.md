# Beebox Extended Client Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 5 newly provided mockups: Pickup Steps 3, 4, 5, Calendario de Retiros page, and Calculadora de Envíos page.

**Architecture:** Next.js 15 App Router using component modularity. Pickup wizard completed with 5 steps (`PickupWizardStep3`, `PickupWizardStep4`, `PickupWizardStep5`), Calendario de Retiros page with interactive month grid, and Calculadora de Envíos page with transport mode tabs & live calculation breakdown.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

## Global Constraints
- Exact visual matching of provided mockups
- Primary brand accent: Beebox Honey Orange (`#FF7A00` / `#F59E0B`)
- Zero TypeScript errors (`npx tsc --noEmit`)

---

### Task 1: Pickup Step 3 - Datos del Destinatario Internacional

**Files:**
- Create: `src/components/client/PickupWizardStep3.tsx`

- [ ] **Step 1: Create `PickupWizardStep3.tsx` (Matching Image 1)**

Form inputs for Nombre completo / Razón social, ID / Tax ID, Teléfono de contacto, and Dirección de destino internacional textarea.

---

### Task 2: Pickup Step 4 - Programación de Fecha y Hora

**Files:**
- Create: `src/components/client/PickupWizardStep4.tsx`

- [ ] **Step 1: Create `PickupWizardStep4.tsx` (Matching Image 2)**

Mini interactive calendar date picker (October 2026, day 11 selected) and time slot cards (Mañana 09-12h, Tarde 14-18h).

---

### Task 3: Pickup Step 5 - Pago y Confirmación Final

**Files:**
- Create: `src/components/client/PickupWizardStep5.tsx`

- [ ] **Step 1: Create `PickupWizardStep5.tsx` (Matching Image 3)**

Transfer details card, $50.00 USD total box, receipt upload dropzone, yellow notice, and green `CONFIRMAR Y ENVIAR ✓` button.

---

### Task 4: Connect All 5 Steps in `src/app/dashboard/pickup/page.tsx`

**Files:**
- Modify: `src/app/dashboard/pickup/page.tsx`

- [ ] **Step 1: Wire steps 1-5 into Pickup Wizard**

Update stepper header and render active step dynamically.

---

### Task 5: Redesigned Calendario de Retiros Page (`/dashboard/retiros`)

**Files:**
- Modify: `src/app/dashboard/retiros/page.tsx`

- [ ] **Step 1: Build `src/app/dashboard/retiros/page.tsx` (Matching Image 4)**

Orange requirements banner, October 2026 month grid with status pills, time slot picker cards (09:00 AM Elegido, 10:30 AM, 11:00 AM, 01:30 PM Lleno), and appointment summary bar with `3 Ítems Listos` & `AGENDAR RETIRO AHORA` button.

---

### Task 6: Redesigned Calculadora de Envíos Page (`/dashboard/calculadora`)

**Files:**
- Modify: `src/app/dashboard/calculadora/page.tsx`

- [ ] **Step 1: Build `src/app/dashboard/calculadora/page.tsx` (Matching Image 5)**

Aéreo/Marítimo transport selector, Weight LB/KG, Declared value USD, Dimensions L/W/H, right dark summary card with base freight, insurance, taxes, total estimate, `GUARDAR COTIZACIÓN` button, and bottom consolidation info callout.

---

### Task 7: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
