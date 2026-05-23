"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, Store, Mail, Phone, MapPin, Users2 } from "lucide-react";
import BotonesAccionProveedor from "./BotonesAccionProveedor";
import BotonesAccionEmpresa from "@/app/admin/empresas/_components/BotonesAccionEmpresa";

const estadoPill: Record<string, string> = {
  aprobado: "bg-[#EEF8F0] text-[#2D7A47] border border-[#2D7A47]/10",
  pendiente: "bg-[#FFF6E8] text-[#8C5E08] border border-[#BC9968]/20",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D] border border-[#A32D2D]/10",
};

interface Props {
  proveedores: any[];
  busquedaInicial: string;
  filtroEstadoInicial: string;
  filtroCategoriaInicial: string;
  categorias: string[];
  tipoVista?: "empresas" | "representantes";
}

export default function ProveedoresListClient({
  proveedores,
  busquedaInicial,
  filtroEstadoInicial,
  filtroCategoriaInicial,
  categorias,
  tipoVista = "representantes",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const actualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const getInicial = (nombre: string) => (nombre ? nombre.charAt(0).toUpperCase() : "?");

  const formatMoney = (value: any) => `Bs. ${Number(value || 0).toFixed(2)}`;

  const isEmpresas = tipoVista === "empresas";

  const headers = isEmpresas
    ? ["Empresa", "Contacto & Dirección", "Total Ventas", "Estado", "Acciones"]
    : ["Representante", "Empresa Vinculada", "Estado", "Acciones"];

  return (
    <div className="space-y-7">
      {/* Barra de filtros */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={18} />
          <input
            type="text"
            placeholder={
              isEmpresas
                ? "Buscar por empresa, email, dirección..."
                : "Buscar por representante, empresa, email o teléfono..."
            }
            defaultValue={busquedaInicial}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as any).__provBusq);
              (window as any).__provBusq = setTimeout(() => actualizarFiltro("q", v), 400);
            }}
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            defaultValue={filtroEstadoInicial}
            onChange={(e) => actualizarFiltro("estado", e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="">Todos los estados</option>
            <option value="aprobado">Aprobado</option>
            {!isEmpresas && <option value="pendiente">Pendiente</option>}
            <option value="suspendido">Suspendido</option>
          </select>

          {!isEmpresas && categorias.length > 0 && (
            <select
              defaultValue={filtroCategoriaInicial}
              onChange={(e) => actualizarFiltro("categoria", e.target.value)}
              className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          )}

          <div className="bg-white p-2.5 border border-[#8E1B3A]/10 rounded-xl text-[#BC9968] flex items-center justify-center">
            <Filter size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">
            {isEmpresas ? "Directorio de Empresas" : "Directorio de Representantes"}
          </h3>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {proveedores.length} {isEmpresas ? "empresas" : "representantes"} en esta página
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#8E1B3A]/5">
              {proveedores.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-[#FAF3EC] rounded-full flex items-center justify-center text-[#BC9968]">
                        {isEmpresas ? <Store size={32} /> : <Users2 size={32} />}
                      </div>
                      <p className="text-sm font-medium text-[#7A5260]">
                        No se encontraron {isEmpresas ? "empresas" : "representantes"}
                      </p>
                      <p className="text-xs text-[#7A5260]/70">
                        Intenta ajustar los filtros de búsqueda o cambiar de pestaña.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : !isEmpresas ? (
                /* ── VISTA REPRESENTANTES ── */
                proveedores.map((p) => {
                  const estadoActual = p.estado || "pendiente";
                  return (
                    <tr key={p.id} className="hover:bg-[#FDFBF9] transition-colors group">
                      {/* Representante */}
                      <td className="px-6 py-4 min-w-[240px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#2A0E18]">
                            {p.rep_nombre || "Sin representante"}
                          </span>
                          <span className="text-[10px] text-[#7A5260]/70 flex items-center gap-1">
                            <Mail size={10} className="text-[#BC9968]" />
                            {p.rep_email || "Sin email"}
                          </span>
                          <span className="text-[10px] text-[#B0B0B0] flex items-center gap-1">
                            <Phone size={10} className="text-[#BC9968]" />
                            {p.rep_telefono || "Sin teléfono"}
                          </span>
                          {p.rep_anio_nacimiento && (
                            <span className="text-[10px] text-[#B0B0B0]">
                              Año nac.: {p.rep_anio_nacimiento}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Empresa Vinculada */}
                      <td className="px-6 py-4 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            {p.logo_url ? (
                              <img src={p.logo_url} alt={p.nombre_negocio} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#2D5C7A] flex items-center justify-center text-[10px] font-bold text-white">
                                {getInicial(p.nombre_negocio)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#2A0E18]">{p.nombre_negocio}</p>
                            <p className="text-[10px] text-[#7A5260]/65 truncate max-w-[160px]">{p.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${estadoPill[estadoActual] || estadoPill.pendiente}`}>
                          {estadoActual}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 min-w-[220px]">
                        <BotonesAccionProveedor proveedor={p} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* ── VISTA EMPRESAS ── */
                proveedores.map((p) => {
                  const estadoActual = p.estado || "pendiente";
                  return (
                    <tr key={p.id} className="hover:bg-[#FDFBF9] transition-colors group">
                      {/* Empresa */}
                      <td className="px-6 py-4 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                            {p.logo_url ? (
                              <img src={p.logo_url} alt={p.nombre_negocio} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white">
                                {getInicial(p.nombre_negocio)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2A0E18]">{p.nombre_negocio}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contacto & Dirección */}
                      <td className="px-6 py-4 min-w-[240px]">
                        <div className="flex flex-col gap-1 text-[11px] text-[#7A5260]">
                          <p className="font-semibold text-[#2A0E18] flex items-center gap-1">
                            <Mail size={11} className="text-[#BC9968] flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{p.email}</span>
                          </p>
                          {p.telefono && (
                            <p className="flex items-center gap-1">
                              <Phone size={11} className="text-[#BC9968] flex-shrink-0" />
                              {p.telefono}
                            </p>
                          )}
                          <p className="flex items-start gap-1 mt-0.5">
                            <MapPin size={11} className="text-[#BC9968] mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{p.direccion || "Sin dirección física"}</span>
                          </p>
                        </div>
                      </td>

                      {/* Total Ventas */}
                      <td className="px-6 py-4 min-w-[180px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#5A0F24]">{formatMoney(p.total_vendido)}</span>
                          <span className="text-[10px] text-[#7A5260]">
                            {p._count?.detalle_pedidos || 0} pedidos facturados
                          </span>
                          <span className="text-[10px] text-[#B0B0B0]">
                            Rating: {Number(p.calificacion_prom || 0).toFixed(1)} / 5.0
                          </span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${estadoPill[estadoActual] || estadoPill.pendiente}`}>
                          {estadoActual}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 min-w-[260px]">
                        <BotonesAccionEmpresa empresa={p} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
