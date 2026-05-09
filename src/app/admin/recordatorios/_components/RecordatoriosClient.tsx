"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface RecordatorioItem {
  id: number;
  titulo: string;
  fecha_evento: string;
  dias_aviso: number;
  descripcion: string | null;
  activo: boolean;
  usuario: string;
  email: string;
  dias_restantes: number;
}

interface Props {
  items: RecordatorioItem[];
}

function formatFecha(isoStr: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(isoStr));
}

type FiltroEstado = "" | "activo" | "inactivo" | "vencido" | "proximo";

export default function RecordatoriosClient({ items }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("");

  const filtrados = items.filter((r) => {
    const q = busqueda.toLowerCase();
    const coincideBusqueda =
      !q ||
      r.usuario.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.titulo.toLowerCase().includes(q);

    const vencido = r.activo && r.dias_restantes < 0;
    const proximo = r.activo && r.dias_restantes >= 0 && r.dias_restantes <= 7;

    const coincideEstado =
      filtroEstado === "" ||
      (filtroEstado === "activo" && r.activo && !vencido) ||
      (filtroEstado === "inactivo" && !r.activo) ||
      (filtroEstado === "vencido" && vencido) ||
      (filtroEstado === "proximo" && proximo);

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10">
      {/* Header + filtros */}
      <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="font-serif text-xl font-semibold text-[#5A0F24] flex-1">
          Todos los recordatorios
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={15} />
            <input
              type="text"
              placeholder="Usuario, email o título…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full sm:w-64 bg-[#FDFBF9] text-sm border border-[#8E1B3A]/10 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
            className="text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2 outline-none text-[#7A5260] bg-[#FDFBF9] cursor-pointer hover:border-[#8E1B3A]/30"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="proximo">Próximos (≤7 días)</option>
            <option value="vencido">Vencidos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="py-12 text-center text-[#7A5260] text-sm italic">
          No se encontraron recordatorios con esa búsqueda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                {["Usuario", "Título", "Fecha Evento", "Días restantes", "Aviso (días)", "Estado"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => {
                const urgente = r.activo && r.dias_restantes >= 0 && r.dias_restantes <= 7;
                const vencido = r.activo && r.dias_restantes < 0;
                return (
                  <tr
                    key={r.id}
                    className={`border-b border-[#8E1B3A]/5 last:border-0 transition-colors ${
                      urgente ? "bg-[#FFF8E1] hover:bg-[#FFF3CD]" : "hover:bg-[#FAF3EC]/50"
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
                      {formatFecha(r.fecha_evento)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">
                      {vencido ? (
                        <span className="text-[#A32D2D]">Vencido ({Math.abs(r.dias_restantes)}d)</span>
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
                      {vencido ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#FBF0F0] text-[#A32D2D]">
                          Vencido
                        </span>
                      ) : urgente ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#FFF3E0] text-[#E65100]">
                          Próximo
                        </span>
                      ) : r.activo ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#EEF8F0] text-[#2D7A47]">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#7A7A7A]">
                          Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-5 py-3 border-t border-[#8E1B3A]/5 text-xs text-[#7A5260]">
        {filtrados.length} de {items.length} recordatorios
      </div>
    </div>
  );
}
