"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { toggleSuspensionProveedor } from "../../actions";
import ModalConfirmacion from "@/app/admin/productos/_components/ModalConfirmacion";

interface EmpresaData {
  id: number;
  nombre_negocio: string;
  logo_url: string | null;
  email: string;
  estado: string;
  calificacion_prom: number;
  total_vendido: number;
  updated_at: string;
  pedidosCompletados: number;
  pedidosCancelados: number;
}

interface Props {
  empresasReales:     EmpresaData[];
  estadoFiltroInicial: string;
}

function EmpresaAvatar({ nombre, logoUrl, size = "md" }: { nombre: string; logoUrl?: string | null; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const initials = nombre ? nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "EM";
  if (logoUrl) {
    return (
      <div className={`${dim} rounded-lg overflow-hidden flex-shrink-0 relative`}>
        <Image src={logoUrl} alt={nombre} fill className="object-cover" sizes="40px" />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

function tiempoTranscurrido(fechaStr: string) {
  const seg = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (seg < 60) return "Hace un momento";
  const min = Math.floor(seg / 60); if (min < 60) return `Hace ${min} min`;
  const h   = Math.floor(min / 60); if (h   < 24) return `Hace ${h} h`;
  const d   = Math.floor(h   / 24); return `Hace ${d} día${d > 1 ? "s" : ""}`;
}

export default function ActividadEmpresasClient({ empresasReales, estadoFiltroInicial }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen]     = useState(false);
  const [selected, setSelected]       = useState<EmpresaData | null>(null);
  const [busqueda, setBusqueda]       = useState("");

  const actualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const confirmarCambioEstado = () => {
    if (!selected) return;
    startTransition(async () => {
      await toggleSuspensionProveedor(selected.id, selected.estado);
      setModalOpen(false);
    });
  };

  const filtradas = empresasReales.filter((e) =>
    e.nombre_negocio.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="relative space-y-4">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
        </div>
      )}

      {/* Barra de búsqueda y filtro */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={16} />
          <input
            type="text"
            placeholder="Buscar empresa o email…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
          />
        </div>
        <select
          defaultValue={estadoFiltroInicial}
          onChange={(e) => actualizarFiltro("estado", e.target.value)}
          className="text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2 outline-none text-[#7A5260] bg-white cursor-pointer hover:border-[#8E1B3A]/30"
        >
          <option value="">Todos los estados</option>
          <option value="aprobado">Activos</option>
          <option value="suspendido">Suspendidos</option>
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="py-12 text-center text-[#7A5260] text-sm italic">
          No se encontraron empresas con esa búsqueda.
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="block lg:hidden space-y-3">
            {filtradas.map((p) => (
              <div key={p.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EmpresaAvatar nombre={p.nombre_negocio} logoUrl={p.logo_url} />
                    <div>
                      <p className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</p>
                      <p className="text-xs text-[#7A5260]">★ {p.calificacion_prom > 0 ? p.calificacion_prom.toFixed(1) : "—"}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${p.estado === "aprobado" ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                    {p.estado === "aprobado" ? "Activo" : "Suspendido"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-[#FAF3EC] rounded-lg p-2">
                    <p className="font-semibold text-[#5A0F24] text-base">{p.pedidosCompletados + p.pedidosCancelados}</p>
                    <p className="text-[#7A5260]">Recibidos</p>
                  </div>
                  <div className="bg-[#EEF8F0] rounded-lg p-2">
                    <p className="font-semibold text-[#2D7A47] text-base">{p.pedidosCompletados}</p>
                    <p className="text-[#7A5260]">Completados</p>
                  </div>
                  <div className="bg-[#FBF0F0] rounded-lg p-2">
                    <p className={`font-semibold text-base ${p.pedidosCancelados > 0 ? "text-[#A32D2D]" : "text-[#2A0E18]"}`}>{p.pedidosCancelados}</p>
                    <p className="text-[#7A5260]">Cancelados</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link href={`/admin/empresas/actividad/${p.id}`} className="flex-1 flex items-center justify-center text-xs px-3 py-2 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-bold hover:bg-[#8E1B3A]/15">Ver</Link>
                  <Link href={`/admin/empresas/${p.id}/editar`} className="flex-1 flex items-center justify-center text-xs px-3 py-2 rounded-lg bg-[#F1EFE8] text-[#7A5260] font-bold hover:bg-[#E5E3DC]">Editar</Link>
                  <button
                    onClick={() => { setSelected(p); setModalOpen(true); }}
                    className={`flex-1 text-xs px-3 py-2 rounded-lg font-bold ${p.estado === "aprobado" ? "bg-[#FBF0F0] text-[#A32D2D]" : "bg-[#EEF8F0] text-[#2D7A47]"}`}
                  >
                    {p.estado === "aprobado" ? "Suspender" : "Activar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FDFBF9]/30">
                  {["Empresa", "Recibidos", "Completados", "Cancelados", "Estado", "Última actividad", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8E1B3A]/5">
                {filtradas.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF3EC]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <EmpresaAvatar nombre={p.nombre_negocio} logoUrl={p.logo_url} size="sm" />
                        <div>
                          <span className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</span>
                          <p className="text-xs text-[#7A5260]">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-[#2A0E18]">{p.pedidosCompletados + p.pedidosCancelados}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#2D7A47]">{p.pedidosCompletados}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: p.pedidosCancelados > 0 ? "#A32D2D" : "#2A0E18" }}>{p.pedidosCancelados}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${p.estado === "aprobado" ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                        {p.estado === "aprobado" ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#7A5260]">{tiempoTranscurrido(p.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/empresas/actividad/${p.id}`} className="px-3 py-1.5 rounded-lg bg-[#8E1B3A]/5 text-[#8E1B3A] text-xs font-bold hover:bg-[#8E1B3A] hover:text-white transition-all">Ver</Link>
                        <Link href={`/admin/empresas/${p.id}/editar`} className="px-3 py-1.5 rounded-lg bg-[#FAF3EC] text-[#BC9968] text-xs font-bold hover:bg-[#BC9968] hover:text-white transition-all">Editar</Link>
                        <button
                          onClick={() => { setSelected(p); setModalOpen(true); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${p.estado === "aprobado" ? "bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D] hover:text-white" : "bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47] hover:text-white"}`}
                        >
                          {p.estado === "aprobado" ? "Suspender" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarCambioEstado}
        titulo={selected?.estado === "aprobado" ? "Suspender Empresa" : "Activar Empresa"}
        mensaje={selected?.estado === "aprobado"
          ? `¿Estás seguro de que deseas suspender a "${selected?.nombre_negocio}"? No podrá recibir nuevos pedidos.`
          : `¿Deseas activar nuevamente a "${selected?.nombre_negocio}"? Volverá a estar visible para los clientes.`}
        confirmText={selected?.estado === "aprobado" ? "Suspender" : "Activar"}
        isDestructive={selected?.estado === "aprobado"}
      />
    </div>
  );
}
