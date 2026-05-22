"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw, User, Building2, UserCheck } from "lucide-react";

type CuentaUnificada = {
  id: string;
  nombre: string;
  tipo: "Usuario" | "Representante" | "Empresa";
  email: string;
  estado: string;
  created_at: string; // ISO String
  foto?: string | null;
};

interface CentroCuentasTablaProps {
  cuentas: CuentaUnificada[];
}

export default function CentroCuentasTabla({ cuentas }: CentroCuentasTablaProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<"Todos" | "Usuario" | "Representante" | "Empresa">("Todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("Todos");
  const [sortBy, setSortBy] = useState<"recent" | "old" | "name_asc" | "name_desc">("recent");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20); // default 20 per page

  // Filter states
  const uniqueEstados = useMemo(() => {
    const states = new Set<string>();
    cuentas.forEach((c) => {
      if (c.estado) {
        states.add(c.estado.toLowerCase());
      }
    });
    return Array.from(states);
  }, [cuentas]);

  // Clean Filters
  const handleReset = () => {
    setSearchTerm("");
    setTipoFilter("Todos");
    setEstadoFilter("Todos");
    setSortBy("recent");
    setCurrentPage(1);
  };

  // Filtered and Sorted accounts
  const processedCuentas = useMemo(() => {
    let result = [...cuentas];

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (tipoFilter !== "Todos") {
      result = result.filter((c) => c.tipo === tipoFilter);
    }

    // Status filter
    if (estadoFilter !== "Todos") {
      result = result.filter((c) => c.estado.toLowerCase() === estadoFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "old") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "name_asc") {
        return a.nombre.localeCompare(b.nombre);
      }
      if (sortBy === "name_desc") {
        return b.nombre.localeCompare(a.nombre);
      }
      return 0;
    });

    return result;
  }, [cuentas, searchTerm, tipoFilter, estadoFilter, sortBy]);

  // Pagination Logic
  const totalItems = processedCuentas.length;
  const totalPages = pageSize === -1 ? 1 : Math.ceil(totalItems / pageSize);
  
  // Safe page adjustment
  const activePage = Math.min(currentPage, totalPages || 1);

  const paginatedCuentas = useMemo(() => {
    if (pageSize === -1) return processedCuentas;
    const startIndex = (activePage - 1) * pageSize;
    return processedCuentas.slice(startIndex, startIndex + pageSize);
  }, [processedCuentas, activePage, pageSize]);

  // Pagination helpers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 space-y-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24]">Todas las Cuentas del Ecosistema</h3>
          <p className="text-xs text-[#7A5260] mt-0.5">
            Listado completo y filtros interactivos de cuentas activas en la plataforma.
          </p>
        </div>

        {/* Cuentas Totales / Filtradas Quick badge */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#7A5260] self-start lg:self-auto bg-[#FAF3EC] px-3 py-1.5 rounded-lg border border-[#BC9968]/20">
          <span>Total: <strong>{cuentas.length}</strong></span>
          <span className="text-[#BC9968]/30">|</span>
          <span>Filtradas: <strong className="text-[#8E1B3A]">{totalItems}</strong></span>
        </div>
      </div>

      {/* Filtros Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-[#FAF3EC]/30 p-3 rounded-lg border border-[#8E1B3A]/5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#7A5260]/60" />
          <input
            type="text"
            placeholder="Buscar nombre, correo..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#BC9968]/30 focus:outline-none focus:ring-1 focus:ring-[#8E1B3A] focus:border-[#8E1B3A] bg-white text-[#2A0E18]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Tipo */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5260] whitespace-nowrap">Tipo:</label>
          <select
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#BC9968]/30 bg-white text-[#2A0E18] focus:outline-none focus:ring-1 focus:ring-[#8E1B3A]"
            value={tipoFilter}
            onChange={(e) => {
              setTipoFilter(e.target.value as "Todos" | "Usuario" | "Representante" | "Empresa");
              setCurrentPage(1);
            }}
          >
            <option value="Todos">Todos</option>
            <option value="Usuario">Usuario (Cliente)</option>
            <option value="Empresa">Empresa (Negocio)</option>
            <option value="Representante">Representante</option>
          </select>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5260] whitespace-nowrap">Estado:</label>
          <select
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#BC9968]/30 bg-white text-[#2A0E18] focus:outline-none focus:ring-1 focus:ring-[#8E1B3A]"
            value={estadoFilter}
            onChange={(e) => {
              setEstadoFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Todos">Todos</option>
            {uniqueEstados.map((state) => (
              <option key={state} value={state}>
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Orden */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5260] whitespace-nowrap">Orden:</label>
          <select
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#BC9968]/30 bg-white text-[#2A0E18] focus:outline-none focus:ring-1 focus:ring-[#8E1B3A]"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "recent" | "old" | "name_asc" | "name_desc");
              setCurrentPage(1);
            }}
          >
            <option value="recent">Más recientes</option>
            <option value="old">Más antiguos</option>
            <option value="name_asc">Nombre A-Z</option>
            <option value="name_desc">Nombre Z-A</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8E1B3A] bg-[#8E1B3A]/5 hover:bg-[#8E1B3A]/10 rounded-lg transition-colors border border-[#8E1B3A]/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Limpiar filtros</span>
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-[#8E1B3A]/5 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAF3EC]/50">
              <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-[#7A5260] font-semibold border-b border-[#8E1B3A]/10">
                Nombre / Negocio
              </th>
              <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-[#7A5260] font-semibold border-b border-[#8E1B3A]/10 w-32">
                Tipo
              </th>
              <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-[#7A5260] font-semibold border-b border-[#8E1B3A]/10">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-[#7A5260] font-semibold border-b border-[#8E1B3A]/10 w-32">
                Estado
              </th>
              <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-[#7A5260] font-semibold border-b border-[#8E1B3A]/10 w-44">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8E1B3A]/5">
            {paginatedCuentas.length > 0 ? (
              paginatedCuentas.map((c) => {
                let estadoColor = "bg-[#EEF8F0] text-[#2D7A47]";
                const estLower = c.estado?.toLowerCase() || "";
                if (estLower === "pendiente") {
                  estadoColor = "bg-[#BC9968]/15 text-[#8B6A3E]";
                } else if (
                  estLower === "suspendido" || 
                  estLower === "inactivo" || 
                  estLower === "rechazado"
                ) {
                  estadoColor = "bg-[#FBF0F0] text-[#A32D2D]";
                }

                let badgeColor = "bg-[#8E1B3A]/10 text-[#8E1B3A]";
                let IconComponent = User;
                if (c.tipo === "Empresa") {
                  badgeColor = "bg-[#185FA5]/10 text-[#185FA5]";
                  IconComponent = Building2;
                } else if (c.tipo === "Representante") {
                  badgeColor = "bg-[#BC9968]/15 text-[#8B6A3E]";
                  IconComponent = UserCheck;
                }

                return (
                  <tr key={c.id} className="hover:bg-[#FAF3EC]/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#2A0E18] min-w-[200px]">
                      <div className="flex items-center gap-3">
                        {c.foto ? (
                          <img
                            src={c.foto}
                            alt={c.nombre}
                            className="h-8 w-8 rounded-full object-cover border border-[#BC9968]/20 bg-white flex-shrink-0"
                            onError={(e) => {
                              const img = e.currentTarget;
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
                          style={c.foto ? { display: "none" } : undefined}
                        >
                          {c.nombre ? c.nombre.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase() : "??"}
                        </div>
                        <span className="truncate">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${badgeColor}`}>
                        <IconComponent className="h-2.5 w-2.5" />
                        {c.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7A5260] break-all">
                      {c.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${estadoColor}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7A5260]">
                      {new Intl.DateTimeFormat("es-BO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(c.created_at))}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm text-[#7A5260] bg-[#FAF3EC]/10">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">🔍</span>
                    <p className="font-medium text-[#5A0F24]">No se encontraron cuentas</p>
                    <p className="text-xs text-[#BC9968]">Intenta ajustar los criterios de búsqueda o limpiar los filtros.</p>
                    <button
                      onClick={handleReset}
                      className="mt-2 text-xs font-semibold text-[#8E1B3A] hover:underline"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#8E1B3A]/5">
          {/* Page size select */}
          <div className="flex items-center gap-2 text-xs text-[#7A5260]">
            <span>Mostrar</span>
            <select
              className="px-2 py-1 rounded border border-[#BC9968]/30 bg-white text-[#2A0E18] focus:outline-none"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>Todos</option>
            </select>
            <span>cuentas por página</span>
          </div>

          {/* Current range info */}
          <span className="text-xs text-[#7A5260]">
            Mostrando {totalItems === 0 ? 0 : (activePage - 1) * (pageSize === -1 ? 0 : pageSize) + 1} -{" "}
            {pageSize === -1 ? totalItems : Math.min(activePage * pageSize, totalItems)} de{" "}
            <strong>{totalItems}</strong> cuentas
          </span>

          {/* Navigation buttons */}
          {pageSize !== -1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className="p-1.5 rounded-lg border border-[#BC9968]/20 bg-white hover:bg-[#FAF3EC] text-[#7A5260] disabled:opacity-40 disabled:hover:bg-white transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1.5 mx-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around the active page
                  let pageNum = i + 1;
                  if (activePage > 3 && totalPages > 5) {
                    if (activePage + 2 > totalPages) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = activePage - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                        activePage === pageNum
                          ? "bg-[#8E1B3A] text-white shadow-sm shadow-[#8E1B3A]/30"
                          : "border border-[#BC9968]/10 hover:bg-[#FAF3EC] text-[#7A5260]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                className="p-1.5 rounded-lg border border-[#BC9968]/20 bg-white hover:bg-[#FAF3EC] text-[#7A5260] disabled:opacity-40 disabled:hover:bg-white transition-colors"
                title="Siguiente página"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
