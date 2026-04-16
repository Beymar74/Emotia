export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { usuarios } from "@/generated/prisma/client";
import { ShieldCheck, UserMinus, Star, Globe, Shield } from "lucide-react";
import ModalNuevoUsuario from "@/components/ModalNuevoUsuario"; 
import UsuariosListClient from "./_components/UsuariosListClient";

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

  // --- 2. CÁLCULO DE MÉTRICAS ---
  const totalUsuarios = usuariosReales.length;
  const usuariosPremium = usuariosReales.filter((u: usuarios) => u.plan === 'premium').length;
  const usuariosAdmins = usuariosReales.filter((u: usuarios) => u.tipo === 'admin').length;
  const usuariosSuspendidos = usuariosReales.filter((u: usuarios) => !u.activo).length; 
  const accesoGoogle = usuariosReales.filter((u: usuarios) => u.google_id !== null).length;

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

      {/* Listado Maestro Interactivo (Client Side Filters) */}
      <UsuariosListClient usuarios={usuariosReales} />
    </div>
  );
}