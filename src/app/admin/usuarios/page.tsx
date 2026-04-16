export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { usuarios } from "@/generated/prisma/client";
import { Search, Filter, ShieldCheck, UserMinus, Star, Globe, Shield } from "lucide-react";
import ModalNuevoUsuario from "@/components/ModalNuevoUsuario"; 
import BotonesAccion from "./_components/BotonesAccion";

type EstadoUsuario = "activo" | "inactivo" | "suspendido";
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

export default async function UsuariosPage() {
  // --- 1. CONSULTAS A LA BASE DE DATOS ---
  const usuariosReales = await prisma.usuarios.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { pedidos: true } 
      }
    }
  });

  type UsuarioConConteo = usuarios & { _count: { pedidos: number } };

  // --- 2. CÁLCULO DE MÉTRICAS ---
  const totalUsuarios = usuariosReales.length;
  const usuariosPremium = usuariosReales.filter((u: usuarios) => u.plan === 'premium').length;
  const usuariosAdmins = usuariosReales.filter((u: usuarios) => u.tipo === 'admin').length;
  const usuariosSuspendidos = usuariosReales.filter((u: usuarios) => !u.activo).length; 
  const accesoGoogle = usuariosReales.filter((u: usuarios) => u.google_id !== null).length;

  const getAvatar = (nombre: string, apellido?: string | null) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const second = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${first}${second}`;
  };

  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).format(fecha);
  };

  return (
    <div className="space-y-7 p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-[#BC9968] font-bold mb-1">
            Sistemas & Accesos
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Gestión de Usuarios</h1>
          <p className="text-xs text-[#7A5260] mt-1">Control total de cuentas, roles y suscripciones premium.</p>
        </div>
      </div>

      {/* Stats Cards - Cuadrícula de 5 columnas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Componente Modal funcionando como Tarjeta Interactiva */}
        <ModalNuevoUsuario variante="tarjeta" />

        {/* Tarjetas de Métricas */}
        {[
          { label: "Total Cuentas", valor: totalUsuarios, color: "#8E1B3A", icon: <ShieldCheck size={14}/> },
          { label: "Administradores", valor: usuariosAdmins, color: "#5A0F24", icon: <Shield size={14}/> },
          { label: "Cuentas Premium", valor: usuariosPremium, color: "#BC9968", icon: <Star size={14}/> },
          { label: "Acceso Google", valor: accesoGoogle, color: "#5C3A2E", icon: <Globe size={14}/> },
          { label: "Suspendidos", valor: usuariosSuspendidos, color: "#AB3A50", icon: <UserMinus size={14}/> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#8E1B3A]/5 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              {s.icon}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-bold mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18]">{s.valor}</span>
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]">
            <option>Todos los Tipos</option>
            <option>Usuario</option>
            <option>Admin</option>
          </select>
          <select className="bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:bg-[#FDFBF9]">
            <option>Todos los Planes</option>
            <option>Premium</option>
            <option>Básico</option>
          </select>
          <button className="bg-white p-2.5 border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:bg-[#FDFBF9]">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabla Unified */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Listado Maestro de Cuentas</h3>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {totalUsuarios} Registros Activos
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
              {usuariosReales.map((u: UsuarioConConteo) => {
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
                        <span className="text-sm font-bold text-[#5A0F24]">{u.tipo === 'admin' ? "—" : u._count.pedidos}</span>
                        {u.tipo !== 'admin' && <span className="text-[10px] text-[#7A5260] uppercase tracking-tighter">órdenes</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${estadoPill[estadoActual as EstadoUsuario]}`}>
                        {estadoActual}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <BotonesAccion usuario={u} esAdmin={esAdmin} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}