import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(date);
}

function diasRestantes(fechaEvento: Date): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diff = fechaEvento.getTime() - hoy.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function RecordatoriosPage() {
  const hoy  = new Date(); hoy.setHours(0, 0, 0, 0);
  const en7  = new Date(hoy); en7.setDate(hoy.getDate() + 7);
  const en30 = new Date(hoy); en30.setDate(hoy.getDate() + 30);

  const recordatorios = await prisma.recordatorios.findMany({
    orderBy: { fecha_evento: "asc" },
    include: {
      usuarios: { select: { nombre: true, apellido: true, email: true } },
    },
  });

  const activos        = recordatorios.filter((r) => r.activo);
  const vencen7        = activos.filter((r) => r.fecha_evento >= hoy && r.fecha_evento <= en7);
  const vencen30       = activos.filter((r) => r.fecha_evento >= hoy && r.fecha_evento <= en30);
  const vencidos       = activos.filter((r) => r.fecha_evento < hoy);

  const serialized = recordatorios.map((r) => ({
    id:           r.id,
    titulo:       r.titulo,
    fecha_evento: r.fecha_evento.toISOString(),
    dias_aviso:   r.dias_aviso,
    descripcion:  r.descripcion,
    activo:       r.activo,
    usuario:      `${r.usuarios.nombre} ${r.usuarios.apellido ?? ""}`.trim(),
    email:        r.usuarios.email,
    dias_restantes: diasRestantes(r.fecha_evento),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Comunicación
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
          Recordatorios
        </h1>
        <p className="text-sm text-[#7A5260] mt-1">
          Supervisión de recordatorios de eventos configurados por los usuarios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Activos",          valor: activos.length,  color: "#8E1B3A" },
          { label: "Vencen en 7 días", valor: vencen7.length,  color: "#E65100" },
          { label: "Vencen en 30 d",   valor: vencen30.length, color: "#BC9968" },
          { label: "Vencidos",         valor: vencidos.length, color: "#A32D2D" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: s.color }}
            />
            <p className="font-serif text-4xl font-bold text-[#5A0F24]">
              {s.valor}
            </p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
          <h2 className="font-serif text-xl font-semibold text-[#5A0F24]">
            Todos los recordatorios
          </h2>
        </div>
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              {["Usuario", "Título", "Fecha Evento", "Días restantes", "Aviso (días)", "Estado"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {serialized.map((r) => {
              const urgente = r.activo && r.dias_restantes >= 0 && r.dias_restantes <= 7;
              const vencido = r.activo && r.dias_restantes < 0;
              return (
                <tr
                  key={r.id}
                  className={`border-b border-[#8E1B3A]/5 last:border-0 transition-colors ${
                    urgente
                      ? "bg-[#FFF8E1] hover:bg-[#FFF3CD]"
                      : "hover:bg-[#FAF3EC]/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#2A0E18]">{r.usuario}</p>
                    <p className="text-xs text-[#7A5260]">{r.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A0F24] font-semibold">
                    {r.titulo}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#7A5260]">
                    {formatFecha(new Date(r.fecha_evento))}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {vencido ? (
                      <span className="text-[#A32D2D]">
                        Vencido ({Math.abs(r.dias_restantes)}d)
                      </span>
                    ) : (
                      <span className={urgente ? "text-[#E65100]" : "text-[#2D7A47]"}>
                        {r.dias_restantes}d
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-[#7A5260]">
                    {r.dias_aviso}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        r.activo
                          ? "bg-[#EEF8F0] text-[#2D7A47]"
                          : "bg-[#F5F5F5] text-[#7A7A7A]"
                      }`}
                    >
                      {r.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {serialized.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#7A5260]">
                  No hay recordatorios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
