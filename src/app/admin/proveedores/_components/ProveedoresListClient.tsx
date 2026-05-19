"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, Store } from "lucide-react";
import BotonesAccionProveedor from "./BotonesAccionProveedor";

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
}

export default function ProveedoresListClient({
  proveedores,
  busquedaInicial,
  filtroEstadoInicial,
  filtroCategoriaInicial,
  categorias,
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

  const getInicial = (nombre: string) =>
    nombre ? nombre.charAt(0).toUpperCase() : "?";

  const formatFecha = (fechaRaw: any) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/La_Paz",
    }).format(new Date(fechaRaw));

  const formatMoney = (value: any) => {
    const numberValue = Number(value || 0);
    return `Bs. ${numberValue.toFixed(2)}`;
  };

  return (
    <div className="space-y-7">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50"
            size={18}
          />

          <input
            type="text"
            placeholder="Buscar por negocio, email, representante o teléfono..."
            defaultValue={busquedaInicial}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as any).__provBusq);
              (window as any).__provBusq = setTimeout(
                () => actualizarFiltro("q", v),
                400
              );
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
            <option value="pendiente">Pendiente</option>
            <option value="suspendido">Suspendido</option>
          </select>

          <select
            defaultValue={filtroCategoriaInicial}
            onChange={(e) => actualizarFiltro("categoria", e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          <div className="bg-white p-2.5 border border-[#8E1B3A]/10 rounded-xl text-[#BC9968] flex items-center justify-center">
            <Filter size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">
            Listado Maestro de Proveedores
          </h3>

          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {proveedores.length} en esta página
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {[
                  "Proveedor",
                  "Representante",
                  "Categorías",
                  "Catálogo",
                  "Rendimiento",
                  "Estado",
                  "Acciones",
                ].map((h) => (
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
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-[#FAF3EC] rounded-full flex items-center justify-center text-[#BC9968]">
                        <Store size={32} />
                      </div>
                      <p className="text-sm font-medium text-[#7A5260]">
                        No se encontraron proveedores
                      </p>
                      <p className="text-xs text-[#7A5260]/70">
                        Intenta ajustar los filtros de búsqueda.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                proveedores.map((p) => {
                  const estadoActual = p.estado || "pendiente";

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FDFBF9] transition-colors group"
                    >
                      <td className="px-6 py-4 min-w-[260px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                            {p.logo_url ? (
                              <img
                                src={p.logo_url}
                                alt={p.nombre_negocio}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white">
                                {getInicial(p.nombre_negocio)}
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#2A0E18]">
                              {p.nombre_negocio}
                            </p>
                            <p className="text-xs text-[#7A5260]/70 truncate max-w-[180px]">
                              {p.email}
                            </p>
                            {p.telefono ? (
                              <p className="text-[10px] text-[#B0B0B0]">
                                {p.telefono}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 min-w-[220px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#2A0E18]">
                            {p.rep_nombre || "Sin representante"}
                          </span>
                          <span className="text-[10px] text-[#7A5260]/70 truncate max-w-[160px]">
                            {p.rep_email || "Sin email"}
                          </span>
                          <span className="text-[10px] text-[#B0B0B0]">
                            {p.rep_telefono || "Sin teléfono"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 min-w-[220px]">
                        <div className="flex flex-wrap gap-1.5">
                          {(p.categorias || []).slice(0, 3).map((categoria: string) => (
                            <span
                              key={categoria}
                              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#BC9968]/15 text-[#5C3A2E] border border-[#BC9968]/20"
                            >
                              {categoria}
                            </span>
                          ))}

                          {(p.categorias || []).length === 0 ? (
                            <span className="text-[10px] text-[#B0B0B0]">
                              Sin categorías
                            </span>
                          ) : null}

                          {(p.categorias || []).length > 3 ? (
                            <span className="text-[10px] text-[#7A5260]">
                              +{p.categorias.length - 3}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#5A0F24]">
                            {p._count?.productos || 0}
                          </span>
                          <span className="text-[10px] text-[#7A5260] uppercase tracking-tighter">
                            productos
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 min-w-[160px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#5A0F24]">
                            {formatMoney(p.total_vendido)}
                          </span>
                          <span className="text-[10px] text-[#7A5260]">
                            {p._count?.detalle_pedidos || 0} ventas · rating{" "}
                            {Number(p.calificacion_prom || 0).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[#B0B0B0]">
                            Alta: {formatFecha(p.created_at)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            estadoPill[estadoActual] || estadoPill.pendiente
                          }`}
                        >
                          {estadoActual}
                        </span>
                      </td>

                      <td className="px-6 py-4 min-w-[220px]">
                        <BotonesAccionProveedor proveedor={p} />
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