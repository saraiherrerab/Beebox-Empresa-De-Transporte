# Design Specification: Beebox Frontend - Extended Client Views

## 1. Overview & Objectives
Implement the 5 newly provided mockups for **Beebox Empresa de Transporte SpA**:
1. **Solicitar Pickup - Step 3 (Destinatario)**: International recipient details (Nombre/Razón Social, Tax ID, Teléfono, Dirección completa).
2. **Solicitar Pickup - Step 4 (Horario)**: Pickup scheduling (Interactive calendar date picker + Time slots: Mañana 09-12h / Tarde 14-18h).
3. **Solicitar Pickup - Step 5 (Pago y Confirmación)**: Bank transfer details card, $50.00 USD total box, Payment receipt PDF/JPG upload dropzone, and "CONFIRMAR Y ENVIAR" green button.
4. **Agendar Retiro / Calendario de Retiros (`/dashboard/retiros`)**:
   - Orange top banner: Requisitos obligatorios (ID Oficial, Código CAS-88293-MX).
   - Month grid view (Octubre 2026) with status pills (Abierto, Pocos Cupos, Seleccionado).
   - Available time slots (09:00 AM Elegido, 10:30 AM Disponible, 11:00 AM Disponible, 01:30 PM Lleno).
   - Bottom summary card: Cita details, 3 Ítems Listos, "AGENDAR RETIRO AHORA" button, QR code notice.
5. **Calculadora de Envíos (`/dashboard/calculadora`)**:
   - Transport type selector: Aéreo (Active) / Marítimo.
   - Cargo inputs: Peso (LB/KG), Valor Declarado (USD), Dimensiones L/W/H.
   - Dark summary card: Flete base, Seguro, Impuestos, Manejo & Aduana, Total Estimado ($0.00 USD), "GUARDAR COTIZACIÓN" button.
   - "¿SABÍAS QUE?" consolidation discount callout box.

## 2. Route & Component Architecture
```text
src/
├── app/
│   └── dashboard/
│       ├── pickup/
│       │   └── page.tsx            # Updated 5-Step Pickup Wizard
│       ├── retiros/
│       │   └── page.tsx            # Updated Calendario de Retiros
│       └── calculadora/
│           └── page.tsx            # Updated Calculadora de Envíos
└── components/
    └── client/
        ├── PickupWizardStep3.tsx   # Step 3: Destinatario internacional
        ├── PickupWizardStep4.tsx   # Step 4: Schedule date & time slot
        ├── PickupWizardStep5.tsx   # Step 5: Transfer details & payment receipt upload
        ├── RetirosCalendar.tsx     # Month grid & time slot selection
        └── CalculatorForm.tsx      # Freight calculation form & dark breakdown summary
```

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Dev server route verification: `/dashboard/pickup`, `/dashboard/retiros`, `/dashboard/calculadora`.
