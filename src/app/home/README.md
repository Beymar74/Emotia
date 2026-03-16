# Emotia — Frontend Dashboard

> Sistema de Recomendación de Regalos Personalizados con IA  
> **Grupo:** Explosión Pressman · **Semestre:** 8vo · EMI Bolivia 2026

---

## Índice

1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Paleta de colores](#paleta-de-colores)
4. [Estructura de carpetas](#estructura-de-carpetas)
5. [Componente DashboardCliente](#componente-dashboardcliente)
6. [Sub-componentes](#sub-componentes)
7. [Constantes y datos mock](#constantes-y-datos-mock)
8. [Responsividad](#responsividad)
9. [Cómo integrarlo con lógica real](#cómo-integrarlo-con-lógica-real)
10. [Cómo correr el proyecto](#cómo-correr-el-proyecto)

---

## Descripción general

El archivo `DashboardCliente.jsx` es la pantalla principal del panel de usuario de **Emotia**. Muestra al cliente un resumen de sus pedidos, sus Emotia Points, el tracking del pedido activo y un recordatorio inteligente de próximas fechas especiales.

Está construido como un **componente React** para **Next.js App Router**, usando `"use client"` ya que maneja estado local (sidebar móvil, tab activo).

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 14+** (App Router) | Framework principal |
| **React 18** | Componentes y hooks |
| **styled-jsx** | Estilos CSS (incluido en Next.js, sin dependencias extra) |
| **Google Fonts** | `Playfair Display` (títulos) + `DM Sans` (cuerpo) |

> No requiere Tailwind, ni ninguna librería de UI externa.

---

## Paleta de colores

Definida como variables CSS en `:root` y también como objeto JS `COLORS` dentro del componente.

| Variable | Hex | Uso |
|---|---|---|
| `--garnet` | `#8E1B3A` | Color primario, botones, acentos |
| `--bordeaux` | `#5A0F24` | Títulos, gradientes oscuros |
| `--crimson` | `#AB3A50` | Hover states secundarios |
| `--choco` | `#5C3A2E` | Texto de cuerpo general |
| `--gold` | `#BC9968` | Dorado envejecido, bordes, badges |
| `--beige` | `#F5E6D0` | Fondos de iconos, fills suaves |
| `--gray` | `#B0B0B0` | Texto secundario, metadata |

**Degradado principal:** `linear-gradient(135deg, #8E1B3A, #5A0F24)`  
**Fondo general de la app:** `#FAF7F4` (beige ultra claro)

---

## Estructura de carpetas

La ubicación sugerida dentro del proyecto Next.js:

```
app/
├── dashboard/
│   └── page.jsx              ← DashboardCliente va aquí
├── layout.jsx
└── globals.css

components/
└── dashboard/
    └── DashboardCliente.jsx  ← O acá si lo querés reutilizable

constants/
└── home/
    └── constants.js          ← COLORS y StarIcon (ya existentes en el proyecto)
```

> **Nota:** El componente actualmente tiene `COLORS` definido internamente. Si ya tienen un archivo `constants/home/constants.js`, pueden importarlo desde ahí y eliminar la definición local.

---

## Componente DashboardCliente

**Archivo:** `DashboardCliente.jsx`  
**Directiva:** `"use client"` (requerido por Next.js App Router)

### Estado local

```js
const [activeTab, setActiveTab]     = useState("inicio");  // Tab activo en el nav
const [sidebarOpen, setSidebarOpen] = useState(false);     // Sidebar móvil abierto/cerrado
```

### Efectos (useEffect)

| Efecto | Qué hace |
|---|---|
| `resize` listener | Cierra el sidebar automáticamente al volver a escritorio (> 768px) |
| `overflow` en body | Bloquea el scroll del fondo cuando el sidebar móvil está abierto |
| `keydown` listener | Cierra el sidebar al presionar `Escape` |

### Función `navigate(tab)`

Centraliza la navegación: actualiza `activeTab`, cierra el sidebar en móvil y puede reemplazarse con `router.push()`.

```js
const navigate = useCallback((tab) => {
  setActiveTab(tab);
  setSidebarOpen(false);
}, []);
```

---

## Sub-componentes

Todos están definidos en el mismo archivo. Si el proyecto crece, se recomienda separarlos en `/components/dashboard/`.

### `StatCard({ stat })`
Tarjeta de métrica rápida. Recibe un objeto `stat` con: `id`, `num`, `label`, `color`, `stroke`, `icon`.

### `StatusBadge({ status, text })`
Badge de color para el estado de un pedido. Los valores válidos de `status` son:
- `"transit"` → azul (En tránsito)
- `"prep"` → dorado/granate (Preparando)
- `"done"` → gris (Entregado)

### `OrderRow({ order, onNavigate })`
Fila de pedido clickeable. Accesible con teclado (`role="button"`, `tabIndex`, `onKeyDown`). Llama a `onNavigate(order.tab)` al hacer click.

### `TrackStep({ step, isLast })`
Paso del tracking de envío. `isLast` controla si se dibuja el conector vertical hacia abajo. Los estados válidos son `"done"`, `"active"`, `"pending"`.

### `NavItem({ id, icon, label, badge, active, onClick })`
Ítem del menú lateral. La prop `badge` es opcional (muestra una pastilla roja, ej: `"Nuevo"`).

### Iconos SVG
Todos los íconos están como componentes funcionales (`IconGrid`, `IconChat`, `IconGift`, etc.) para evitar dependencias externas como `lucide-react`. Si el proyecto ya usa `lucide-react`, se pueden reemplazar directamente.

---

## Constantes y datos mock

### `COLORS`
Objeto JS con los mismos valores que las variables CSS. Se usa para estilos inline donde no llega el CSS.

### `STATS`
Array de 4 objetos para las tarjetas de métricas. Reemplazar con datos reales del backend.

### `ORDERS`
Array de 3 pedidos recientes. Reemplazar con una llamada a la API o SWR/React Query.

```js
// Ejemplo de fetch real:
const { data: orders } = useSWR('/api/orders/recent', fetcher);
```

### `TRACKING_STEPS`
Array de pasos del pedido activo. Reemplazar con datos del pedido seleccionado.

### `NAV_TABS`
Objeto que mapea el id del tab con su título legible para el topbar.

---

## Responsividad

El diseño tiene 3 breakpoints definidos con `@media` dentro del bloque `styled-jsx`:

| Breakpoint | Comportamiento |
|---|---|
| **Desktop** `> 1024px` | Sidebar fijo 252px, stats en 4 columnas, grid `1fr 340px` |
| **Tablet** `≤ 1024px` | Stats en 2 columnas, columna derecha pasa a grid 2×1 |
| **Mobile** `≤ 768px` | Sidebar oculto (slide-in con overlay), hamburger visible, barra de búsqueda oculta, todo en 1 columna |
| **Mobile S** `≤ 480px` | Padding y tipografía reducidos, pts-row hace wrap |

---

## Cómo integrarlo con lógica real

### 1. Logout
```jsx
// Reemplazar en handleLogout():
import { signOut } from "next-auth/react";
const handleLogout = () => signOut({ callbackUrl: "/login" });
```

### 2. Navegación entre páginas
```jsx
// Reemplazar navigate() para usar el router de Next.js:
import { useRouter } from "next/navigation";
const router = useRouter();
const navigate = useCallback((tab) => {
  router.push(`/dashboard/${tab}`);
  setSidebarOpen(false);
}, [router]);
```

### 3. Datos reales con SWR
```jsx
import useSWR from "swr";
const fetcher = (url) => fetch(url).then(r => r.json());

// Dentro del componente:
const { data: orders, isLoading } = useSWR("/api/orders/recent", fetcher);
const { data: stats }             = useSWR("/api/stats", fetcher);
```

### 4. Importar COLORS desde constants
```jsx
// Eliminar la definición local de COLORS y usar:
import { COLORS, StarIcon } from "@/constants/home/constants";
```

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Build para producción
npm run build
npm start
```

El dashboard estará disponible en:
```
http://localhost:3000/dashboard
```

---

## Integrantes

| Nombre | Porcentaje |
|---|---|
| Mamani Cruz Beymar Santiago | 100% |
| Burgoa Aliaga Evelyn Cristina | 100% |
| Gutierrez Huanca Einard Angel | 100% |
| Menacho Triguero Mauricio David | 100% |

---

*Emotia — PREPE · EMI Bolivia 2026*