import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import FooterCatalogo from "../../_components/FooterCatalogo";
import BrandProfileClient from "./BrandProfileClient";
import { mapCatalogProduct, type BrandProfileSummary } from "../../product-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const DEFAULT_BRAND_IMAGE = "/logo/logo-store.png";

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampRating(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(5, Number(value.toFixed(1))));
}

export default async function MarcaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const providerId = Number(resolvedParams.id);

  if (!Number.isInteger(providerId) || providerId <= 0) {
    notFound();
  }

  const provider = await prisma.proveedores.findFirst({
    where: {
      id: providerId,
    },
    include: {
      productos: {
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
            select: {
              calificacion: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!provider) {
    notFound();
  }

  const brand: BrandProfileSummary = {
    id: provider.id,
    name: provider.nombre_negocio,
    logoUrl: provider.logo_url || DEFAULT_BRAND_IMAGE,
    description: provider.descripcion?.trim() || "Marca disponible dentro de Emotia Store.",
    email: provider.email,
    phone: provider.telefono?.trim() || "No disponible",
    address: provider.direccion?.trim() || "No disponible",
    representativeName: provider.rep_nombre?.trim() || "Equipo de atencion",
    representativePhone: provider.rep_telefono?.trim() || "No disponible",
    representativeEmail: provider.rep_email?.trim() || provider.email,
    rating: clampRating(toNumber(provider.calificacion_prom ?? 0)),
    totalSold: Math.max(0, toNumber(provider.total_vendido ?? 0)),
  };

  const products = provider.productos.map(mapCatalogProduct);

  return (
    <>
      <BrandProfileClient brand={brand} products={products} />
      <FooterCatalogo />
    </>
  );
}
