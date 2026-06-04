# Project Blueprint — Emotia Admin Panel

## Overview

Panel de administración total para la plataforma Emotia (e-commerce de regalos emocionales). 
Stack: Next.js 15 (App Router) + Prisma + PostgreSQL + TailwindCSS. Paleta: vinos (#5A0F24, #8E1B3A), dorado (#BC9968), crema (#FAF3EC).

---

## Modelos Prisma → Cobertura Admin

| Modelo          | Sección Admin              | Estado        |
|-----------------|----------------------------|---------------|
| audit_log       | /admin/auditoria           | ✅ Completo   |
| carrito         | /admin/carritos            | ✅ Completo   |
| categorias      | /admin/categorias          | ✅ CRUD       |
| detalle_pedidos | /admin/pedidos/[id]        | ✅ Completo   |
| direcciones     | /admin/pedidos/[id]        | ✅ Lectura    |
| notificaciones  | /admin/notificaciones      | ✅ CRUD       |
| pedidos         | /admin/pedidos + [id]      | ✅ Completo   |
| productos       | /admin/productos           | ✅ CRUD       |
| proveedores     | /admin/proveedores         | ✅ CRUD       |
| recomendaciones | (pendiente — asistente IA) | ⏳ Pendiente  |
| recordatorios   | /admin/recordatorios       | ✅ Supervisión|
| usuarios        | /admin/usuarios            | ✅ Completo   |
| insignias       | ELIMINADO (sin gamificación)|❌ Removido   |

---

## Sidebar — Secciones

- **Principal**: Dashboard
- **Usuarios & Accesos**: Gestión de usuarios
- **Proveedores**: Supervisar actividad, Rendimiento
- **Catálogo**: Todos los productos, Categorías
- **Pedidos & Pagos**: Todos los pedidos, Carritos activos, Métodos de pago
- **Comunicación**: Notificaciones, Recordatorios
- **Reportes & Sistema**: Reportes de ventas, Log de auditoría, Configuración

---

## Cambios Completados

### Admin panel inicial
- Dashboard con métricas principales
- CRUD Usuarios, Productos, Proveedores, Pedidos, Pagos, Reportes, Auditoría, Asistente, Configuración

### Optimización de rendimiento (conversación 5377de89)
- Cloudinary para assets
- Upstash Redis para caché
- Server Components con datos reales de PostgreSQL

### Completar cobertura admin (conversación actual 6d1594dc)
- ✅ Fix bug crítico en Auditoría (usaba campo `actor` inexistente → corregido a `actor_tipo` + `actor_id`)
- ✅ Auditoría ahora tiene filtros funcionales (AuditoriaClient con estado)
- ✅ `/admin/categorias` — CRUD completo con modal, toggle activo/inactivo
- ✅ `/admin/notificaciones` — enviar a usuarios, marcar leída, filtros
- ✅ `/admin/recordatorios` — supervisión con resaltado de urgentes (<7 días)
- ✅ `/admin/carritos` — KPIs de abandono de carrito, tabla detallada
- ✅ `/admin/pedidos/[id]` — página de detalle completa con cambio de estado
- ✅ `PedidosClient` mejorado: filtros por estado (clickable), link a detalle, badges correctos
- ✅ Sidebar actualizado con todas las secciones nuevas + icono IconBell
- ✅ Asistente IA eliminado del sidebar (pendiente de implementar)
- ✅ Sistema de gamificación (insignias) eliminado de la UI
- ✅ Navbar: Botón de perfil actualizado a Menú Dropdown con accesos rápidos (Pedidos, Configuración).

### Configuración de Cloudinary (Conversación anterior)
- ✅ Fix: Instalación de dependencia `cloudinary` en el contenedor de Docker para resolver error "Module not found: Can't resolve 'cloudinary'".
- ✅ Verificación de compilación exitosa y reinicio de servicios.

### Corrección de errores de compilación en Vercel (Conversación actual)
- ✅ Solucionado error "Export Facebook/Instagram doesn't exist in target module" en `Footer.tsx`.
- ✅ Se migraron los iconos de redes sociales de `lucide-react` a `react-icons/fa6` para evitar conflictos de exportación en Turbopack/Next.js 16.


---

## Cargar Base de Datos Prisma (Conversación Actual acec1d23)

### Objetivo
Sincronizar el esquema de Prisma con la base de datos PostgreSQL local corriendo en Docker y poblar la base de datos utilizando el script de seed (`prisma/seed.ts`).

### Plan y Pasos de Ejecución
1. **Verificar Conexión de Base de Datos**: Comprobar que el contenedor Docker `emotia_db` está arriba y respondiendo en el puerto 5432.
2. **Generar Cliente de Prisma**: Ejecutar `npx prisma generate` para compilar los tipos del cliente de Prisma en `src/generated/prisma`.
3. **Sincronizar Esquema (`db push`)**: Ejecutar `npx prisma db push` para mapear y crear todas las tablas definidas en `schema.prisma` dentro de PostgreSQL.
4. **Poblar la Base de Datos (`db seed`)**: Ejecutar `npx prisma db seed` para correr el script `prisma/seed.ts` que limpia e inserta datos iniciales premium de categorías, proveedores, usuarios, productos, pedidos, etc., y limpia la caché de Redis.
5. **Verificación**: Asegurar que las tablas tengan los datos cargados y listos para el panel de administración.

---

## Reestructuración de Identidad, Cuentas y Reportes PREPE (Conversación Actual)

### Objetivo
Transformar el panel administrador en una plataforma administrativa premium, moderna e intuitiva que refleje la identidad de **PREPE** (Plataforma de Regalos Personalizados y Experiencias) como núcleo del ecosistema, unificando el módulo de cuentas (Usuarios, Empresas y Proveedores), creando un Dashboard Global consolidado, reestructurando todos los reportes con gráficas Recharts nítidas (mounted state) y permitiendo filtros dinámicos y exportaciones personalizadas por empresa.

### Plan y Pasos de Ejecución
1. **Identidad Dinámica y PREPE Core**:
   - Refactorizar `Sidebar.tsx` para eliminar cualquier residuo de marcas anteriores y organizar el menú lateral en: Dashboard Global, Gestión de Cuentas, Productos, Pedidos, Ventas, Reportes y Configuración.
   - **Logotipo PREPE Extendido:** Presentar `public/logo/prepe.png` centrado y dominante en la cabecera del Sidebar sin ningún texto o letra a su lado.
   - Refactorizar `Topbar.tsx` para usar datos reales del administrador, saludo dinámico y rol como **"Administrador PREPE"** o **"Administrador General PREPE"** usando `@stackframe/stack`.
   - Incorporar **Breadcrumbs dinámicos** en la parte superior para enriquecer la UX.
2. **Hub de Cuentas Centralizado**:
   - Rediseñar `/admin/usuarios/page.tsx` para servir como el **Hub Centralizado de Cuentas** que permita administrar Usuarios, Empresas y Proveedores mediante pestañas dinámicas con estética premium (vino y dorado), filtros avanzados y métricas rápidas.
   - Redireccionar `/admin/proveedores/page.tsx` al Hub de Cuentas.
3. **Dashboard Global PREPE**:
   - Crear un componente `DashboardGlobal.tsx` que agrupe métricas y gráficos interactivos consolidados (crecimiento, ventas, ingresos por empresa, estados de pedidos y productos más vendidos).
   - Integrarlo en la raíz del panel administrador (`src/app/admin/page.tsx`).
4. **Centro de Reportes Interactivos y Nitidez**:
   - Implementar e integrar nuevos gráficos interactivos en Recharts para todos los reportes:
     - **Reporte de Usuarios:** crecimiento, segmentación de base, top compradores.
     - **Reporte de Empresas:** estados de empresas, ingresos.
     - **Reporte de Proveedores:** activos/suspendidos, ingresos generados.
     - **Reporte de Productos:** top vendidos, stock crítico.
     - **Reporte de Pedidos:** evolución temporal, estados.
     - **Reporte de Ventas:** ventas globales, ventas por empresa, top productos.
   - Añadir control de montaje en cliente (`mounted` state check) en **todos** los componentes gráficos Recharts (Ventas, Usuarios, Empresas, Productos, Pedidos, Clientes, Calidad, Global) para eliminar pixelación y mal escalado en SSR.
   - Hacer que los reportes cambien dinámicamente títulos y gráficos (ej. cambiar "Top Empresas" por "Top Productos de la Empresa") cuando se filtre por una empresa, heredando esto en la exportación PDF y Excel.
5. **Verificación**:
   - Ejecutar `npm run build` and `npm run lint` para validar la compilación y linter estático.

---

## Progreso Reciente & Próximos Pasos (Conversación Actual)

### Reportes Completados e Interactivos:
- ✅ **UsuariosCharts.tsx [NEW]**: Componente cliente que visualiza el registro de nuevos usuarios (AreaChart) y la segmentación (PieChart/Dona).
- ✅ **EmpresasCharts.tsx [NEW]**: Componente cliente que visualiza el estado de las empresas afiliadas (PieChart/Dona) y el top de ingresos (BarChart).
- ✅ **ProveedoresCharts.tsx [NEW]**: Componente cliente que visualiza el registro de nuevos proveedores (AreaChart), su rendimiento en ventas (BarChart) y la distribución por estados (PieChart/Dona).
- ✅ **Nítidez Recharts (SSR Client Check)**: Añadido chequeo de montaje en cliente (`mounted`) a todos los componentes Recharts del módulo de reportes (`VentasCharts`, `UsuariosCharts`, `EmpresasCharts`, `ProveedoresCharts`, `ProductosCharts`, `PedidosCharts`, `GlobalCharts`, `CalidadCharts`, `ClientesCharts`) para erradicar errores de renderizado en el servidor.
- ✅ **Filtro de Ventas Dinámico**: Modificado `src/app/admin/reportes/ventas/page.tsx` para computar dinámicamente métricas basadas en la empresa seleccionada (usando `subtotal` de `detalle_pedidos` y conteos de pedidos únicos), actualizando títulos y exportación PDF/Excel.

### Estado de Compilación:
- ✅ **TypeScript & Build Check**: Ejecutado exitosamente `npm run build` dentro del contenedor `emotia_app`.
- ✅ **Resolución de Errores de Tipo (TS)**: 
  - Corregido error de propiedad `primaryEmailAddress` a `primaryEmail` en `Sidebar.tsx` y `Topbar.tsx` (API oficial de Stackframe).
  - Corregido error de propiedad `nombre_contacto` a `rep_nombre` (nombre oficial en la base de datos) en `reportes/representantes/page.tsx`.
  - Corregido error de comparación de tabulación literal mediante conversión explícita (`(tab as string) === ...`) en `usuarios/page.tsx`.
  - Verificada la compilación exitosa global con Turbopack.

---

## Reporte del Centro de Cuentas (Conversación Actual)

### Objetivo
Diseñar e implementar un nuevo reporte consolidado para el **Centro de Cuentas** en `/admin/reportes/centro-cuentas` que centralice e integre los datos y el crecimiento de los Usuarios (Clientes), Empresas y Representantes en un panel analítico e interactivo premium.

### Plan y Pasos de Ejecución
1. **Configuración de Rutas y Menús**:
   - ✅ Registrar la nueva ruta `/admin/reportes/centro-cuentas` en la barra de sub-navegación `ReportSubNav.tsx`.
   - ✅ Modificar `/admin/reportes/page.tsx` para agregar la tarjeta interactiva de "Centro de Cuentas" con métricas acumuladas y un icono de grupo SVG.
2. **Creación del Componente de Gráficos**:
   - ✅ Crear `CentroCuentasCharts.tsx` utilizando Recharts. Los gráficos incluirán:
     - **Evolución del Registro** (registro acumulado por mes segregado por tipo de cuenta).
     - **Composición del Ecosistema** (proporción porcentual por tipo).
     - **Estados de Cuentas** (comparación de activos/aprobados frente a suspendidos/pendientes).
     - **Segmentación de Planes de Usuario** (Premium vs Básico).
     - **Top 5 Representantes por Ventas** (facturación acumulada).
   - ✅ Implementar el estado `mounted` en el cliente de forma asíncrona (`setTimeout`) para evitar errores de renderizado de SSR y lints.
3. **Página de Reporte Consolidado (`page.tsx`)**:
   - ✅ Crear la página principal `/admin/reportes/centro-cuentas/page.tsx`.
   - ✅ Realizar consultas asíncronas con Prisma para calcular KPIs en tiempo real (totales, activos, inactivos, aprobados, pendientes, ventas consolidadas, total puntos y calificación promedio).
   - ✅ Agregar una tabla con los registros más recientes del sistema para una vista inmediata.
   - ✅ Configurar `DescargarReporteBtn` con soporte para exportación PDF y Excel.
4. **Validación**:
   - ✅ Correr `npm run build` y `npm run lint` para certificar la estabilidad de la compilación (compilación exitosa en contenedor Docker, 0 errores de linter en nuevos archivos).

---

## Reestructuración de Proveedores a Representantes (Conversación Actual)

### Objetivo
Alinear el sistema de reportes con el esquema de Prisma y la lógica de negocio donde la tabla `proveedores` almacena los datos de los **Representantes** (personas, rep_nombre) de las **Empresas** (nombre_negocio). Renombrar las referencias visuales de "Proveedores" a "Representantes" y reestructurar el reporte correspondiente para mostrar al Representante y su respectiva Empresa de forma clara.

### Plan y Pasos de Ejecución
1. **Renombrar Rutas y Archivos**:
   - ✅ Renombrar la carpeta de reportes `/admin/reportes/proveedores` a `/admin/reportes/representantes`.
   - ✅ Renombrar `ProveedoresCharts.tsx` a `RepresentantesCharts.tsx` adaptando su código y tipos internos.
2. **Refactorizar el Reporte de Representantes (`page.tsx`)**:
   - ✅ Cambiar los títulos y etiquetas de "Proveedores" a "Representantes".
   - ✅ Cambiar la tabla detallada del reporte para mostrar dos columnas principales: **Representante** (nombre de contacto/representante `rep_nombre`) y **Empresa** (nombre del negocio `nombre_negocio`).
   - ✅ Actualizar la configuración de exportación (`DescargarReporteBtn`) con la nomenclatura y estructura de columnas correcta para el reporte de Representantes.
3. **Actualizar Navegación y Enlaces**:
   - ✅ Modificar `ReportSubNav.tsx` para cambiar el enlace `/admin/reportes/proveedores` a `/admin/reportes/representantes` con la etiqueta "Representantes".
   - ✅ Modificar `/admin/reportes/page.tsx` para renombrar la tarjeta de "Proveedores" a "Representantes", apuntando a la nueva ruta y actualizando descripciones y estadísticas.
   - ✅ Modificar `global/page.tsx` para corregir el enlace de sub-navegación.
4. **Segunda Fase: Reemplazo de etiquetas visuales de Proveedor a Representante en la UI Comercial (Productos, Pedidos y Hub de Cuentas)**:
   - ✅ Modificar etiquetas de "Proveedores" a "Representantes" en `/admin/usuarios/page.tsx` (Hub de cuentas).
   - ✅ Modificar `/admin/productos/[id]/page.tsx` (etiqueta "Proveedor" a "Representante").
   - ✅ Modificar `/admin/productos/_components/ProductosClient.tsx` (placeholder de búsqueda y columna de tabla).
   - ✅ Modificar `/admin/pedidos/page.tsx` (fallbacks de nombres y textos instructivos).
   - ✅ Modificar `/admin/pedidos/[id]/page.tsx` (cabecera "Proveedor" de tabla a "Representante").
   - ✅ Modificar `/admin/pedidos/_components/PedidosClient.tsx` (cabecera "Proveedor" de tabla a "Representante").
5. **Validación y Pruebas**:
   - ✅ Correr `npm run lint` y `npm run build` para asegurar que no queden referencias rotas y la aplicación compile limpiamente.

---

## Mostrar Todas las Cuentas e Integrar Tipo 'Empresa' en Reporte de Centro de Cuentas (Conversación Actual)

### Objetivo
Modificar la página del reporte de Centro de Cuentas `/admin/reportes/centro-cuentas` para que muestre todas las cuentas registradas en el sistema en lugar de solo las últimas 15 y que, a su vez, muestre las **Empresas** (Negocios) como una categoría de cuenta diferenciada de los **Representantes** en la tabla unificada, filtros y exportaciones.

### Plan y Pasos de Ejecución
1. **Modelado y Queries**:
   - Ajustar la consulta Prisma en `page.tsx` para incluir `rep_email` de la tabla `proveedores`.
2. **Unificación y Desdoblamiento**:
   - Mapear cada registro de `proveedores` a dos entidades separadas en `cuentasUnificadas`:
     * Tipo **Empresa**: usando `nombre_negocio` y `email`.
     * Tipo **Representante**: usando `rep_nombre` y `rep_email || email`.
3. **Componente de Tabla Interactivo (`CentroCuentasTabla.tsx`)**:
   - Extender el tipo `CuentaUnificada` y los filtros de tipo a `"Usuario" | "Representante" | "Empresa"`.
   - Cargar iconos correspondientes de Lucide (e.g. `User`, `UserCheck`, `Building2` o `Store`).
   - Aplicar badges estilizados con colores diferenciados (Premium vino para Usuarios, Azul corporativo para Empresas, Dorado/Marrón para Representantes).
4. **Configuración de Descargas**:
   - Modificar la estructura de exportación PDF/Excel en `page.tsx` para que refleje correctamente el desglose de los tres tipos.
5. **Validación**:
   - Compilar el proyecto con `npm run build` y correr `npm run lint` para certificar la estabilidad de la compilación.

---

## Reportes con Imágenes y Dashboard de Empresa Completo en Reporte Global (Conversación Actual)

### Objetivo
Hacer los reportes de administración de PREPE más amigables visualmente integrando las fotos de perfil/logotipos de empresas y usuarios en todas las tablas relevantes (Centro de Cuentas, Directorio de Empresas, Directorio de Representantes). Además, enriquecer el Reporte Global para que, al filtrar por una empresa específica, se renderice un panel con toda la información de la empresa (logo, datos de contacto, representante), sus KPIs locales, su catálogo completo de productos, su historial de ventas y sus calificaciones recibidas.

### Cambios Completados
1. **Centro de Cuentas (`centro-cuentas`)**:
   - ✅ Incluida `foto_perfil` (de `usuarios`) y `logo_url` (de `proveedores`) en las consultas asíncronas de Prisma.
   - ✅ Mapeados estos campos a un único campo de imagen `foto` en la entidad `cuentasUnificadas`.
   - ✅ Modificado `CentroCuentasTabla.tsx` para renderizar avatares con imágenes circulares elegantes de 32x32px e iniciales/iconos con fallback de gradiente CSS en caso de ausencia de imagen.
2. **Directorio de Empresas (`empresas`)**:
   - ✅ Modificada la tabla en `/admin/reportes/empresas/page.tsx` para utilizar `logo_url` del proveedor y renderizar la foto/logo de la empresa con fallback circular.
3. **Directorio de Representantes (`representantes`)**:
   - ✅ Modificado `/admin/reportes/representantes/page.tsx` para seleccionar `logo_url` de la base de datos.
   - ✅ Actualizado `RepresentantesTabla.tsx` para admitir `logo_url` y renderizar la imagen circular de la empresa en la lista.
4. **Dashboard de Empresa en Reporte Global (`global`)**:
   - ✅ Creado `GlobalEmpresaDetail.tsx` como un componente interactivo de cliente que provee un panel completo segregado por pestañas:
     - **Perfil de Empresa**: Información de contacto del negocio y de su representante legal, especialidades y redes sociales.
     - **Catálogo de Productos**: Listado con imágenes de productos, categorías, precios y estado, con buscador en tiempo real y paginación.
     - **Historial de Ventas**: Detalle de todos los artículos de la empresa que han sido vendidos, indicando cantidades, subtotales y estado.
     - **Opiniones y Calificaciones**: Comentarios reales de los clientes con estrellas interactivas de color dorado.
     - **KPIs Locales Consolidados**: Computa en tiempo real las ventas totales, pedidos completados, ticket promedio, calificación promedio y total de reseñas.
   - ✅ Modificado `src/app/admin/reportes/global/page.tsx` para que si se filtra por una empresa (`empresaId > 0`), realice la consulta completa de datos en Prisma y renderice el componente `<GlobalEmpresaDetail />`.
5. **Validación y Calidad**:
   - ✅ Ejecutado `npm run lint` sin errores de linter en los archivos modificados.
   - ✅ Ejecutado `npm run build` con compilación y pre-renderizado estático/dinámico exitosos de Next.js.

---

## Paginación Dinámica y Reportes Completos (Conversación Actual)

### Objetivo
Asegurar que todas las tablas y listados en los reportes (Ventas, Clientes, Productos, Representantes, Calidad) muestren la totalidad de los datos sin limitaciones arbitrarias. Se implementarán selectores interactivos de tamaño de página (`10, 20, 50, 100, -1`), donde la opción `-1` ("Todos") inhabilitará la paginación y mostrará todos los registros en pantalla.

### Plan y Pasos de Ejecución
1. **Reporte de Clientes**: Refactorizar `ClientesReporteTabla.tsx` para admitir tamaño de página dinámico y la opción "Todos".
2. **Reporte de Ventas**: Refactorizar `VentasTabla.tsx` aplicando el mismo patrón.
3. **Reporte de Productos**: Refactorizar `ProductosReporteTabla.tsx` para soporte de paginación completa.
4. **Reporte de Representantes**: Refactorizar `RepresentantesTabla.tsx` integrando el selector de tamaño.
5. **Reporte de Calidad**: Refactorizar `CalidadTablas.tsx` adaptando tanto la tabla de reseñas como la de calificaciones de productos.
6. **Validación**: Ejecutar pruebas de linter y compilación estática (`npm run lint` & `npm run build`).

---

## Descarga Dinámica de Reporte de Empresas (Conversación Anterior)

### Objetivo
Corregir el botón de descarga del Reporte Global del Sistema en `/admin/reportes/global` para que, al filtrar por una empresa, descargue el reporte de dicha empresa (con sus KPIs locales, su catálogo, su historial de ventas y sus calificaciones reales) en lugar de descargar el reporte global.

### Plan y Pasos de Ejecución
1. **Modelado e Integración de Relaciones**: Modificar la consulta Prisma de `pedidosData` en `page.tsx` para incluir la relación `categorias` del producto y permitir segmentación por categoría.
2. **Configuración de Descargas Condicional**:
   - Crear una lógica condicional para el objeto `config` de `DescargarReporteBtn`.
   - Si se filtra por empresa (`empresaId > 0`), poblar `config` con la información del negocio: KPIs locales, gráficos de evolución semanal de ingresos y distribución de categorías de la empresa, y tablas de catálogo, pedidos e historial de opiniones.
   - En caso contrario, proveer la configuración global de PREPE.
3. **Habilitación de Formatos**: Permitir tanto PDF como Excel en las descargas para ampliar las opciones analíticas.
4. **Validación**: Validar que la compilación y el linter no tengan advertencias ni errores.

---

## Reporte Global del Sistema Consolidado Completo (Conversación Actual)

### Objetivo
Hacer que el Reporte Global del Sistema (cuando no tiene filtros aplicados por empresa) sea un reporte que consolide y englobe de forma íntegra todos los reportes analíticos, operativos y comerciales del sistema (Ventas, Clientes, Pedidos, Carritos, Métodos de Pago, Productos, Categorías, Empresas, Representantes, Calidad, Fidelización, Recomendaciones IA, Personalización, Recordatorios, Notificaciones y Distribución Geográfica). Se rediseñará tanto la interfaz web (UI) utilizando secciones o pestañas organizadas por áreas, como la estructura de descarga (PDF y Excel) para proporcionar un verdadero documento maestro de auditoría del sistema.

### Plan y Pasos de Ejecución
1. **Modelado y Queries de Prisma**:
   - Ampliar la consulta unificada en `src/app/admin/reportes/global/page.tsx` para obtener métricas detalladas de recordatorios, recomendaciones IA, personalizaciones, notificaciones, carritos y la relación geográfica de direcciones.
2. **Reorganización de la Interfaz del Reporte Global**:
   - Rediseñar la página principal para mostrar una vista consolidada en pestañas:
     - **Comercial & Geográfico**: Ventas semanales, participación de empresas, métodos de pago y ventas por ciudad.
     - **Cuentas & Hub**: Tipos de cuentas, planes de clientes y catálogo por empresa.
     - **Catálogo & Calidad**: Inventario por categoría, top productos más vendidos y valoraciones por empresa.
     - **Fidelidad & Operaciones**: Conversión IA, puntos de usuarios, carritos abandonados, recordatorios y notificaciones.
3. **Estructura Dinámica de Descarga (PDF / Excel)**:
   - Configurar `DescargarReporteBtn` en la vista global sin filtros para incluir múltiples tablas que desglosen cada reporte del sistema.
4. **Validación**:
   - Correr pruebas de linter y compilación estática (`npm run lint` & `npm run build`).

---

## Integración del Ecosistema de Marcas en la Landing Page Principal (Conversación Actual)

### Objetivo
Añadir una sección informativa y visualmente impactante en la página de inicio principal (B2C) que presente y explique detalladamente la composición del ecosistema de marcas: **Emotia**, **Emotia Business** y **Emotia Store**, permitiendo a los visitantes entender la amplitud de la plataforma y navegar fácilmente hacia sus respectivas secciones.

### Plan y Pasos de Ejecución
1. **Crear el Componente `EcosystemSection.tsx`**:
   - Diseñar una sección premium con una grilla de dos tarjetas interactivas representando a **Emotia Business** (Portal para que proveedores y empresas se registren y ofrezcan sus productos) y **Emotia Store** (Tienda virtual y catálogo de cara al cliente final para ver y comprar regalos).
   - Integrar los logotipos correspondientes (`/logo/logo-business.png`, `/logo/logo-store.png`) con descripciones alineadas a estos roles y CTAs dirigidos a sus portales específicos (`/business` y `/producto`).
2. **Integrar en el Layout Principal (`HomeClientWrapper.tsx`)**:
   - Importar y renderizar el componente `EcosystemSection` justo debajo de `HeroSection`, introduciendo el ecosistema antes de mostrar los productos destacados.
3. **Validación y Linter**:
   - Asegurar compilación limpia y visualización responsiva a dos columnas.

---

## Reordenamiento y Ajustes del Ecosistema y Catálogo (Conversación Actual)

### Objetivo
Optimizar el flujo de la página de inicio reubicando la sección del Ecosistema de Marcas al final del recorrido (antes del footer), actualizar los logotipos a sus versiones expandidas y centradas, conectar el carrusel de productos ("Los más deseados") y el carrusel de marcas aliadas con datos reales de la base de datos (PostgreSQL), pausar el desplazamiento del carrusel de productos al colocar el cursor y permitir redirigir directamente al detalle del producto individual.

### Plan y Pasos de Ejecución
1. **Reordenar Layout (`HomeClientWrapper.tsx` y `page.tsx`)**:
   - Mover la sección `EcosystemSection` (y su contenedor `#unete`) al final de la página de inicio, justo arriba del `<Footer />`.
   - Modificar `src/app/page.tsx` para consultar los nombres de negocios aprobados (`proveedores` con `estado = "aprobado"`) y pasarlos a `HomeClientWrapper` como `initialBrands`.
2. **Actualizar Logotipos y Centrado (`EcosystemSection.tsx`)**:
   - Cambiar los logotipos a `/logo/logo-business-expandido.png` y `/logo/logo-store-expandido.png`.
   - Centrar los logos en cada tarjeta aplicando `justify-content: center` y un tamaño proporcional más grande.
3. **Conectar Datos Reales y Efecto Hover (`ProductsSection.tsx`)**:
   - Utilizar el arreglo de marcas aliadas (`initialBrands`) provenientes de la base de datos para el carrusel de marcas (aliados).
   - Añadir la regla CSS `.marquee-track:hover { animation-play-state: paused; }` para pausar el carrusel en hover.
   - Actualizar el enlace de clic de cada tarjeta de producto para que use `router.push("/producto/" + p.id)` en lugar de redirigir al catálogo genérico.
4. **Validación**:
   - Asegurar compilación correcta de TypeScript.

---

## Ajuste de Identidad y Eslogan en Hero (Conversación Actual)

### Objetivo
Destacar la identidad de marca de Emotia mediante su eslogan oficial **"Regala emociones, personaliza momentos"** e invitar a explorar el catálogo de forma directa y elegante.

### Cambios Completados
1. **Pill Badge**: Modificado a `"Emotia • Regalos Exclusivos"` con el icono de un regalo en vez de la IA.
2. **Encabezado y Mensaje Principal**: Reemplazado por el eslogan oficial de la marca: **"Regala emociones, personaliza momentos."**.
3. **Descripción**: Se enfatiza el valor de conectar con los mejores artesanos y marcas de Bolivia para diseñar regalos exclusivos.
4. **Llamadas a la Acción (CTAs)**: Removida la barra de búsqueda y las sugerencias. Implementados dos botones premium:
   - **Explorar Catálogo**: Enlace directo a `/producto`.
   - **Conocer ecosistema**: Desplazamiento suave a la sección del ecosistema (`#unete`).
5. **Limpieza Visual**: Removida la burbuja de chat / tarjeta de dedicatoria sobre la imagen para mantener la visualización limpia y despejada del hero.


---

## Carrusel de marcas continuo (Conversación Actual)

### Objetivo
Hacer que la marquesina o carrusel de la sección **"Trabajamos con las mejores marcas y artesanos"** se desplace de forma constante sin detenerse o pausarse cuando el usuario posiciona el cursor encima.

### Cambios Completados
1. **Clase CSS Específica**: Se creó la clase CSS `.marquee-track-partners` en [ProductsSection.tsx](file:///c:/Users/Beymar/Desktop/emotia/Emotia/src/app/home/ProductsSection.tsx) que hereda la animación lenta de 50 segundos del carrusel, pero excluye a esta clase de la regla `:hover { animation-play-state: paused; }`.
2. **Asociación en UI**: Se asignó la clase `.marquee-track-partners` al carrusel de logos/nombres de marcas aliadas, asegurando que las marcas se muevan de forma constante e ininterrumpida. El carrusel de productos ("Los más deseados") mantiene su comportamiento interactivo de pausa en hover para facilitar la selección.

---

## Pantalla de Recuperación y Restablecimiento de Contraseña (Conversación Actual)

### Objetivo
Crear una interfaz premium e intuitiva para la recuperación de contraseña de Emotia, tanto en formato de modal integrado como de páginas de redirección independientes, configurando las rutas personalizadas en `@stackframe/stack`.

### Plan y Pasos de Ejecución
1. **Modificación de Stack Config**:
   - Editar `src/lib/stack.ts` para registrar `forgotPassword: "/auth/recuperar"` y `passwordReset: "/auth/restablecer"`.
2. **Implementación de la Pantalla de Recuperación (`/auth/recuperar`)**:
   - Crear `src/app/auth/recuperar/page.tsx`.
   - Diseñar una maquetación B2C de doble columna (branding con eslogan + formulario limpio de recuperación).
   - Llamar a la API `stackApp.sendForgotPasswordEmail` para gestionar el envío.
3. **Implementación de la Pantalla de Restablecimiento (`/auth/restablecer`)**:
   - Crear `src/app/auth/restablecer/page.tsx`.
   - Envolver el componente `<PasswordReset />` de `@stackframe/stack` en un contenedor con la misma estética de la marca (vinos, dorados, crema).
4. **Integración en Modal de Autenticación**:
   - Modificar `src/app/home/AuthModal.tsx` para admitir una vista in-modal `"forgot"` o redirigir directamente al usuario a `/auth/recuperar`.
5. **Verificación**:
   - Ejecutar `npm run build` y `npm run lint` para garantizar la estabilidad del compilador y el linter.

