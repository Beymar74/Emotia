import prisma from "@/lib/prisma";
import Link from "next/link";

const TIPO_LABEL: Record<string, string> = {
  admin:    "Admin",
  sistema:  "Sistema",
  usuario:  "Usuario",
};

const TIPO_COLOR: Record<string, string> = {
  admin:   "#8E1B3A",
  sistema: "#BC9968",
  usuario: "#5C3A2E",
};

function getTiempoTranscurrido(fecha: Date) {
  const seg = Math.floor((Date.now() - fecha.getTime()) / 1000);
  if (seg < 60) return "Hace un momento";
  const min = Math.floor(seg / 60);
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} día${Math.floor(h / 24) > 1 ? "s" : ""}`;
}

export default async function ActividadReciente() {
  const logs = await prisma.audit_log.findMany({
    take: 4,
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">
          Actividad reciente
        </h3>
        <Link href="/admin/auditoria" className="text-xs text-[#BC9968] hover:underline">
          Ver todo →
        </Link>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-[#7A5260] py-4 text-center">No hay actividad reciente.</p>
      ) : (
        <div className="divide-y divide-[#8E1B3A]/6">
          {logs.map((log) => {
            const tipo = log.actor_tipo ?? "sistema";
            const color = TIPO_COLOR[tipo] ?? "#BC9968";
            const label = TIPO_LABEL[tipo] ?? tipo;
            const logId = `#${String(log.id).padStart(4, "0")}`;

            return (
              <div key={log.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: color }}
                />
                <div>
                  <p className="text-sm text-[#2A0E18] leading-snug">
                    <span className="font-medium">{label}</span>
                    {log.actor_id ? ` #${log.actor_id}` : ""} — {log.accion}
                  </p>
                  <p className="text-xs text-[#7A5260] mt-1">
                    {getTiempoTranscurrido(log.created_at)} · log {logId}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}