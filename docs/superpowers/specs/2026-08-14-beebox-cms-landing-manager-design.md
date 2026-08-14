# Design Specification: Landing Page CMS Manager Architecture (`/admin/cms`)

## 1. Overview & Objectives
This specification maps every section of the public Landing Page (`/`) into an interactive, 100% editable CMS Administration Panel (`/admin/cms`):
- **Hero Carousel**: Edit titles, yellow highlights, descriptions, CTA buttons & links for Slides 1, 2, 3.
- **Métricas e Indicadores**: Edit statistics (Aéreo, Marítimo, % Entregas, Clientes).
- **Promociones Activas**: Edit promo cards, discount percentages, and countdown timers.
- **¿Cómo Funciona?**: Edit 4-step titles, descriptions, and process guides.
- **Quiénes Somos**: Edit institutional story, Misión, and Visión.
- **Mapa de Cobertura**: Edit international warehouse hubs (Miami, Madrid, Shenzhen, Santiago).
- **Footer & Contacto**: Edit support phone, email, physical address, and legal links.

---

## 2. Component Architecture for `/admin/cms`

```text
src/app/admin/cms/
└── page.tsx                    # Multi-Tab Landing Page CMS Manager
```

### Tabs Structure in `/admin/cms`:
1. `🎯 HERO CAROUSEL`: Form for Slide 1, Slide 2, Slide 3.
2. `📊 MÉTRICAS`: Form for 4 key indicators.
3. `🏷️ PROMOCIONES`: Editor for active promotion cards.
4. `⚡ ¿CÓMO FUNCIONA?`: 4-step process editor.
5. `🏢 QUIÉNES SOMOS`: Misión & Visión text fields.
6. `🌐 COBERTURA`: Hubs & location pins editor.
7. `📞 FOOTER & CONTACTO`: Contact phones, emails, and address fields.

---

## 3. Verification Plan
- Type check: `npx tsc --noEmit`
- Build check: `npm run build`
- Test editing fields in `/admin/cms` and saving updates with instant toast notifications.
