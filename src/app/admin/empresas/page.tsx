import Link from "next/link";
import prisma from "@/lib/prisma";
import { proveedores } from "@/generated/prisma/client";

const estadoPill: Record<string, string> = {
  aprobado: "bg-[#EEF8F0] text-[#2D7A47]",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
};

const estadoLabel: Record<string, string> = {
  aprobado: "Activo",
  suspendido: "Suspendido",
};

const subPages = [
  { href: "/admin/empresas", label: "Directorio", icon: "≡", active: true },
  { href: "/admin/empresas/actividad", label: "Supervisar actividad", icon: "◷" },
  { href: "/admin/empresas/rendimiento", label: "Rendimiento", icon: "▲" },
];

export default async function EmpresasPage() {
  const empresasReales = await prisma.proveedores.findMany({
    orderBy: { nombre_negocio: "asc" },
    where: {
      estado: { in: ["aprobado", "suspendido"] }
    }
  });

  const totalAprobados = empresasReales.filter((p: proveedores) => p.estado === "aprobado").length;
  const totalSuspendidos = empresasReales.filter((p: proveedores) => p.estado === "suspendido").length;

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fecha);

  const getInitials = (nombre: string) => {
    if (!nombre) return "EM";
    return nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Panel de Control</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Directorio de Empresas
          </h1>
        </div>
        <Link
          href="/admin/empresas/actividad/nueva"
          className="bg-[#8E1B3A] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <span className="text-xl leading-none">+</span>
          Nueva Empresa
        </Link>
      </div>

      {/* Sub-navegación */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-1.5 flex flex-col sm:flex-row gap-1.5">
        {subPages.map((sp) => (
          <Link
            key={sp.href}
            href={sp.href}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${sp.active
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total en directorio", valor: String(empresasReales.length), color: "#8E1B3A" },
          { label: "Empresas activas", valor: String(totalAprobados), color: "#2D7A47" },
          { label: "Cuentas suspendidas", valor: String(totalSuspendidos), color: "#A32D2D" },
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

      {/* Listado */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24]">
            Empresas registradas
          </h3>
          <Link
            href="/admin/empresas/nuevo"
            className="text-xs text-[#8E1B3A] font-bold hover:underline hidden sm:block"
          >
            + Agregar empresa
          </Link>
        </div>

        {empresasReales.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF3EC] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#BC9968" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="#BC9968" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#5A0F24] mb-1">No hay empresas registradas</p>
            <p className="text-xs text-[#7A5260] mb-4">Agrega la primera empresa al directorio</p>
            <Link
              href="/admin/empresas/nuevo"
              className="inline-flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#5A0F24] transition-all"
            >
              <span>+</span> Nueva Empresa
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Empresa", "Email", "Teléfono", "Fecha de Alta", "Estado", "Acción"].map((h) => (
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
                {empresasReales.map((s: proveedores) => (
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
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{s.telefono || "N/A"}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{formatFecha(s.created_at)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${estadoPill[s.estado] || "bg-[#F1EFE8] text-[#5F5E5A]"
                          }`}
                      >
                        {estadoLabel[s.estado] || s.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3 flex items-center gap-3">
                      <Link
                        href={`/admin/empresas/actividad/${s.id}`}
                        className="text-xs text-[#8E1B3A] font-bold hover:underline"
                      >
                        Ver detalles
                      </Link>
                      <Link
                        href={`/admin/empresas/${s.id}/editar`}
                        className="text-xs text-[#BC9968] font-bold hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
