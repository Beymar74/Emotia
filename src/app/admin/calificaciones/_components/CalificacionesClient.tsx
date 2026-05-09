"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

interface ReseñaItem {
  id:          number;
  producto:    string;
  proveedor:   string;
  cliente:     string;
  calificacion: number | null;
  resena:      string | null;
  fecha:       string;
}

interface Props {
  items:                  ReseñaItem[];
  busquedaInicial:        string;
  filtroEstrellasInicial: number;
  filtroEmpresaInicial:   number;
  empresas:               { id: number; nombre_negocio: string }[];
  totalCount:             number;
}

export default function CalificacionesClient({ items, busquedaInicial, filtroEstrellasInicial, filtroEmpresaInicial, empresas, totalCount }: Props) {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const actualizarFiltro = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value); else params.delete(key);
      params.set("pagina", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <>
      {/* Barra de filtros */}
      <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#5A0F24]">Últimas reseñas</h2>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {totalCount} en total
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Buscar producto o cliente…"
            defaultValue={busquedaInicial}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as any).__calBusq);
              (window as any).__calBusq = setTimeout(() => actualizarFiltro("q", v), 400);
            }}
            className="flex-1 text-sm border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18] bg-white"
          />
          <select
            defaultValue={filtroEmpresaInicial || ""}
            onChange={(e) => actualizarFiltro("empresa", e.target.value)}
            className="text-xs font-semibold border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none text-[#7A5260] bg-white cursor-pointer hover:border-[#8E1B3A]/30 w-full sm:w-auto"
          >
            <option value="">Todas las empresas</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.nombre_negocio}</option>
            ))}
          </select>
          <select
            defaultValue={filtroEstrellasInicial || ""}
            onChange={(e) => actualizarFiltro("estrellas", e.target.value)}
            className="text-xs font-semibold border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none text-[#7A5260] bg-white cursor-pointer hover:border-[#8E1B3A]/30 w-full sm:w-auto"
          >
            <option value="">Todas las estrellas</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} ★</option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-[#7A5260] text-sm italic">
          No hay reseñas que coincidan con los filtros.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {["Producto", "Cliente", "Cal.", "Reseña", "Fecha"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {items.map((d) => (
                <tr key={d.id} className="hover:bg-[#FDFBF9] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-[#2A0E18] max-w-[140px] truncate">{d.producto}</p>
                    <p className="text-[10px] text-[#7A5260] truncate max-w-[140px]">{d.proveedor}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-[#2A0E18] max-w-[110px] truncate">{d.cliente}</p>
                  </td>
                  <td className="px-5 py-3">
                    {d.calificacion !== null ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[#5A0F24]">{d.calificacion}</span>
                        <span className="text-[#BC9968] text-sm">★</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#B0B0B0] italic">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 max-w-[200px]">
                    {d.resena ? (
                      <p className="text-xs text-[#5A0F24] line-clamp-2">{d.resena}</p>
                    ) : (
                      <span className="text-xs text-[#B0B0B0] italic">Sin comentario</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-[#7A5260]">{d.fecha}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de carga mientras se aplican los filtros en calificaciones */}
      {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[#8E1B3A]/10 p-6 flex flex-col items-center gap-4 min-w-[250px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
            <div className="text-center">
              <p className="font-serif text-lg font-bold text-[#5A0F24]">Aplicando filtros...</p>
              <p className="text-sm text-[#7A5260] mt-1">Cargando reseñas</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
