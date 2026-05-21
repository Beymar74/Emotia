"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface BuyerRow {
  nombre: string;
  email: string;
  pedidos: number;
  total: number;
}

interface UserRow {
  id: number;
  nombre: string | null;
  email: string;
  activo: boolean;
  created_at: Date;
}

interface UsuariosReporteTablasProps {
  compradores: BuyerRow[];
  usuarios: UserRow[];
}

export default function UsuariosReporteTablas({ compradores, usuarios }: UsuariosReporteTablasProps) {
  const [activeTab, setActiveTab] = useState<"compradores" | "usuarios">("compradores");

  return (
    <div className="space-y-4">
      {/* Tabs Selector */}
      <div className="flex border-b border-[#8E1B3A]/10">
        <button
          onClick={() => setActiveTab("compradores")}
          className={`px-4 py-2.5 font-serif text-sm font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === "compradores"
              ? "border-[#8E1B3A] text-[#5A0F24]"
              : "border-transparent text-[#7A5260] hover:text-[#5A0F24]"
          }`}
        >
          Compradores ({compradores.length})
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`px-4 py-2.5 font-serif text-sm font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === "usuarios"
              ? "border-[#8E1B3A] text-[#5A0F24]"
              : "border-transparent text-[#7A5260] hover:text-[#5A0F24]"
          }`}
        >
          Usuarios Registrados ({usuarios.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "compradores" ? (
        <TopCompradoresTabla compradores={compradores} />
      ) : (
        <UsuariosRegistradosTabla usuarios={usuarios} />
      )}
    </div>
  );
}

function TopCompradoresTabla({ compradores }: { compradores: BuyerRow[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"total" | "pedidos">("total");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const handleSort = (field: "total" | "pedidos") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...compradores];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [compradores, search, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
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
          placeholder="Buscar comprador por nombre o email..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron compradores.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-16">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Comprador
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Email
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-28">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto font-medium" onClick={() => handleSort("pedidos")}>
                    Pedidos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto font-medium" onClick={() => handleSort("total")}>
                    Gasto Total <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  Ticket Promedio
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((c, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                return (
                  <tr
                    key={c.email}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold flex items-center justify-center">
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
                    <td className="px-3 py-3 text-sm text-center text-[#2A0E18] font-bold">{c.pedidos}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">{formatBs(c.total)}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {formatBs(c.pedidos > 0 ? c.total / c.pedidos : 0)}
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

function UsuariosRegistradosTabla({ usuarios }: { usuarios: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "inactivos">("todos");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...usuarios];

    // Status Filter
    if (statusFilter === "activos") {
      result = result.filter((u) => u.activo);
    } else if (statusFilter === "inactivos") {
      result = result.filter((u) => !u.activo);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.nombre && u.nombre.toLowerCase().includes(q)) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Sort by registration date
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [usuarios, search, statusFilter, sortDirection]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
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
            placeholder="Buscar usuario por nombre o email..."
            className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 self-start sm:self-center gap-1">
          {[
            { key: "todos", label: "Todos" },
            { key: "activos", label: "Activos" },
            { key: "inactivos", label: "Inactivos" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setStatusFilter(opt.key as any);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === opt.key
                  ? "bg-[#8E1B3A] text-white shadow-sm"
                  : "text-[#7A5260] hover:text-[#5A0F24]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron usuarios registrados.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Usuario
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Email
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-28">
                  Estado
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-48">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto font-medium" onClick={toggleSort}>
                    Fecha de Registro <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((u) => {
                return (
                  <tr
                    key={u.id}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0 border border-[#8E1B3A]/10">
                          {(u.nombre?.[0] || "U").toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[#2A0E18]">{u.nombre || "—"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{u.email}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          u.activo
                            ? "bg-[#EEF8F0] text-[#2D7A47]"
                            : "bg-[#FBF0F0] text-[#A32D2D]"
                        }`}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {new Intl.DateTimeFormat("es-BO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(u.created_at))}
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
