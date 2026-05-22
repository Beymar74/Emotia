"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface ProductoVendido {
  nombre: string;
  monto: number;
  cantidad: number;
  categoria: string;
  empresa: string;
}

interface EmpresaVenta {
  nombre: string;
  monto: number;
  pct: number;
  items: number;
}

interface VentasTablaProps {
  productos: ProductoVendido[];
  empresas: EmpresaVenta[];
  isEmpresaFiltrada: boolean;
}

export default function VentasTabla({ productos, empresas, isEmpresaFiltrada }: VentasTablaProps) {
  const [activeTab, setActiveTab] = useState<"productos" | "empresas">(
    isEmpresaFiltrada ? "productos" : "productos"
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("monto");
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

  const filteredAndSortedProductos = useMemo(() => {
    let result = [...productos];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.empresa.toLowerCase().includes(q)
      );
    }
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
  }, [productos, search, sortField, sortDirection]);

  const filteredAndSortedEmpresas = useMemo(() => {
    let result = [...empresas];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.nombre.toLowerCase().includes(q));
    }
    result.sort((a: any, b: any) => {
      const valA = a[sortField === "categoria" || sortField === "empresa" ? "nombre" : sortField === "cantidad" ? "items" : sortField];
      const valB = b[sortField === "categoria" || sortField === "empresa" ? "nombre" : sortField === "cantidad" ? "items" : sortField];
      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
    return result;
  }, [empresas, search, sortField, sortDirection]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  const currentData = activeTab === "productos" ? filteredAndSortedProductos : filteredAndSortedEmpresas;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = currentData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Desglose de Ventas</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Consulta la lista completa sin límites</p>
        </div>

        {/* Tab Selector */}
        {!isEmpresaFiltrada && (
          <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 self-start sm:self-center">
            <button
              onClick={() => {
                setActiveTab("productos");
                setPage(1);
                setSearch("");
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === "productos"
                  ? "bg-[#8E1B3A] text-white shadow-sm"
                  : "text-[#7A5260] hover:text-[#5A0F24]"
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => {
                setActiveTab("empresas");
                setPage(1);
                setSearch("");
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === "empresas"
                  ? "bg-[#8E1B3A] text-white shadow-sm"
                  : "text-[#7A5260] hover:text-[#5A0F24]"
              }`}
            >
              Empresas
            </button>
          </div>
        )}
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
          placeholder={
            activeTab === "productos"
              ? "Buscar por producto, categoría, empresa..."
              : "Buscar por nombre de negocio..."
          }
          className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
        />
      </div>

      {/* Grid or Table */}
      <div className="overflow-x-auto min-h-[250px]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm">
            No se encontraron resultados para tu búsqueda.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#8E1B3A]/10">
                {activeTab === "productos" ? (
                  <>
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
                    {!isEmpresaFiltrada && (
                      <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                        <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("empresa")}>
                          Empresa <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("cantidad")}>
                        Unidades <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("monto")}>
                        Total Ventas <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleSort("nombre")}>
                        Empresa <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("items")}>
                        Ítems Despachados <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("monto")}>
                        Ventas Totales <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleSort("pct")}>
                        % Participación <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row: any, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors"
                >
                  {activeTab === "productos" ? (
                    <>
                      <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{row.nombre}</td>
                      <td className="px-3 py-3 text-sm text-[#7A5260]">{row.categoria}</td>
                      {!isEmpresaFiltrada && <td className="px-3 py-3 text-sm text-[#7A5260]">{row.empresa}</td>}
                      <td className="px-3 py-3 text-sm text-[#2A0E18] text-right font-medium">
                        {row.cantidad}
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                        {formatBs(row.monto)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{row.nombre}</td>
                      <td className="px-3 py-3 text-sm text-[#7A5260] text-right">{row.items}</td>
                      <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24] text-right">
                        {formatBs(row.monto)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-xs font-bold text-[#8E1B3A] bg-[#8E1B3A]/10 px-2 py-0.5 rounded">
                          {row.pct}%
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
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
