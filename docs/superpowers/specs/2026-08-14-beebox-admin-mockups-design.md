# Design Specification: Beebox Admin Panel Mockups & Yellow Palette Alignment

## 1. Overview & Objectives
This specification fuses the 5 admin mockups designed by the user with the functional requirements from `proyecto-revision`:
1. **Primary Yellow Palette**: Enforce bright Beebox Yellow (`#F59E0B` / `#FBBF24` / `#EAB308`) across all buttons, active sidebar items, badges, and tab underlines. 100% elimination of orange.
2. **Admin Sidebar Structure**: Dark navy sidebar (`#0F172A`) matching mockups with grouped navigation:
   - **PRINCIPAL**: Resumen General (`/admin`)
   - **OPERACIONES**: Recolecciones (Pickups) (`/admin/pickups`), Control de Envíos (`/admin/envios`), Citas de Retiro (`/admin/retiros`), Rutas de Entrega (`/admin/rutas`)
   - **GESTIÓN DE CLIENTES**: Base de Clientes CRM (`/admin/clientes`), Prealertas (`/admin/prealertas`)
   - **SITIO WEB**: Landing Page CMS (`/admin/cms`)
   - **CONFIGURACIÓN**: Configuración (`/admin/configuracion`)
   - Footer: `AD Admin Principal SUPERUSER` & Role switcher toggle to return to Client Portal.

---

## 2. Page & Component Specification

### 2.1. Gestión de Pickups (`/admin/pickups` - Mockup 1)
- Header: "Gestión de Pickups - Validación de pagos y logística", search bar, badge "5 PENDIENTES".
- Tabs: `POR VALIDAR PAGO`, `POR RECOLECTAR`, `EN RUTA`.
- Left list: Pickup cards (User info, CAS ID, Amount USD, Ref PICKUP-9901, Comprobante Subido).
- Right detail view: Receipt image preview, Requested schedule (`18 Oct 2026`), Recolect Address, Driver assignment dropdown (`Seleccionar Chofer...`), Buttons: `RECHAZAR PAGO` (pink/red) & `VALIDAR Y ASIGNAR` (emerald green).

### 2.2. Control de Envíos (`/admin/envios` - Mockup 2)
- Title: "Control de Envíos - Seguimiento global de paquetes".
- Tabs: `TODOS`, `RECIBIDOS`, `EN VUELO`, `ADUANA`, `DISPONIBLES`.
- Table columns: Número de Guía (vía Aéreo/Marítimo + peso), Cliente / Casillero, Ruta (MIA -> MEX), Estatus Actual (badges), Última Actividad, Acciones (Map, Edit, Delete).

### 2.3. Citas de Retiro (`/admin/retiros` - Mockup 3)
- Title: "Citas de Retiro - Gestión de entregas programadas en sucursal".
- Tabs: `HOY`, `MAÑANA`, `PRÓXIMAS`, `COMPLETADAS`.
- Table columns: Hora, Cliente / Casillero, Sucursal / Ventanilla, Paquetes Listos, Estado (Confirmada), Acciones (`ENTREGAR` green button).

### 2.4. Logística y Rutas (`/admin/rutas` - Mockup 4)
- Top Grid: Catálogo de Rutas Predeterminadas (Miami Express Aérea, Madrid Cargo Marítima, CDMX Local Terrestre + `+ AÑADIR AL CATÁLOGO`).
- Bottom Grid: Monitoreo de Rutas en Curso (Ruta Poniente, Ruta Centro with Chofer, progress bar %, `RASTREAR EN MAPA` dark button + `+ Asignar Nueva Ruta Activa`).

### 2.5. Base de Clientes CRM (`/admin/clientes` - Mockup 5)
- Top Metrics: `TOTAL DE CLIENTES` (12,481), `NUEVOS REGISTROS` (+456).
- Table: Lista Maestra with Cliente / Registro, Casillero ID, Contacto, Actividad (Paquetes activos), Estado (Verificado / Pendiente), Acciones.

---

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Verify pure yellow `#F59E0B` / `#FBBF24` palette on all screens.
