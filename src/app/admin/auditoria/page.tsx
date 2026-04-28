import prisma from "@/lib/prisma";
import AuditoriaClient from "./_components/AuditoriaClient";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [logsDB, logsHoy] = await Promise.all([
    prisma.audit_log.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
    }),
    prisma.audit_log.findMany({
      where: { created_at: { gte: hoy } },
    }),
  ]);

  // Métricas usando actor_tipo real del schema
  const accionesHoy       = logsHoy.length;
  const accionesAdmin     = logsHoy.filter((l) => l.actor_tipo === "admin").length;
  const accionesProveedor = logsHoy.filter((l) => l.actor_tipo === "proveedor").length;
  const accionesUsuario   = logsHoy.filter((l) => l.actor_tipo === "usuario").length;

  // Serializar para el client component
  const logs = logsDB.map((l) => ({
    id:         l.id.toString(),
    actor_id:   l.actor_id ?? null,
    actor_tipo: l.actor_tipo ?? "sistema",
    accion:     l.accion,
    ip_address: l.ip_address ?? null,
    created_at: l.created_at.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Reportes &amp; Sistema
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Log de auditoría
          </h1>
        </div>
        <button className="bg-[#8E1B3A] text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity self-start sm:self-auto">
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Acciones hoy",      valor: accionesHoy,       color: "#8E1B3A" },
          { label: "Por administrador", valor: accionesAdmin,     color: "#AB3A50" },
          { label: "Por proveedores",   valor: accionesProveedor, color: "#BC9968" },
          { label: "Por usuarios",      valor: accionesUsuario,   color: "#5C3A2E" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: s.color }}
            />
            <p className="font-serif text-2xl sm:text-4xl font-bold text-[#5A0F24]">
              {s.valor}
            </p>
            <p className="text-xs sm:text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Client: filtros + tabla */}
      <AuditoriaClient logs={logs} />
    </div>
  );
}