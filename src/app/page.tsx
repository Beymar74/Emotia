import prisma from "@/lib/prisma";
import { getFeaturedProducts } from "@/lib/services/productService";
import HomeClientWrapper from "./HomeClientWrapper";

export default async function HomePage() {
  // Obtenemos los productos reales y marcas de la base de datos
  const [products, providers] = await Promise.all([
    getFeaturedProducts(),
    prisma.proveedores.findMany({
      where: { estado: "aprobado" },
      select: { nombre_negocio: true },
      orderBy: { total_vendido: "desc" }
    })
  ]);

  const brandNames = providers.map((p) => p.nombre_negocio);

  return <HomeClientWrapper initialProducts={products} initialBrands={brandNames} />;
}