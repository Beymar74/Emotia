# 📄 Página Nosotros — Emotia

Módulo de la ruta `/nosotros` construido con **Next.js 14 App Router**, **React** y **Tailwind CSS**.  
Hereda el `Navbar` y `Footer` globales de `src/app/home/`.

---

## 📁 Estructura de archivos

```
src/app/nosotros/
├── page.tsx                  → Ruta pública /nosotros (Server Component)
├── NosotrosClient.tsx        → Shell cliente: monta Navbar + secciones + Footer
├── hooks/
│   └── useReveal.ts          → Hook de animación scroll (Intersection Observer)
└── components/
    ├── Hero.tsx              → Sección hero pantalla completa
    ├── MisionVision.tsx      → Bloque misión / visión lado a lado
    ├── Valores.tsx           → Grid de 6 valores de la empresa
    ├── Equipo.tsx            → Tarjetas de los 4 integrantes
    └── Propuesta.tsx         → Propuesta de solución con 4 features
```

---

## 🔄 Flujo de renderizado

```
page.tsx  (Server Component)
    └── NosotrosClient.tsx  ("use client")
            ├── Navbar  ← importado de ../home/Navbar
            ├── <main>
            │     ├── Hero
            │     ├── MisionVision
            │     ├── Valores
            │     ├── Equipo
            │     └── Propuesta
            └── Footer  ← importado de ../home/Footer
```

`page.tsx` es Server Component para que Next.js pueda generar el `<head>` con el `metadata` (título y descripción SEO).  
Todo lo interactivo vive en `NosotrosClient.tsx` y sus hijos, todos marcados con `"use client"`.

---

## 🪝 Hook `useReveal`

Archivo: `hooks/useReveal.ts`

Detecta cuando un elemento entra al viewport y le agrega la clase `nos-visible`, disparando una animación CSS de entrada (fade + slide up).

**Uso:**
```tsx
const ref = useReveal();          // sin delay
const ref = useReveal(200);       // con 200ms de delay extra

<div ref={ref}>
  <div className="nos-reveal">Elemento 1</div>
  <div className="nos-reveal">Elemento 2</div>
</div>
```

**Cómo funciona internamente:**
1. Se adjunta al contenedor con `ref`.
2. Busca todos los hijos con clase `nos-reveal` dentro del contenedor.
3. Cuando el contenedor entra al viewport (`IntersectionObserver`), agrega `nos-visible` a cada hijo con un delay escalonado de 80ms entre ellos.
4. Se desconecta automáticamente después del primer disparo (la animación solo ocurre una vez).

**CSS requerido** (ya incluido en `Hero.tsx` vía `<style>`):
```css
.nos-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .8s cubic-bezier(.16,1,.3,1),
              transform .8s cubic-bezier(.16,1,.3,1);
}
.nos-reveal.nos-visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 🎨 Tipografía y colores

Hereda el sistema de diseño de Emotia, igual que el `Navbar` y `Footer`:

| Token       | Valor     | Uso                        |
|-------------|-----------|----------------------------|
| Bordeaux    | `#5A0F24` | Fondos oscuros, títulos    |
| Garnet      | `#9B2335` | Acentos, CTAs              |
| Gold        | `#BC9968` | Labels, detalles dorados   |
| Beige       | `#FAF5EE` | Fondos claros, texto claro |
| Chocolate   | `#5C3A1E` | Texto sobre fondo claro    |

**Fuentes** (Google Fonts, cargadas en `Hero.tsx`):
- `Playfair Display` — títulos (`font-weight: 700 / 900`)
- `DM Sans` — cuerpo, labels, botones (`font-weight: 300–700`)

---

## 🧩 Componentes

### `Hero`
- Layout 2 columnas: izquierda con gradiente bordeaux → carmesí, derecha beige.
- Título en **Playfair Display 900**, estadísticas animadas (IA / 360° / ∞).
- Tarjeta flotante con animación `floatCard` (CSS keyframes).
- Animación de entrada escalonada en `useEffect` (clase `nos-fade` → `nos-active`).
- En móvil se apila en 1 columna.

### `MisionVision`
- 2 bloques: fondo bordeaux (misión) + fondo blanco (visión).
- Letra gigante decorativa (`M` / `V`) en el fondo con opacidad muy baja.
- Usa `useReveal` para animar cada bloque al hacer scroll.
- En móvil se apila verticalmente.

### `Valores`
- Grid `auto-fit` de mínimo 280px por columna (1 col móvil → 2 tablet → 3 desktop).
- Cada `ValorCard` tiene una línea lateral de acento que aparece en hover.
- Animación de elevación (`translateY(-4px)`) y sombra en hover.
- Cada tarjeta tiene su propio `useReveal` para animar individualmente.

### `Equipo`
- 4 tarjetas sobre fondo bordeaux oscuro.
- Grid `auto-fit` de mínimo 200px (2 cols en móvil, 4 en desktop).
- Avatar con iniciales y gradiente garnet → carmesí.
- Nota de tutoría al pie con separador.

### `Propuesta`
- Layout 2 columnas: texto explicativo a la izquierda, lista de 4 features a la derecha.
- Cada feature tiene un ícono con gradiente, título en mayúsculas y descripción.
- Hover: `padding-left` animado para dar sensación de "deslizar".
- En móvil se apila en 1 columna.

---

## ⚙️ Requisitos

- Next.js 14+ con App Router
- React 18+
- Tailwind CSS (solo para algunas clases utilitarias menores)
- `tsconfig.json` con `"jsx": "preserve"` y `"jsxImportSource": "react"`



## 🐛 Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find name 'main'` | Falta `import React from "react"` | Agregar el import en el archivo afectado |
| `"use client"` no funciona | El directive no está en la primera línea | Moverlo antes de cualquier import o comentario |
| Animaciones no disparan | Clase `nos-reveal` sin el CSS base | Verificar que `Hero.tsx` se monta primero (carga el `<style>`) |
| Navbar no aparece | Path incorrecto en el import | Ajustar `../home/Navbar` según tu estructura real |