# 🚚 Beebox - Empresa de Transporte & Logística (Frontend)

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

## 📋 Pre-requisitos

- **Node.js**: `v18.0.0` o superior (Recomendado v20+ / v22+)
- **npm**: `v9.0.0` o superior
- **BeeBox Backend**: Ejecutándose preferentemente en `http://localhost:4000` (ver repositorio `BeeBox-Backend`)

---

## ⚡ Guía de Inicialización Rápida

### 1. Clona o ubícate en el directorio del proyecto

```bash
cd Beebox-Empresa-De-Transporte
```

### 2. Configura las variables de entorno (Opcional)

Si deseas conectar con una URL de API personalizada, crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> *Por defecto, la aplicación utiliza `http://localhost:4000/api` si no se especifica esta variable.*

### 3. Instalación de Dependencias

```bash
npm install
```

### 4. Ejecución en Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **`http://localhost:3000`** en tu navegador.

### 5. Verificación de Tipos & Compilación de Producción

```bash
# Verificación de tipos TypeScript
npx tsc --noEmit

# Compilación de producción
npm run build

# Iniciar servidor de producción
npm start
```

---

## 🛠️ Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Next.js Turbo en `http://localhost:3000`. |
| `npm run build` | Genera la compilación optimizada para producción. |
| `npm start` | Inicia el servidor de producción con la compilación generada. |
| `npm run lint` | Ejecuta ESLint para analizar el código en busca de problemas. |
| `npx tsc --noEmit` | Valida los tipos TypeScript sin generar archivos. |

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
│   ├── context/
│   │   └── AuthContext.tsx           # Contexto de autenticación JWT conectado al backend
│   ├── lib/
│   │   └── utils.ts                  # Helper cn() para fusión de clases Tailwind
│   ├── types/
│   │   └── index.ts                  # Interfaces TypeScript para Envíos, Eventos, Servicios y Flota
│   └── constants/
│       └── index.ts                  # Datos de prueba (Shipments demo BEE-98234-CL / BBX-89421)
├── next.config.ts                    # Configuración de Next.js
├── tailwind.config.ts                # Paleta de colores de marca Beebox
├── tsconfig.json                     # Alias de importación @/*
└── package.json
```

---

## 📦 Características Destacadas

1. **Rastreo de Envíos en Tiempo Real**: Prueba con el código demo `BBX-89421` (o `BEE-98234-CL`) para ver la línea de tiempo interactiva cargada desde la API o fallback local.
2. **Cotizador de Tarifas Instantáneo**: Estimación dinámica de costos y tiempos de entrega conectada al endpoint `/api/quotes/calculate`.
3. **Catálogo Interactivo de Flota**: Visualizador por categorías (Vans Express, Camiones Medianos, Trailers, Refrigerados) conectado al endpoint `/api/fleet`.
4. **Diseño Responsive & Estética Premium**: Paleta de colores corporativa (Navy `#0F172A`, Amber `#F59E0B`, Cyan `#06B6D4`) con soporte para glassmorphism.

---

## 🔄 Integración Backend y Frontend

Para una experiencia completa e interactiva:
1. Inicia el servidor Backend en `BeeBox-Backend`: `npm run dev` (Port `4000`).
2. Inicia el servidor Frontend en `Beebox-Empresa-De-Transporte`: `npm run dev` (Port `3000`).
3. Accede a `http://localhost:3000`.
