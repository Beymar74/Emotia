import prisma from '../prisma';
import { redis } from '../redis';

// Clave para la caché de productos destacados en el Home
const FEATURED_PRODUCTS_CACHE_KEY = 'home:featured_products';
// Tiempo de expiración en caché (segundos) - 10 minutos para evitar datos stale
const CACHE_TTL = 600;

export async function getFeaturedProducts() {
  try {
    // 1. Intentar obtener desde Upstash Redis
    const cachedProducts = await redis.get(FEATURED_PRODUCTS_CACHE_KEY);
    
    if (cachedProducts) {
      console.log('⚡ Sirviendo productos desde Upstash Cache');
      // Redis ya nos devuelve un objeto o arreglo parseado si es JSON válido
      return Array.isArray(cachedProducts) ? cachedProducts : JSON.parse(cachedProducts as string);
    }

    console.log('🐌 Consultando productos desde PostgreSQL (Neon)...');
    
    // 2. Si no hay caché, buscar en la base de datos
    // Tomaremos 12 productos destacados (con mayor stock o más recientes como ejemplo)
    const dbProducts = await prisma.productos.findMany({
      take: 12,
      include: {
        categorias: true, // Incluir la categoría si existe
        proveedores: {
          select: { nombre_negocio: true }
        }
      },
      orderBy: {
        created_at: 'desc', // Los más recientes primero
      }
    });

    // Adaptar los nombres de la base de datos a lo que espera el componente frontend visual
    const formattedProducts = dbProducts.map((p: any) => ({
      id: p.id,
      imgSrc: p.imagen_url || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop&q=80",
      bg: "#FEF0F3", // Color de fondo por defecto
      name: p.nombre,
      description: p.descripcion || "",
      price: `Bs.${p.precio_venta}`,
      old: p.precio_base ? `Bs.${p.precio_base}` : null,
      tag: "DESTACADO",
      tagColor: "#C6284F",
      brand: p.proveedores?.nombre_negocio || "Marca Local",
    }));

    // 3. Solo guardar en caché si hay productos con imágenes reales de Cloudinary
    const conImagenes = formattedProducts.filter((p: any) => p.imgSrc.includes('cloudinary.com'));
    console.log(`📸 ${conImagenes.length}/${formattedProducts.length} productos tienen imagen de Cloudinary`);

    if (formattedProducts.length > 0) {
      await redis.setex(FEATURED_PRODUCTS_CACHE_KEY, CACHE_TTL, JSON.stringify(formattedProducts));
    }

    return formattedProducts;
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    return []; // En caso de error (ej. Redis caído), devolver array vacío para no romper la app
  }
}

/**
 * Invalida el caché de productos destacados del Home.
 * Llamar esto cada vez que se actualice una imagen de producto.
 */
export async function invalidateFeaturedProductsCache() {
  try {
    await redis.del(FEATURED_PRODUCTS_CACHE_KEY);
    console.log('🗑️ Caché de productos del Home invalidada');
  } catch (error) {
    console.error('Error al invalidar caché:', error);
  }
}
