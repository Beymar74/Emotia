import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { mapDetailProduct, mapProductComments } from "../product-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetalleProducto({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const productoDB = await prisma.productos.findFirst({
    where: {
      id: productId,
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
          id: true,
          nombre_negocio: true,
          descripcion: true,
          logo_url: true,
          email: true,
          telefono: true,
          direccion: true,
          rep_nombre: true,
          rep_telefono: true,
          rep_email: true,
          calificacion_prom: true,
          total_vendido: true,
        },
      },
      detalle_pedidos: {
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          calificacion: true,
          resena: true,
          pedidos: {
            select: {
              usuarios: {
                select: {
                  nombre: true,
                  apellido: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!productoDB) {
    notFound();
  }

  const producto = mapDetailProduct(productoDB);
  const comentariosIniciales = mapProductComments(productoDB);

  return <ProductDetailClient producto={producto} comentariosIniciales={comentariosIniciales} />;
}
