# Admin Prealerta Editing & Status Filter Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable full editing of unconfirmed prealertas by Admins/SuperAdmins, lock editing on confirmed prealertas, fix the admin prealerta status filter tabs, and ensure confirmed prealertas automatically generate shipments with status `En el origen`.

**Architecture:** Backend validation in `prealerta.service.ts` blocks modification of confirmed prealertas while allowing edits to store, tracking, WR, description, value, destination, and status for unconfirmed prealertas. Frontend `AdminPrealertasPage` updates tab filters and introduces `EditPrealertaModal`.

**Tech Stack:** Express, TypeScript, Prisma (Backend) + Next.js, React, Tailwind CSS, Lucide-react (Frontend).

## Global Constraints

- Role permissions: `admin` and `super_admin` can edit prealertas.
- Immutable status constraint: `status === 'Confirmado'` or `'Vinculado'` prealertas CANNOT be edited.
- Automatic shipment status: Confirming a prealerta initializes its Shipment `currentStatus` to `'En el origen'`.

---

### Task 1: Backend Prealerta Service & Controller Update

**Files:**
- Modify: `BeeBox-Backend/src/services/prealerta.service.ts`
- Modify: `BeeBox-Backend/src/controllers/prealerta.controller.ts`

**Interfaces:**
- Consumes: Prisma Client, Express Auth middleware (`req.user`)
- Produces: `updatePrealerta` method enforcing immutable confirmed prealertas and updating `store`, `trackingNumber`, `providerWarehouseReceipt`, `description`, `amountPaid`, `destination`, `status`.

- [ ] **Step 1: Update `updatePrealerta` in `prealerta.service.ts` to block confirmed prealertas and allow status update**

```typescript
    if (existing.status === 'Confirmado' || existing.status === 'Vinculado') {
      throw new Error('No es posible editar una prealerta que ya ha sido confirmada.');
    }
```

- [ ] **Step 2: Update `linkPrealerta` in `prealerta.service.ts` to ensure initial shipment status is 'En el origen'**

```typescript
      shipment = await prisma.shipment.create({
        data: {
          trackingCode: warehouseGuide,
          providerWarehouseReceipt: finalProviderWR || null,
          userId: existing.userId,
          senderName: existing.store || 'Oklahoma Warehouse',
          senderCity: 'Broken Arrow, OK',
          recipientName: existing.user.name,
          recipientCity: targetDestination,
          recipientAddress: 'Dirección Registrada del Cliente',
          serviceType: 'Aéreo Exprés Internacional',
          weightKg: 1.0,
          dimensions: '25x20x15 cm',
          estimatedDelivery: '3-5 días hábiles',
          currentStatus: 'En el origen',
        },
      });
```

- [ ] **Step 3: Test backend prealerta editing with scratch test script**

Run node script verifying editing an unconfirmed prealerta succeeds, and editing a confirmed prealerta returns 400 error.

- [ ] **Step 4: Commit Backend changes**

```bash
git add BeeBox-Backend/src/services/prealerta.service.ts BeeBox-Backend/src/controllers/prealerta.controller.ts
git commit -m "feat(backend): add prealerta edit validation and ensure En el origen status on confirmation"
```

---

### Task 2: Frontend Status Filter Tabs & Admin Prealerta Edit Modal

**Files:**
- Modify: `Beebox-Empresa-De-Transporte/src/app/admin/prealertas/page.tsx`

**Interfaces:**
- Consumes: `useAuth` hook (`refreshPrealertas`, `updatePrealerta`), `API_URL`
- Produces: Enhanced `AdminPrealertasPage` with `POR CONFIRMAR` tab filter, and `EditPrealertaModal` component for unconfirmed prealertas.

- [ ] **Step 1: Fix status tabs and `matchesStatus` filter logic**

```tsx
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
            {["TODOS", "POR CONFIRMAR", "CONFIRMADO"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all flex-1 md:flex-none ${
                  statusFilter === status
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status === "TODOS" ? "TODAS" : status}
              </button>
            ))}
          </div>
```

- [ ] **Step 2: Add `editingItem` state and `EditPrealertaModal` to `AdminPrealertasPage`**

Add Edit button on unconfirmed rows, modal form for 6 fields (Store, Tracking, WR, Description, Value, Destination), handle submit with API call.

- [ ] **Step 3: Verify AdminPrealertasPage UI**

Verify editing prealertas updates table data in real-time, confirmed rows display locked badge, and status tabs filter cleanly.

- [ ] **Step 4: Commit Frontend changes**

```bash
git add Beebox-Empresa-De-Transporte/src/app/admin/prealertas/page.tsx
git commit -m "feat(frontend): add admin prealerta edit modal and fix status tab filter"
```
