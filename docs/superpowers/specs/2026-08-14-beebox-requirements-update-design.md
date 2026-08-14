# Design Specification: Beebox Full Requirements & CMS Architecture Update

## 1. Executive Summary
This document incorporates the exact technical and business requirements from the 4-page Specification Document provided:
- **100% Elimination of Orange**: Transition all primary actions, highlights, and borders to **Yellow** (`#F59E0B` / `#EAB308` / `#FBBF24`) matching the Beebox logo identity, paired strictly with neutrals (white, black, grays).
- **Homepage Carousel & Metrics**: Interactive Hero Carousel with *"Rastrea tus sueños, nosotros los llevamos"*, replaced newsletter with Key Metrics (Aéreo/Marítimo statistics), and moved newsletter subscription to the Footer.
- **Prealertas Module (`/dashboard/prealertas`)**: Online purchase pre-notification before physical warehouse arrival.
- **Standardized Tracking**: Strict use of **"Estatus"** in package tables with fields: Guía, Descripción, Origen, Destino, Ruta, Peso, Pies Cúbicos, Estatus.
- **Adjusted Pickup Flow (No Payment Step)**:
  - Removed "Información de Pago" step (Section 5 requirement).
  - Added **Multipaquete** support (adding 1, 2, 3+ boxes with individual dimensions).
  - Added **Dispositivos Electrónicos** conditional fields (Marca & Modelo required if Yes).
  - Required **two (2) contact phone numbers** for recipient.
- **CMS / Admin Panel (`/admin`)**:
  - Role switcher toggle (Modo Cliente <-> Modo Administrador).
  - Client & Locker Directory, Pre-alerts Linking, Standard Routes Manager, Unified Pickups Calendar, Admin Quoter & CMS Banner Manager.

---

## 2. Palette & Design Token Updates
- **Primary Color**: Beebox Honey Yellow (`#F59E0B` / `#EAB308` / `#FFC107`).
- **Neutrals**:
  - Backgrounds: `#FFFFFF`, `#F8FAFC`, Slate Dark `#0F172A` (for contrast blocks).
  - Text & Headings: `#0F172A`, `#334155`, `#64748B`.
  - Borders: `#E2E8F0`, `#CBD5E1`.
- **Eliminated**: `#FF7A00`, `#FF8C00` (Orange color completely removed).

---

## 3. Detailed Component & Route Architecture

```text
src/
├── app/
│   ├── page.tsx                        # Redesigned Homepage with Carousel & Metrics
│   ├── login/
│   │   └── page.tsx                    # Login view with Yellow palette
│   ├── registro/
│   │   └── page.tsx                    # Registration with auto-assigned virtual locker
│   ├── dashboard/
│   │   ├── layout.tsx                  # Client Sidebar with Role Switcher
│   │   ├── page.tsx                    # Dashboard Overview (Prealertas summary & tracking)
│   │   ├── prealertas/
│   │   │   └── page.tsx                # NEW: Prealertas de Compras Online
│   │   ├── paquetes/
│   │   │   └── page.tsx                # Mis Paquetes Recibidos (Estatus column & full specs)
│   │   ├── pickup/
│   │   │   └── page.tsx                # Adjusted 4-Step Pickup (Multipaquete & Electronic Check)
│   │   └── calculadora/
│   │       └── page.tsx                # Calculadora de Envíos con opción Guardar/Enviar Email
│   └── admin/
│       ├── layout.tsx                  # Admin Portal Layout
│       ├── page.tsx                    # Admin Overview & Key Metrics
│       ├── clientes/
│       │   └── page.tsx                # Directorio de Clientes y Casilleros
│       ├── prealertas/
│       │   └── page.tsx                # Gestión & Vinculación de Prealertas
│       ├── rutas/
│       │   └── page.tsx                # Catálogo de Rutas Standard y Tarifas
│       ├── retiros/
│       │   └── page.tsx                # Gestión de Retiros y Pickups Unificado
│       ├── calculadora/
│       │   └── page.tsx                # Calculadora Administrativa (Cotización por Email)
│       └── cms/
│           └── page.tsx                # Administrador de Banners y Contenidos
├── context/
│   └── AuthContext.tsx                 # Extended with role state (client / admin) & prealerts
└── components/
    ├── home/
    │   ├── HeroCarousel.tsx            # Interactive Hero Carousel
    │   └── MetricsSection.tsx          # Key Metrics (Aéreo / Marítimo stats)
    ├── client/
    │   └── PrealertaModal.tsx          # Prealerta quick registration
    └── admin/
        ├── AdminSidebar.tsx            # Admin Navigation sidebar
        └── LinkPrealertaModal.tsx      # Link prealert with warehouse barcode
```

---

## 4. Verification & Testing Plan
- TypeScript type checking: `npx tsc --noEmit`
- Next.js build validation: `npm run build`
- Role switcher verification: Toggle between Client Dashboard and Admin CMS Panel.
