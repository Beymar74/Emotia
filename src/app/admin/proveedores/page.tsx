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

// Sub-navegación actualizada (Sin Aprobar/Rechazar)
const subPages = [
  { href: "/admin/proveedores/actividad", label: "Supervisar actividad", icon: "◷", active: true },
  { href: "/admin/proveedores/rendimiento", label: "Rendimiento", icon: "▲" },
];

export default async function ProveedoresPage() {
  const proveedoresReales = await prisma.proveedores.findMany({
    orderBy: { nombre_negocio: "asc" },
    where: {
      estado: { in: ["aprobado", "suspendido"] }
    }
  });

  const totalAprobados = proveedoresReales.filter((p: proveedores) => p.estado === "aprobado").length;
  const totalSuspendidos = proveedoresReales.filter((p: proveedores) => p.estado === "suspendido").length;

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
      {/* Header Limpio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Panel de Control</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Directorio de Proveedores
          </h1>
        </div>
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

      {/* Stats de Directorio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total en directorio", valor: String(proveedoresReales.length), color: "#8E1B3A" },
          { label: "Proveedores activos", valor: String(totalAprobados), color: "#2D7A47" },
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

      {/* Listado de Directorio */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">
          Proveedores registrados
        </h3>

        {proveedoresReales.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-8">No hay proveedores en el directorio.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Proveedor", "Email", "Teléfono", "Fecha de Alta", "Estado", "Acción"].map((h) => (
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
                {proveedoresReales.map((s: proveedores) => (
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
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/proveedores/actividad/${s.id}`}
                        className="text-xs text-[#8E1B3A] font-bold hover:underline"
                      >
                        Ver detalles
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