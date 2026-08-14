# Design Specification: Intuitive Hero Carousel Manager (`/admin/cms`)

## 1. Overview & Objectives
Make the **Hero Carousel CMS Manager** in `/admin/cms` intuitive, visual, and effective by mirroring how real web carousels function:
1. **Slide Selector Bar**: Interactive tabs for `Slide 1 (Miami Express)`, `Slide 2 (Marítimo Madrid)`, `Slide 3 (Tarifas PyME)` and `+ Añadir Diapositiva`.
2. **Live Interactive Slide Preview**: Real-time mock preview of how the selected slide will render on the landing page (desktop & mobile toggle).
3. **Slide State & Visibility Toggle**: Switch between `PUBLICADO (Activo)` and `BORRADOR (Oculto)`.
4. **Structured Image & Content Form Fields**:
   - Background gradient / Image URL for Desktop and Mobile.
   - Badge text & icon.
   - Title line 1 & Yellow highlighted text.
   - Subtitle / Description.
   - Primary & Secondary CTA Buttons (Text + Target Link URL).
5. **Reordering & Action Controls**: Move slide Left/Right, Duplicate slide, Delete slide.

---

## 2. Component Architecture

```text
src/app/admin/cms/
└── page.tsx                    # Enhanced Hero Carousel CMS Manager with Live Preview
```

---

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Verify switching between slide tabs and live preview updates in real time.
