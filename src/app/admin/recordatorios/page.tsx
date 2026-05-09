import prisma from "@/lib/prisma";
import RecordatoriosClient from "./_components/RecordatoriosClient";

export const dynamic = "force-dynamic";

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
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          En esta sección puedes configurar recordatorios automáticos para fechas importantes, seguimientos de pedidos o renovaciones de suscripciones.
        </p>
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

      <RecordatoriosClient items={serialized} />
    </div>
  );
}
