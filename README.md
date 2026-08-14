# 🚚 Beebox - Empresa de Transporte & Logística

Repositorio frontend oficial para **Beebox Empresa de Transporte SpA**. Desarrollado con **Next.js 15+ (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS**.

---

## 🚀 Tecnologías Principales

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Engine**: [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Utilidades**: `clsx`, `tailwind-merge` (`cn` helper)

---

## 📁 Arquitectura del Proyecto

```text
Beebox-Empresa-De-Transporte/
├── docs/                             # Especificaciones de diseño y planes de arquitectura
├── public/                           # Recursos estáticos e imágenes
├── src/
│   ├── app/                          # Next.js App Router Pages & Layouts
│   │   ├── layout.tsx                # Root layout con metadata y fuentes
│   │   ├── page.tsx                  # Página principal de inicio
│   │   ├── globals.css               # Estilos globales y utilidades de Tailwind
│   │   ├── loading.tsx               # Skeleton loader global
│   │   ├── not-found.tsx             # Página 404 personalizada
│   │   └── rastreo/
│   │       └── page.tsx              # Dashboard interactivo de seguimiento de paquetes
│   ├── components/
│   │   ├── ui/                       # Componentes primitivos atómicos (Button, Card, Badge, Input)
│   │   ├── layout/                   # Navbar (con menú responsive) y Footer
│   │   ├── home/                     # Hero, TrackingWidget, ServiceCards, RateCalculator, FleetShowcase
│   │   └── tracking/                 # StatusTimeline, ParcelDetailsCard
│   ├── lib/
│   │   └── utils.ts                  # Helper cn() para fusión de clases Tailwind
│   ├── types/
│   │   └── index.ts                  # Interfaces TypeScript para Envíos, Eventos, Servicios y Flota
│   └── constants/
│       └── index.ts                  # Datos de prueba (Shipments demo BEE-98234-CL), Servicios y Flota
├── next.config.ts                    # Configuración de Next.js
├── tailwind.config.ts                # Paleta de colores de marca Beebox
├── tsconfig.json                     # Alias de importación @/*
└── package.json
```

---

## ⚡ Guía de Inicio Rápido

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Ejecución en Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

### 3. Verificación de Tipos & Compilación

```bash
# Verificación de tipos TypeScript
npx tsc --noEmit

# Compilación de producción
npm run build
```

---

## 📦 Características Destacadas

1. **Rastreo de Envíos en Tiempo Real**: Prueba con el código demo `BEE-98234-CL` para ver la línea de tiempo interactiva.
2. **Cotizador de Tarifas Instantáneo**: Estimación dinámica de costos y tiempos de entrega según origen, destino y peso.
3. **Catálogo Interactivo de Flota**: Visualizador por categorías (Vans Express, Camiones Medianos, Trailers, Refrigerados).
4. **Diseño Responsive & Estética Premium**: Paleta de colores corporativa (Navy `#0F172A`, Amber `#F59E0B`, Cyan `#06B6D4`) con soporte para glassmorphism.
