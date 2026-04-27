"use client";

import { useState, useMemo, useTransition } from "react";
import { enviarNotificacionAction, marcarLeidaAction } from "../actions";

type Notif = {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  leida: boolean;
  created_at: string;
};

type Usuario = { id: number; nombre: string; apellido: string | null };

const TIPOS = ["promocion", "pedido", "sistema", "recordatorio", "otro"];

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/La_Paz",
  }).format(new Date(iso));
}

const tipoBadge: Record<string, string> = {
  promocion:    "bg-[#FFF3E0] text-[#E65100]",
  pedido:       "bg-[#E8F5E9] text-[#1B5E20]",
  sistema:      "bg-[#F3E5F5] text-[#6A1B9A]",
  recordatorio: "bg-[#E3F2FD] text-[#0D47A1]",
  otro:         "bg-[#F5F5F5] text-[#424242]",
};

export default function NotificacionesClient({
  notifs,
  usuarios,
}: {
  notifs: Notif[];
  usuarios: Usuario[];
}) {
  const [lista, setLista] = useState(notifs);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroLeida, setFiltroLeida]  = useState("todas");
  const [filtroTipo, setFiltroTipo]    = useState("todos");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtradas = useMemo(() => {
    return lista.filter((n) => {
      const matchLeida =
        filtroLeida === "todas" ||
        (filtroLeida === "no_leida" && !n.leida) ||
        (filtroLeida === "leida" && n.leida);
      const matchTipo = filtroTipo === "todos" || n.tipo === filtroTipo;
      return matchLeida && matchTipo;
    });
  }, [lista, filtroLeida, filtroTipo]);

  const handleEnviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");
    startTransition(async () => {
      const result = await enviarNotificacionAction(formData);
      if ("error" in result) {
        setError(result.error ?? "No se pudo enviar la notificación.");
      } else {
        setMostrarModal(false);
        window.location.reload();
      }
    });
  };

  const handleMarcarLeida = (id: number) => {
    startTransition(async () => {
      await marcarLeidaAction(id);
      setLista((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          <select
            value={filtroLeida}
            onChange={(e) => setFiltroLeida(e.target.value)}
            className="text-sm border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none text-[#7A5260]"
          >
            <option value="todas">Todas</option>
            <option value="no_leida">No leídas</option>
            <option value="leida">Leídas</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="text-sm border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none text-[#7A5260]"
          >
            <option value="todos">Todos los tipos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setMostrarModal(true); setError(""); }}
          className="bg-[#8E1B3A] text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity"
        >
          + Enviar notificación
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <table className="w-full border-collapse min-w-[750px]">
          <thead>
            <tr>
              {["Usuario", "Tipo", "Título", "Mensaje", "Estado", "Fecha", "Acción"].map(
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
            {filtradas.map((n) => (
              <tr
                key={n.id}
                className={`border-b border-[#8E1B3A]/5 last:border-0 transition-colors ${
                  n.leida ? "hover:bg-[#FAF3EC]/50" : "bg-[#FFFDF8] hover:bg-[#FDF5E0]"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#2A0E18]">
                  {n.usuario_nombre}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      tipoBadge[n.tipo] ?? tipoBadge.otro
                    }`}
                  >
                    {n.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-[#5A0F24]">
                  {n.titulo}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260] max-w-xs truncate">
                  {n.mensaje ?? <span className="italic text-[#B0B0B0]">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      n.leida
                        ? "bg-[#F5F5F5] text-[#7A7A7A]"
                        : "bg-[#FFF3CD] text-[#856404]"
                    }`}
                  >
                    {n.leida ? "Leída" : "No leída"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#7A5260]">
                  {formatFecha(n.created_at)}
                </td>
                <td className="px-4 py-3">
                  {!n.leida ? (
                    <button
                      onClick={() => handleMarcarLeida(n.id)}
                      disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#E8F5E9] text-[#1B5E20] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      Marcar leída
                    </button>
                  ) : (
                    <span className="text-[#B0B0B0] text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#7A5260]">
                  No hay notificaciones con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal enviar notificación */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-serif text-xl font-bold text-[#5A0F24] mb-5">
              Enviar notificación
            </h2>
            <form onSubmit={handleEnviar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Usuario *
                </label>
                <select
                  name="usuario_id"
                  required
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50"
                >
                  <option value="">Seleccionar usuario...</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido ?? ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  required
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Título *
                </label>
                <input
                  name="titulo"
                  required
                  maxLength={200}
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50"
                  placeholder="Ej. Tu pedido está en camino"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  rows={3}
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50 resize-none"
                  placeholder="Detalle opcional..."
                />
              </div>
              {error && (
                <p className="text-xs text-[#A32D2D] bg-[#FBF0F0] px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 border border-[#8E1B3A]/20 text-sm px-4 py-2.5 rounded-lg text-[#7A5260] hover:bg-[#FAF3EC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#8E1B3A] text-white text-sm px-4 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity disabled:opacity-60"
                >
                  {isPending ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
