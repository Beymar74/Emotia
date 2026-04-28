import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function LogAuditoria() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [accionesHoy, ultimoLog, totalLogs] = await Promise.all([
    prisma.audit_log.count({ where: { created_at: { gte: hoy } } }),
    prisma.audit_log.findFirst({ orderBy: { created_at: "desc" } }),
    prisma.audit_log.count(),
  ]);

  const stats = [
    { label: "Acciones hoy",          valor: String(accionesHoy) },
    { label: "Último log registrado", valor: ultimoLog ? `#${String(ultimoLog.id).padStart(4, "0")}` : "—" },
    { label: "Total registros",       valor: String(totalLogs) },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">
          Log de auditoría
        </h3>
        <Link
          href="/admin/auditoria"
          className="text-xs text-[#BC9968] hover:underline"
        >
          Ver todo →
        </Link>
      </div>
      <div className="divide-y divide-[#8E1B3A]/6">
        {stats.map((l) => (
          <div key={l.label} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-[#7A5260]">{l.label}</span>
            <span className="text-sm font-semibold text-[#5A0F24]">{l.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
