import Link from "next/link";

import prisma from "@/lib/prisma";

import ActividadEmpresasClient from "./_components/ActividadEmpresasClient";
import SubNav from "../_components/SubNav";

export const dynamic = "force-dynamic";

export default async function ActividadEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const estadoFiltro =
    typeof sp.estado === "string" ? sp.estado : "";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    1
  );

  // =========================
  // FILTROS
  // =========================

  const where: {
    estado?: string | { in: string[] };
  } = {
    estado: {
      in: ["pendiente", "aprobado", "suspendido"],
    },
  };

  if (
    estadoFiltro === "pendiente" ||
    estadoFiltro === "aprobado" ||
    estadoFiltro === "suspendido"
  ) {
    where.estado = estadoFiltro;
  }

  // =========================
  // QUERIES
  // =========================

  const [
    provActivos,
    pedidosCurso,
    completadosHoy,
    canceladosMes,
    totalFinalizadosMes,

    empresasRaw,

    completadosPorProv,
    canceladosPorProv,
    productosActivosPorProv,
  ] = await Promise.all([
    prisma.proveedores.count({
      where: { estado: "aprobado" },
    }),

    prisma.pedidos.count({
      where: {
        estado: {
          notIn: ["entregado", "cancelado"],
        },
      },
    }),

    prisma.pedidos.count({
      where: {
        estado: "entregado",
        updated_at: { gte: hoy },
      },
    }),

    prisma.pedidos.count({
      where: {
        estado: "cancelado",
        updated_at: { gte: inicioMes },
      },
    }),

    prisma.pedidos.count({
      where: {
        estado: {
          in: ["entregado", "cancelado"],
        },
        updated_at: { gte: inicioMes },
      },
    }),

    prisma.proveedores.findMany({
      where,
      orderBy: {
        updated_at: "desc",
      },
    }),

    prisma.detalle_pedidos.groupBy({
      by: ["proveedor_id"],
      _count: { id: true },
      where: {
        pedidos: {
          estado: "entregado",
        },
      },
    }),

    prisma.detalle_pedidos.groupBy({
      by: ["proveedor_id"],
      _count: { id: true },
      where: {
        pedidos: {
          estado: "cancelado",
        },
      },
    }),

    prisma.productos.groupBy({
      by: ["proveedor_id"],
      _count: { id: true },
      where: {
        activo: true,
      },
    }),
  ]);

  // =========================
  // MAPS
  // =========================

  const completadosMap: Record<number, number> = {};
  const canceladosMap: Record<number, number> = {};
  const productosMap: Record<number, number> = {};

  for (const r of completadosPorProv) {
    completadosMap[r.proveedor_id] = r._count.id;
  }

  for (const r of canceladosPorProv) {
    canceladosMap[r.proveedor_id] = r._count.id;
  }

  for (const r of productosActivosPorProv) {
    productosMap[r.proveedor_id] = r._count.id;
  }

  // =========================
  // TASA DE ÉXITO
  // =========================

  const tasaExitoMes =
    totalFinalizadosMes > 0
      ? Math.round(
          ((totalFinalizadosMes - canceladosMes) /
            totalFinalizadosMes) *
            100
        )
      : 100;

  // =========================
  // EMPRESAS
  // =========================

  const empresas = empresasRaw.map((p) => ({
    id: p.id,
    nombre_negocio: p.nombre_negocio,
    logo_url: p.logo_url,

    email: p.email,
    telefono: p.telefono,

    categorias: p.categorias,

    estado: p.estado,

    calificacion_prom: p.calificacion_prom
      ? Number(p.calificacion_prom)
      : 0,

    total_vendido: p.total_vendido
      ? Number(p.total_vendido)
      : 0,

    updated_at: p.updated_at.toISOString(),
    created_at: p.created_at.toISOString(),

    pedidosCompletados:
      completadosMap[p.id] ?? 0,

    pedidosCancelados:
      canceladosMap[p.id] ?? 0,

    productosActivos:
      productosMap[p.id] ?? 0,
  }));

  // =========================
  // KPIs
  // =========================

  const kpis = [
    {
      label: "Empresas activas",
      valor: String(provActivos),
      sub: "empresas aprobadas",
      color: "#8E1B3A",
      bg: "#FDF5F7",
    },

    {
      label: "Pedidos en proceso",
      valor: String(pedidosCurso),
      sub: "sin completar ni cancelar",
      color: "#BC9968",
      bg: "#FDF8F1",
    },

    {
      label: "Entregados hoy",
      valor: String(completadosHoy),
      sub: "pedidos completados hoy",
      color: "#2D7A47",
      bg: "#F0FAF3",
    },

    {
      label: "Tasa de éxito del mes",
      valor: `${tasaExitoMes}%`,
      sub: `${canceladosMes} cancelado${
        canceladosMes !== 1 ? "s" : ""
      } este mes`,
      color:
        tasaExitoMes >= 80
          ? "#2D7A47"
          : tasaExitoMes >= 60
            ? "#BC9968"
            : "#A32D2D",

      bg:
        tasaExitoMes >= 80
          ? "#F0FAF3"
          : tasaExitoMes >= 60
            ? "#FDF8F1"
            : "#FBF0F0",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Empresas
          </p>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Supervisar actividad
          </h1>

          <p className="mt-1 text-sm text-[#7A5260]">
            Monitorea el desempeño y la actividad
            de cada empresa registrada.
          </p>
        </div>

        <Link
          href="/admin/usuarios?tab=representantes"
          className="bg-[#8E1B3A]/10 text-[#8E1B3A] border border-[#8E1B3A]/20 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8E1B3A] hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Gestionar representantes →
        </Link>
      </div>

      {/* ================= SUBNAV ================= */}

      <SubNav activa="actividad" />

      {/* ================= KPIs ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border p-4 sm:p-5 relative overflow-hidden"
            style={{
              background: s.bg,
              borderColor: `${s.color}25`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: s.color }}
            />

            <p
              className="font-serif text-2xl sm:text-3xl font-bold"
              style={{ color: s.color }}
            >
              {s.valor}
            </p>

            <p className="text-xs font-semibold text-[#2A0E18] mt-1">
              {s.label}
            </p>

            <p className="text-[10px] text-[#7A5260] mt-0.5">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ================= CLIENT ================= */}

      <ActividadEmpresasClient
        empresasReales={empresas}
        estadoFiltroInicial={estadoFiltro}
      />
    </div>
  );
}