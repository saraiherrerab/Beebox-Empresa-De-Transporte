# Design Specification: Mobile & Desktop Responsive Design Audit

## 1. Overview & Objectives
Ensure 100% responsive fluid layouts across all devices (Mobile `<768px`, Tablet `768px–1024px`, Desktop `>1024px`):
1. **Client Portal Mobile Navigation (`/dashboard`)**:
   - Add a mobile top bar header with logo and drawer toggle so client portal sidebar is accessible on mobile screens.
2. **Admin Portal Mobile Navigation (`/admin`)**:
   - Add a mobile top bar header with logo, `CMS ADMIN` badge, and drawer toggle for Admin portal pages.
3. **Landing Page Mobile Optimization (`/`)**:
   - Ensure Hero Carousel text sizes scale gracefully (`text-2xl sm:text-4xl lg:text-6xl`).
   - Ensure CTA buttons stack vertically on small mobile screens.
4. **Data Tables Mobile Scrolling**:
   - Ensure all data tables in `/dashboard/paquetes`, `/admin/envios`, `/admin/clientes`, `/admin/retiros`, `/admin/pickups` have horizontal scroll wrappers (`overflow-x-auto`) to prevent viewport breaking.

---

## 2. Component Modifications

### 2.1. Client Dashboard Layout (`src/app/dashboard/layout.tsx`)
Include a top mobile bar with logo, avatar, and toggle button for the Client Sidebar drawer on mobile devices.

### 2.2. Admin Layout (`src/app/admin/layout.tsx`)
Include a top mobile bar with logo, executive badge, and toggle button for the Admin Sidebar drawer on mobile devices.

---

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Verify responsive layout on both desktop and mobile viewports.
