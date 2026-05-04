import prisma from '../prisma';

export async function getFeaturedProducts() {
  try {
    const dbProducts = await prisma.productos.findMany({
      take: 12,
      where: { activo: true },
      include: {
        categorias: true,
        proveedores: {
          select: { nombre_negocio: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return dbProducts.map((p: any) => ({
      id: p.id,
      imgSrc: p.imagen_url || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop&q=80",
      bg: "#FEF0F3",
      name: p.nombre,
      description: p.descripcion || "",
      price: `Bs.${p.precio_venta}`,
      old: p.precio_base ? `Bs.${p.precio_base}` : null,
      tag: "DESTACADO",
      tagColor: "#C6284F",
      brand: p.proveedores?.nombre_negocio || "Marca Local",
    }));
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    return [];
  }
}
