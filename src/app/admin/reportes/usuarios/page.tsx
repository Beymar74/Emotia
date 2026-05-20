import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";

export const dynamic = "force-dynamic";

export default async function ReporteUsuariosPage() {
  const [usuariosDB, pedidosDB] = await Promise.all([
    prisma.usuarios.findMany({
      where: { tipo: "usuario" },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
        created_at: true,
        tipo: true,
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.pedidos.findMany({
      select: { id: true, usuario_id: true, total: true, estado: true, created_at: true },
    }),
  ]);

  const totalUsuarios = usuariosDB.length;
  const activos = usuariosDB.filter((u) => u.activo).length;
  const inactivos = totalUsuarios - activos;

  // Registro mensual (últimos 6 meses)
  const ahora = new Date();
  const mesesMap: Record<string, { mes: string; total: number; activos: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric" }).format(d);
    mesesMap[key] = { mes: label, total: 0, activos: 0 };
  }
  usuariosDB.forEach((u) => {
    const key = `${u.created_at.getFullYear()}-${String(u.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) {
      mesesMap[key].total += 1;
      if (u.activo) mesesMap[key].activos += 1;
    }
  });
  const registroMensual = Object.values(mesesMap);

  // Usuarios con pedidos
  const usuariosConPedido = new Set(pedidosDB.map((p) => p.usuario_id)).size;
  const tasaConversion = totalUsuarios > 0 ? Math.round((usuariosConPedido / totalUsuarios) * 100) : 0;

  // Top compradores
  type CompMap = Record<string, { nombre: string; email: string; pedidos: number; total: number }>;
  const compradoresMap: CompMap = {};
  pedidosDB.forEach((p) => {
    if (!p.usuario_id) return;
    const uid = String(p.usuario_id);
    if (!compradoresMap[uid]) {
      const user = usuariosDB.find((u) => u.id === p.usuario_id);
      compradoresMap[uid] = {
        nombre: user?.nombre || "Cliente",
        email: user?.email || "—",
        pedidos: 0,
        total: 0,
      };
    }
    compradoresMap[uid].pedidos += 1;
    compradoresMap[uid].total += Number(p.total || 0);
  });
  const topCompradores = Object.values(compradoresMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Usuarios recientes (últimos 10)
  const usuariosRecientes = usuariosDB.slice(0, 10);

  const config = {
    filename: "reporte-usuarios",
    titulo: "Reporte de Usuarios — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total usuarios", valor: String(totalUsuarios), color: "#8E1B3A" },
      { label: "Usuarios activos", valor: String(activos), color: "#2D7A47" },
      { label: "Usuarios inactivos", valor: String(inactivos), color: "#A32D2D" },
      { label: "Han comprado", valor: String(usuariosConPedido), color: "#BC9968" },
    ],
    graficos: [
      {
        tipo: "area" as const,
        titulo: "Nuevos usuarios por mes",
        datos: registroMensual.map((m) => ({ x: m.mes, y: m.total })),
        color: "#8E1B3A",
      },
      {
        tipo: "dona" as const,
        titulo: "Segmentación de usuarios",
        datos: [
          { nombre: "Activos con compras", valor: Math.min(usuariosConPedido, activos), color: "#2D7A47" },
          { nombre: "Activos sin compras", valor: Math.max(0, activos - usuariosConPedido), color: "#BC9968" },
          { nombre: "Inactivos", valor: inactivos, color: "#A32D2D" },
        ],
      },
      {
        tipo: "barras-h" as const,
        titulo: "Top compradores (Bs)",
        datos: topCompradores.slice(0, 6).map((c) => ({ nombre: c.nombre, valor: c.total })),
        color: "#8E1B3A",
      },
    ],
    tablas: [
      {
        nombre: "Registro mensual",
        columnas: ["Período", "Nuevos usuarios", "Activos"],
        filas: registroMensual.map((m) => [m.mes, m.total, m.activos]),
      },
      {
        nombre: "Top compradores",
        columnas: ["Usuario", "Email", "Pedidos", "Total gastado (Bs)"],
        filas: topCompradores.map((c) => [c.nombre, c.email, c.pedidos, c.total]),
      },
      {
        nombre: "Resumen general",
        columnas: ["Métrica", "Valor"],
        filas: [
          ["Total usuarios registrados", totalUsuarios],
          ["Usuarios activos", activos],
          ["Usuarios inactivos", inactivos],
          ["Han realizado al menos una compra", usuariosConPedido],
          ["Tasa de conversión", tasaConversion + "%"],
        ],
      },
    ],
  };

  const maxMes = Math.max(...registroMensual.map((m) => m.total), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reportes"
            className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes — PREPE</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Usuarios</h1>
            <p className="mt-1 text-sm text-[#7A5260] max-w-2xl">
              Análisis completo de los usuarios registrados en el Sistema PREPE: actividad, registro y comportamiento de compra.
            </p>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total usuarios", valor: String(totalUsuarios), color: "#8E1B3A", sub: "Registrados en PREPE" },
          { label: "Activos", valor: String(activos), color: "#2D7A47", sub: "Cuentas habilitadas" },
          { label: "Inactivos", valor: String(inactivos), color: "#A32D2D", sub: "Cuentas deshabilitadas" },
          { label: "Han comprado", valor: String(usuariosConPedido), color: "#BC9968", sub: `${tasaConversion}% de conversión` },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Registro mensual */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Nuevos usuarios por mes</h3>
          <div className="space-y-2">
            {registroMensual.map((m) => (
              <div key={m.mes} className="flex items-center gap-3">
                <span className="text-xs text-[#7A5260] w-20 flex-shrink-0 capitalize">{m.mes}</span>
                <div className="flex-1 h-6 bg-[#FAF3EC] rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E1B3A] to-[#BC9968] rounded-lg transition-all"
                    style={{ width: `${Math.round((m.total / maxMes) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#5A0F24] w-8 text-right">{m.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Segmentación */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Segmentación de usuarios</h3>
          <div className="space-y-3">
            {[
              { label: "Activos con compras", value: Math.min(usuariosConPedido, activos), color: "#2D7A47" },
              { label: "Activos sin compras", value: Math.max(0, activos - usuariosConPedido), color: "#BC9968" },
              { label: "Inactivos", value: inactivos, color: "#A32D2D" },
            ].map((seg) => {
              const pct = totalUsuarios > 0 ? Math.round((seg.value / totalUsuarios) * 100) : 0;
              return (
                <div key={seg.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#2A0E18]">{seg.label}</span>
                    <span className="text-sm font-bold text-[#5A0F24]">{seg.value} <span className="font-normal text-[#7A5260]">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-[#FAF3EC] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: seg.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[#8E1B3A]/8">
            <p className="text-xs text-[#7A5260]">Tasa de conversión a comprador: <span className="font-bold text-[#5A0F24]">{tasaConversion}%</span></p>
          </div>
        </div>
      </div>

      {/* Top compradores */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top compradores</h3>
        {topCompradores.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de compras disponibles.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#", "Usuario", "Email", "Pedidos", "Total gastado", "Ticket promedio"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCompradores.map((c, i) => (
                <tr key={c.email} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0">
                        {(c.nombre?.[0] || "U").toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#2A0E18]">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{c.email}</td>
                  <td className="px-3 py-3 text-sm font-bold text-[#2A0E18]">{c.pedidos}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{formatBs(c.total)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {formatBs(c.pedidos > 0 ? c.total / c.pedidos : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Usuarios recientes */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Usuarios registrados recientemente</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Usuario", "Email", "Estado", "Fecha de registro"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuariosRecientes.map((u) => (
              <tr key={u.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0">
                      {(u.nombre?.[0] || "U").toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#2A0E18]">{u.nombre || "—"}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{u.email}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.activo
                        ? "bg-[#EEF8F0] text-[#2D7A47]"
                        : "bg-[#FBF0F0] text-[#A32D2D]"
                    }`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">
                  {new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(u.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-[#BC9968] mt-3">
          Mostrando los 10 más recientes de {totalUsuarios} usuarios totales. Usa{" "}
          <Link href="/admin/usuarios" className="underline hover:text-[#8E1B3A]">Gestión de usuarios</Link>{" "}
          para la lista completa.
        </p>
      </div>
    </div>
  );
}
