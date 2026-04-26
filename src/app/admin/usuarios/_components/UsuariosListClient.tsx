"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import BotonesAccion from "./BotonesAccion";

type Plan = "premium" | "basico";

const estadoPill: Record<string, string> = {
  activo: "bg-[#EEF8F0] text-[#2D7A47] border border-[#2D7A47]/10",
  inactivo: "bg-[#F1EFE8] text-[#5F5E5A] border border-[#5F5E5A]/10",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D] border border-[#A32D2D]/10",
};

const planPill: Record<Plan, string> = {
  premium: "bg-[#BC9968]/15 text-[#5C3A2E] border border-[#BC9968]/20",
  basico: "bg-[#8E1B3A]/8 text-[#8E1B3A] border border-[#8E1B3A]/10",
};

interface UsuariosListClientProps {
  usuarios: any[];
}

export default function UsuariosListClient({ usuarios }: UsuariosListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterPlan, setFilterPlan] = useState("Todos");

  // --- LÓGICA DE FILTRADO ---
  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      u.nombre.toLowerCase().includes(term) || 
      (u.apellido?.toLowerCase() || "").includes(term) ||
      u.email.toLowerCase().includes(term) ||
      String(u.id).includes(term);

    const matchesTipo = filterTipo === "Todos" || u.tipo === filterTipo.toLowerCase();
    const matchesPlan = filterPlan === "Todos" || u.plan === filterPlan.toLowerCase();

    return matchesSearch && matchesTipo && matchesPlan;
  });

  const getAvatar = (nombre: string, apellido?: string | null) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const second = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${first}${second}`;
  };

  const formatFecha = (fechaRaw: any) => {
    const fecha = new Date(fechaRaw);
    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'America/La_Paz',
    }).format(fecha);
  };

  return (
    <div className="space-y-7">
      {/* Barra de Filtros Interactiva */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="Todos">Todos los Tipos</option>
            <option value="Usuario">Usuario</option>
            <option value="Admin">Admin</option>
          </select>
          <select 
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]"
          >
            <option value="Todos">Todos los Planes</option>
            <option value="Premium">Premium</option>
            <option value="Basico">Básico</option>
          </select>
          <div className="bg-white p-2.5 border border-[#8E1B3A]/10 rounded-xl text-[#BC9968] flex items-center justify-center">
            <Filter size={18} />
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Listado Maestro de Cuentas</h3>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {usuariosFiltrados.length} Resultados encontrados
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
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A5260] text-sm italic">
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => {
                  const estadoActual = u.activo ? "activo" : "suspendido";
                  const esGoogle = u.google_id !== null;
                  const esAdmin = u.tipo === "admin";

                  return (
                    <tr key={u.id} className="hover:bg-[#FDFBF9] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white shadow-sm group-hover:scale-110 transition-transform">
                            {getAvatar(u.nombre, u.apellido)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2A0E18]">{u.nombre} {u.apellido}</p>
                            <p className="text-xs text-[#7A5260]/70 truncate max-w-[150px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${esAdmin ? "bg-[#5A0F24] text-white" : "bg-[#E6F1FB] text-[#185FA5]"}`}>
                            {u.tipo}
                          </span>
                          {!esAdmin && (
                            <span className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${planPill[(u.plan || 'basico') as Plan]}`}>
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
                          <p className="text-[10px] text-[#B0B0B0]">
                            {formatFecha(u.updated_at)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#5A0F24]">{u.tipo === 'admin' ? "—" : u._count?.pedidos || 0}</span>
                          {u.tipo !== 'admin' && <span className="text-[10px] text-[#7A5260] uppercase tracking-tighter">órdenes</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${estadoPill[estadoActual as any]}`}>
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
