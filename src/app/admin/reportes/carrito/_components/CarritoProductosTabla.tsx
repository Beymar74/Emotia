"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface CarritoProductoRow {
  nombre: string;
  cantidad: number;
  valor: number;
}

interface CarritoProductosTablaProps {
  productos: CarritoProductoRow[];
}

export default function CarritoProductosTabla({ productos }: CarritoProductosTablaProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("cantidad");
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
    let result = [...productos];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q));
    }

    // Sorting logic
    result.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle unit price calculation sorting
      if (sortField === "precioUnitario") {
        valA = a.cantidad > 0 ? a.valor / a.cantidad : 0;
        valB = b.cantidad > 0 ? b.valor / b.cantidad : 0;
      }

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [productos, search, sortField, sortDirection]);

  const fmtBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Productos en Carrito</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Listado completo de productos agregados a carritos activos</p>
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
          placeholder="Buscar producto..."
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron productos en los carritos.
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
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("cantidad")}>
                    Unidades en carrito <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("valor")}>
                    Valor acumulado <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                  <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("precioUnitario")}>
                    Precio Unitario Prom. <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, i) => {
                const rank = (page - 1) * pageSize + i + 1;
                const unitPrice = p.cantidad > 0 ? p.valor / p.cantidad : 0;
                return (
                  <tr
                    key={p.nombre}
                    className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-xs text-[#7A5260] font-bold">{rank}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#2A0E18] text-sm">{p.nombre}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#5A0F24] text-right font-bold">
                      {p.cantidad}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#8E1B3A] text-right">
                      {fmtBs(p.valor)}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] text-right">
                      {fmtBs(unitPrice)}
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
