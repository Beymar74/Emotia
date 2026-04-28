import prisma from "@/lib/prisma";
import NotificacionesClient from "./_components/NotificacionesClient";

export const dynamic = "force-dynamic";

export default async function NotificacionesPage() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [notifsDB, usuarios] = await Promise.all([
    prisma.notificaciones.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
      include: {
        usuarios: { select: { nombre: true, apellido: true } },
      },
    }),
    prisma.usuarios.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, apellido: true },
    }),
  ]);

  const totalHoy   = notifsDB.filter((n) => n.created_at >= hoy).length;
  const noLeidas   = notifsDB.filter((n) => !n.leida).length;
  const totalTotal = notifsDB.length;

  const notifs = notifsDB.map((n) => ({
    id:             n.id,
    usuario_id:     n.usuario_id,
    usuario_nombre: `${n.usuarios.nombre} ${n.usuarios.apellido ?? ""}`.trim(),
    tipo:           n.tipo,
    titulo:         n.titulo,
    mensaje:        n.mensaje,
    leida:          n.leida,
    created_at:     n.created_at.toISOString(),
  }));

  const usuariosSerial = usuarios.map((u) => ({
    id:       u.id,
    nombre:   u.nombre,
    apellido: u.apellido,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Comunicación
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
          Notificaciones
        </h1>
        <p className="text-sm text-[#7A5260] mt-1">
          Envía y gestiona notificaciones a los usuarios de Emotia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total registradas", valor: totalTotal, color: "#8E1B3A" },
          { label: "Enviadas hoy",      valor: totalHoy,   color: "#BC9968" },
          { label: "No leídas",         valor: noLeidas,   color: "#A32D2D" },
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

      {/* Client interactivo */}
      <NotificacionesClient notifs={notifs} usuarios={usuariosSerial} />
    </div>
  );
}
