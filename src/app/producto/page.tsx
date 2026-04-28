import prisma from "@/lib/prisma";
import CatalogoClient from "./_components/CatalogoClient";
import FooterCatalogo from "./_components/FooterCatalogo";
import { buildCatalogFilters, mapCatalogProduct } from "./product-data";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const productosDB = await prisma.productos.findMany({
    where: {
      activo: true,
    },
    include: {
      categorias: {
        select: {
          nombre: true,
        },
      },
      proveedores: {
        select: {
          nombre_negocio: true,
          calificacion_prom: true,
        },
      },
      detalle_pedidos: {
        select: {
          calificacion: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const productos = productosDB.map(mapCatalogProduct);
  const filtros = buildCatalogFilters(productos);

  return (
    <>
      <CatalogoClient
        productos={productos}
        secciones={filtros.secciones}
        categorias={filtros.categorias}
        ocasiones={filtros.ocasiones}
        marcas={filtros.marcas}
        precioMaximoInicial={filtros.maxPrecio}
      />
      <FooterCatalogo />
    </>
  );
}
