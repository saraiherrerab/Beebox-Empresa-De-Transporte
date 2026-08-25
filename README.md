# 🚚 Beebox - Empresa de Transporte & Logística (Frontend)

Repositorio frontend oficial para **Beebox Empresa de Transporte SpA**. Desarrollado con **Next.js 15+ (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS**.

---

## 🚀 Tecnologías Principales

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Engine**: [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 📋 Pre-requisitos

- **Node.js**: `v18.0.0` o superior (Recomendado v20+ / v22+)
- **npm**: `v9.0.0` o superior
- **BeeBox Backend**: Corriendo en `http://localhost:4000` (ver repositorio `BeeBox-Backend`)

---

## ⚡ Guía de Inicialización Rápida

### 1. Ubícate en el directorio del frontend

```bash
cd Beebox-Empresa-De-Transporte
```

### 2. Configura las variables de entorno (Opcional)

Si deseas personalizar la URL de la API, crea el archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Instalación de Dependencias

```bash
npm install
```

### 4. Ejecución en Modo Desarrollo

```bash
npm run dev
```

Abre **`http://localhost:3000`** en tu navegador.

---

## 🛠️ Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000`. |
| `npx tsc --noEmit` | Valida los tipos TypeScript en busca de errores. |
| `npm run build` | Genera la compilación de producción optimizada. |
| `npm start` | Inicia el servidor con la versión compilada. |

---

## 📦 Funcionalidades Principales

1. **Campanita de Notificaciones (🔔)**: En el header del portal de cliente con badge numérico no leído y menú desplegable pop-over.
2. **Página de Notificaciones (`/dashboard/notificaciones`)**: Vista completa con historial de avisos de origen, destino y estado de cuenta.
3. **Control de Clientes Inhabilitados**:
   - **Vista Admin (`/admin/clientes`)**: Modal para inhabilitar clientes introduciendo motivo interno.
   - **Vista Cliente (`/dashboard`)**: Banner superior de aviso (*"Tu cuenta se encuentra inhabilitada hasta nuevo aviso"*) y restricción para crear prealertas.
4. **Prealertas de Compras en Miami (`/dashboard/prealertas`)**: Registro de compras online y vinculación con guías de envío.
5. **Rastreo con 3 Estados Estandarizados**: Timeline interactivo (**En el origen** ➔ **En camino** ➔ **Llegó a su destino**).
