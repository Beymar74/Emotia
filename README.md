# Emotia - Plataforma de Obsequios y Experiencias 🎁

Emotia es una plataforma moderna de comercio electrónico diseñada para vender regalos, canastas artesanales, licores y experiencias únicas en Bolivia. Está construida para ser ultrarrápida y escalable utilizando un stack tecnológico moderno.

## 🚀 Stack Tecnológico

- **Frontend/Backend:** [Next.js](https://nextjs.org/) (App Router, Server Components).
- **Base de Datos:** PostgreSQL alojado en [Neon Database](https://neon.tech/).
- **ORM:** [Prisma](https://www.prisma.io/).
- **Caché (Alto Rendimiento):** [Upstash Redis](https://upstash.com/).
- **Almacenamiento de Imágenes:** [Cloudinary](https://cloudinary.com/).
- **Autenticación:** [Stack Auth](https://stack-auth.com/).
- **Entorno de Desarrollo:** Docker & Docker Compose.

---

## 🛠️ Cómo Iniciar el Proyecto Localmente

Este proyecto utiliza Docker para simplificar el entorno de desarrollo y evitar la instalación manual de dependencias en el sistema anfitrión.

### 1. Variables de Entorno (`.env`)
Antes de iniciar, debes crear un archivo `.env` en la raíz del proyecto. Aquí tienes una plantilla de lo que debe contener:

```env
# URL directa a la base de datos PostgreSQL (Neon o Local)
DATABASE_URL="postgresql://usuario:password@host:5432/emotia_db"

# Autenticación (Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID="..."
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."
STACK_SECRET_SERVER_KEY="..."
NEXT_PUBLIC_STACK_URL="https://api.stack-auth.com"

# Caché (Upstash Redis) - *Ver sección más abajo*
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Manejo de Imágenes (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 2. Levantar el Contenedor con Docker
Para arrancar tanto la base de datos como el servidor de Next.js de desarrollo:

```bash
docker compose up -d
```
Una vez que diga `Started`, tu aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

> **Nota importante sobre Docker y `.env`:** 
> Si en algún momento cambias los valores en tu archivo `.env`, Docker no los actualizará con un simple `restart`. Debes "recrear" el contenedor volviendo a ejecutar `docker compose up -d`.

---

## ⚡ Configuración de Caché con Upstash Redis

Para evitar que la base de datos colapse cuando hay mucho tráfico (por ejemplo, en la pantalla principal), Emotia utiliza **Upstash Redis** para cachear los productos y entregarlos en milisegundos.

### ¿Cómo obtener las credenciales de Upstash?

1. Crea una cuenta gratuita en [Upstash](https://console.upstash.com/).
2. Haz clic en **Create Database** (Tipo: Redis).
3. Selecciona una región cercana y ponle nombre (ej. `emotia-cache`). Habilita "Eviction" si deseas.
4. Una vez creada la base de datos, baja hasta la sección **REST API**.
5. Copia la **URL** y el **Token** y pégalos en tu archivo `.env`:

```env
UPSTASH_REDIS_REST_URL="https://stable-baboon-106631.upstash.io"
UPSTASH_REDIS_REST_TOKEN="tu_token_aqui"
```

### ¿Cómo funciona en el código?

La conexión principal ocurre en `src/lib/redis.ts`.
Cuando un usuario visita el inicio (`src/app/page.tsx`), el servidor hace lo siguiente (puedes ver la lógica en `src/lib/services/productService.ts`):

1. **Intenta leer de Upstash:** Busca la clave `home:featured_products`.
2. **Si existe (Caché Hit):** Devuelve los productos instantáneamente sin tocar PostgreSQL. Verás en consola: `⚡ Sirviendo productos desde Upstash Cache`.
3. **Si no existe (Caché Miss):** Hace una consulta lenta a Prisma (Neon), adapta los datos visualmente, guarda los resultados en Upstash con un tiempo de expiración (ej. 1 hora) y los muestra al usuario.

---

## 🗄️ Semillas de Base de Datos (Seeds)

Si la base de datos está en blanco y deseas llenarla con datos de prueba reales (Usuarios, Roles, Productos, Proveedores), puedes ejecutar el script de seed preconfigurado.

Accede a la terminal interactiva del contenedor y ejecuta:
```bash
docker exec -it emotia_app sh
npx ts-node prisma/seed.ts
```

---

## 🚀 Despliegue a Producción

Este proyecto está configurado para desplegarse automáticamente a **Vercel** en cada *commit* o *merge* hacia la rama `main`. 
Vercel se encargará de ejecutar:
```bash
npx prisma generate && next build
```
*(Asegúrate de tener todas tus variables de entorno configuradas en el Dashboard de Vercel bajo Settings > Environment Variables).*
