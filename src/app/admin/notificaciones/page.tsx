import prisma from "@/lib/prisma";
import NotificacionesClient from "./_components/NotificacionesClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const POR_PAGINA = 30;

export default async function NotificacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina = Math.max(1, parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [totalCount, notifsDB, totalHoy, noLeidas, usuarios] = await Promise.all([
    prisma.notificaciones.count(),
    prisma.notificaciones.findMany({
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: { usuarios: { select: { nombre: true, apellido: true } } },
    }),
    prisma.notificaciones.count({ where: { created_at: { gte: hoy } } }),
    prisma.notificaciones.count({ where: { leida: false } }),
    prisma.usuarios.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, apellido: true },
    }),
  ]);

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
    id: u.id, nombre: u.nombre, apellido: u.apellido,
  }));

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Comunicación</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Notificaciones</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Aquí puedes enviar y gestionar notificaciones push y alertas para los usuarios y empresas, informando sobre novedades o actualizaciones del sistema.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total registradas", valor: totalCount, color: "#8E1B3A" },
          { label: "Enviadas hoy",      valor: totalHoy,   color: "#BC9968" },
          { label: "No leídas",         valor: noLeidas,   color: "#A32D2D" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <NotificacionesClient notifs={notifs} usuarios={usuariosSerial} />

      <Suspense>
        <Paginacion
          paginaActual={pagina}
          totalPaginas={totalPaginas}
          totalItems={totalCount}
          porPagina={POR_PAGINA}
        />
      </Suspense>
    </div>
  );
}
