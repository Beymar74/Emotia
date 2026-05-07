import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";
import { Star, CheckCircle2 } from "lucide-react";

export default async function ReporteCalidadPage() {
  const [detallesReseñas, proveedoresStats, productosTop] = await Promise.all([
    prisma.detalle_pedidos.findMany({
      where: { calificacion: { not: null } },
      include: {
        productos: { select: { nombre: true, imagen_url: true } },
        proveedores: { select: { nombre_negocio: true } },
        pedidos: { select: { created_at: true, usuarios: { select: { nombre: true, apellido: true } } } },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    }),
    prisma.proveedores.findMany({
      where: { estado: "aprobado", calificacion_prom: { gt: 0 } },
      select: { nombre_negocio: true, calificacion_prom: true, _count: { select: { detalle_pedidos: { where: { calificacion: { not: null } } } } } },
      orderBy: { calificacion_prom: "desc" },
      take: 10,
    }),
    prisma.productos.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        detalle_pedidos: {
          where: { calificacion: { not: null } },
          select: { calificacion: true },
        },
      },
    }),
  ]);

  // ─── Cálculos de Calidad ─────────────────────────────────────────────────────
  const totalReseñas = detallesReseñas.length;
  const calificaciones = detallesReseñas.map((d) => Number(d.calificacion));
  const califPromedio = calificaciones.length > 0 ? calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length : 0;

  // Distribución de estrellas
  const estrellasDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: calificaciones.filter((c) => c === star).length,
    pct: totalReseñas > 0 ? Math.round((calificaciones.filter((c) => c === star).length / totalReseñas) * 100) : 0,
  }));

  // Top productos por calificación (calculado manualmente para precisión)
  const productosCalificados = productosTop
    .map((p) => {
      const counts = p.detalle_pedidos.length;
      const avg = counts > 0 ? p.detalle_pedidos.reduce((a, b) => a + Number(b.calificacion), 0) / counts : 0;
      return { nombre: p.nombre, avg, counts };
    })
    .filter((p) => p.counts > 0)
    .sort((a, b) => b.avg - a.avg || b.counts - a.counts)
    .slice(0, 10);

  const fmt = (n: number) => n.toLocaleString("es-BO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Calidad</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Calidad & Satisfacción</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Análisis de calificaciones, reseñas y reputación de proveedores</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
          <p className="font-serif text-4xl font-bold text-[#5A0F24]">{fmt(califPromedio)} <span className="text-xl text-[#BC9968]">/ 5.0</span></p>
          <p className="text-sm text-[#7A5260] mt-1">Calificación promedio global</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(califPromedio) ? "text-[#BC9968] fill-[#BC9968]" : "text-gray-200"}`} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
          <p className="font-serif text-4xl font-bold text-[#5A0F24]">{totalReseñas}</p>
          <p className="text-sm text-[#7A5260] mt-1">Reseñas totales registradas</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Basado en pedidos entregados</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5C3A2E]" />
          <p className="font-serif text-4xl font-bold text-[#5A0F24]">{estrellasDist.find(e => e.star === 5)?.pct ?? 0}%</p>
          <p className="text-sm text-[#7A5260] mt-1">Nivel de excelencia (5★)</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Porcentaje de satisfacción total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribución de Estrellas */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Distribución de calificaciones</h3>
          <div className="space-y-4">
            {estrellasDist.map((e) => (
              <div key={e.star} className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#7A5260] w-6 flex items-center gap-0.5">{e.star}<Star className="w-3 h-3 fill-current" /></span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${e.pct}%`, 
                      background: e.star >= 4 ? "linear-gradient(90deg,#8E1B3A,#BC9968)" : e.star === 3 ? "#BC9968" : "#D1D5DB" 
                    }} 
                  />
                </div>
                <span className="text-xs font-bold text-[#5A0F24] w-10 text-right">{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Proveedores por Calificación */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top 10 Proveedores con mejor reputación</h3>
          <div className="space-y-3">
            {proveedoresStats.map((p, i) => (
              <div key={p.nombre_negocio} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF3EC]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#BC9968] w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7A5260]">{p._count.detalle_pedidos} reseñas</span>
                  <span className="text-sm font-bold text-[#8E1B3A] bg-[#8E1B3A]/5 px-2 py-0.5 rounded flex items-center gap-1">
                    {Number(p.calificacion_prom).toFixed(1)} <Star className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Productos Calificados */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Productos más destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productosCalificados.map((p, i) => (
            <div key={p.nombre} className="flex items-center gap-4 p-3 border border-[#8E1B3A]/5 rounded-xl">
              <span className="text-xl font-serif font-bold text-[#BC9968]/30">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#5A0F24] truncate">{p.nombre}</p>
                <p className="text-xs text-[#7A5260]">{p.counts} calificaciones recibidas</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#8E1B3A]">{p.avg.toFixed(1)}</p>
                <div className="flex gap-0.5 justify-end">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(p.avg) ? "text-[#BC9968] fill-[#BC9968]" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reseñas Recientes */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Últimas reseñas de clientes</h3>
        </div>
        <div className="divide-y divide-[#8E1B3A]/5">
          {detallesReseñas.map((r) => (
            <div key={r.id} className="p-5 hover:bg-[#FAF3EC]/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-[#5A0F24]">{r.productos.nombre}</p>
                  <p className="text-xs text-[#BC9968]">por {r.proveedores.nombre_negocio}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= Number(r.calificacion) ? "text-[#BC9968] fill-[#BC9968]" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#B0B0B0] mt-1">
                    {new Date(r.pedidos.created_at).toLocaleDateString("es-BO")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#7A5260] italic leading-relaxed">
                "{r.resena || "Sin comentario"}"
              </p>
              <p className="text-[10px] text-[#BC9968] mt-2 font-medium">
                — {r.pedidos.usuarios.nombre} {r.pedidos.usuarios.apellido}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
