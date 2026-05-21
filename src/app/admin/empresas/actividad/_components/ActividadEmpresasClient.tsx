"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from "lucide-react";

interface EmpresaData {
  id: number;
  nombre_negocio: string;
  logo_url: string | null;
  email: string;
  telefono: string | null;
  categorias: string[];
  estado: string;
  calificacion_prom: number;
  total_vendido: number;
  updated_at: string;
  created_at: string;
  pedidosCompletados: number;
  pedidosCancelados: number;
  productosActivos: number;
}

interface Props {
  empresasReales: EmpresaData[];
  estadoFiltroInicial: string;
}

function EmpresaAvatar({ nombre, logoUrl }: { nombre: string; logoUrl?: string | null }) {
  const initials = nombre
    ? nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "EM";
  if (logoUrl) {
    return (
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative border border-[#8E1B3A]/10">
        <Image src={logoUrl} alt={nombre} fill className="object-cover" sizes="56px" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-base font-bold text-white flex-shrink-0">
      {initials}
    </div>
  );
}

function tiempoTranscurrido(fechaStr: string) {
  const seg = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (seg < 60) return "Hace un momento";
  const min = Math.floor(seg / 60);
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h}h`;
  const d = Math.floor(h / 24);
  return `Hace ${d} día${d > 1 ? "s" : ""}`;
}

function BarraExito({ completados, cancelados }: { completados: number; cancelados: number }) {
  const total = completados + cancelados;
  if (total === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#7A5260]">Tasa de éxito</span>
          <span className="text-[#7A5260] italic">Sin pedidos</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#F0EAE8]" />
      </div>
    );
  }
  const tasa = Math.round((completados / total) * 100);
  const color = tasa >= 80 ? "#2D7A47" : tasa >= 60 ? "#BC9968" : "#A32D2D";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#7A5260]">Tasa de éxito</span>
        <span className="font-bold" style={{ color }}>
          {tasa}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#F0EAE8] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${tasa}%`, background: color }}
        />
      </div>
    </div>
  );
}

function formatMonto(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(0);
}

export default function ActividadEmpresasClient({ empresasReales, estadoFiltroInicial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("reciente");

  const actualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtradas = empresasReales
    .filter(
      (e) =>
        e.nombre_negocio.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.categorias.some((c) => c.toLowerCase().includes(busqueda.toLowerCase()))
    )
    .sort((a, b) => {
      if (orden === "ventas") return b.total_vendido - a.total_vendido;
      if (orden === "calificacion") return b.calificacion_prom - a.calificacion_prom;
      if (orden === "pedidos")
        return (
          b.pedidosCompletados + b.pedidosCancelados - (a.pedidosCompletados + a.pedidosCancelados)
        );
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <div className="space-y-4">
      {/* Barra de controles */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50"
              size={15}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o categoría…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#FDFBF9] text-sm border border-[#8E1B3A]/10 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 focus:border-[#8E1B3A]/30"
            />
          </div>

          <div className="relative">
            <select
              defaultValue={estadoFiltroInicial}
              onChange={(e) => actualizarFiltro("estado", e.target.value)}
              className="appearance-none text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl pl-4 pr-8 py-2.5 outline-none text-[#7A5260] bg-[#FDFBF9] cursor-pointer hover:border-[#8E1B3A]/30"
            >
              <option value="">Todos los estados</option>
              <option value="aprobado">Solo activas</option>
              <option value="suspendido">Solo suspendidas</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A5260] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="appearance-none text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl pl-4 pr-8 py-2.5 outline-none text-[#7A5260] bg-[#FDFBF9] cursor-pointer hover:border-[#8E1B3A]/30"
            >
              <option value="reciente">Más reciente</option>
              <option value="ventas">Mayor facturación</option>
              <option value="calificacion">Mejor calificación</option>
              <option value="pedidos">Más pedidos</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A5260] pointer-events-none"
            />
          </div>
        </div>

        {busqueda && (
          <p className="text-xs text-[#7A5260] mt-2.5">
            {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""} para &quot;{busqueda}&quot;
          </p>
        )}
      </div>

      {/* Grid de tarjetas */}
      {filtradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 py-20 text-center">
          <p className="text-[#7A5260] text-sm">No se encontraron empresas.</p>
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="mt-3 text-xs text-[#8E1B3A] font-semibold hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-[#7A5260] px-1">
            {filtradas.length} empresa{filtradas.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtradas.map((empresa) => {
              const isActivo = empresa.estado === "aprobado";
              const totalPedidos = empresa.pedidosCompletados + empresa.pedidosCancelados;

              return (
                <div
                  key={empresa.id}
                  className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-hidden hover:shadow-lg hover:border-[#8E1B3A]/20 transition-all duration-200"
                >
                  {/* Banda de estado superior */}
                  <div
                    className="h-1"
                    style={{ background: isActivo ? "#2D7A47" : "#A32D2D" }}
                  />

                  <div className="p-5 space-y-4">
                    {/* Cabecera: logo + nombre + badge */}
                    <div className="flex items-start gap-3">
                      <EmpresaAvatar
                        nombre={empresa.nombre_negocio}
                        logoUrl={empresa.logo_url}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[#2A0E18] text-sm leading-tight">
                            {empresa.nombre_negocio}
                          </h3>
                          <span
                            className={`flex-shrink-0 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              isActivo
                                ? "bg-[#EEF8F0] text-[#2D7A47]"
                                : "bg-[#FBF0F0] text-[#A32D2D]"
                            }`}
                          >
                            {isActivo ? "Activa" : "Suspendida"}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A5260] mt-0.5 truncate">{empresa.email}</p>

                        {/* Categorías */}
                        {empresa.categorias.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {empresa.categorias.slice(0, 3).map((cat) => (
                              <span
                                key={cat}
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-[#FAF3EC] text-[#BC9968] border border-[#BC9968]/20"
                              >
                                {cat}
                              </span>
                            ))}
                            {empresa.categorias.length > 3 && (
                              <span className="text-[9px] text-[#7A5260] self-center">
                                +{empresa.categorias.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Barra de tasa de éxito */}
                    <BarraExito
                      completados={empresa.pedidosCompletados}
                      cancelados={empresa.pedidosCancelados}
                    />

                    {/* Métricas: Facturado · Calificación · Productos */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-[#FDFBF9] border border-[#8E1B3A]/6 p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <TrendingUp size={11} className="text-[#BC9968]" />
                          <span className="text-xs font-bold text-[#2A0E18]">
                            Bs.{formatMonto(empresa.total_vendido)}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#7A5260]">Facturado</p>
                      </div>
                      <div className="rounded-lg bg-[#FDFBF9] border border-[#8E1B3A]/6 p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <Star size={11} className="text-[#BC9968]" />
                          <span className="text-xs font-bold text-[#2A0E18]">
                            {empresa.calificacion_prom > 0
                              ? empresa.calificacion_prom.toFixed(1)
                              : "—"}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#7A5260]">Calificación</p>
                      </div>
                      <div className="rounded-lg bg-[#FDFBF9] border border-[#8E1B3A]/6 p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <Package size={11} className="text-[#BC9968]" />
                          <span className="text-xs font-bold text-[#2A0E18]">
                            {empresa.productosActivos}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#7A5260]">Productos</p>
                      </div>
                    </div>

                    {/* Completados vs Cancelados */}
                    <div className="flex items-center gap-3 bg-[#FDFBF9] rounded-lg px-3 py-2 border border-[#8E1B3A]/6">
                      <div className="flex items-center gap-1.5 text-[#2D7A47] flex-1">
                        <CheckCircle size={13} />
                        <span className="text-xs font-bold">{empresa.pedidosCompletados}</span>
                        <span className="text-[10px] text-[#7A5260]">completados</span>
                      </div>
                      <div className="w-px h-4 bg-[#8E1B3A]/10 flex-shrink-0" />
                      <div
                        className={`flex items-center gap-1.5 flex-1 ${
                          empresa.pedidosCancelados > 0 ? "text-[#A32D2D]" : "text-[#7A5260]"
                        }`}
                      >
                        <XCircle size={13} />
                        <span className="text-xs font-bold">{empresa.pedidosCancelados}</span>
                        <span className="text-[10px] text-[#7A5260]">cancelados</span>
                      </div>
                      {totalPedidos > 0 && (
                        <>
                          <div className="w-px h-4 bg-[#8E1B3A]/10 flex-shrink-0" />
                          <span className="text-[10px] text-[#7A5260]">
                            {totalPedidos} total
                          </span>
                        </>
                      )}
                    </div>

                    {/* Footer: última actividad + botón */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-[#7A5260]">
                        <Clock size={11} />
                        {tiempoTranscurrido(empresa.updated_at)}
                      </div>
                      <Link
                        href={`/admin/empresas/actividad/${empresa.id}`}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] hover:bg-[#8E1B3A] hover:text-white transition-all"
                      >
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
