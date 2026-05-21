import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import SubNav from "../_components/SubNav";
import { Trophy, TrendingUp, Star, CheckCircle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RendimientoEmpresasPage() {
  const hoy = new Date();
  const seisAtras = new Date(hoy);
  seisAtras.setDate(hoy.getDate() - 6);
  seisAtras.setHours(0, 0, 0, 0);

  const [empresasDB, completadosPorProv, canceladosPorProv, recentDelivered] =
    await Promise.all([
      prisma.proveedores.findMany({
        where: { estado: "aprobado" },
        orderBy: { total_vendido: "desc" },
      }),
      prisma.detalle_pedidos.groupBy({
        by: ["proveedor_id"],
        _count: { id: true },
        where: { pedidos: { estado: "entregado" } },
      }),
      prisma.detalle_pedidos.groupBy({
        by: ["proveedor_id"],
        _count: { id: true },
        where: { pedidos: { estado: "cancelado" } },
      }),
      // Una sola query reemplaza el loop de N×7 queries anterior
      prisma.detalle_pedidos.findMany({
        where: { pedidos: { estado: "entregado", created_at: { gte: seisAtras } } },
        select: { proveedor_id: true, pedidos: { select: { created_at: true } } },
      }),
    ]);

  const completadosMap: Record<number, number> = {};
  const canceladosMap: Record<number, number> = {};
  for (const r of completadosPorProv) completadosMap[r.proveedor_id] = r._count.id;
  for (const r of canceladosPorProv) canceladosMap[r.proveedor_id] = r._count.id;

  // Construir sparklines en JS con los datos ya cargados
  const sparklineData: Record<number, number[]> = {};
  for (const emp of empresasDB) sparklineData[emp.id] = [0, 0, 0, 0, 0, 0, 0];
  for (const item of recentDelivered) {
    const daysAgo = Math.floor(
      (Date.now() - new Date(item.pedidos.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo >= 0 && daysAgo <= 6) {
      const idx = 6 - daysAgo;
      if (sparklineData[item.proveedor_id]) sparklineData[item.proveedor_id][idx]++;
    }
  }

  // KPIs globales
  const totalFacturado = empresasDB.reduce((s, e) => s + Number(e.total_vendido || 0), 0);
  const califValidas = empresasDB.filter((e) => Number(e.calificacion_prom) > 0);
  const promedioCalif =
    califValidas.length > 0
      ? califValidas.reduce((s, e) => s + Number(e.calificacion_prom), 0) / califValidas.length
      : 0;
  const totalComp = Object.values(completadosMap).reduce((a, b) => a + b, 0);
  const totalCanc = Object.values(canceladosMap).reduce((a, b) => a + b, 0);
  const totalFin = totalComp + totalCanc;
  const tasaGlobal = totalFin > 0 ? Math.round((totalComp / totalFin) * 100) : 100;

  const getInitials = (nombre: string) =>
    nombre ? nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "EM";

  const datos = empresasDB.map((p) => {
    const ventas = Number(p.total_vendido || 0);
    const calif = Number(p.calificacion_prom || 0);
    const completados = completadosMap[p.id] ?? 0;
    const cancelados = canceladosMap[p.id] ?? 0;
    const total = completados + cancelados;
    return {
      id: p.id,
      nombre: p.nombre_negocio,
      initials: getInitials(p.nombre_negocio),
      logoUrl: p.logo_url,
      ventas,
      calif,
      completados,
      cancelados,
      total,
      tasaExito: total > 0 ? Math.round((completados / total) * 100) : null,
      semana: sparklineData[p.id] ?? [0, 0, 0, 0, 0, 0, 0],
    };
  });

  const maxVentas = Math.max(...datos.map((d) => d.ventas), 1);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `Bs. ${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `Bs. ${(n / 1_000).toFixed(1)}k`
      : `Bs. ${n.toFixed(0)}`;

  const tasaColor = (t: number | null) =>
    t === null ? "#B0B0B0" : t >= 80 ? "#2D7A47" : t >= 60 ? "#BC9968" : "#A32D2D";

  const podio = datos.slice(0, 3);

  const podioStyle = [
    {
      border: "#F5C518",
      bg: "#FFFBEB",
      pillCls: "bg-[#F5C518]/20 text-[#92700A] border-[#F5C518]/40",
      barColor: "#F5C518",
      tag: "🥇 Líder",
    },
    {
      border: "#A8A9AD",
      bg: "#F8F8F8",
      pillCls: "bg-[#A8A9AD]/20 text-[#5A5A5A] border-[#A8A9AD]/40",
      barColor: "#A8A9AD",
      tag: "🥈 2° lugar",
    },
    {
      border: "#CD7F32",
      bg: "#FDF4EE",
      pillCls: "bg-[#CD7F32]/20 text-[#7A4010] border-[#CD7F32]/40",
      barColor: "#CD7F32",
      tag: "🥉 3° lugar",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Empresas</p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
          Rendimiento
        </h1>
        <p className="mt-1 text-sm text-[#7A5260]">
          Análisis financiero y operativo de todas las empresas proveedoras.
        </p>
      </div>

      <SubNav activa="rendimiento" />

      {datos.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-16 text-center">
          <p className="text-sm text-[#7A5260]">No hay empresas aprobadas aún.</p>
        </div>
      ) : (
        <>
          {/* ── KPIs globales ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: <TrendingUp size={16} />,
                label: "Facturación total",
                valor: fmt(totalFacturado),
                sub: "acumulado de todas las empresas",
                color: "#2D7A47",
                bg: "#F0FAF3",
              },
              {
                icon: <Star size={16} fill="currentColor" />,
                label: "Calificación promedio",
                valor: promedioCalif > 0 ? `${promedioCalif.toFixed(1)} / 5` : "Sin datos",
                sub: `${califValidas.length} empresas con reseñas`,
                color: "#BC9968",
                bg: "#FDF8F1",
              },
              {
                icon: <CheckCircle size={16} />,
                label: "Tasa de éxito global",
                valor: `${tasaGlobal}%`,
                sub: `${totalComp} de ${totalFin} ítems entregados`,
                color: tasaGlobal >= 80 ? "#2D7A47" : tasaGlobal >= 60 ? "#BC9968" : "#A32D2D",
                bg: tasaGlobal >= 80 ? "#F0FAF3" : tasaGlobal >= 60 ? "#FDF8F1" : "#FBF0F0",
              },
              {
                icon: <Trophy size={16} />,
                label: "Empresa líder",
                valor: datos[0]?.nombre ?? "—",
                sub: fmt(datos[0]?.ventas ?? 0),
                color: "#8E1B3A",
                bg: "#FDF5F7",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl border p-4 sm:p-5 relative overflow-hidden"
                style={{ background: k.bg, borderColor: `${k.color}25` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: k.color }}
                />
                <div className="flex items-center gap-1.5 mb-2" style={{ color: k.color }}>
                  {k.icon}
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A5260]">
                    {k.label}
                  </span>
                </div>
                <p
                  className="font-serif text-lg sm:text-xl font-bold leading-tight"
                  style={{ color: k.color }}
                >
                  {k.valor}
                </p>
                <p className="text-[9px] text-[#7A5260] mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Podio top 3 ── */}
          {podio.length > 0 && (
            <div>
              <h2 className="font-serif text-lg font-bold text-[#5A0F24] mb-3">
                Top empresas por facturación
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {podio.map((r, i) => {
                  const ps = podioStyle[i];
                  const max = Math.max(...r.semana, 1);
                  const tc = tasaColor(r.tasaExito);
                  return (
                    <div
                      key={r.id}
                      className={`rounded-2xl border-2 p-5 space-y-4 ${i === 0 ? "shadow-lg" : "shadow-sm"}`}
                      style={{ background: ps.bg, borderColor: ps.border }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ps.pillCls}`}
                        >
                          {ps.tag}
                        </span>
                        <Link
                          href={`/admin/empresas/actividad/${r.id}`}
                          className="flex items-center gap-1 text-[10px] text-[#7A5260] hover:text-[#8E1B3A]"
                        >
                          Ver perfil <ArrowRight size={10} />
                        </Link>
                      </div>

                      <div className="flex items-center gap-3">
                        {r.logoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 border border-black/10">
                            <Image
                              src={r.logoUrl}
                              alt={r.nombre}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                            {r.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#2A0E18] text-sm leading-tight">
                            {r.nombre}
                          </p>
                          <p className="font-serif text-xl font-bold text-[#5A0F24] mt-0.5">
                            {fmt(r.ventas)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/70 rounded-lg p-2.5 text-center border border-black/5">
                          <p className="text-xs font-bold text-[#2A0E18]">
                            {r.calif > 0 ? `★ ${r.calif.toFixed(1)}` : "—"}
                          </p>
                          <p className="text-[9px] text-[#7A5260]">Calificación</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2.5 text-center border border-black/5">
                          <p className="text-xs font-bold" style={{ color: tc }}>
                            {r.tasaExito !== null ? `${r.tasaExito}%` : "—"}
                          </p>
                          <p className="text-[9px] text-[#7A5260]">Tasa éxito</p>
                        </div>
                      </div>

                      {/* Sparkline */}
                      <div>
                        <p className="text-[9px] text-[#7A5260] mb-1.5">
                          Ítems entregados — últimos 7 días
                        </p>
                        <div className="flex items-end gap-0.5 h-8">
                          {r.semana.map((val, idx) => (
                            <div
                              key={idx}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${Math.max((val / max) * 100, 8)}%`,
                                background: ps.barColor,
                                opacity: 0.7 + (idx / r.semana.length) * 0.3,
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                            <span key={d} className="flex-1 text-center text-[8px] text-[#B0B0B0]">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Ranking completo ── */}
          <div className="bg-white rounded-xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#8E1B3A]/8 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#5A0F24]">Ranking completo</h2>
              <span className="text-xs text-[#7A5260]">
                {datos.length} empresa{datos.length !== 1 ? "s" : ""} · ordenado por facturación
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[660px]">
                <thead>
                  <tr className="bg-[#FDFBF9]">
                    {["#", "Empresa", "Facturado", "Tasa de éxito", "Calificación", "Entregados / Cancelados", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[9px] tracking-widest uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/8"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E1B3A]/5">
                  {datos.map((r, i) => {
                    const tc = tasaColor(r.tasaExito);
                    const ventasPct = (r.ventas / maxVentas) * 100;
                    return (
                      <tr key={r.id} className="hover:bg-[#FAF3EC]/40 transition-colors">
                        {/* Ranking */}
                        <td className="px-4 py-3 w-12">
                          <span
                            className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                              i === 0
                                ? "bg-[#F5C518]/20 text-[#92700A]"
                                : i === 1
                                ? "bg-[#A8A9AD]/20 text-[#5A5A5A]"
                                : i === 2
                                ? "bg-[#CD7F32]/20 text-[#7A4010]"
                                : "bg-[#8E1B3A]/8 text-[#8E1B3A]"
                            }`}
                          >
                            {i + 1}
                          </span>
                        </td>

                        {/* Empresa */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {r.logoUrl ? (
                              <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0">
                                <Image
                                  src={r.logoUrl}
                                  alt={r.nombre}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {r.initials}
                              </div>
                            )}
                            <span className="text-sm font-medium text-[#2A0E18]">{r.nombre}</span>
                          </div>
                        </td>

                        {/* Facturado con barra relativa */}
                        <td className="px-4 py-3 min-w-[130px]">
                          <p className="text-sm font-bold text-[#5A0F24] mb-1">{fmt(r.ventas)}</p>
                          <div className="h-1 rounded-full bg-[#F0EAE8] overflow-hidden w-24">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${ventasPct}%`,
                                background: "linear-gradient(90deg,#8E1B3A,#BC9968)",
                              }}
                            />
                          </div>
                        </td>

                        {/* Tasa de éxito */}
                        <td className="px-4 py-3">
                          {r.tasaExito !== null ? (
                            <div className="space-y-1">
                              <span className="text-sm font-bold" style={{ color: tc }}>
                                {r.tasaExito}%
                              </span>
                              <div className="h-1 rounded-full bg-[#F0EAE8] overflow-hidden w-16">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${r.tasaExito}%`, background: tc }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#B0B0B0] italic">Sin datos</span>
                          )}
                        </td>

                        {/* Calificación */}
                        <td className="px-4 py-3">
                          {r.calif > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-sm font-medium text-[#2A0E18]">
                                {r.calif.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#B0B0B0] italic">—</span>
                          )}
                        </td>

                        {/* Entregados / Cancelados */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="font-semibold text-[#2D7A47]">{r.completados}</span>
                            <span className="text-[#C0C0C0]">/</span>
                            <span className="font-semibold text-[#A32D2D]">{r.cancelados}</span>
                          </div>
                        </td>

                        {/* Acción */}
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/empresas/actividad/${r.id}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] hover:bg-[#8E1B3A] hover:text-white transition-all whitespace-nowrap"
                          >
                            Ver perfil
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
