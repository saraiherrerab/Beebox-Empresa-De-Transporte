# Beebox Client Views & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the complete client experience for Beebox based on the provided design mockups, including a redesigned Landing page, Authentication (`/login`, `/registro`), and a full Client Dashboard (`/dashboard`, `/dashboard/paquetes`, `/dashboard/pickup`).

**Architecture:** Next.js 15 App Router with an AuthContext for mock user session persistence (`Juan Pérez CAS-88293-MX`). Dashboard uses a dedicated layout with sidebar navigation, status filters, interactive timeline cards, and a multi-step pickup wizard.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, `clsx`, `tailwind-merge`.

## Global Constraints
- Clean responsive layout matching exact user mockups
- Primary brand accent: Beebox Honey Orange (`#FF7A00` / `#F59E0B`)
- Zero TypeScript errors (`npx tsc --noEmit`)
- Successful production build (`npm run build`)

---

### Task 1: AuthContext & Global Session Setup

**Files:**
- Create: `src/context/AuthContext.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `useAuth()` hook with `user`, `login()`, `logout()`, `isAuthenticated`

- [ ] **Step 1: Create `src/context/AuthContext.tsx`**

Implement mock user state with default profile (`Juan Pérez`, suite `CAS-88293-MX`, `juan@beebox.com`, addresses: `Casa (Predeterminada)`, `Oficina Norte`).

- [ ] **Step 2: Wrap root layout with AuthProvider**

Update `src/app/layout.tsx` to wrap children in `<AuthProvider>`.

---

### Task 2: Redesigned Landing Page (Matching Image 1)

**Files:**
- Create: `src/components/home/PromosSection.tsx`
- Create: `src/components/home/HowItWorks.tsx`
- Create: `src/components/home/AboutUs.tsx`
- Create: `src/components/home/GlobalCoverage.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update Navbar with Login & Signup buttons**

Add "INICIAR" and "REGISTRARSE" orange button to header navigation linking to `/login` and `/registro`.

- [ ] **Step 2: Create `PromosSection.tsx`**

Promociones Activas cards with discount timer badges ("Black Friday Logístico", "Primer Envío Gratis", "Flete Madrid Express") and image previews.

- [ ] **Step 3: Create `HowItWorks.tsx` & `AboutUs.tsx`**

4-step process cards (1. Regístrate, 2. Compra online, 3. Recibimos, 4. Entrega final) and Quiénes Somos section with company story & +15 Años stats.

- [ ] **Step 4: Create `GlobalCoverage.tsx` & update `src/app/page.tsx`**

World map coverage section with pins (Miami US, Madrid ES, Shenzhen CN, Arica CL). Assemble complete homepage matching Image 1.

---

### Task 3: Authentication Pages (`/login` & `/registro`)

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/registro/page.tsx`

- [ ] **Step 1: Create `src/app/login/page.tsx`**

Login screen with Beebox branding, credentials input, "Recordarme", "Olvidaste tu contraseña?", and a quick "Ingresar con Cuenta Demo (Juan Pérez)" button redirecting to `/dashboard`.

- [ ] **Step 2: Create `src/app/registro/page.tsx`**

Client registration screen with inputs for Nombre completo, Email, Teléfono, Contraseña, Confirmar Contraseña, and Terms checkbox.

---

### Task 4: Client Dashboard Layout & Sidebar (Matching Image 4)

**Files:**
- Create: `src/components/client/Sidebar.tsx`
- Create: `src/components/client/Header.tsx`
- Create: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Create `Sidebar.tsx`**

Sidebar menu with Beebox logo, active indicators for Dashboard, Mis Paquetes, Solicitar Pickup, Agendar Retiro, Calculadora, Mi Perfil, User profile footer at bottom (`Juan Pérez CAS-88293-MX`), and "Cerrar Sesión".

- [ ] **Step 2: Create `src/app/dashboard/layout.tsx`**

Dashboard layout integrating Sidebar on the left and scrollable page content on the right.

---

### Task 5: Dashboard Overview Page (`/dashboard`, Matching Image 2)

**Files:**
- Create: `src/components/client/WarehouseCard.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create `WarehouseCard.tsx`**

Card showing locker details (`🇺🇸 MIAMI WAREHOUSE`, Nombre: `Juan Pérez CAS-88293`, Dirección: `8400 NW 25th St`).

- [ ] **Step 2: Build `src/app/dashboard/page.tsx`**

Welcome header ("Bienvenido, Juan - Tienes 3 paquetes en camino a tu destino"), Real-time tracking card (`LT-449201-US` En Aduana timeline stepper + Subir Factura button), Miami Warehouse card, Orange Pickup CTA card ("¿Necesitas recolección?"), and Recent Packages table.

---

### Task 6: Mis Paquetes Page (`/dashboard/paquetes`, Matching Image 3)

**Files:**
- Create: `src/app/dashboard/paquetes/page.tsx`

- [ ] **Step 1: Build `src/app/dashboard/paquetes/page.tsx`**

Shipments table with status filter tabs (Todos 12, En Tránsito 2, En Aduana 1, Entregados 9), search bar ("Buscar por número de guía..."), table columns (Paquete, Origen, Estado, Última actu., Acción), and pagination controls.

---

### Task 7: Solicitar Pickup Multi-Step Wizard (`/dashboard/pickup`, Matching Images 4 & 5)

**Files:**
- Create: `src/components/client/PickupWizardStep1.tsx`
- Create: `src/components/client/PickupWizardStep2.tsx`
- Create: `src/app/dashboard/pickup/page.tsx`

- [ ] **Step 1: Create `PickupWizardStep1.tsx` (Matching Image 4)**

Step 1 Remitente: Pick pickup address cards (Casa Predeterminada, Oficina Norte, + Usar nueva dirección), Driver notes text area, Guía de Envío helper card, and 24/7 Support box.

- [ ] **Step 2: Create `PickupWizardStep2.tsx` (Matching Image 5)**

Step 2 Paquete: Cargo specs form (Tipo de carga, Dimensiones L/W/H, Peso est. kg, Valor decl. USD) and Commercial Invoice PDF/JPG upload dropzone.

- [ ] **Step 3: Build `src/app/dashboard/pickup/page.tsx`**

Interactive 5-step wizard container handling active step transitions.

---

### Task 8: Additional Dashboard Pages (`retiros`, `calculadora`, `perfil`)

**Files:**
- Create: `src/app/dashboard/retiros/page.tsx`
- Create: `src/app/dashboard/calculadora/page.tsx`
- Create: `src/app/dashboard/perfil/page.tsx`

- [ ] **Step 1: Build complementary dashboard screens**

Build Agendar Retiro, Calculadora, and Mi Perfil screens.

---

### Task 9: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
