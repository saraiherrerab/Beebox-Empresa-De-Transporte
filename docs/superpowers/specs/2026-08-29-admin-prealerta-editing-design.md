# Especificación de Diseño: Edición de Prealertas y Corrección de Filtros por Administradores

**Fecha**: 2026-08-29  
**Estado**: Aprobado por el usuario  
**Módulos**: `BeeBox-Backend` (Servicio y Controlador de Prealertas), `Beebox-Empresa-De-Transporte` (`AdminPrealertasPage`)

---

## 1. Visión General

El objetivo de esta mejora es proporcionar a los **Administradores** y **SuperAdministradores** control operacional completo para auditar, corregir y completar los datos físicos de paquetes recepcionados en el almacén de EE.UU. antes de su despacho internacional.

Además, se corrige la lógica de filtrado de estados en la vista administrativa para permitir la navegación fluida entre prealertas **Pendientes por Confirmar (`Prealertado`, `Recibido en Almacén`)** y **Confirmadas**.

---

## 2. Reglas de Negocio y Restricciones de Estado

1. **Permisos de Edición**:
   - Reservado exclusivamente para usuarios con rol `admin` o `super_admin` (y clientes propietarios mientras el paquete esté en estado inicial `Prealertado`).
2. **Restricción de Estado Operacional**:
   - **Editables**: Prealertas en estado `Prealertado` o `Recibido en Almacén`.
   - **Bloqueadas**: Prealertas en estado `Confirmado` o `Vinculado`.
   - Una vez que la prealerta ha sido confirmada y convertida en una Guía de Almacén Internacional (`OK-xxxxx`), su edición queda **congelada y bloqueada** para preservar la integridad de las guías ya despachadas.

---

## 3. Especificación Técnica

### 3.1 Backend (`BeeBox-Backend`)

- **Método `updatePrealerta` (`src/services/prealerta.service.ts`)**:
  - Validar si la prealerta ya posee `status === 'Confirmado'` o `status === 'Vinculado'`. Si es así, lanzar un error HTTP 400 (`No es posible editar una prealerta que ya ha sido confirmada.`).
  - Permitir la modificación por administradores de los siguientes campos:
    - `store`: Tienda de origen
    - `trackingNumber`: Tracking del courier origen
    - `providerWarehouseReceipt`: Recibo de Almacén del Proveedor (WR)
    - `description`: Descripción del contenido
    - `amountPaid`: Valor Declarado ($USD)
    - `destination`: Ciudad/País de destino final
    - `status`: Estado operacional (`Prealertado` | `Recibido en Almacén`)
  - Emitir evento Socket.io `prealerta:updated` para actualización en tiempo real.

- **Ruta y Controlador (`src/controllers/prealerta.controller.ts`)**:
  - Asegurar que `updatePrealertaController` admita tanto a `admin` como a `super_admin`.

### 3.2 Frontend (`Beebox-Empresa-De-Transporte`)

- **Filtros de Estado Mejorados (`src/app/admin/prealertas/page.tsx`)**:
  - Actualizar los botones de pestaña de estado:
    - **TODAS**: Muestra la totalidad de paquetes.
    - **POR CONFIRMAR (PENDIENTES)**: Agrupa los paquetes en estado `Prealertado` y `Recibido en Almacén`.
    - **CONFIRMADOS**: Muestra los paquetes procesados con guía de almacén asignada.
  - Corregir el predicado `matchesStatus` para incluir correctamente todos los estados.

- **Modal de Edición Administrativa (`EditPrealertaModal`)**:
  - Agregar botón de edición (icono lápiz / edit) en las filas de la tabla cuya prealerta esté **Por Confirmar**.
  - Formulario pre-poblado con los 6 campos para corrección y guardado directo contra la API.
  - Para filas **Confirmadas**, mostrar la insignia de estado *"✓ Confirmado"* y deshabilitar/ocultar el botón de edición.

---

## 4. Plan de Verificación

1. **Prueba de Edición en Estado Por Confirmar**:
   - Editar una prealerta de estado `Prealertado`, modificar su WR, Tienda y Valor. Verificar que la API responda HTTP 200 y la tabla se actualice.
2. **Prueba de Bloqueo en Estado Confirmado**:
   - Intentar editar una prealerta con estado `Confirmado`. Verificar que el botón esté deshabilitado en UI y que la API rechace cualquier intento directo con un mensaje explicativo.
3. **Prueba de Pestañas y Filtros**:
   - Probar la alternancia entre las pestañas **TODAS**, **POR CONFIRMAR** y **CONFIRMADOS**, verificando la correcta clasificación de los paquetes.
