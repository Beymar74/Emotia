"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface RepresentativeRow {
  id: number;
  nombre_negocio: string;
  rep_nombre: string | null;
  email: string;
  estado: string;
  total_vendido: any; // Decimal type from Prisma
  created_at: Date;
  logo_url?: string | null;
  _count: {
    productos: number;
    detalle_pedidos: number;
  };
}

interface RepresentantesTablaProps {
  representantes: RepresentativeRow[];
}

export default function RepresentantesTabla({ representantes }: RepresentantesTablaProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("total_vendido");
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
    let result = [...representantes];

    // Filter by Status
    if (statusFilter !== "todos") {
      result = result.filter((r) => r.estado === statusFilter);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.rep_nombre && r.rep_nombre.toLowerCase().includes(q)) ||
          r.nombre_negocio.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }

    // Sorting logic
    result.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "total_vendido") {
        valA = Number(a.total_vendido || 0);
        valB = Number(b.total_vendido || 0);
      } else if (sortField === "productos") {
        valA = a._count.productos;
        valB = b._count.productos;
      } else if (sortField === "pedidos") {
        valA = a._count.detalle_pedidos;
        valB = b._count.detalle_pedidos;
      } else if (sortField === "created_at") {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      }

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [representantes, search, statusFilter, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Detalle de Representantes</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Listado completo con rendimiento de ventas y catálogo</p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 gap-1">
          {[
            { key: "todos", label: "Todos" },
            { key: "aprobado", label: "Aprobados" },
            { key: "pendiente", label: "Pendientes" },
            { key: "suspendido", label: "Suspendidos" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setStatusFilter(opt.key);
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
          placeholder="Buscar por representante, empresa o email..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron representantes.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-12">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Representante / Empresa
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  Email
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-28">
                  Estado
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("total_vendido")}>
                    Ventas <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-28">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleSort("productos")}>
                    Productos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleSort("pedidos")}>
                    Pedidos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-32">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("created_at")}>
                    Registro <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                const statusColor =
                  p.estado === "aprobado"
                    ? "bg-[#EEF8F0] text-[#2D7A47]"
                    : p.estado === "pendiente"
                    ? "bg-[#FFF8EC] text-[#8C5E08]"
                    : "bg-[#FBF0F0] text-[#A32D2D]";
                return (
                  <tr
                    key={p.id}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-xs text-[#7A5260] font-bold">{rank}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {p.logo_url ? (
                          <img
                            src={p.logo_url}
                            alt={p.nombre_negocio}
                            className="w-8 h-8 rounded-full object-cover border border-[#BC9968]/20 bg-white flex-shrink-0"
                            onError={(evt) => {
                              const img = evt.currentTarget;
                              img.style.display = "none";
                              const fallback = img.nextElementSibling;
                              if (fallback) {
                                (fallback as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={p.logo_url ? { display: "none" } : undefined}
                        >
                          {((p.rep_nombre || p.nombre_negocio)?.[0] || "R").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#2A0E18] text-sm">{p.rep_nombre || "—"}</div>
                          <div className="text-[10px] text-[#7A5260]">{p.nombre_negocio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{p.email}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                      {formatBs(Number(p.total_vendido || 0))}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-center font-medium">
                      {p._count.productos}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-center">
                      {p._count.detalle_pedidos}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {new Intl.DateTimeFormat("es-BO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(p.created_at))}
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
