"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface ClienteRow {
  nombre: string;
  email: string;
  pedidos: number;
  total: number;
}

interface ClientesReporteTablaProps {
  clientes: ClienteRow[];
}

export default function ClientesReporteTabla({ clientes }: ClientesReporteTablaProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"todos" | "con-compras" | "sin-compras">("todos");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("total");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...clientes];

    // Filter by type
    if (filterType === "con-compras") {
      result = result.filter((c) => c.pedidos > 0);
    } else if (filterType === "sin-compras") {
      result = result.filter((c) => c.pedidos === 0);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // Sorting logic
    result.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle ticket average sorting
      if (sortField === "ticketPromedio") {
        valA = a.pedidos > 0 ? a.total / a.pedidos : 0;
        valB = b.pedidos > 0 ? b.total / b.pedidos : 0;
      }

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [clientes, search, filterType, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Detalle de Clientes</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Listado completo de clientes sin excepciones</p>
        </div>

        {/* Filter options */}
        <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 self-start sm:self-center">
          {(
            [
              { key: "todos", label: "Todos" },
              { key: "con-compras", label: "Con compras" },
              { key: "sin-compras", label: "Sin compras" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setFilterType(opt.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterType === opt.key
                  ? "bg-[#8E1B3A] text-white shadow-sm"
                  : "text-[#7A5260] hover:text-[#5A0F24]"
              }`}
            >
              {opt.label}
            </button>
          ))}
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
          placeholder="Buscar por cliente o email..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron clientes para tu búsqueda.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-12">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("nombre")}>
                    Cliente <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("email")}>
                    Email <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleSort("pedidos")}>
                    Pedidos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("total")}>
                    Total Gastado <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("ticketPromedio")}>
                    Ticket Promedio <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((c, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                const ticketProm = c.pedidos > 0 ? c.total / c.pedidos : 0;
                return (
                  <tr
                    key={c.email}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8E1B3A]/80 to-[#BC9968]/80 text-white text-xs font-bold flex items-center justify-center">
                        {rank}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0 border border-[#8E1B3A]/10">
                          {(c.nombre?.[0] || "C").toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[#2A0E18]">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{c.email}</td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18] text-center font-semibold">
                      {c.pedidos}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                      {formatBs(c.total)}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {formatBs(ticketProm)}
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
