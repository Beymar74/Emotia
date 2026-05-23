import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import CentroCuentasCharts from "./CentroCuentasCharts";
import CentroCuentasTabla from "./CentroCuentasTabla";

export const dynamic = "force-dynamic";

export default async function ReporteCentroCuentasPage() {
  const [usuariosDB, proveedoresDB] = await Promise.all([
    prisma.usuarios.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        activo: true,
        created_at: true,
        tipo: true,
        plan: true,
        puntos: true,
        foto_perfil: true,
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.proveedores.findMany({
      select: {
        id: true,
        nombre_negocio: true,
        email: true,
        estado: true,
        created_at: true,
        rep_nombre: true,
        rep_email: true,
        total_vendido: true,
        calificacion_prom: true,
        rep_telefono: true,
        logo_url: true,
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  // ── Estadísticas de Usuarios ──────────────────────────────────────────────
  const totalUsuarios = usuariosDB.length;
  const usuariosActivos = usuariosDB.filter((u) => u.activo).length;
  const usuariosSuspendidos = totalUsuarios - usuariosActivos;
  const usuariosPremium = usuariosDB.filter((u) => u.plan === "premium").length;
  const usuariosBasicos = totalUsuarios - usuariosPremium;
  const totalPuntosCirculacion = usuariosDB.reduce((acc, u) => acc + (u.puntos || 0), 0);

  // ── Estadísticas de Proveedores y Empresas ───────────────────────────────
  const totalProveedores = proveedoresDB.length; // Representantes
  const proveedoresAprobados = proveedoresDB.filter((p) => p.estado === "aprobado").length;
  const proveedoresSuspendidos = proveedoresDB.filter((p) => p.estado === "suspendido").length;
  const proveedoresPendientes = proveedoresDB.filter((p) => p.estado === "pendiente").length;

  // Las Empresas son proveedores aprobados o suspendidos (sin contar los pendientes)
  const totalEmpresas = proveedoresDB.filter((p) => p.estado === "aprobado" || p.estado === "suspendido").length;
  const empresasActivas = proveedoresAprobados;
  const empresasSuspendidas = proveedoresSuspendidos;

  const totalCuentas = totalUsuarios + 2 * totalProveedores;

  // Ventas consolidadas y calificación promedio
  const ventasConsolidadas = proveedoresDB.reduce((acc, p) => acc + Number(p.total_vendido || 0), 0);
  const representantesConCalificacion = proveedoresDB.filter((p) => p.calificacion_prom && Number(p.calificacion_prom) > 0);
  const promedioCalificacion = representantesConCalificacion.length > 0
    ? (representantesConCalificacion.reduce((acc, p) => acc + Number(p.calificacion_prom), 0) / representantesConCalificacion.length).toFixed(1)
    : "0.0";

  // Top 5 representantes por ventas
  const topRepresentantes = [...proveedoresDB]
    .filter((p) => p.estado === "aprobado")
    .sort((a, b) => Number(b.total_vendido || 0) - Number(a.total_vendido || 0))
    .slice(0, 5)
    .map((p) => ({
      nombre: p.nombre_negocio,
      representante: p.rep_nombre || "—",
      ventas: Number(p.total_vendido || 0),
      calificacion: Number(p.calificacion_prom || 0),
    }));

  const distribucionPlanes = [
    { name: "Plan Básico", value: usuariosBasicos, color: "#BC9968" },
    { name: "Plan Premium", value: usuariosPremium, color: "#8E1B3A" },
  ];

  // ── Registro Mensual Consolidados (últimos 6 meses) ──────────────────────
  const ahora = new Date();
  const mesesMap: Record<string, { mes: string; usuarios: number; empresas: number; representantes: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric" }).format(d);
    mesesMap[key] = { mes: label, usuarios: 0, empresas: 0, representantes: 0 };
  }

  usuariosDB.forEach((u) => {
    const key = `${u.created_at.getFullYear()}-${String(u.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) {
      mesesMap[key].usuarios += 1;
    }
  });

  proveedoresDB.forEach((p) => {
    const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) {
      mesesMap[key].representantes += 1;
      if (p.estado === "aprobado" || p.estado === "suspendido") {
        mesesMap[key].empresas += 1;
      }
    }
  });

  const evolucionRegistro = Object.values(mesesMap);

  // ── Unificación de Cuentas ──────────────────────────────────────────────
  type CuentaUnificada = {
    id: string;
    nombre: string;
    tipo: "Usuario" | "Representante" | "Empresa";
    email: string;
    estado: string;
    created_at: string;
    foto?: string | null;
  };

  const cuentasUnificadas: CuentaUnificada[] = [
    ...usuariosDB.map((u) => ({
      id: `u-${u.id}`,
      nombre: `${u.nombre} ${u.apellido || ""}`.trim(),
      tipo: "Usuario" as const,
      email: u.email,
      estado: u.activo ? "Activo" : "Suspendido",
      created_at: u.created_at.toISOString(),
      foto: u.foto_perfil,
    })),
    ...proveedoresDB.map((p) => ({
      id: `e-${p.id}`,
      nombre: p.nombre_negocio,
      tipo: "Empresa" as const,
      email: p.email,
      estado: p.estado,
      created_at: p.created_at.toISOString(),
      foto: p.logo_url,
    })),
    ...proveedoresDB.map((p) => ({
      id: `r-${p.id}`,
      nombre: p.rep_nombre || "—",
      tipo: "Representante" as const,
      email: p.rep_email || p.email,
      estado: p.estado,
      created_at: p.created_at.toISOString(),
      foto: p.logo_url,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // ── Configuración de Descarga de Reportes ─────────────────────────────────
  const config = {
    filename: "reporte-centro-cuentas",
    titulo: "Reporte del Centro de Cuentas — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total Cuentas", valor: String(totalCuentas), color: "#8E1B3A" },
      { label: "Usuarios Activos", valor: String(usuariosActivos), color: "#2D7A47" },
      { label: "Empresas Habilitadas", valor: String(empresasActivas), color: "#185FA5" },
      { label: "Representantes Aprobados", valor: String(proveedoresAprobados), color: "#8B5E3C" },
      { label: "Ventas Consolidadas", valor: `Bs ${ventasConsolidadas.toFixed(2)}`, color: "#BC9968" },
      { label: "Puntos en Circulación", valor: String(totalPuntosCirculacion), color: "#E65100" },
    ],
    graficos: [
      {
        tipo: "area" as const,
        titulo: "Evolución de Nuevos Registros",
        datos: evolucionRegistro.map((m) => ({ x: m.mes, y: m.usuarios + m.representantes })),
        color: "#8E1B3A",
      },
      {
        tipo: "dona" as const,
        titulo: "Composición del Ecosistema",
        datos: [
          { nombre: "Usuarios", valor: totalUsuarios, color: "#8E1B3A" },
          { nombre: "Empresas", valor: totalEmpresas, color: "#185FA5" },
          { nombre: "Representantes", valor: totalProveedores, color: "#8B5E3C" },
        ],
      },
    ],
    tablas: [
      {
        nombre: "Composición del Ecosistema",
        columnas: ["Métrica", "Habilitados / Activos", "Suspendidos / Inactivos", "Pendientes", "Total"],
        filas: [
          ["Usuarios (Clientes)", usuariosActivos, usuariosSuspendidos, 0, totalUsuarios],
          ["Empresas (Negocios)", empresasActivas, empresasSuspendidas, 0, totalEmpresas],
          ["Representantes", proveedoresAprobados, proveedoresSuspendidos, proveedoresPendientes, totalProveedores],
        ],
      },
      {
        nombre: "Top 5 Representantes por Ventas",
        columnas: ["Negocio", "Representante", "Ventas Acumuladas", "Calificación"],
        filas: topRepresentantes.map((tr) => [
          tr.nombre,
          tr.representante,
          `Bs ${tr.ventas.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`,
          `${tr.calificacion.toFixed(1)} ★`,
        ]),
      },
      {
        nombre: "Todas las Cuentas del Ecosistema",
        columnas: ["Nombre / Negocio", "Tipo", "Email", "Estado", "Fecha de Registro"],
        filas: cuentasUnificadas.map((c) => [
          c.nombre,
          c.tipo,
          c.email,
          c.estado.toUpperCase(),
          new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(c.created_at)),
        ]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Centro de Cuentas</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Centro de Cuentas</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Consolidado analítico de usuarios, empresas, representantes, métricas comerciales y de gamificación en la plataforma PREPE.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs Consolidados */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Cuentas Totales", valor: String(totalCuentas), color: "#8E1B3A", sub: "Ecosistema PREPE" },
          { label: "Usuarios Activos", valor: String(usuariosActivos), color: "#2D7A47", sub: `${usuariosPremium} Premium / ${usuariosBasicos} Básicos` },
          { label: "Empresas Habilitadas", valor: String(empresasActivas), color: "#185FA5", sub: `de ${totalEmpresas} en sistema` },
          { label: "Representantes Aprob.", valor: String(proveedoresAprobados), color: "#8B5E3C", sub: `de ${totalProveedores} registrados` },
          { label: "Ventas Consolidadas", valor: `Bs ${ventasConsolidadas.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`, color: "#BC9968", sub: `Prom. Rating: ${promedioCalificacion} ★` },
          { label: "Puntos Circulando", valor: totalPuntosCirculacion.toLocaleString("es-BO"), color: "#E65100", sub: "En poder de clientes" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <div>
              <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-semibold">{k.label}</p>
              <p className="font-serif text-lg sm:text-xl font-bold text-[#5A0F24] mt-2 break-all">{k.valor}</p>
            </div>
            <p className="text-[9px] mt-2 font-medium" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <CentroCuentasCharts
        evolucionRegistro={evolucionRegistro}
        composicionEcosistema={[
          { label: "Usuarios (Clientes)", value: totalUsuarios, color: "#8E1B3A" },
          { label: "Empresas (Negocios)", value: totalEmpresas, color: "#185FA5" },
          { label: "Representantes", value: totalProveedores, color: "#8B5E3C" },
        ]}
        distribucionEstados={[
          { categoria: "Usuarios", activo: usuariosActivos, suspendido: usuariosSuspendidos, pendiente: 0 },
          { categoria: "Empresas", activo: empresasActivas, suspendido: empresasSuspendidas, pendiente: 0 },
          { categoria: "Representantes", activo: proveedoresAprobados, suspendido: proveedoresSuspendidos, pendiente: proveedoresPendientes },
        ]}
        distribucionPlanes={distribucionPlanes}
        topRepresentantes={topRepresentantes}
      />

      {/* Tabla Resumen de Ecosistema */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Composición Detallada del Ecosistema</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Tipo de Cuenta", "Habilitados / Activos", "Suspendidos / Inactivos", "Pendientes", "Total Registros"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#8E1B3A]/5 hover:bg-[#FAF3EC]/50">
              <td className="px-3 py-3 font-medium text-[#2A0E18]">Usuarios (Clientes)</td>
              <td className="px-3 py-3 text-sm text-[#2D7A47] font-semibold">{usuariosActivos}</td>
              <td className="px-3 py-3 text-sm text-[#A32D2D]">{usuariosSuspendidos}</td>
              <td className="px-3 py-3 text-sm text-[#7A5260]">—</td>
              <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{totalUsuarios}</td>
            </tr>
            <tr className="border-b border-[#8E1B3A]/5 hover:bg-[#FAF3EC]/50">
              <td className="px-3 py-3 font-medium text-[#2A0E18]">Empresas (Negocios afiliados)</td>
              <td className="px-3 py-3 text-sm text-[#2D7A47] font-semibold">{empresasActivas}</td>
              <td className="px-3 py-3 text-sm text-[#A32D2D]">{empresasSuspendidas}</td>
              <td className="px-3 py-3 text-sm text-[#7A5260]">—</td>
              <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{totalEmpresas}</td>
            </tr>
            <tr className="last:border-0 hover:bg-[#FAF3EC]/50">
              <td className="px-3 py-3 font-medium text-[#2A0E18]">Representantes</td>
              <td className="px-3 py-3 text-sm text-[#2D7A47] font-semibold">{proveedoresAprobados}</td>
              <td className="px-3 py-3 text-sm text-[#A32D2D]">{proveedoresSuspendidos}</td>
              <td className="px-3 py-3 text-sm text-[#BC9968] font-medium">{proveedoresPendientes}</td>
              <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{totalProveedores}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabla de Todas las Cuentas */}
      <CentroCuentasTabla cuentas={cuentasUnificadas} />
    </div>
  );
}

