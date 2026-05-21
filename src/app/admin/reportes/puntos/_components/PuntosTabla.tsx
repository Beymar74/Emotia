"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface UserPointsRow {
  nombre: string | null;
  email: string;
  puntos: number | null;
}

interface PuntosTablaProps {
  usuarios: UserPointsRow[];
}

export default function PuntosTabla({ usuarios }: PuntosTablaProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const filteredAndSorted = useMemo(() => {
    let result = [...usuarios];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.nombre && u.nombre.toLowerCase().includes(q)) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Sort by points
    result.sort((a, b) => {
      const ptsA = a.puntos || 0;
      const ptsB = b.puntos || 0;
      return sortDirection === "asc" ? ptsA - ptsB : ptsB - ptsA;
    });

    return result;
  }, [usuarios, search, sortDirection]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Ranking de Puntos por Usuario</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Listado completo de clientes ordenados por puntos acumulados</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-[#BC9968]" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron usuarios.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-16">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Usuario
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Email
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-40">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto font-medium" onClick={toggleSort}>
                    Puntos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((u, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                return (
                  <tr
                    key={u.email}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: rank === 1 ? "#BC9968" : rank === 2 ? "#8E1B3A" : "#FAF3EC",
                          color: rank < 3 ? "white" : "#5A0F24",
                        }}
                      >
                        {rank}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#BC9968] text-xs font-bold flex-shrink-0 border border-[#8E1B3A]/10">
                          {(u.nombre?.[0] || "U").toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[#2A0E18]">{u.nombre || "—"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{u.email}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#BC9968]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z" />
                        </svg>
                        {(u.puntos || 0).toLocaleString()} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#8E1B3A]/10 mt-4 pt-4">
          <p className="text-xs text-[#7A5260]">
            Mostrando <span className="font-semibold">{(page - 1) * pageSize + 1}</span> a{" "}
            <span className="font-semibold">{Math.min(page * pageSize, totalItems)}</span> de{" "}
            <span className="font-semibold">{totalItems}</span> registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-[#2A0E18] flex items-center px-1">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
