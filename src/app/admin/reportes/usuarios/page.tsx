import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import UsuariosCharts from "./UsuariosCharts";
import ReportSubNav from "../_components/ReportSubNav";
import UsuariosReporteTablas from "./_components/UsuariosReporteTablas";

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
    .sort((a, b) => b.total - a.total);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Todos los usuarios
  const usuariosRecientes = usuariosDB;

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
        nombre: "Compradores por total gastado",
        columnas: ["Usuario", "Email", "Pedidos", "Total gastado (Bs)"],
        filas: topCompradores.map((c) => [c.nombre, c.email, c.pedidos, c.total]),
      },
      {
        nombre: "Usuarios registrados",
        columnas: ["Usuario", "Email", "Estado", "Fecha de registro"],
        filas: usuariosDB.map((u) => [
          u.nombre || "—",
          u.email,
          u.activo ? "Activo" : "Inactivo",
          new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(u.created_at)),
        ]),
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Usuarios</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Usuarios</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Registro mensual, segmentación por actividad, conversión a compradores y top usuarios.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

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
      <UsuariosCharts
        registroMensual={registroMensual}
        segmentos={[
          { label: "Activos con compras", value: Math.min(usuariosConPedido, activos), color: "#2D7A47" },
          { label: "Activos sin compras", value: Math.max(0, activos - usuariosConPedido), color: "#BC9968" },
          { label: "Inactivos", value: inactivos, color: "#A32D2D" },
        ]}
        topCompradores={topCompradores.slice(0, 6).map((c) => ({ nombre: c.nombre, total: c.total }))}
      />

      {/* Listados de usuarios y compradores */}
      <UsuariosReporteTablas compradores={topCompradores} usuarios={usuariosRecientes} />
    </div>
  );
}
