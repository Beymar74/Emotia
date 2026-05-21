"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Star } from "lucide-react";

interface ProductoCalificado {
  nombre: string;
  categoria: string;
  promedio: number;
  total: number;
}

interface ResenaDetalle {
  id: number;
  producto: string;
  categoria: string;
  cliente: string;
  calificacion: number;
  resena: string;
  fecha: Date;
}

interface CalidadTablasProps {
  productos: ProductoCalificado[];
  resenas: ResenaDetalle[];
}

export default function CalidadTablas({ productos, resenas }: CalidadTablasProps) {
  const [activeTab, setActiveTab] = useState<"productos" | "resenas">("resenas");
  
  // Products table states
  const [prodSearch, setProdSearch] = useState("");
  const [prodPage, setProdPage] = useState(1);
  const [prodSortField, setProdSortField] = useState<string>("promedio");
  const [prodSortDirection, setProdSortDirection] = useState<"asc" | "desc">("desc");
  
  // Reviews table states
  const [resSearch, setResSearch] = useState("");
  const [resRatingFilter, setResRatingFilter] = useState<number | "todos">("todos");
  const [resPage, setResPage] = useState(1);
  const [resSortDirection, setResSortDirection] = useState<"asc" | "desc">("desc");

  const pageSize = 10;

  const handleProdSort = (field: string) => {
    if (prodSortField === field) {
      setProdSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setProdSortField(field);
      setProdSortDirection("desc");
    }
    setProdPage(1);
  };

  const filteredAndSortedProductos = useMemo(() => {
    let result = [...productos];
    if (prodSearch.trim()) {
      const q = prodSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
      );
    }
    result.sort((a: any, b: any) => {
      const valA = a[prodSortField];
      const valB = b[prodSortField];
      if (typeof valA === "string") {
        return prodSortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return prodSortDirection === "asc" ? valA - valB : valB - valA;
    });
    return result;
  }, [productos, prodSearch, prodSortField, prodSortDirection]);

  const filteredAndSortedResenas = useMemo(() => {
    let result = [...resenas];
    
    // Filter by stars
    if (resRatingFilter !== "todos") {
      result = result.filter((r) => Math.round(r.calificacion) === resRatingFilter);
    }

    // Search query
    if (resSearch.trim()) {
      const q = resSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.producto.toLowerCase().includes(q) ||
          r.cliente.toLowerCase().includes(q) ||
          r.resena.toLowerCase().includes(q) ||
          r.categoria.toLowerCase().includes(q)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const timeA = new Date(a.fecha).getTime();
      const timeB = new Date(b.fecha).getTime();
      return resSortDirection === "asc" ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [resenas, resSearch, resRatingFilter, resSortDirection]);

  const formatFecha = (d: Date) =>
    new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));

  const totalProdItems = filteredAndSortedProductos.length;
  const totalProdPages = Math.ceil(totalProdItems / pageSize) || 1;
  const paginatedProductos = filteredAndSortedProductos.slice(
    (prodPage - 1) * pageSize,
    prodPage * pageSize
  );

  const totalResItems = filteredAndSortedResenas.length;
  const totalResPages = Math.ceil(totalResItems / pageSize) || 1;
  const paginatedResenas = filteredAndSortedResenas.slice(
    (resPage - 1) * pageSize,
    resPage * pageSize
  );

  const starColor = (avg: number) => (avg >= 4 ? "text-[#2D7A47]" : avg >= 3 ? "text-[#8C5E08]" : "text-[#A32D2D]");

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Historial de Calidad</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">Explora todas las reseñas e índices de satisfacción de productos</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 self-start sm:self-center">
          <button
            onClick={() => {
              setActiveTab("resenas");
              setResPage(1);
              setResSearch("");
              setResRatingFilter("todos");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "resenas"
                ? "bg-[#8E1B3A] text-white shadow-sm"
                : "text-[#7A5260] hover:text-[#5A0F24]"
            }`}
          >
            Reseñas Recibidas ({resenas.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("productos");
              setProdPage(1);
              setProdSearch("");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "productos"
                ? "bg-[#8E1B3A] text-white shadow-sm"
                : "text-[#7A5260] hover:text-[#5A0F24]"
            }`}
          >
            Calificación por Producto ({productos.length})
          </button>
        </div>
      </div>

      {activeTab === "resenas" ? (
        // RESEÑAS DETALLADAS TAB
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-[#BC9968]" />
              </span>
              <input
                type="text"
                value={resSearch}
                onChange={(e) => {
                  setResSearch(e.target.value);
                  setResPage(1);
                }}
                placeholder="Buscar por producto, cliente, comentario..."
                className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
              />
            </div>

            {/* Rating Star Filter */}
            <div className="flex bg-[#FAF3EC] p-1 rounded-lg border border-[#8E1B3A]/5 items-center self-start">
              <span className="text-[10px] text-[#7A5260] font-bold px-2">Estrellas:</span>
              {(["todos", 5, 4, 3, 2, 1] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setResRatingFilter(r);
                    setResPage(1);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    resRatingFilter === r
                      ? "bg-[#8E1B3A] text-white"
                      : "text-[#7A5260] hover:text-[#5A0F24]"
                  }`}
                >
                  {r === "todos" ? "Todas" : `${r}★`}
                </button>
              ))}
            </div>

            {/* Date Sorting */}
            <button
              onClick={() => {
                setResSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                setResPage(1);
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#8E1B3A]/10 rounded-lg text-xs font-bold bg-[#FAF3EC]/40 text-[#7A5260] hover:text-[#5A0F24] self-start"
            >
              Fecha <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {paginatedResenas.length === 0 ? (
              <div className="py-12 text-center text-[#7A5260] text-sm">
                No se encontraron reseñas con los filtros seleccionados.
              </div>
            ) : (
              paginatedResenas.map((r) => (
                <div key={r.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#2A0E18]">{r.producto}</p>
                        <span className="text-[10px] bg-[#FAF3EC] text-[#7A5260] px-2 py-0.5 rounded border border-[#8E1B3A]/5">
                          {r.categoria}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A5260] mt-0.5">
                        por <span className="font-medium text-[#2A0E18]">{r.cliente}</span> · {formatFecha(r.fecha)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 self-start sm:self-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5"
                          fill={s <= Math.round(r.calificacion) ? "#BC9968" : "none"}
                          stroke={s <= Math.round(r.calificacion) ? "#BC9968" : "#E5E7EB"}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#5A0F24] ml-1">
                        {r.calificacion.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {r.resena ? (
                    <p className="text-sm text-[#7A5260] leading-relaxed italic bg-[#FAF3EC]/30 p-2.5 rounded-lg border border-[#8E1B3A]/5">
                      &ldquo;{r.resena}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-[#7A5260]/40 leading-relaxed italic">
                      Sin comentario adjunto.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalResPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#8E1B3A]/10 mt-4 pt-4">
              <p className="text-xs text-[#7A5260]">
                Mostrando <span className="font-semibold">{(resPage - 1) * pageSize + 1}</span> a{" "}
                <span className="font-semibold">{Math.min(resPage * pageSize, totalResItems)}</span> de{" "}
                <span className="font-semibold">{totalResItems}</span> reseñas
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setResPage((p) => Math.max(p - 1, 1))}
                  disabled={resPage === 1}
                  className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#2A0E18] flex items-center px-1">
                  Página {resPage} de {totalResPages}
                </span>
                <button
                  onClick={() => setResPage((p) => Math.min(p + 1, totalResPages))}
                  disabled={resPage === totalResPages}
                  className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // PRODUCTOS CALIFICADOS TAB
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-[#BC9968]" />
            </span>
            <input
              type="text"
              value={prodSearch}
              onChange={(e) => {
                setProdSearch(e.target.value);
                setProdPage(1);
              }}
              placeholder="Buscar por nombre de producto o categoría..."
              className="w-full pl-10 pr-4 py-2 border border-[#8E1B3A]/10 rounded-lg text-sm bg-[#FAF3EC]/30 text-[#2A0E18] placeholder-[#7A5260]/60 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {paginatedProductos.length === 0 ? (
              <div className="py-12 text-center text-[#7A5260] text-sm">
                No se encontraron productos calificados.
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#8E1B3A]/10">
                    <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-12">
                      #
                    </th>
                    <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleProdSort("nombre")}>
                        Producto <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24]" onClick={() => handleProdSort("categoria")}>
                        Categoría <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-center px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] mx-auto" onClick={() => handleProdSort("total")}>
                        Total Reseñas <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium w-36">
                      <button className="flex items-center gap-1 hover:text-[#5A0F24] ml-auto" onClick={() => handleProdSort("promedio")}>
                        Calificación Promedio <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProductos.map((p, i) => {
                    const rank = (prodPage - 1) * pageSize + i + 1;
                    return (
                      <tr key={p.nombre} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/40 transition-colors">
                        <td className="px-3 py-3 text-xs text-[#7A5260] font-bold">{rank}</td>
                        <td className="px-3 py-3 text-sm font-semibold text-[#2A0E18]">{p.nombre}</td>
                        <td className="px-3 py-3 text-sm text-[#7A5260]">{p.categoria}</td>
                        <td className="px-3 py-3 text-sm text-center text-[#2A0E18] font-medium">{p.total}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`text-sm font-bold ${starColor(p.promedio)}`}>
                              {p.promedio.toFixed(2)}
                            </span>
                            <span className={`${starColor(p.promedio)}`}>★</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalProdPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#8E1B3A]/10 mt-4 pt-4">
              <p className="text-xs text-[#7A5260]">
                Mostrando <span className="font-semibold">{(prodPage - 1) * pageSize + 1}</span> a{" "}
                <span className="font-semibold">{Math.min(prodPage * pageSize, totalProdItems)}</span> de{" "}
                <span className="font-semibold">{totalProdItems}</span> productos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setProdPage((p) => Math.max(p - 1, 1))}
                  disabled={prodPage === 1}
                  className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#2A0E18] flex items-center px-1">
                  Página {prodPage} de {totalProdPages}
                </span>
                <button
                  onClick={() => setProdPage((p) => Math.min(p + 1, totalProdPages))}
                  disabled={prodPage === totalProdPages}
                  className="p-1.5 rounded-lg border border-[#8E1B3A]/10 hover:bg-[#FAF3EC] disabled:opacity-40 disabled:hover:bg-transparent text-[#7A5260] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
