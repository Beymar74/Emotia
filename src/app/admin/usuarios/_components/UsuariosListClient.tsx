"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import BotonesAccion from "./BotonesAccion";

type Plan = "premium" | "basico";

const estadoPill: Record<string, string> = {
  activo:     "bg-[#EEF8F0] text-[#2D7A47] border border-[#2D7A47]/10",
  inactivo:   "bg-[#F1EFE8] text-[#5F5E5A] border border-[#5F5E5A]/10",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D] border border-[#A32D2D]/10",
};

const planPill: Record<Plan, string> = {
  premium: "bg-[#BC9968]/15 text-[#5C3A2E] border border-[#BC9968]/20",
  basico:  "bg-[#8E1B3A]/8 text-[#8E1B3A] border border-[#8E1B3A]/10",
};

interface Props {
  usuarios:            any[];
  busquedaInicial:     string;
  filtroTipoInicial:   string;
  filtroPlanInicial:   string;
}

export default function UsuariosListClient({
  usuarios,
  busquedaInicial,
  filtroTipoInicial,
  filtroPlanInicial,
}: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const actualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const getAvatar = (nombre: string, apellido?: string | null) =>
    `${nombre ? nombre.charAt(0).toUpperCase() : "?"}${apellido ? apellido.charAt(0).toUpperCase() : ""}`;

  const formatFecha = (fechaRaw: any) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false,
      timeZone: "America/La_Paz",
    }).format(new Date(fechaRaw));

  return (
    <div className="space-y-7">
      {/* Barra de Filtros */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            defaultValue={busquedaInicial}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as any).__usBusq);
              (window as any).__usBusq = setTimeout(() => actualizarFiltro("q", v), 400);
            }}
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
          />
        </div>
        <div className="flex gap-2">
          <select
            defaultValue={filtroTipoInicial}
            onChange={(e) => actualizarFiltro("tipo", e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="">Todos los Tipos</option>
            <option value="usuario">Usuario</option>
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>
          <select
            defaultValue={filtroPlanInicial}
            onChange={(e) => actualizarFiltro("plan", e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="">Todos los Planes</option>
            <option value="premium">Premium</option>
            <option value="basico">Básico</option>
          </select>
          <div className="bg-white p-2.5 border border-[#8E1B3A]/10 rounded-xl text-[#BC9968] flex items-center justify-center">
            <Filter size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Listado Maestro de Cuentas</h3>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {usuarios.length} en esta página
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {["Perfil", "Tipo/Plan", "Auth/Acceso", "Pedidos", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-[#FAF3EC] rounded-full flex items-center justify-center text-[#BC9968]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-[#7A5260]">No se encontraron usuarios</p>
                      <p className="text-xs text-[#7A5260]/70">Intenta ajustar los filtros de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => {
                  const estadoActual = u.activo ? "activo" : "suspendido";
                  const esGoogle     = u.google_id !== null;
                  const esAdmin      = u.tipo === "admin";
                  const esOperador   = u.tipo === "operador";

                  return (
                    <tr key={u.id} className="hover:bg-[#FDFBF9] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                            {u.foto_perfil ? (
                              <Image src={u.foto_perfil} alt={`${u.nombre} ${u.apellido}`} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white">
                                {getAvatar(u.nombre, u.apellido)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2A0E18]">{u.nombre} {u.apellido}</p>
                            <p className="text-xs text-[#7A5260]/70 truncate max-w-[150px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            esAdmin ? "bg-[#5A0F24] text-white" : esOperador ? "bg-[#2D5C7A] text-white" : "bg-[#E6F1FB] text-[#185FA5]"
                          }`}>
                            {u.tipo}
                          </span>
                          {!esAdmin && !esOperador && (
                            <span className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${planPill[(u.plan || "basico") as Plan]}`}>
                              {u.plan}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-medium ${esGoogle ? "text-[#2D7A47]" : "text-[#7A5260]"}`}>
                            {esGoogle ? "Google ID" : "Email / Password"}
                          </span>
                          <p className="text-[10px] text-[#B0B0B0]">{formatFecha(u.updated_at)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#5A0F24]">{(esAdmin || esOperador) ? "—" : u._count?.pedidos || 0}</span>
                          {!esAdmin && !esOperador && <span className="text-[10px] text-[#7A5260] uppercase tracking-tighter">órdenes</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${estadoPill[estadoActual]}`}>
                          {estadoActual}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <BotonesAccion usuario={u} esAdmin={esAdmin} />
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
