# Design Specification: Demo Auth Page & PDF Requirements Audit

## 1. Overview & Objectives
This specification covers:
1. **Simplified Demo Login Page (`/login`)**: Replace conventional inputs with 2 instant access demo buttons:
   - **`INGRESAR COMO CLIENTE DE PRUEBA`** (`Juan Pérez`, `CAS-88293-MIAMI` &rarr; redirects to `/dashboard`).
   - **`INGRESAR COMO ADMINISTRADOR DE PRUEBA (CMS)`** (`Admin Principal SUPERUSER` &rarr; redirects to `/admin`).
2. **Simplified Demo Register Page (`/registro`)**: Instant registration card generating a new client suite code and redirecting to `/dashboard`.
3. **Header Navbar Integration (`src/components/layout/Navbar.tsx`)**:
   - Ensure logo height is prominent (`h-12`).
   - Add `Iniciar Sesión` and `Registrarse / Abrir Casillero` buttons in the top navbar header.
4. **Audit of PDF `proyecto-revision`**:
   - Confirm 100% elimination of orange (all yellow `#FFC107`).
   - Confirm table column "Estatus" (not "Estado") + "Pies Cúbicos".
   - Confirm no online payment gateways or fee fields in pickup flow.

---

## 2. Component Architecture & Changes

### 2.1. Login Page (`src/app/login/page.tsx`)
Replace standard form inputs with 2 prominent demo cards:
- Card A: **`ACCESO DEMO CLIENTE`**
  - Avatar: `JP` (Juan Pérez)
  - Details: `CAS-88293-MIAMI`
  - Button: `ENTRAR COMO CLIENTE →`
- Card B: **`ACCESO DEMO ADMINISTRADOR (CMS)`**
  - Avatar: `AD` (Admin Principal)
  - Details: `SUPERUSER CMS`
  - Button: `ENTRAR COMO ADMIN (CMS) →`

---

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Manual test: Click "Iniciar Sesión" in navbar, test both Demo Login buttons, and test Demo Register button.
