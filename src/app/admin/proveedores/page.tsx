import Link from "next/link";
import prisma from "@/lib/prisma";
import { proveedores } from "@/generated/prisma/client";
import { aprobarProveedor, rechazarProveedor } from "../actions";

const estadoPill: Record<string, string> = {
  pendiente: "bg-[#FDF5E6] text-[#8C5E08]",
  aprobado: "bg-[#EEF8F0] text-[#2D7A47]",
  rechazado: "bg-[#FBF0F0] text-[#A32D2D]",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
};

const estadoLabel: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  suspendido: "Suspendido",
};

const subPages = [
  { href: "/admin/proveedores", label: "Aprobar / Rechazar", icon: "⚑", active: true },
  { href: "/admin/proveedores/actividad", label: "Supervisar actividad", icon: "◷" },
  { href: "/admin/proveedores/rendimiento", label: "Rendimiento", icon: "▲" },
];

export default async function ProveedoresPage() {
  const proveedoresReales = await prisma.proveedores.findMany({
    orderBy: { created_at: "desc" },
  });

  const pendientes = proveedoresReales.filter((p: proveedores) => p.estado === "pendiente");
  const aprobados = proveedoresReales.filter((p: proveedores) => p.estado === "aprobado");
  const rechazados = proveedoresReales.filter(
    (p: proveedores) => p.estado === "rechazado" || p.estado === "suspendido"
  );

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fecha);

  const getInitials = (nombre: string) => {
    if (!nombre) return "PR";
    return nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Proveedores</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Aprobar / Rechazar solicitudes
          </h1>
        </div>
        <span className="self-start sm:self-auto text-xs bg-[#FDF5E6] text-[#8C5E08] px-4 py-1.5 rounded-full font-medium">
          {pendientes.length} solicitudes pendientes
        </span>
      </div>

      {/* Sub-navegación */}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total solicitudes", valor: String(proveedoresReales.length), color: "#8E1B3A" },
          { label: "Pendientes", valor: String(pendientes.length), color: "#8C5E08" },
          { label: "Aprobados", valor: String(aprobados.length), color: "#2D7A47" },
          { label: "Rechazados", valor: String(rechazados.length), color: "#A32D2D" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-2xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-xs sm:text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Solicitudes pendientes */}
      <div>
        <p className="text-[8.5px] tracking-[2.5px] uppercase text-[#7A5260] font-medium mb-3">
          Solicitudes pendientes de revisión
        </p>

        {pendientes.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-8 text-center text-[#7A5260]">
            No hay solicitudes pendientes en este momento. ✅
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendientes.map((s: proveedores) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 space-y-4"
              >
                {/* Header proveedor */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {getInitials(s.nombre_negocio)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-[#2A0E18]">{s.nombre_negocio}</h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          estadoPill[s.estado] || estadoPill.pendiente
                        }`}
                      >
                        {estadoLabel[s.estado] || s.estado}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A5260] mt-0.5">
                      Solicitud del {formatFecha(s.created_at)}
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-[#7A5260] leading-relaxed bg-[#FAF3EC] rounded-lg p-3 min-h-[52px]">
                  {s.descripcion || "El proveedor no proporcionó una descripción del negocio."}
                </p>

                {/* Info rápida */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF3EC] rounded-lg p-2.5 overflow-hidden">
                    <p className="text-[#7A5260]">Email</p>
                    <p className="text-[#2A0E18] font-medium truncate mt-0.5" title={s.email}>
                      {s.email}
                    </p>
                  </div>
                  <div className="bg-[#FAF3EC] rounded-lg p-2.5">
                    <p className="text-[#7A5260]">Teléfono</p>
                    <p className="text-[#2A0E18] font-medium mt-0.5">{s.telefono || "N/A"}</p>
                  </div>
                </div>

                {/* Acciones con Server Actions reales */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {/* APROBAR */}
                  <form action={aprobarProveedor} className="flex-1">
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="w-full text-sm bg-[#2D7A47] text-white py-2.5 rounded-lg font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      ✓ Aprobar proveedor
                    </button>
                  </form>

                  {/* RECHAZAR */}
                  <form action={rechazarProveedor} className="flex-1">
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="w-full text-sm bg-[#A32D2D] text-white py-2.5 rounded-lg font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      ✕ Rechazar solicitud
                    </button>
                  </form>

                  {/* VER ACTIVIDAD */}
                  <Link
                    href="/admin/proveedores/actividad"
                    className="sm:flex-none text-sm border border-[#8E1B3A]/20 text-[#8E1B3A] px-4 py-2.5 rounded-lg font-medium hover:bg-[#8E1B3A]/5 transition-colors text-center"
                  >
                    Ver actividad
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de decisiones */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">
          Historial de decisiones
        </h3>

        {[...aprobados, ...rechazados].length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin historial aún.</p>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="block md:hidden space-y-3">
              {[...aprobados, ...rechazados].map((s: proveedores) => (
                <div key={s.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {getInitials(s.nombre_negocio)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2A0E18] truncate">{s.nombre_negocio}</p>
                      <p className="text-xs text-[#7A5260]">{formatFecha(s.updated_at)}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      estadoPill[s.estado] || estadoPill.pendiente
                    }`}
                  >
                    {estadoLabel[s.estado] || s.estado}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop: tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Proveedor", "Email", "Fecha decisión", "Estado"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...aprobados, ...rechazados].map((s: proveedores) => (
                    <tr
                      key={s.id}
                      className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {getInitials(s.nombre_negocio)}
                          </div>
                          <span className="text-sm font-medium text-[#2A0E18]">{s.nombre_negocio}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-[#7A5260]">{s.email}</td>
                      <td className="px-3 py-3 text-sm text-[#7A5260]">{formatFecha(s.updated_at)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            estadoPill[s.estado] || estadoPill.pendiente
                          }`}
                        >
                          {estadoLabel[s.estado] || s.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}