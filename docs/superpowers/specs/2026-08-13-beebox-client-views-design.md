# Design Specification: Beebox Frontend - Client Views & Authentication Flow

## 1. Overview & Objectives
Incorporate the exact visual design and user flow from the provided mockups for **Beebox Empresa de Transporte SpA**, adding:
1. **Redesigned Landing Page** matching Image 1 (Light clean UI, Orange `#FF7A00` accents, Active Promotions, How It Works, About Us, Global Coverage).
2. **Authentication Pages**:
   - `/login`: Clean login form with demo credentials auto-fill.
   - `/registro`: Client signup form.
3. **Client Portal Dashboard (`/dashboard`)**:
   - Sidebar layout (Image 4): Logo, Navigation links, User profile footer (`Juan Pérez CAS-88293-MX`).
   - `/dashboard`: Overview (Image 2) - Real-time tracking card (`LT-449201-US`), Miami Warehouse card (`8400 NW 25th St`), Pickup CTA, Recent Packages table.
   - `/dashboard/paquetes`: Mis Paquetes (Image 3) - Filter tabs (Todos 12, En Tránsito 2, En Aduana 1, Entregados 9), Search, Action links.
   - `/dashboard/pickup`: Solicitar Pickup Wizard (Images 4 & 5) - Step 1 Address selection, Step 2 Package specs & Invoice upload, Steps 3-5 Recipient, Schedule, Payment.

## 2. Visual Palette & Styling Tokens
- **Background**: Clean Light Gray / White (`#F8FAFC`, `#FFFFFF`) for dashboard and landing, with slate card borders (`#E2E8F0` / `#F1F5F9`).
- **Primary Action**: Bright Beebox Orange (`#FF7A00`, `#F59E0B`) for buttons, active steppers, and active tabs.
- **Secondary Accent**: Dark Charcoal (`#1E293B`, `#0F172A`) for primary headings, dark CTA cards, and sidebar active indicators.
- **Status Colors**:
  - `En Aduana`: Soft Amber (`#FEF3C7` bg, `#D97706` text).
  - `En Tránsito`: Soft Blue/Orange (`#FFEDD5` bg, `#EA580C` text).
  - `Entregado`: Soft Emerald (`#D1FAE5` bg, `#059669` text).

## 3. Directory & Route Architecture
```text
src/
├── app/
│   ├── page.tsx                    # Landing Page (Image 1)
│   ├── login/
│   │   └── page.tsx                # Iniciar Sesión
│   ├── registro/
│   │   └── page.tsx                # Registro de Usuario
│   └── dashboard/
│       ├── layout.tsx              # Sidebar Dashboard Layout (Image 4)
│       ├── page.tsx                # Dashboard Overview (Image 2)
│       ├── paquetes/
│       │   └── page.tsx            # Mis Paquetes (Image 3)
│       ├── pickup/
│       │   └── page.tsx            # Solicitar Pickup Wizard (Image 4 & 5)
│       ├── retiros/
│       │   └── page.tsx            # Agendar Retiro
│       ├── calculadora/
│       │   └── page.tsx            # Calculadora de Envíos
│       └── perfil/
│           └── page.tsx            # Mi Perfil de Cliente
├── context/
│   └── AuthContext.tsx             # Global Session Context (Juan Pérez)
└── components/
    ├── client/
    │   ├── Sidebar.tsx             # Dashboard Sidebar menu
    │   ├── Header.tsx              # Dashboard Top header
    │   ├── WarehouseCard.tsx       # Miami Warehouse details card
    │   ├── PickupWizardStep1.tsx   # Pickup Step 1: Address selection
    │   └── PickupWizardStep2.tsx   # Pickup Step 2: Cargo & Invoice upload
    ├── home/
    │   ├── PromosSection.tsx       # Active Promotions cards
    │   ├── HowItWorks.tsx          # 4-step process
    │   ├── AboutUs.tsx             # Company story & stats
    │   └── GlobalCoverage.tsx      # World map coverage
    └── ui/
        ├── Button.tsx
        ├── Card.tsx
        └── Badge.tsx
```

## 4. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Dev server route verification: `/`, `/login`, `/registro`, `/dashboard`, `/dashboard/paquetes`, `/dashboard/pickup`.
