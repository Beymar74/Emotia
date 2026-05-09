import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoNuevosClientes, GraficoSegmentacionClientes, GraficoTopCompradores } from "./ClientesCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";

export default async function ReporteClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  
  const empresaFiltroUsuario = empresaId > 0 ? { pedidos: { some: { detalle_pedidos: { some: { proveedor_id: empresaId } } } } } : {};
  const empresaFiltroPedido = empresaId > 0 ? { detalle_pedidos: { some: { proveedor_id: empresaId } } } : {};
  const [usuariosDB, pedidosDB, empresasLista] = await Promise.all([
    prisma.usuarios.findMany({
      where: { tipo: 'usuario', ...empresaFiltroUsuario },
      select: { id: true, nombre: true, email: true, activo: true, created_at: true },
      orderBy: { created_at: 'desc' },
    }),
    prisma.pedidos.findMany({
      where: { ...empresaFiltroPedido },
      select: { id: true, usuario_id: true, total: true, estado: true, created_at: true },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } })
  ]);

  const totalUsuarios = usuariosDB.length;
  const usuariosActivos = usuariosDB.filter((u: any) => u.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;

  // Registro por mes (últimos 6 meses)
  const ahora = new Date();
  type MesReg = { mes: string; total: number };
  const mesesMap: Record<string, MesReg> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('es-BO', { month: 'short', year: 'numeric' }).format(d);
    mesesMap[key] = { mes: label, total: 0 };
  }
  usuariosDB.forEach((u: any) => {
    const key = `${u.created_at.getFullYear()}-${String(u.created_at.getMonth() + 1).padStart(2, '0')}`;
    if (mesesMap[key]) mesesMap[key].total += 1;
  });
  const registroMensual = Object.values(mesesMap);
  const maxReg = Math.max(...registroMensual.map(m => m.total), 1);

  // Top compradores
  type CompMap = Record<string, { nombre: string; email: string; pedidos: number; total: number }>;
  const compradoresMap: CompMap = {};
  pedidosDB.forEach((p: any) => {
    if (!p.usuario_id) return;
    const uid = String(p.usuario_id);
    if (!compradoresMap[uid]) {
      const user = usuariosDB.find((u: any) => u.id === p.usuario_id);
      compradoresMap[uid] = {
        nombre: user?.nombre || "Cliente",
        email: user?.email || "—",
        pedidos: 0,
        total: 0
      };
    }
    compradoresMap[uid].pedidos += 1;
    compradoresMap[uid].total += Number(p.total || 0);
  });
  const topCompradores = Object.values(compradoresMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Clientes con al menos un pedido
  const clientesConPedidos = new Set(pedidosDB.map((p: any) => p.usuario_id)).size;
  const tasaConversion = totalUsuarios > 0 ? Math.round((clientesConPedidos / totalUsuarios) * 100) : 0;

  const config = {
    filename: "reporte-clientes",
    titulo: "Reporte de Clientes — Emotia",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total clientes", valor: String(totalUsuarios), color: "#8E1B3A" },
      { label: "Clientes activos", valor: String(usuariosActivos), color: "#2D7A47" },
      { label: "Han comprado", valor: String(clientesConPedidos), color: "#BC9968" },
      { label: "Tasa conversión", valor: `${tasaConversion}%`, color: "#AB3A50" },
    ],
    graficos: [
      { tipo: "area" as const, titulo: "Nuevos clientes por mes", datos: registroMensual.map((m) => ({ x: m.mes, y: m.total })), color: "#8E1B3A" },
      { tipo: "dona" as const, titulo: "Segmentación de clientes", datos: [
        { nombre: "Activos con compras", valor: Math.min(clientesConPedidos, usuariosActivos), color: "#2D7A47" },
        { nombre: "Activos sin compras", valor: Math.max(0, usuariosActivos - clientesConPedidos), color: "#BC9968" },
        { nombre: "Inactivos", valor: usuariosInactivos, color: "#A32D2D" },
      ]},
      { tipo: "barras-h" as const, titulo: "Top compradores (Bs)", datos: topCompradores.slice(0, 6).map((c) => ({ nombre: c.nombre, valor: c.total })), color: "#8E1B3A" },
    ],
    tablas: [
      {
        nombre: "Registro mensual",
        columnas: ["Período", "Nuevos clientes"],
        filas: registroMensual.map((m) => [m.mes, m.total]),
      },
      {
        nombre: "Top compradores",
        columnas: ["Cliente", "Email", "Pedidos", "Total gastado (Bs)", "Ticket promedio (Bs)"],
        filas: topCompradores.map((c) => [
          c.nombre, c.email, c.pedidos, c.total,
          Math.round(c.pedidos > 0 ? c.total / c.pedidos : 0),
        ]),
      },
      {
        nombre: "Resumen",
        columnas: ["Métrica", "Valor"],
        filas: [
          ["Total clientes", totalUsuarios],
          ["Clientes activos", usuariosActivos],
          ["Clientes inactivos", usuariosInactivos],
          ["Han comprado", clientesConPedidos],
          ["Tasa de conversión", tasaConversion + "%"],
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/reportes" className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Clientes</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          En esta sección puedes evaluar el crecimiento de la base de usuarios, demografía y el comportamiento de consumo de tus clientes.
        </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total clientes", valor: String(totalUsuarios), color: "#8E1B3A" },
          { label: "Clientes activos", valor: String(usuariosActivos), color: "#2D7A47" },
          { label: "Han comprado", valor: String(clientesConPedidos), color: "#BC9968" },
          { label: "Tasa conversión", valor: `${tasaConversion}%`, color: "#AB3A50" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoNuevosClientes data={registroMensual} />
        <GraficoSegmentacionClientes data={[
          { label: "Activos con compras", value: Math.min(clientesConPedidos, usuariosActivos), color: "#2D7A47" },
          { label: "Activos sin compras", value: Math.max(0, usuariosActivos - clientesConPedidos), color: "#BC9968" },
          { label: "Inactivos", value: usuariosInactivos, color: "#A32D2D" },
        ]} />
      </div>

      <GraficoTopCompradores data={topCompradores} />

      {/* Tabla top compradores */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle de compradores</h3>
        {topCompradores.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de compras disponibles.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#", "Cliente", "Email", "Pedidos", "Total gastado", "Ticket promedio"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
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
                        {(c.nombre?.[0] || "C").toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#2A0E18]">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{c.email}</td>
                  <td className="px-3 py-3 text-sm font-bold text-[#2A0E18]">{c.pedidos}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{formatBs(c.total)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{formatBs(c.pedidos > 0 ? c.total / c.pedidos : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
