"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface RecurrenteRow {
  id: number;
  nombre: string;
  email: string;
  pedidos: number;
  total: number;
  entregados: number;
}

interface FidelizacionTablaProps {
  clientes: RecurrenteRow[];
}

export default function FidelizacionTabla({ clientes }: FidelizacionTablaProps) {
  const [search, setSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState<"todos" | "leal" | "frecuente" | "nuevo">("todos");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("pedidos");
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

  const getProfile = (pedidos: number) => {
    if (pedidos >= 5) return "leal";
    if (pedidos >= 2) return "frecuente";
    return "nuevo";
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...clientes];

    // Filter by Profile
    if (profileFilter !== "todos") {
      result = result.filter((c) => getProfile(c.pedidos) === profileFilter);
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
  }, [clientes, search, profileFilter, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Compradores Recurrentes</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Listado completo con segmentación y frecuencia de compras</p>
        </div>

        {/* Profile Filters */}
        <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 self-start sm:self-center">
          {(
            [
              { key: "todos", label: "Todos" },
              { key: "leal", label: "Leal (5+)" },
              { key: "frecuente", label: "Frecuente (2-4)" },
              { key: "nuevo", label: "Nuevo (1)" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setProfileFilter(opt.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                profileFilter === opt.key
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
            No se encontraron compradores recurrentes.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-12">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Cliente
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleSort("pedidos")}>
                    Pedidos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleSort("entregados")}>
                    Entregados <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("total")}>
                    Gasto Total <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("ticketPromedio")}>
                    Ticket Promedio <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  Perfil
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((c, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                const ticket = c.pedidos > 0 ? c.total / c.pedidos : 0;
                const profile = getProfile(c.pedidos);
                const perfilColor =
                  profile === "leal"
                    ? "bg-[#2D7A47]/10 text-[#2D7A47]"
                    : profile === "frecuente"
                    ? "bg-[#BC9968]/10 text-[#8C5E08]"
                    : "bg-[#185FA5]/10 text-[#185FA5]";
                return (
                  <tr
                    key={c.id}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-xs text-[#7A5260] font-bold">{rank}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0 border border-[#8E1B3A]/10">
                          {(c.nombre?.[0] || "C").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#2A0E18] text-sm">{c.nombre}</div>
                          <div className="text-[10px] text-[#7A5260]">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18] text-center font-bold">
                      {c.pedidos}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#2D7A47] text-center font-medium">
                      {c.entregados}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                      {formatBs(c.total)}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {formatBs(ticket)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${perfilColor}`}
                      >
                        {profile === "leal" ? "Leal" : profile === "frecuente" ? "Frecuente" : "Nuevo"}
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
