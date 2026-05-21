import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoNuevosClientes, GraficoSegmentacionClientes, GraficoTopCompradores } from "./ClientesCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";
import ClientesReporteTabla from "./_components/ClientesReporteTabla";

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
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, logo_url: true }, orderBy: { nombre_negocio: "asc" } })
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

  // Uncapped clients roster including those with zero orders
  type CompMap = Record<string, { nombre: string; email: string; pedidos: number; total: number }>;
  const compradoresMap: CompMap = {};
  usuariosDB.forEach((u: any) => {
    compradoresMap[String(u.id)] = {
      nombre: u.nombre || "Cliente",
      email: u.email || "—",
      pedidos: 0,
      total: 0
    };
  });
  pedidosDB.forEach((p: any) => {
    if (!p.usuario_id) return;
    const uid = String(p.usuario_id);
    if (compradoresMap[uid]) {
      compradoresMap[uid].pedidos += 1;
      compradoresMap[uid].total += Number(p.total || 0);
    }
  });
  const todosLosClientes = Object.values(compradoresMap).sort((a, b) => b.total - a.total);

  // Clientes con al menos un pedido
  const clientesConPedidos = new Set(pedidosDB.map((p: any) => p.usuario_id)).size;
  const tasaConversion = totalUsuarios > 0 ? Math.round((clientesConPedidos / totalUsuarios) * 100) : 0;

  const config = {
    filename: "reporte-clientes",
    titulo: "Reporte de Clientes — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    logoUrl: empresaId > 0 ? (empresasLista.find((e) => e.id === empresaId)?.logo_url || undefined) : undefined,
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
      { tipo: "barras-h" as const, titulo: "Top compradores (Bs)", datos: todosLosClientes.slice(0, 6).map((c) => ({ nombre: c.nombre, valor: c.total })), color: "#8E1B3A" },
    ],
    tablas: [
      {
        nombre: "Registro mensual",
        columnas: ["Período", "Nuevos clientes"],
        filas: registroMensual.map((m) => [m.mes, m.total]),
      },
      {
        nombre: "Detalle de compradores",
        columnas: ["Cliente", "Email", "Pedidos", "Total gastado (Bs)", "Ticket promedio (Bs)"],
        filas: todosLosClientes.map((c) => [
          c.nombre, c.email, c.pedidos, c.total,
          Math.round(c.pedidos > 0 ? c.total / c.pedidos : 0),
        ]),
      },
      {
        nombre: "Resumen general",
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Clientes</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Clientes</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Crecimiento de la base de usuarios, comportamiento de compra y top compradores.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

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

      <GraficoTopCompradores data={todosLosClientes.slice(0, 8)} />

      {/* Interactive & Complete Table Component */}
      <ClientesReporteTabla clientes={todosLosClientes} />
    </div>
  );
}
