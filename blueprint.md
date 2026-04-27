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

### Configuración de Cloudinary (Conversación actual)
- ✅ Fix: Instalación de dependencia `cloudinary` en el contenedor de Docker para resolver error "Module not found: Can't resolve 'cloudinary'".
- ✅ Verificación de compilación exitosa y reinicio de servicios.

---

## Pendiente

- [ ] Conectar `/admin/asistente` con datos reales de `recomendaciones`
- [ ] Mejorar `/admin/pagos` para que los métodos no sean hardcodeados
- [ ] Mejorar detalles en `/admin/usuarios` (mostrar plan, puntos, cambiar tipo)
