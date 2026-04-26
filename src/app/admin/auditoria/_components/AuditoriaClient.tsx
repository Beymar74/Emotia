"use client";

import { useState, useMemo } from "react";

const tipoBadge: Record<string, string> = {
  admin:     "bg-[#8E1B3A]/10 text-[#8E1B3A]",
  proveedor: "bg-[#BC9968]/15 text-[#5C3A2E]",
  usuario:   "bg-[#E6F1FB] text-[#185FA5]",
  sistema:   "bg-[#F1EFE8] text-[#5F5E5A]",
};

type LogEntry = {
  id: string;
  actor_id: number | null;
  actor_tipo: string;
  accion: string;
  ip_address: string | null;
  created_at: string;
};

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    timeZone: "America/La_Paz",
  }).format(new Date(iso));
}
function formatHora(iso: string) {
  return new Intl.DateTimeFormat("es-BO", {
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/La_Paz",
  }).format(new Date(iso));
}

export default function AuditoriaClient({ logs }: { logs: LogEntry[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const filtrados = useMemo(() => {
    return logs.filter((l) => {
      const matchBusqueda =
        busqueda === "" ||
        l.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
        (l.actor_id?.toString() ?? "").includes(busqueda) ||
        (l.ip_address ?? "").includes(busqueda);

      const matchTipo =
        tipoFiltro === "todos" || l.actor_tipo === tipoFiltro;

      const matchFecha =
        fechaFiltro === "" ||
        l.created_at.startsWith(fechaFiltro);

      return matchBusqueda && matchTipo && matchFecha;
    });
  }, [logs, busqueda, tipoFiltro, fechaFiltro]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Buscar por acción, actor ID o IP..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18] placeholder:text-[#B0B0B0]"
        />
        <div className="flex gap-2 sm:gap-3">
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="flex-1 sm:flex-none text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none text-[#7A5260]"
          >
            <option value="todos">Todos los actores</option>
            <option value="admin">Administrador</option>
            <option value="proveedor">Proveedor</option>
            <option value="usuario">Usuario</option>
            <option value="sistema">Sistema</option>
          </select>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="flex-1 sm:flex-none text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none text-[#7A5260]"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24]">
            Registro de acciones
          </h3>
          <span className="text-xs text-[#7A5260]">
            {filtrados.length} registro{filtrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtrados.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-10">
            No hay registros que coincidan con los filtros.
          </p>
        ) : (
          <table className="w-full border-collapse min-w-[750px]">
            <thead>
              <tr>
                {["Log ID", "Actor ID", "Tipo", "Acción", "IP", "Fecha", "Hora"].map((h) => (
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
              {filtrados.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors"
                >
                  <td className="px-3 py-3 text-xs font-mono font-bold text-[#5A0F24]">
                    #{l.id.padStart(4, "0")}
                  </td>
                  <td className="px-3 py-3 text-sm text-[#2A0E18]">
                    {l.actor_id ?? <span className="text-[#B0B0B0]">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        tipoBadge[l.actor_tipo] ?? tipoBadge.sistema
                      }`}
                    >
                      {l.actor_tipo}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260] max-w-xs truncate">
                    {l.accion}
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-[#7A5260]">
                    {l.ip_address ?? <span className="text-[#B0B0B0]">—</span>}
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {formatFecha(l.created_at)}
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {formatHora(l.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
