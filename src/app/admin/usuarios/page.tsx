export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { ShieldCheck, UserMinus, Star, Globe, Shield } from "lucide-react";
import ModalNuevoUsuario from "@/components/ModalNuevoUsuario";
import UsuariosListClient from "./_components/UsuariosListClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";

const POR_PAGINA = 30;

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina      = Math.max(1, parseInt(typeof sp.pagina  === "string" ? sp.pagina  : "1") || 1);
  const busqueda    = typeof sp.q    === "string" ? sp.q.trim()    : "";
  const filtroTipo  = typeof sp.tipo === "string" ? sp.tipo  : "";
  const filtroPlan  = typeof sp.plan === "string" ? sp.plan  : "";

  const where: any = {};
  if (filtroTipo) where.tipo  = filtroTipo;
  if (filtroPlan) where.plan  = filtroPlan;
  if (busqueda) {
    where.OR = [
      { nombre:   { contains: busqueda, mode: "insensitive" } },
      { apellido: { contains: busqueda, mode: "insensitive" } },
      { email:    { contains: busqueda, mode: "insensitive" } },
    ];
  }

  const [totalCount, usuariosReales, statsGlobal] = await Promise.all([
    prisma.usuarios.count({ where }),
    prisma.usuarios.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: { _count: { select: { pedidos: true } } },
    }),
    // Stats globales (sin filtros)
    prisma.usuarios.aggregate({
      _count: { id: true },
      where: {},
    }),
  ]);

  // Métricas globales siempre desde toda la BD
  const [usuariosPremium, usuariosAdmins, usuariosSuspendidos, accesoGoogle] = await Promise.all([
    prisma.usuarios.count({ where: { plan: "premium" } }),
    prisma.usuarios.count({ where: { tipo: "admin" } }),
    prisma.usuarios.count({ where: { activo: false } }),
    prisma.usuarios.count({ where: { google_id: { not: null } } }),
  ]);

  const totalUsuarios = statsGlobal._count.id;
  const totalPaginas  = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

  return (
    <div className="space-y-7 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-[#BC9968] font-bold mb-1">Sistemas &amp; Accesos</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            En esta sección puedes gestionar a todos los usuarios registrados, revisar sus roles, editar sus datos y controlar su acceso a la plataforma.
          </p>
          <p className="text-xs text-[#7A5260] mt-1">Control total de cuentas, roles y suscripciones premium.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <ModalNuevoUsuario variante="tarjeta" />
        {[
          { label: "Total Cuentas",   valor: totalUsuarios,       color: "#8E1B3A", icon: <ShieldCheck size={14}/> },
          { label: "Administradores", valor: usuariosAdmins,      color: "#5A0F24", icon: <Shield size={14}/> },
          { label: "Cuentas Premium", valor: usuariosPremium,     color: "#BC9968", icon: <Star size={14}/> },
          { label: "Acceso Google",   valor: accesoGoogle,        color: "#5C3A2E", icon: <Globe size={14}/> },
          { label: "Suspendidos",     valor: usuariosSuspendidos, color: "#AB3A50", icon: <UserMinus size={14}/> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#8E1B3A]/5 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">{s.icon}</div>
            <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-bold mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18]">{s.valor}</span>
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <UsuariosListClient
        usuarios={usuariosReales}
        busquedaInicial={busqueda}
        filtroTipoInicial={filtroTipo}
        filtroPlanInicial={filtroPlan}
      />

      <Suspense>
        <Paginacion
          paginaActual={pagina}
          totalPaginas={totalPaginas}
          totalItems={totalCount}
          porPagina={POR_PAGINA}
        />
      </Suspense>
    </div>
  );
}
