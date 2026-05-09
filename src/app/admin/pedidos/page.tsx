import prisma from "@/lib/prisma";
import PedidosClient from "./_components/PedidosClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";
import EmpresaFilter from "../_components/EmpresaFilter";

export const dynamic = "force-dynamic";

const POR_PAGINA = 25;

type EstadoPedido = "pendiente" | "en_preparacion" | "en_camino" | "completado" | "cancelado";

function mapEstado(estadoBD: string): EstadoPedido {
  switch (estadoBD.toLowerCase()) {
    case "confirmado":
    case "en_preparacion": return "en_preparacion";
    case "enviado":        return "en_camino";
    case "entregado":      return "completado";
    case "cancelado":      return "cancelado";
    default:               return "pendiente";
  }
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina  = Math.max(1, parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1);
  const estadoFiltro = typeof sp.estado === "string" ? sp.estado : "todos";
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const busqueda = typeof sp.q === "string" ? sp.q.trim() : "";

  const whereEstado: any = estadoFiltro !== "todos" ? { estado: estadoFiltro } : {};
  const whereStats: any = {};

  if (empresaId > 0) {
    whereEstado.detalle_pedidos = { some: { proveedor_id: empresaId } };
    whereStats.detalle_pedidos = { some: { proveedor_id: empresaId } };
  }

  if (busqueda) {
    whereEstado.OR = [
      { usuarios: { nombre: { contains: busqueda, mode: 'insensitive' } } },
      { usuarios: { apellido: { contains: busqueda, mode: 'insensitive' } } },
      { detalle_pedidos: { some: { productos: { nombre: { contains: busqueda, mode: 'insensitive' } } } } }
    ];
    const bNum = parseInt(busqueda.replace('#', ''));
    if (!isNaN(bNum)) {
      whereEstado.OR.push({ id: bNum });
    }
  }

  const [totalCount, pedidosDB, statsRaw, empresasLista] = await Promise.all([
    prisma.pedidos.count({ where: whereEstado }),
    prisma.pedidos.findMany({
      where: whereEstado,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        usuarios: { select: { nombre: true, apellido: true } },
        detalle_pedidos: {
          include: {
            productos:   { select: { nombre: true } },
            proveedores: { select: { nombre_negocio: true } },
          },
        },
      },
    }),
    prisma.pedidos.groupBy({
      by: ["estado"],
      where: whereStats,
      _count: { id: true },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } }),
  ]);

  const countByEstado: Record<string, number> = {};
  for (const r of statsRaw) countByEstado[r.estado] = r._count.id;

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(fecha);

  const pedidosMapeados = pedidosDB.map((p: any) => {
    const detalles = p.detalle_pedidos || [];
    const prim = detalles[0];
    let producto  = prim?.productos?.nombre || "Producto desconocido";
    let proveedor = prim?.proveedores?.nombre_negocio || "Proveedor desconocido";
    if (detalles.length > 1) { producto += ` (+${detalles.length - 1} más)`; proveedor = "Varios proveedores"; }

    return {
      id:       `#${p.id.toString().padStart(4, "0")}`,
      idNum:    p.id,
      usuario:  `${p.usuarios?.nombre || ""} ${p.usuarios?.apellido || ""}`.trim(),
      proveedor,
      producto,
      monto:    `Bs ${Number(p.total).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      fecha:    formatFecha(p.created_at),
      estado:   mapEstado(p.estado),
    };
  });

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));
  const enCursoCount = (countByEstado["confirmado"] ?? 0) + (countByEstado["en_preparacion"] ?? 0) + (countByEstado["enviado"] ?? 0);

  const stats = {
    totalPedidos: Object.values(countByEstado).reduce((a, b) => a + b, 0),
    pendientes:   countByEstado["pendiente"]  ?? 0,
    enCurso:      enCursoCount,
    completados:  countByEstado["entregado"]  ?? 0,
    cancelados:   countByEstado["cancelado"]  ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Pedidos &amp; Pagos</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Todos los pedidos</h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            En esta sección puedes gestionar los pedidos de los clientes, revisar su estado actual, verificar los pagos y coordinar con los proveedores para asegurar entregas exitosas.
          </p>
        </div>
        <div className="flex gap-3">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
        </div>
      </div>

      <PedidosClient pedidos={pedidosMapeados} stats={stats} estadoFiltroActivo={estadoFiltro} busquedaInicial={busqueda} />

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
