# Beebox Requirements Update & CMS Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full technical and business specification: 100% elimination of orange to yellow, Hero Carousel, Key Metrics module, Prealertas module, standardized package table with "Estatus", adjusted 4-step Pickup with multipack & electronic devices check, and full Admin/CMS Panel with role switcher.

**Architecture:** Next.js 15 App Router. Role switcher in sidebar/header to seamlessly toggle between Client Dashboard (`/dashboard`) and Admin CMS Panel (`/admin`).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

---

### Task 1: Color Palette Update (100% Elimination of Orange to Yellow)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/client/Sidebar.tsx`
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace all orange classes with Beebox Yellow**
Ensure zero orange classes (`bg-orange-*`, `text-orange-*`, `border-orange-*`) remain. Use Beebox Yellow (`amber-500` / `#F59E0B`).

---

### Task 2: Redesign Homepage - Hero Carousel, Key Metrics & Footer Newsletter

**Files:**
- Create: `src/components/home/HeroCarousel.tsx`
- Create: `src/components/home/MetricsSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `HeroCarousel.tsx`**
Interactive 3-slide rotating carousel featuring *"Rastrea tus sueños, nosotros los llevamos"*.

- [ ] **Step 2: Create `MetricsSection.tsx`**
Key Metrics intermediate banner showing total Aéreo and Marítimo shipments and delivery accuracy stats (replaces top newsletter).

- [ ] **Step 3: Update `src/app/page.tsx`**
Integrate HeroCarousel and MetricsSection into homepage layout.

---

### Task 3: Prealertas Module (`/dashboard/prealertas`) & AuthContext Extension

**Files:**
- Modify: `src/context/AuthContext.tsx`
- Create: `src/app/dashboard/prealertas/page.tsx`
- Modify: `src/components/client/Sidebar.tsx`

- [ ] **Step 1: Update `AuthContext.tsx`**
Add pre-alerts state array and `addPrealerta` helper, plus role state (`client` | `admin`).

- [ ] **Step 2: Create `src/app/dashboard/prealertas/page.tsx`**
Pre-alert registration form (Comercio de origen, Tracking number, Descripción, Monto pagado, Factura PDF/JPG upload) and pre-alerts list table.

- [ ] **Step 3: Update `Sidebar.tsx`**
Replace "Agendar Retiro" with "Prealertas" (`/dashboard/prealertas`) and add Role Switcher toggle (Modo Cliente <-> Modo Administrador).

---

### Task 4: Package Table Standardization (`/dashboard/paquetes`)

**Files:**
- Modify: `src/app/dashboard/paquetes/page.tsx`

- [ ] **Step 1: Standardize table column header to "Estatus"**
Include fields: Número de Guía, Descripción, Origen, Destino, Ruta, Peso, Pies Cúbicos, Estatus.

---

### Task 5: Adjusted Solicitar Pickup Flow (4 Steps, Multipaquete & Electronics Check)

**Files:**
- Modify: `src/components/client/PickupWizardStep2.tsx`
- Modify: `src/components/client/PickupWizardStep3.tsx`
- Modify: `src/app/dashboard/pickup/page.tsx`

- [ ] **Step 1: Update `PickupWizardStep2.tsx`**
Add Multipaquete support (adding 1, 2, 3+ boxes with individual dimensions) and mandatory Checkbox/Radio *"¿El envío contiene dispositivos electrónicos?"* (Marca and Modelo required if Yes).

- [ ] **Step 2: Update `PickupWizardStep3.tsx`**
Require two (2) contact phone numbers for the recipient.

- [ ] **Step 3: Update `src/app/dashboard/pickup/page.tsx`**
Set 4-step wizard structure without payment step (Step 1 Remitente -> Step 2 Paquetes -> Step 3 Destinatario -> Step 4 Horario & Confirmación).

---

### Task 6: Panel de Administración & CMS (`/admin`)

**Files:**
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/clientes/page.tsx`
- Create: `src/app/admin/prealertas/page.tsx`
- Create: `src/app/admin/rutas/page.tsx`
- Create: `src/app/admin/retiros/page.tsx`
- Create: `src/app/admin/calculadora/page.tsx`
- Create: `src/app/admin/cms/page.tsx`

- [ ] **Step 1: Build Admin Sidebar & Layout**
Create `AdminSidebar.tsx` and `src/app/admin/layout.tsx` with role toggle back to client dashboard.

- [ ] **Step 2: Build Admin Sub-pages**
Create Directorio de Clientes, Gestión de Prealertas (linking trackings), Catálogo de Rutas, Calendario de Retiros Unificado, Calculadora Administrativa (email quote) and CMS Banner Manager.

---

### Task 7: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
