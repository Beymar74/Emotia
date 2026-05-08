import Link from "next/link";
import prisma from "@/lib/prisma";
import { proveedores } from "@/generated/prisma/client";
import ActividadEmpresasClient from "./_components/ActividadEmpresasClient";

const subPages = [
  { href: "/admin/empresas/actividad", label: "Supervisar actividad", icon: "◷", active: true },
  { href: "/admin/empresas/rendimiento", label: "Rendimiento", icon: "▲" },
];

export default async function ActividadEmpresasPage() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const provActivos = await prisma.proveedores.count({ where: { estado: 'aprobado' } });

  const pedidosCurso = await prisma.pedidos.count({
    where: { estado: { notIn: ['entregado', 'cancelado'] } }
  });

  const completadosHoy = await prisma.pedidos.count({
    where: { estado: 'entregado', updated_at: { gte: hoy } }
  });

  const canceladosMes = await prisma.pedidos.count({
    where: { estado: 'cancelado', updated_at: { gte: inicioMes } }
  });

  const empresasRaw = await prisma.proveedores.findMany({
    where: { estado: { in: ['aprobado', 'suspendido'] } },
    orderBy: { updated_at: 'desc' },
    take: 10
  });

  const empresasReales = empresasRaw.map((p: proveedores) => ({
    ...p,
    calificacion_prom: p.calificacion_prom ? Number(p.calificacion_prom) : 0,
    total_vendido: p.total_vendido ? Number(p.total_vendido) : 0
  }));

  const logActividadDB = await prisma.audit_log.findMany({
    take: 6,
    orderBy: { created_at: 'desc' }
  });

  const getInitials = (nombre: string) => {
    if (!nombre) return "EM";
    return nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatHora = (fecha: Date) =>
    new Intl.DateTimeFormat('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/La_Paz' }).format(fecha);

  const formatFechaCorta = (fecha: Date) =>
    new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/La_Paz' }).format(fecha);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Empresas</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Supervisar actividad</h1>
        </div>
        <Link
          href="/admin/empresas/nuevo"
          className="bg-[#8E1B3A] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="text-xl leading-none">+</span>
          Agregar Empresa
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-1.5 flex flex-col sm:flex-row gap-1.5">
        {subPages.map((sp) => (
          <Link
            key={sp.href}
            href={sp.href}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              sp.active
                ? "bg-gradient-to-r from-[#8E1B3A] to-[#AB3A50] text-white shadow-sm"
                : "text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#5A0F24]"
            }`}
          >
            <span>{sp.icon}</span>
            <span>{sp.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Empresas activas",    valor: String(provActivos),    color: "#8E1B3A" },
          { label: "Pedidos en curso",    valor: String(pedidosCurso),   color: "#BC9968" },
          { label: "Completados hoy",     valor: String(completadosHoy), color: "#2D7A47" },
          { label: "Cancelados este mes", valor: String(canceladosMes),  color: "#A32D2D" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-2xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-xs sm:text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">Actividad por empresa</h3>
        <ActividadEmpresasClient empresasReales={empresasReales} />
      </div>

      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">Log de actividad reciente</h3>

        {logActividadDB.length === 0 ? (
          <p className="text-sm text-[#7A5260] py-4 text-center">No hay registros de auditoría recientes.</p>
        ) : (
          <div className="divide-y divide-[#8E1B3A]/6">
            {logActividadDB.map((l: any) => (
              <div key={l.id} className="flex items-start gap-3 sm:gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  {getInitials(l.actor_tipo || "SA")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2A0E18]">
                    <span className="font-medium">{l.actor_tipo ?? "Sistema"}</span>
                    {l.actor_id ? ` #${l.actor_id}` : ""} — {l.accion}
                  </p>
                  <p className="text-xs text-[#7A5260] mt-0.5">
                    {formatFechaCorta(l.created_at)} · {formatHora(l.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
