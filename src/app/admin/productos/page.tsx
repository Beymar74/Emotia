import prisma from "@/lib/prisma";
import ProductosClient from "./_components/ProductosClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";
import EmpresaFilter from "../_components/EmpresaFilter";

export const dynamic = "force-dynamic";

const POR_PAGINA = 30;

type EstadoProd = "activo" | "desactivado" | "revision";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina        = Math.max(1, parseInt(typeof sp.pagina     === "string" ? sp.pagina     : "1") || 1);
  const busqueda      = typeof sp.q          === "string" ? sp.q.trim()       : "";
  const filtroCateg   = typeof sp.categoria  === "string" ? sp.categoria       : "";
  const filtroEstado  = typeof sp.estado     === "string" ? sp.estado          : "";
  const empresaId     = typeof sp.empresa    === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;

  const where: any = {};
  if (filtroEstado === "activo")      where.activo = true;
  if (filtroEstado === "desactivado") where.activo = false;
  if (filtroCateg) where.categorias = { nombre: filtroCateg };
  if (empresaId > 0) where.proveedor_id = empresaId;
  if (busqueda) {
    where.OR = [
      { nombre:       { contains: busqueda, mode: "insensitive" } },
      { proveedores:  { nombre_negocio: { contains: busqueda, mode: "insensitive" } } },
    ];
  }

  const [totalCount, productosDB, calificacionesDB, statsGlobal, categoriasDB, empresasLista] = await Promise.all([
    prisma.productos.count({ where }),
    prisma.productos.findMany({
      where,
      include: { proveedores: { select: { nombre_negocio: true } }, categorias: { select: { nombre: true } } },
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.detalle_pedidos.groupBy({
      by: ["producto_id"],
      where: { calificacion: { not: null } },
      _avg: { calificacion: true },
    }),
    // Stats globales sin filtro
    prisma.productos.groupBy({ by: ["activo"], _count: { id: true } }),
    prisma.categorias.findMany({ select: { nombre: true }, orderBy: { nombre: "asc" } }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } }),
  ]);

  const califMap: Record<number, number> = {};
  for (const c of calificacionesDB) {
    if (c._avg.calificacion !== null) califMap[c.producto_id] = c._avg.calificacion;
  }

  const totalProductos = statsGlobal.reduce((a, r) => a + r._count.id, 0);
  const activos        = statsGlobal.find((r) => r.activo === true)?._count.id ?? 0;
  const desactivados   = statsGlobal.find((r) => r.activo === false)?._count.id ?? 0;

  type ProductoData = {
    id: number; nombre: string; proveedor: string; categoria: string;
    precio: string; stock: number; calificacion: string; estado: EstadoProd; activo: boolean;
  };

  const productosMapeados: ProductoData[] = productosDB.map((p: any) => ({
    id:           p.id,
    nombre:       p.nombre,
    proveedor:    p.proveedores?.nombre_negocio || "Desconocido",
    categoria:    p.categorias?.nombre || "Sin categoría",
    precio:       `Bs ${Number(p.precio_venta).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
    stock:        p.stock,
    calificacion: califMap[p.id] !== undefined ? califMap[p.id].toFixed(1) : "—",
    estado:       p.activo ? "activo" : "desactivado",
    activo:       p.activo,
  }));

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));
  const categorias   = categoriasDB.map((c) => c.nombre);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Catálogo</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Todos los productos</h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            En esta sección puedes gestionar los productos disponibles, revisar su estado, actualizar precios, controlar stock y administrar la información visible para los clientes.
          </p>
        </div>
        <div className="flex gap-3">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
        </div>
      </div>

      <ProductosClient
        productos={productosMapeados}
        categorias={categorias}
        totalProductos={totalProductos}
        activos={activos}
        enRevision={0}
        desactivados={desactivados}
        busquedaInicial={busqueda}
        filtroCategoriaInicial={filtroCateg}
        filtroEstadoInicial={filtroEstado}
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
