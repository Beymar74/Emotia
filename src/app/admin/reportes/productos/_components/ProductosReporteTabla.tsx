"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface ProductoRow {
  id: number;
  nombre: string;
  categoria: string;
  empresa: string;
  precio: number;
  unidades: number;
  ingresos: number;
  activo: boolean;
}

interface ProductosReporteTablaProps {
  productos: ProductoRow[];
}

export default function ProductosReporteTabla({ productos }: ProductosReporteTablaProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "inactivos">("todos");
  const [salesFilter, setSalesFilter] = useState<"todos" | "con-ventas" | "sin-ventas">("todos");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("ingresos");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  // Extract unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set(productos.map((p) => p.categoria));
    return ["todas", ...Array.from(cats)].filter(Boolean);
  }, [productos]);

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
    let result = [...productos];

    // Filter by Category
    if (categoryFilter !== "todas") {
      result = result.filter((p) => p.categoria === categoryFilter);
    }

    // Filter by Status
    if (statusFilter === "activos") {
      result = result.filter((p) => p.activo);
    } else if (statusFilter === "inactivos") {
      result = result.filter((p) => !p.activo);
    }

    // Filter by Sales Status
    if (salesFilter === "con-ventas") {
      result = result.filter((p) => p.unidades > 0);
    } else if (salesFilter === "sin-ventas") {
      result = result.filter((p) => p.unidades === 0);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.empresa.toLowerCase().includes(q)
      );
    }

    // Sorting logic
    result.sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [productos, search, categoryFilter, statusFilter, salesFilter, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Catálogo de Productos</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Métricas de stock y ventas de todos los productos</p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-[#8E1B3A]/10 rounded-lg px-2.5 py-1.5 bg-[#FAF3EC] text-[#2A0E18] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E1B3A]"
          >
            <option value="todas">Categorías: Todas</option>
            {uniqueCategories.filter(c => c !== "todas").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5">
            {(
              [
                { key: "todos", label: "Estado: Todos" },
                { key: "activos", label: "Activos" },
                { key: "inactivos", label: "Inactivos" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setStatusFilter(opt.key);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  statusFilter === opt.key
                    ? "bg-[#8E1B3A] text-white shadow-sm"
                    : "text-[#7A5260] hover:text-[#5A0F24]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sales status buttons */}
          <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5">
            {(
              [
                { key: "todos", label: "Ventas: Todos" },
                { key: "con-ventas", label: "Con Ventas" },
                { key: "sin-ventas", label: "Sin Ventas" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setSalesFilter(opt.key);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  salesFilter === opt.key
                    ? "bg-[#8E1B3A] text-white shadow-sm"
                    : "text-[#7A5260] hover:text-[#5A0F24]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
          placeholder="Buscar producto, categoría o representante de empresa..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron productos con los filtros seleccionados.
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
                    Producto <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("categoria")}>
                    Categoría <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("empresa")}>
                    Empresa <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("precio")}>
                    Precio <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  Estado
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-24">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("unidades")}>
                    Vendidos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("ingresos")}>
                    Ingresos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-xs text-[#7A5260] font-bold">{rank}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#2A0E18] text-sm">{p.nombre}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-[#7A5260] font-medium">{p.categoria}</td>
                    <td className="px-3 py-3 text-xs text-[#7A5260]">{p.empresa}</td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18] text-right font-medium">
                      {formatBs(p.precio)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.activo
                            ? "bg-[#2D7A47]/10 text-[#2D7A47]"
                            : "bg-[#A32D2D]/10 text-[#A32D2D]"
                        }`}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18] text-right font-semibold">
                      {p.unidades}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                      {formatBs(p.ingresos)}
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
