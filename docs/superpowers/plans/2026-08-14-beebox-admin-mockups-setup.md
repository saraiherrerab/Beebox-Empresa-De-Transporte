# Beebox Admin Panel Mockups & Yellow Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the exact layout, visual design, and components from the user's 5 Admin Panel Mockups while ensuring 100% bright Beebox Yellow palette (`#F59E0B` / `#FACC15`) across all screens.

**Architecture:** Next.js 15 App Router. Grouped dark sidebar matching user mockups (`PRINCIPAL`, `OPERACIONES`, `GESTIÓN DE CLIENTES`, `SITIO WEB`, `CONFIGURACIÓN`).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

---

### Task 1: Primary Yellow Color Tokens Alignment

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Ensure Beebox Yellow tokens render crisp bright yellow**

---

### Task 2: Redesign Admin Sidebar (`src/components/admin/AdminSidebar.tsx`)

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Rebuild Admin Sidebar matching Mockups 1-5**
Grouped navigation (PRINCIPAL, OPERACIONES, GESTIÓN DE CLIENTES, SITIO WEB, CONFIGURACIÓN) and bottom profile `AD Admin Principal SUPERUSER` with role toggle button.

---

### Task 3: Build Admin Pickups Management (`/admin/pickups`)

**Files:**
- Create: `src/app/admin/pickups/page.tsx`

- [ ] **Step 1: Build `/admin/pickups` matching Mockup 1**
Tabs (Por Validar Pago, Por Recolectar, En Ruta), request card list, and detail view with payment receipt preview, driver assignment dropdown, and `RECHAZAR PAGO` & `VALIDAR Y ASIGNAR` buttons.

---

### Task 4: Build Admin Control de Envíos (`/admin/envios`)

**Files:**
- Create: `src/app/admin/envios/page.tsx`

- [ ] **Step 1: Build `/admin/envios` matching Mockup 2**
Filter tabs (Todos, Recibidos, En Vuelo, Aduana, Disponibles), global package tracking table with Guía, Cliente/Casillero, Ruta, Estatus Actual badges, Última Actividad, and Acciones.

---

### Task 5: Build Admin Citas de Retiro (`/admin/retiros`)

**Files:**
- Modify: `src/app/admin/retiros/page.tsx`

- [ ] **Step 1: Build `/admin/retiros` matching Mockup 3**
Tabs (Hoy, Mañana, Próximas, Completadas), table with Hora, Cliente/Casillero, Sucursal/Ventanilla, Paquetes Listos, Estado Confirmada, and `ENTREGAR` green button.

---

### Task 6: Build Admin Logística y Rutas (`/admin/rutas`)

**Files:**
- Modify: `src/app/admin/rutas/page.tsx`

- [ ] **Step 1: Build `/admin/rutas` matching Mockup 4**
Catálogo de Rutas Predeterminadas (Miami Express Aérea, Madrid Cargo Marítima, CDMX Local Terrestre + `+ AÑADIR AL CATÁLOGO`) and Monitoreo de Rutas en Curso with Chofer, progress % and `RASTREAR EN MAPA` dark button.

---

### Task 7: Build Admin Base de Clientes CRM (`/admin/clientes`)

**Files:**
- Modify: `src/app/admin/clientes/page.tsx`

- [ ] **Step 1: Build `/admin/clientes` matching Mockup 5**
Top metrics cards (Total Clientes 12,481, Nuevos Registros +456) and Lista Maestra table with Cliente, Casillero ID, Contacto, Actividad, Estado, Acciones.

---

### Task 8: Verification & Build Validation

- [ ] **Step 1: Run TypeScript check**
`npx tsc --noEmit`

- [ ] **Step 2: Production build validation**
`npm run build`
