### Task 1: Hide Pickups from Client Sidebar & Dashboard Page

**Files:**
- Modify: `src/components/client/Sidebar.tsx:25-33`
- Modify: `src/app/dashboard/page.tsx:270-293`

**Interfaces:**
- Consumes: Existing Client layout structure
- Produces: Client Sidebar without "Solicitar Pickup" item; Client Dashboard without Pickup banner card

- [ ] **Step 1: Update Client Sidebar navigation items**

Edit `src/components/client/Sidebar.tsx` to remove `{ name: "Solicitar Pickup", href: "/dashboard/pickup", icon: Calculator }` from `navItems`.

- [ ] **Step 2: Update Client Dashboard right column layout**

Edit `src/app/dashboard/page.tsx` to remove the Pickup banner card (`¿Necesitas recolección?`), leaving only `<WarehouseCard />` in the right column container.

- [ ] **Step 3: Commit changes**

```bash
git add src/components/client/Sidebar.tsx src/app/dashboard/page.tsx
git commit -m "feat(ui): hide pickup links from client sidebar and dashboard"
```
