import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";
import { Trophy, Gem, ArrowDown, TrendingUp, Medal } from "lucide-react";

export default async function ReporteFidelizacionPage() {
  const [pedidosPuntos, insigniasRaw, recomendacionesStats, usuariosTop] = await Promise.all([
    prisma.pedidos.aggregate({
      _sum: { puntos_ganados: true, puntos_usados: true },
    }),
    prisma.insignias.findMany({
      include: { usuarios: { select: { nombre: true, apellido: true } } },
      orderBy: { otorgada_en: "desc" },
      take: 20,
    }),
    prisma.recomendaciones.aggregate({
      _count: { id: true },
      where: { convertida_en_compra: true },
    }),
    prisma.usuarios.findMany({
      select: { 
        id: true, nombre: true, apellido: true, puntos: true, 
        _count: { select: { insignias: true, pedidos: { where: { estado: "entregado" } } } } 
      },
      orderBy: { puntos: "desc" },
      take: 10,
    }),
  ]);

  const recomTotal = await prisma.recomendaciones.count();
  const recomConvertidas = recomendacionesStats._count.id;
  const tasaConvIA = recomTotal > 0 ? Math.round((recomConvertidas / recomTotal) * 100) : 0;

  const puntosGanados = Number(pedidosPuntos._sum.puntos_ganados ?? 0);
  const puntosUsados  = Number(pedidosPuntos._sum.puntos_usados ?? 0);
  const totalInsignias = await prisma.insignias.count();

  // Agrupar insignias por tipo
  const insigniasPorTipoRaw = await prisma.insignias.groupBy({
    by: ["tipo"],
    _count: { id: true },
  });

  const insigniasData = insigniasPorTipoRaw.map(i => ({
    tipo: i.tipo,
    count: i._count.id,
    pct: totalInsignias > 0 ? Math.round((i._count.id / totalInsignias) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  const fmt = (n: number) => n.toLocaleString("es-BO");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Fidelización</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Fidelización & Gamificación</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Sistema de puntos, insignias otorgadas y efectividad de la IA Emotia</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
          <p className="font-serif text-3xl font-bold text-[#5A0F24]">{fmt(puntosGanados)}</p>
          <p className="text-sm text-[#7A5260] mt-1">Puntos generados</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Histórico total</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
          <p className="font-serif text-3xl font-bold text-[#5A0F24]">{fmt(puntosUsados)}</p>
          <p className="text-sm text-[#7A5260] mt-1">Puntos canjeados</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">{Math.round((puntosUsados / Math.max(puntosGanados, 1)) * 100)}% de uso</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5C3A2E]" />
          <p className="font-serif text-3xl font-bold text-[#5A0F24]">{totalInsignias}</p>
          <p className="text-sm text-[#7A5260] mt-1">Insignias dadas</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Logros de usuarios</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#AB3A50]" />
          <p className="font-serif text-3xl font-bold text-[#5A0F24]">{tasaConvIA}%</p>
          <p className="text-sm text-[#7A5260] mt-1">Conversión IA</p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">{recomConvertidas} de {recomTotal} recom.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* IA Emotia Funnel */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 flex flex-col justify-center">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-6">Embudo de conversión — IA Emotia</h3>
          <div className="space-y-4">
            <div className="relative">
              <div className="h-12 bg-[#FAF3EC] rounded-lg flex items-center px-4 justify-between border border-[#BC9968]/20">
                <span className="text-sm font-medium text-[#7A5260]">Recomendaciones Generadas</span>
                <span className="font-bold text-[#5A0F24]">{recomTotal}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowDown className="text-[#BC9968] w-5 h-5" />
            </div>
            <div className="relative">
              <div 
                className="h-12 bg-[#8E1B3A]/5 rounded-lg flex items-center px-4 justify-between border border-[#8E1B3A]/20 mx-auto" 
                style={{ width: `${Math.max(tasaConvIA, 40)}%` }}
              >
                <span className="text-sm font-medium text-[#7A5260]">Compras Realizadas</span>
                <span className="font-bold text-[#8E1B3A]">{recomConvertidas}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-4xl font-serif font-bold text-[#8E1B3A]">{tasaConvIA}%</p>
            <p className="text-xs text-[#7A5260] uppercase tracking-widest mt-1">Tasa de Efectividad</p>
          </div>
        </div>

        {/* Distribución de Insignias */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-6">Insignias por categoría</h3>
          {insigniasData.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[#7A5260]">No hay insignias otorgadas aún.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {insigniasData.map((ins) => (
                <div key={ins.tipo}>
                  <div className="flex justify-between items-center mb-1.5 text-sm">
                    <span className="font-medium text-[#2A0E18] capitalize">{ins.tipo.replace(/_/g, " ")}</span>
                    <span className="text-[#7A5260]">{ins.count} usuarios</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#BC9968]" style={{ width: `${ins.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Usuarios Fidelizados */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex justify-between items-center">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Top 10 Usuarios más activos</h3>
          <span className="text-xs text-[#BC9968] font-medium uppercase tracking-wider">Ordenado por puntos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FAF3EC]/30">
                {["Pos", "Usuario", "Puntos", "Insignias", "Pedidos Entregados"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {usuariosTop.map((u, i) => (
                <tr key={u.id} className="hover:bg-[#FAF3EC]/20 transition-colors">
                  <td className="px-5 py-4 text-sm font-serif font-bold text-[#BC9968]">{i + 1}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#5A0F24]">{u.nombre} {u.apellido}</p>
                    <p className="text-[10px] text-[#B0B0B0]">ID: {u.id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#8E1B3A]">{fmt(u.puntos)}</td>
                  <td className="px-5 py-4 text-sm text-[#7A5260]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#BC9968]/10 text-[#BC9968] font-bold text-xs">
                      <Medal className="w-3.5 h-3.5" />
                    </span>
                    <span className="ml-1">{u._count.insignias}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#7A5260]">{u._count.pedidos} pedidos</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actividad Reciente (Insignias) */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Últimos logros otorgados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {insigniasRaw.length === 0 ? (
             <p className="text-sm text-[#7A5260] col-span-full text-center py-4">Sin actividad reciente.</p>
          ) : (
            insigniasRaw.map((ins) => (
              <div key={ins.id} className="p-3 rounded-lg border border-[#BC9968]/10 bg-[#FAF3EC]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-[#BC9968]" />
                  <p className="text-xs font-bold text-[#5A0F24] truncate">{ins.tipo.replace(/_/g, " ")}</p>
                </div>
                <p className="text-xs text-[#7A5260] truncate">{ins.usuarios.nombre} {ins.usuarios.apellido}</p>
                <p className="text-[10px] text-[#B0B0B0] mt-1">{new Date(ins.otorgada_en).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
