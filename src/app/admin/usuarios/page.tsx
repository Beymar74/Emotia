export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ShieldCheck,
  UserMinus,
  Star,
  Globe,
  Shield,
  Store,
  CheckCircle2,
  Clock3,
  UserX,
  Package,
  Users2,
  Building2,
  ArrowRight,
} from "lucide-react";
import ModalNuevoUsuario from "@/components/ModalNuevoUsuario";
import ModalNuevoRepresentante from "@/components/ModalNuevoRepresentante";
import UsuariosListClient from "./_components/UsuariosListClient";
import ProveedoresListClient from "../proveedores/_components/ProveedoresListClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";

const POR_PAGINA = 30;

function TabNav({ activo }: { activo: string }) {
  const tabs = [
    { id: "general",        label: "Vista General" },
    { id: "completo",       label: "Todo en Uno" },
    { id: "clientes",       label: "Usuarios" },
    { id: "representantes", label: "Representantes" },
    { id: "empresas",       label: "Empresas" },
  ];
  return (
    <div className="flex flex-wrap gap-1 bg-white rounded-2xl border border-[#8E1B3A]/10 p-1 shadow-sm">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={`?tab=${t.id}`}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            activo === t.id
              ? "bg-[#5A0F24] text-white shadow-sm"
              : "text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#5A0F24]"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function StatCard({
  label,
  valor,
  color,
  icon,
}: {
  label: string;
  valor: string | number;
  color: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#8E1B3A]/5 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-bold leading-tight">{label}</p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <span style={{ color }} className="flex">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-bold text-[#2A0E18]">{valor}</span>
        <div className="h-1 w-5 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

function PageHeader({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5A0F24] to-[#8E1B3A] flex items-center justify-center shadow-lg shadow-[#5A0F24]/25 flex-shrink-0">
          <Users2 size={22} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] tracking-[3px] uppercase text-[#BC9968] font-bold">PREPE</span>
            <span className="w-1 h-1 rounded-full bg-[#BC9968]/40 inline-block" />
            <span className="text-[10px] tracking-[2px] uppercase text-[#BC9968]/60 font-medium">Administración</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18] leading-tight">
            Centro de Cuentas
          </h1>
          <p className="text-sm text-[#7A5260] mt-0.5">Gestión unificada del ecosistema PREPE</p>
        </div>
      </div>
      <div className="sm:mt-1">
        <TabNav activo={tab} />
      </div>
    </div>
  );
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const tab = typeof sp.tab === "string" ? sp.tab : "general";
  const pagina = Math.max(1, parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1);
  const busqueda = typeof sp.q === "string" ? sp.q.trim() : "";

  // ── VISTA GENERAL ─────────────────────────────────────────────────────────
  if (tab === "general") {
    const [
      totalUsuarios,
      usuariosActivos,
      usuariosPremium,
      usuariosSuspendidos,
      totalEmpresas,
      proveedoresAprobados,
      proveedoresSuspendidos,
      totalProveedores,
      proveedoresPendientes,
    ] = await Promise.all([
      prisma.usuarios.count(),
      prisma.usuarios.count({ where: { activo: true } }),
      prisma.usuarios.count({ where: { plan: "premium" } }),
      prisma.usuarios.count({ where: { activo: false } }),
      prisma.proveedores.count({ where: { estado: { in: ["aprobado", "suspendido"] } } }),
      prisma.proveedores.count({ where: { estado: "aprobado" } }),
      prisma.proveedores.count({ where: { estado: "suspendido" } }),
      prisma.proveedores.count(),
      prisma.proveedores.count({ where: { estado: "pendiente" } }),
    ]);

    const totalSistema = totalUsuarios + totalEmpresas + totalProveedores;

    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader tab={tab} />

        {/* Banner resumen del sistema — clickable */}
        <Link
          href="?tab=completo"
          className="bg-gradient-to-br from-[#5A0F24] via-[#7A1535] to-[#8E1B3A] rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-[#5A0F24]/20 relative overflow-hidden block hover:shadow-[#5A0F24]/40 hover:scale-[1.01] transition-all duration-300 cursor-pointer group/banner"
        >
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-[#BC9968]" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white" />
          </div>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#BC9968]/50 animate-pulse" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#F5E6D0]/55 font-bold mb-2">
                Resumen del Sistema
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-serif font-bold tracking-tight">{totalSistema.toLocaleString()}</span>
                <span className="text-base text-[#F5E6D0]/65">entidades registradas</span>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { label: "Usuarios",        valor: totalUsuarios },
                { label: "Empresas",        valor: totalEmpresas },
                { label: "Representantes",  valor: totalProveedores },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-[#F5E6D0]/20" />}
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold">{item.valor}</p>
                    <p className="text-[10px] text-[#F5E6D0]/50 uppercase tracking-widest font-medium mt-0.5">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA inferior */}
          <div className="relative mt-5 pt-4 border-t border-[#F5E6D0]/10 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[2px] text-[#F5E6D0]/35 font-medium">
              Haz clic para ver todo en un solo panel
            </p>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#BC9968] group-hover/banner:text-[#F5E6D0] transition-colors">
              Ver todo en uno
              <ArrowRight size={12} className="group-hover/banner:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Tarjetas de entidades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Usuarios */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/8 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="bg-gradient-to-br from-[#5A0F24] to-[#8E1B3A] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase text-[#F5E6D0]/60 font-medium">Módulo</p>
                  <h3 className="font-serif text-xl font-bold text-white mt-0.5">Usuarios</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Users2 size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">{totalUsuarios}</span>
                <span className="text-sm text-[#F5E6D0]/60">registrados</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-[#EEF8F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#2D7A47]">{usuariosActivos}</p>
                  <p className="text-[9px] text-[#2D7A47]/70 uppercase tracking-wide font-semibold mt-0.5">Activos</p>
                </div>
                <div className="text-center bg-[#BC9968]/10 rounded-xl p-3">
                  <p className="text-xl font-bold text-[#5C3A2E]">{usuariosPremium}</p>
                  <p className="text-[9px] text-[#5C3A2E]/70 uppercase tracking-wide font-semibold mt-0.5">Premium</p>
                </div>
                <div className="text-center bg-[#FBF0F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#A32D2D]">{usuariosSuspendidos}</p>
                  <p className="text-[9px] text-[#A32D2D]/70 uppercase tracking-wide font-semibold mt-0.5">Susp.</p>
                </div>
              </div>
              <Link
                href="?tab=clientes"
                className="flex items-center justify-between w-full px-4 py-2.5 bg-[#FAF3EC] hover:bg-[#5A0F24] text-[#5A0F24] hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
              >
                <span>Gestionar Usuarios</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Empresas */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/8 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="bg-gradient-to-br from-[#1A3A5C] to-[#2D5C7A] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase text-[#F5E6D0]/60 font-medium">Módulo</p>
                  <h3 className="font-serif text-xl font-bold text-white mt-0.5">Empresas</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Building2 size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">{totalEmpresas}</span>
                <span className="text-sm text-[#F5E6D0]/60">registradas</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center bg-[#EEF8F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#2D7A47]">{proveedoresAprobados}</p>
                  <p className="text-[9px] text-[#2D7A47]/70 uppercase tracking-wide font-semibold mt-0.5">Activas</p>
                </div>
                <div className="text-center bg-[#FBF0F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#A32D2D]">{proveedoresSuspendidos}</p>
                  <p className="text-[9px] text-[#A32D2D]/70 uppercase tracking-wide font-semibold mt-0.5">Suspendidas</p>
                </div>
              </div>
              <Link
                href="?tab=empresas"
                className="flex items-center justify-between w-full px-4 py-2.5 bg-[#F0F4F8] hover:bg-[#1A3A5C] text-[#1A3A5C] hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
              >
                <span>Gestionar Empresas</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Representantes */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/8 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="bg-gradient-to-br from-[#5C3A2E] to-[#8B5E3C] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase text-[#F5E6D0]/60 font-medium">Módulo</p>
                  <h3 className="font-serif text-xl font-bold text-white mt-0.5">Representantes</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Store size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">{totalProveedores}</span>
                <span className="text-sm text-[#F5E6D0]/60">registrados</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-[#EEF8F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#2D7A47]">{proveedoresAprobados}</p>
                  <p className="text-[9px] text-[#2D7A47]/70 uppercase tracking-wide font-semibold mt-0.5">Aprobados</p>
                </div>
                <div className="text-center bg-[#BC9968]/10 rounded-xl p-3">
                  <p className="text-xl font-bold text-[#8B6A3E]">{proveedoresPendientes}</p>
                  <p className="text-[9px] text-[#8B6A3E]/70 uppercase tracking-wide font-semibold mt-0.5">Pend.</p>
                </div>
                <div className="text-center bg-[#FBF0F0] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#A32D2D]">{proveedoresSuspendidos}</p>
                  <p className="text-[9px] text-[#A32D2D]/70 uppercase tracking-wide font-semibold mt-0.5">Susp.</p>
                </div>
              </div>
              <Link
                href="?tab=representantes"
                className="flex items-center justify-between w-full px-4 py-2.5 bg-[#FAF3EC] hover:bg-[#5C3A2E] text-[#5C3A2E] hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
              >
                <span>Gestionar Representantes</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── TODO EN UNO ───────────────────────────────────────────────────────────
  if (tab === "completo") {
    const [
      totalUsuarios,
      totalEmpresas,
      totalProveedores,
      recentUsuarios,
      recentEmpresas,
      recentProveedores,
    ] = await Promise.all([
      prisma.usuarios.count(),
      prisma.proveedores.count({ where: { estado: { in: ["aprobado", "suspendido"] } } }),
      prisma.proveedores.count(),
      prisma.usuarios.findMany({
        orderBy: { created_at: "desc" },
        take: 8,
        select: {
          id: true, nombre: true, apellido: true, email: true,
          tipo: true, plan: true, activo: true, foto_perfil: true,
        },
      }),
      prisma.proveedores.findMany({
        where: { estado: { in: ["aprobado", "suspendido"] } },
        orderBy: { created_at: "desc" },
        take: 8,
        select: { id: true, nombre_negocio: true, email: true, estado: true, logo_url: true },
      }),
      prisma.proveedores.findMany({
        orderBy: { created_at: "desc" },
        take: 8,
        select: { id: true, nombre_negocio: true, email: true, estado: true, logo_url: true, categorias: true },
      }),
    ]);

    const totalSistema = totalUsuarios + totalEmpresas + totalProveedores;

    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader tab={tab} />

        {/* Barra de totales */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/5 shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5A0F24] animate-pulse" />
            <p className="text-sm font-bold text-[#2A0E18]">
              <span className="font-serif text-lg">{totalSistema}</span>{" "}
              <span className="text-[#7A5260] font-normal text-xs">entidades en el sistema</span>
            </p>
          </div>
          <div className="flex items-center gap-5">
            {[
              { label: "Usuarios",        valor: totalUsuarios,    color: "#5A0F24" },
              { label: "Empresas",        valor: totalEmpresas,    color: "#1A3A5C" },
              { label: "Representantes",  valor: totalProveedores, color: "#5C3A2E" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-6 bg-[#8E1B3A]/10" />}
                <div className="text-center">
                  <p className="font-serif text-xl font-bold" style={{ color: s.color }}>{s.valor}</p>
                  <p className="text-[9px] uppercase tracking-wider text-[#7A5260]/70 font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Usuarios ── */}
        <section className="bg-white rounded-2xl border border-[#8E1B3A]/5 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users2 size={16} className="text-white" />
              <h3 className="font-serif font-bold text-white">Usuarios</h3>
              <span className="text-[10px] bg-white/15 text-[#F5E6D0] px-2.5 py-0.5 rounded-full font-semibold">
                {totalUsuarios} total
              </span>
            </div>
            <Link
              href="?tab=clientes"
              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-widest transition-colors"
            >
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#8E1B3A]/5">
            {recentUsuarios.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-[#7A5260]/60">Sin usuarios registrados</p>
            ) : (
              recentUsuarios.map((u) => {
                const estadoActual = u.activo ? "activo" : "suspendido";
                const initials = `${u.nombre?.charAt(0) ?? "?"}${u.apellido?.charAt(0) ?? ""}`.toUpperCase();
                return (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#FAF3EC]/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {u.foto_perfil ? (
                        <img src={u.foto_perfil} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-[10px] font-bold text-white">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2A0E18] truncate">{u.nombre} {u.apellido}</p>
                      <p className="text-[10px] text-[#7A5260]/65 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                        u.tipo === "admin"
                          ? "bg-[#5A0F24] text-white"
                          : u.tipo === "operador"
                          ? "bg-[#2D5C7A] text-white"
                          : "bg-[#E6F1FB] text-[#185FA5]"
                      }`}>{u.tipo}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                        estadoActual === "activo"
                          ? "bg-[#EEF8F0] text-[#2D7A47]"
                          : "bg-[#FBF0F0] text-[#A32D2D]"
                      }`}>{estadoActual}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── Empresas ── */}
        <section className="bg-white rounded-2xl border border-[#8E1B3A]/5 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#1A3A5C] to-[#2D5C7A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-white" />
              <h3 className="font-serif font-bold text-white">Empresas</h3>
              <span className="text-[10px] bg-white/15 text-[#F5E6D0] px-2.5 py-0.5 rounded-full font-semibold">
                {totalEmpresas} total
              </span>
            </div>
            <Link
              href="?tab=empresas"
              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-widest transition-colors"
            >
              Ver todas <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#8E1B3A]/5">
            {recentEmpresas.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-[#7A5260]/60">Sin empresas registradas</p>
            ) : (
              recentEmpresas.map((e) => {
                const initials = e.nombre_negocio?.slice(0, 2).toUpperCase() ?? "??";
                return (
                  <div key={e.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#FAF3EC]/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {e.logo_url ? (
                        <img src={e.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#2D5C7A] flex items-center justify-center text-[10px] font-bold text-white">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2A0E18] truncate">{e.nombre_negocio}</p>
                      <p className="text-[10px] text-[#7A5260]/65 truncate">{e.email}</p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wide flex-shrink-0 ${
                      e.estado === "aprobado"
                        ? "bg-[#EEF8F0] text-[#2D7A47]"
                        : "bg-[#FBF0F0] text-[#A32D2D]"
                    }`}>{e.estado}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── Representantes ── */}
        <section className="bg-white rounded-2xl border border-[#8E1B3A]/5 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#5C3A2E] to-[#8B5E3C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store size={16} className="text-white" />
              <h3 className="font-serif font-bold text-white">Representantes</h3>
              <span className="text-[10px] bg-white/15 text-[#F5E6D0] px-2.5 py-0.5 rounded-full font-semibold">
                {totalProveedores} total
              </span>
            </div>
            <Link
              href="?tab=representantes"
              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-widest transition-colors"
            >
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#8E1B3A]/5">
            {recentProveedores.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-[#7A5260]/60">Sin representantes registrados</p>
            ) : (
              recentProveedores.map((p) => {
                const initials = p.nombre_negocio?.slice(0, 2).toUpperCase() ?? "??";
                const estadoColor =
                  p.estado === "aprobado"
                    ? "bg-[#EEF8F0] text-[#2D7A47]"
                    : p.estado === "pendiente"
                    ? "bg-[#BC9968]/15 text-[#8B6A3E]"
                    : "bg-[#FBF0F0] text-[#A32D2D]";
                return (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#FAF3EC]/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#5C3A2E] to-[#8B5E3C] flex items-center justify-center text-[10px] font-bold text-white">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2A0E18] truncate">{p.nombre_negocio}</p>
                      <p className="text-[10px] text-[#7A5260]/65 truncate">{p.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {p.categorias?.[0] && (
                        <span className="text-[9px] bg-[#BC9968]/10 text-[#5C3A2E] px-2 py-0.5 rounded font-medium hidden sm:inline">
                          {p.categorias[0]}
                        </span>
                      )}
                      <span className={`text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wide ${estadoColor}`}>
                        {p.estado}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    );
  }

  // ── EMPRESAS ───────────────────────────────────────────────────────────────
  if (tab === "empresas") {
    const filtroEstado = typeof sp.estado === "string" ? sp.estado : "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filtroEstado) {
      where.estado = filtroEstado;
    } else {
      where.estado = { in: ["aprobado", "suspendido"] };
    }
    if (busqueda) {
      where.OR = [
        { nombre_negocio: { contains: busqueda, mode: "insensitive" } },
        { email: { contains: busqueda, mode: "insensitive" } },
        { telefono: { contains: busqueda, mode: "insensitive" } },
        { rep_nombre: { contains: busqueda, mode: "insensitive" } },
      ];
    }

    const [
      totalCount,
      proveedores,
      totalEmpresas,
      empresasActivas,
      empresasSuspendidas,
      totalVendidoGlobal,
      totalProductos,
    ] = await Promise.all([
      prisma.proveedores.count({ where }),
      prisma.proveedores.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (pagina - 1) * POR_PAGINA,
        take: POR_PAGINA,
        select: {
          id: true,
          nombre_negocio: true,
          descripcion: true,
          logo_url: true,
          categorias: true,
          redes_sociales: true,
          email: true,
          telefono: true,
          direccion: true,
          rep_nombre: true,
          rep_telefono: true,
          rep_email: true,
          rep_anio_nacimiento: true,
          estado: true,
          calificacion_prom: true,
          total_vendido: true,
          created_at: true,
          updated_at: true,
          _count: { select: { productos: true, detalle_pedidos: true } },
        },
      }),
      prisma.proveedores.count({ where: { estado: { in: ["aprobado", "suspendido"] } } }),
      prisma.proveedores.count({ where: { estado: "aprobado" } }),
      prisma.proveedores.count({ where: { estado: "suspendido" } }),
      prisma.proveedores.aggregate({ _sum: { total_vendido: true } }),
      prisma.productos.count(),
    ]);

    const proveedoresSerializados = proveedores.map((p) => ({
      ...p,
      calificacion_prom: Number(p.calificacion_prom || 0),
      total_vendido: Number(p.total_vendido || 0),
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    }));

    const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));
    const totalVentasValor = Number(totalVendidoGlobal._sum.total_vendido || 0);

    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader tab={tab} />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Empresas",    valor: totalEmpresas,            color: "#8E1B3A", icon: <Store size={14} /> },
            { label: "Activas",           valor: empresasActivas,          color: "#2D7A47", icon: <CheckCircle2 size={14} /> },
            { label: "Suspendidas",       valor: empresasSuspendidas,      color: "#AB3A50", icon: <UserX size={14} /> },
            { label: "Productos",         valor: totalProductos,           color: "#5C3A2E", icon: <Package size={14} /> },
            { label: "Ventas Global",     valor: `Bs. ${totalVentasValor.toFixed(0)}`, color: "#BC9968", icon: <ShieldCheck size={14} /> },
          ].map((s) => (
            <StatCard key={s.label} label={s.label} valor={s.valor} color={s.color} icon={s.icon} />
          ))}
        </div>

        <ProveedoresListClient
          proveedores={proveedoresSerializados}
          busquedaInicial={busqueda}
          filtroEstadoInicial={filtroEstado}
          filtroCategoriaInicial=""
          categorias={[]}
          tipoVista="empresas"
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

  // ── REPRESENTANTES ────────────────────────────────────────────────────────
  if (tab === "representantes") {
    const filtroEstado   = typeof sp.estado    === "string" ? sp.estado    : "";
    const filtroCategoria = typeof sp.categoria === "string" ? sp.categoria : "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filtroEstado)    where.estado    = filtroEstado;
    if (filtroCategoria) where.categorias = { has: filtroCategoria };
    if (busqueda) {
      where.OR = [
        { nombre_negocio: { contains: busqueda, mode: "insensitive" } },
        { email:          { contains: busqueda, mode: "insensitive" } },
        { telefono:       { contains: busqueda, mode: "insensitive" } },
        { rep_nombre:     { contains: busqueda, mode: "insensitive" } },
      ];
    }

    const [
      totalCount,
      proveedores,
      totalProveedores,
      proveedoresActivos,
      proveedoresPendientes,
      proveedoresSuspendidos,
      totalProductos,
      categoriasRaw,
    ] = await Promise.all([
      prisma.proveedores.count({ where }),
      prisma.proveedores.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (pagina - 1) * POR_PAGINA,
        take: POR_PAGINA,
        select: {
          id: true,
          nombre_negocio: true,
          descripcion: true,
          logo_url: true,
          categorias: true,
          redes_sociales: true,
          email: true,
          telefono: true,
          direccion: true,
          rep_nombre: true,
          rep_telefono: true,
          rep_email: true,
          rep_anio_nacimiento: true,
          estado: true,
          calificacion_prom: true,
          total_vendido: true,
          created_at: true,
          updated_at: true,
          _count: { select: { productos: true, detalle_pedidos: true } },
        },
      }),
      prisma.proveedores.count(),
      prisma.proveedores.count({ where: { estado: "aprobado" } }),
      prisma.proveedores.count({ where: { estado: "pendiente" } }),
      prisma.proveedores.count({ where: { estado: "suspendido" } }),
      prisma.productos.count(),
      prisma.proveedores.findMany({ select: { categorias: true } }),
    ]);

    const proveedoresSerializados = proveedores.map((p) => ({
      ...p,
      calificacion_prom: Number(p.calificacion_prom || 0),
      total_vendido: Number(p.total_vendido || 0),
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    }));

    const categorias = Array.from(
      new Set(categoriasRaw.flatMap((p) => p.categorias || []))
    ).sort((a, b) => a.localeCompare(b));

    const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader tab={tab} />

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <ModalNuevoRepresentante variante="tarjeta" />
          {[
            { label: "Total Representantes", valor: totalProveedores,       color: "#8E1B3A", icon: <Store size={14} /> },
            { label: "Aprobados",            valor: proveedoresActivos,     color: "#2D7A47", icon: <CheckCircle2 size={14} /> },
            { label: "Pendientes",           valor: proveedoresPendientes,  color: "#BC9968", icon: <Clock3 size={14} /> },
            { label: "Suspendidos",          valor: proveedoresSuspendidos, color: "#AB3A50", icon: <UserX size={14} /> },
            { label: "Productos",            valor: totalProductos,         color: "#5C3A2E", icon: <Package size={14} /> },
          ].map((s) => (
            <StatCard key={s.label} label={s.label} valor={s.valor} color={s.color} icon={s.icon} />
          ))}
        </div>

        <ProveedoresListClient
          proveedores={proveedoresSerializados}
          busquedaInicial={busqueda}
          filtroEstadoInicial={filtroEstado}
          filtroCategoriaInicial={filtroCategoria}
          categorias={categorias}
          tipoVista="representantes"
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

  // ── CLIENTES (usuarios) ────────────────────────────────────────────────────
  const filtroTipo = typeof sp.tipo === "string" ? sp.tipo : "";
  const filtroPlan = typeof sp.plan === "string" ? sp.plan : "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (filtroTipo) where.tipo = filtroTipo;
  if (filtroPlan) where.plan = filtroPlan;
  if (busqueda) {
    where.OR = [
      { nombre:   { contains: busqueda, mode: "insensitive" } },
      { apellido: { contains: busqueda, mode: "insensitive" } },
      { email:    { contains: busqueda, mode: "insensitive" } },
    ];
  }

  const [
    totalCount,
    usuariosReales,
    totalUsuarios,
    usuariosPremium,
    usuariosAdmins,
    usuariosSuspendidos,
    accesoGoogle,
  ] = await Promise.all([
    prisma.usuarios.count({ where }),
    prisma.usuarios.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: { _count: { select: { pedidos: true } } },
    }),
    prisma.usuarios.count(),
    prisma.usuarios.count({ where: { plan: "premium" } }),
    prisma.usuarios.count({ where: { tipo: "admin" } }),
    prisma.usuarios.count({ where: { activo: false } }),
    prisma.usuarios.count({ where: { google_id: { not: null } } }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(totalCount / POR_PAGINA));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader tab="clientes" />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <ModalNuevoUsuario variante="tarjeta" />
        {[
          { label: "Total Cuentas",   valor: totalUsuarios,       color: "#8E1B3A", icon: <ShieldCheck size={14} /> },
          { label: "Administradores", valor: usuariosAdmins,      color: "#5A0F24", icon: <Shield size={14} /> },
          { label: "Premium",         valor: usuariosPremium,     color: "#BC9968", icon: <Star size={14} /> },
          { label: "Acceso Google",   valor: accesoGoogle,        color: "#5C3A2E", icon: <Globe size={14} /> },
          { label: "Suspendidos",     valor: usuariosSuspendidos, color: "#AB3A50", icon: <UserMinus size={14} /> },
        ].map((s) => (
          <StatCard key={s.label} label={s.label} valor={s.valor} color={s.color} icon={s.icon} />
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
