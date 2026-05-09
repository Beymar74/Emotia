import prisma from "@/lib/prisma";
import Paginacion from "../_components/Paginacion";
import CalificacionesClient from "./_components/CalificacionesClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const POR_PAGINA = 20;

export default async function CalificacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina = Math.max(1, parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1);
  const busqueda = typeof sp.q === "string" ? sp.q.trim() : "";
  const filtroEstrellas = typeof sp.estrellas === "string" ? parseInt(sp.estrellas) : 0;
  const filtroEmpresa = typeof sp.empresa === "string" ? parseInt(sp.empresa) : 0;

  const where: any = {
    OR: [{ calificacion: { not: null } }, { resena: { not: null } }],
  };
  if (filtroEstrellas >= 1 && filtroEstrellas <= 5) where.calificacion = filtroEstrellas;
  if (filtroEmpresa > 0) where.proveedor_id = filtroEmpresa;
  if (busqueda) {
    where.AND = [
      {
        OR: [
          { productos: { nombre: { contains: busqueda, mode: "insensitive" } } },
          { pedidos: { usuarios: { nombre: { contains: busqueda, mode: "insensitive" } } } },
        ],
      },
    ];
  }

  const [totalCount, detalles, statsGlobal, empresas] = await Promise.all([
    prisma.detalle_pedidos.count({ where }),
    prisma.detalle_pedidos.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        productos:   { select: { nombre: true, imagen_url: true } },
        proveedores: { select: { nombre_negocio: true } },
        pedidos:     { select: { usuarios: { select: { nombre: true, apellido: true } }, created_at: true } },
      },
    }),
    // Estadísticas globales (sin filtros de página)
    prisma.detalle_pedidos.findMany({
      where: { 
        OR: [{ calificacion: { not: null } }, { resena: { not: null } }],
        ...(filtroEmpresa > 0 ? { proveedor_id: filtroEmpresa } : {})
      },
      select: { calificacion: true, resena: true },
    }),
    // Lista de empresas para el filtro
    prisma.proveedores.findMany({
      select: { id: true, nombre_negocio: true },
      orderBy: { nombre_negocio: "asc" }
    }),
  ]);

  const totalGlobal   = statsGlobal.length;
  const conResena     = statsGlobal.filter((d) => d.resena && d.resena.trim() !== "").length;
  const promedioGlobal = totalGlobal > 0
    ? statsGlobal.reduce((acc, d) => acc + (d.calificacion ?? 0), 0) / totalGlobal
    : 0;

  const distribucion = [5, 4, 3, 2, 1].map((estrellas) => ({
    estrellas,
    cantidad: statsGlobal.filter((d) => d.calificacion === estrellas).length,
  }));

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/La_Paz" }).format(fecha);

  const items = detalles.map((d) => {
    const cliente = d.pedidos.usuarios;
    return {
      id:          d.id,
      producto:    d.productos.nombre,
      proveedor:   d.proveedores.nombre_negocio,
      cliente:     `${cliente.nombre} ${cliente.apellido ?? ""}`.trim(),
      calificacion: d.calificacion,
      resena:      d.resena,
      fecha:       formatFecha(d.created_at),
    };
  });

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Calidad &amp; Feedback</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Calificaciones y reseñas</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Aquí puedes moderar las reseñas y calificaciones que los clientes dejan sobre los productos, asegurando la calidad y el cumplimiento de las normas de la comunidad.
        </p>
      </div>

      {/* Resumen Global */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stats globales */}
        <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total reseñas",    valor: totalGlobal,                          color: "#8E1B3A" },
            { label: "Promedio general", valor: promedioGlobal.toFixed(1) + " ★",    color: "#BC9968" },
            { label: "Con comentario",   valor: conResena,                             color: "#5A0F24" },
            { label: "Sin comentario",   valor: totalGlobal - conResena,              color: "#7A5260" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
              <p className="font-serif text-3xl font-bold text-[#5A0F24]">{s.valor}</p>
              <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Distribución */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 flex flex-col justify-center">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#7A5260] mb-3">Distribución de Estrellas</h2>
          <div className="space-y-2">
            {distribucion.map(({ estrellas, cantidad }) => {
              const pct = totalGlobal > 0 ? (cantidad / totalGlobal) * 100 : 0;
              return (
                <div key={estrellas} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#7A5260] w-6 text-right">{estrellas}★</span>
                  <div className="flex-1 bg-[#F1EFE8] rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-[#BC9968] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-[#7A5260] w-6">{cantidad}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabla con filtros (Ocupa todo el ancho ahora) */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 overflow-hidden">
        <Suspense>
          <CalificacionesClient
            items={items}
            busquedaInicial={busqueda}
            filtroEstrellasInicial={filtroEstrellas}
            filtroEmpresaInicial={filtroEmpresa}
            empresas={empresas}
            totalCount={totalCount}
          />
        </Suspense>
        <Suspense>
          <Paginacion
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            totalItems={totalCount}
            porPagina={POR_PAGINA}
          />
        </Suspense>
      </div>
    </div>
  );
}
