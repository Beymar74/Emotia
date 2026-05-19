export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Package,
  Store,
  UserX,
} from "lucide-react";
import ProveedoresListClient from "./_components/ProveedoresListClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";

const POR_PAGINA = 30;

export default async function ProveedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const pagina = Math.max(
    1,
    parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1
  );

  const busqueda = typeof sp.q === "string" ? sp.q.trim() : "";
  const filtroEstado = typeof sp.estado === "string" ? sp.estado : "";
  const filtroCategoria = typeof sp.categoria === "string" ? sp.categoria : "";

  const where: any = {};

  if (filtroEstado) {
    where.estado = filtroEstado;
  }

  if (filtroCategoria) {
    where.categorias = {
      has: filtroCategoria,
    };
  }

  if (busqueda) {
    where.OR = [
      { nombre_negocio: { contains: busqueda, mode: "insensitive" } },
      { email: { contains: busqueda, mode: "insensitive" } },
      { telefono: { contains: busqueda, mode: "insensitive" } },
      { rep_nombre: { contains: busqueda, mode: "insensitive" } },
      { rep_email: { contains: busqueda, mode: "insensitive" } },
      { rep_telefono: { contains: busqueda, mode: "insensitive" } },
    ];
  }

  const [
    totalCount,
    proveedores,
    totalProveedores,
    proveedoresActivos,
    proveedoresPendientes,
    proveedoresSuspendidos,
    totalProductos,
    categoriasRaw,
  ] = await Promise.all([
    prisma.proveedores.count({ where }),

    prisma.proveedores.findMany({
    where,
    orderBy: {
        created_at: "desc",
    },
    skip: (pagina - 1) * POR_PAGINA,
    take: POR_PAGINA,
    select: {
        id: true,
        nombre_negocio: true,
        descripcion: true,
        logo_url: true,
        categorias: true,
        redes_sociales: true,
        email: true,
        telefono: true,
        direccion: true,
        rep_nombre: true,
        rep_telefono: true,
        rep_email: true,
        rep_anio_nacimiento: true,
        estado: true,
        calificacion_prom: true,
        total_vendido: true,
        created_at: true,
        updated_at: true,
        _count: {
        select: {
            productos: true,
            detalle_pedidos: true,
        },
        },
    },
    }),

    prisma.proveedores.count(),

    prisma.proveedores.count({
      where: {
        estado: "activo",
      },
    }),

    prisma.proveedores.count({
      where: {
        estado: "pendiente",
      },
    }),

    prisma.proveedores.count({
      where: {
        estado: "suspendido",
      },
    }),

    prisma.productos.count(),

    prisma.proveedores.findMany({
      select: {
        categorias: true,
      },
    }),
  ]);
  const proveedoresSerializados = proveedores.map((proveedor) => ({
    id: proveedor.id,
    nombre_negocio: proveedor.nombre_negocio,
    descripcion: proveedor.descripcion,
    logo_url: proveedor.logo_url,
    categorias: proveedor.categorias,
    redes_sociales: proveedor.redes_sociales,
    email: proveedor.email,
    telefono: proveedor.telefono,
    direccion: proveedor.direccion,
    rep_nombre: proveedor.rep_nombre,
    rep_telefono: proveedor.rep_telefono,
    rep_email: proveedor.rep_email,
    rep_anio_nacimiento: proveedor.rep_anio_nacimiento,
    estado: proveedor.estado,
    calificacion_prom: Number(proveedor.calificacion_prom || 0),
    total_vendido: Number(proveedor.total_vendido || 0),
    created_at: proveedor.created_at.toISOString(),
    updated_at: proveedor.updated_at.toISOString(),
    _count: proveedor._count,
    }));


  const categorias = Array.from(
    new Set(categoriasRaw.flatMap((proveedor) => proveedor.categorias || []))
  ).sort((a, b) => a.localeCompare(b));

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

  return (
    <div className="space-y-7 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-[#BC9968] font-bold mb-1">
            Business & Accesos
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
            Gestión de Proveedores
          </h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            Administra las empresas registradas en Emotia Business, revisa su
            estado, productos, actividad y datos del representante.
          </p>
          <p className="text-xs text-[#7A5260] mt-1">
            Control de proveedores, acceso al panel business y supervisión de catálogo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total proveedores",
            valor: totalProveedores,
            color: "#8E1B3A",
            icon: <Store size={14} />,
          },
          {
            label: "Activos",
            valor: proveedoresActivos,
            color: "#2D7A47",
            icon: <CheckCircle2 size={14} />,
          },
          {
            label: "Pendientes",
            valor: proveedoresPendientes,
            color: "#BC9968",
            icon: <Clock3 size={14} />,
          },
          {
            label: "Suspendidos",
            valor: proveedoresSuspendidos,
            color: "#AB3A50",
            icon: <UserX size={14} />,
          },
          {
            label: "Productos",
            valor: totalProductos,
            color: "#5C3A2E",
            icon: <Package size={14} />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-[#8E1B3A]/5 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              {s.icon}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-bold mb-1">
              {s.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18]">
                {s.valor}
              </span>
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <ProveedoresListClient
        proveedores={proveedoresSerializados}
        busquedaInicial={busqueda}
        filtroEstadoInicial={filtroEstado}
        filtroCategoriaInicial={filtroCategoria}
        categorias={categorias}
        />

      <Suspense>
        <Paginacion
          paginaActual={pagina}
          totalPaginas={totalPaginas}
          totalItems={totalCount}
          porPagina={POR_PAGINA}
        />
      </Suspense>
    </div>
  );
}