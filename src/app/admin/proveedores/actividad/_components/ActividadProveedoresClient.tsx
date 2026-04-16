"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, ExternalLink, Edit3, ShieldOff, ShieldCheck } from "lucide-react";
import { toggleSuspensionProveedor } from "../../actions";
import ModalConfirmacion from "@/app/admin/productos/_components/ModalConfirmacion";

interface ActividadProveedoresClientProps {
  proveedoresReales: any[];
}

export default function ActividadProveedoresClient({ proveedoresReales }: ActividadProveedoresClientProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // --- HANDLERS ---
  const handleToggleEstado = (p: any) => {
    setSelectedProvider(p);
    setModalOpen(true);
  };

  const confirmarCambioEstado = () => {
    if (!selectedProvider) return;
    
    startTransition(async () => {
      await toggleSuspensionProveedor(selectedProvider.id, selectedProvider.estado);
      setModalOpen(false);
    });
  };

  // --- HELPERS REPLICADOS (Para mantener coherencia visual) ---
  const getInitials = (nombre: string) => {
    if (!nombre) return "PR";
    return nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const getTiempoTranscurrido = (fecha: Date | string) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const segundos = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (segundos < 60) return "Hace un momento";
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  };

  return (
    <div className="relative">
      {/* Overlay de Carga Global */}
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
        </div>
      )}

      {/* Mobile: cards */}
      <div className="block lg:hidden space-y-3">
        {proveedoresReales.map((p) => {
          const ventas = Number(p.total_vendido || 0);
          const simuladoCompletados = Math.floor(ventas / 150) + 1;
          const simuladoCancelados = Math.floor(simuladoCompletados * 0.1);

          return (
            <div key={p.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {getInitials(p.nombre_negocio)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</p>
                    <p className="text-xs text-[#7A5260]">★ {p.calificacion_prom ? Number(p.calificacion_prom).toFixed(1) : "—"}</p>
                  </div>
                </div>
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${p.estado === 'aprobado' ? 'bg-[#EEF8F0] text-[#2D7A47]' : 'bg-[#FBF0F0] text-[#A32D2D]'}`}>
                  {p.estado === 'aprobado' ? 'Activo' : 'Suspendido'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-[#FAF3EC] rounded-lg p-2">
                  <p className="font-semibold text-[#5A0F24] text-base">{simuladoCompletados + simuladoCancelados + 2}</p>
                  <p className="text-[#7A5260]">Recibidos</p>
                </div>
                <div className="bg-[#EEF8F0] rounded-lg p-2">
                  <p className="font-semibold text-[#2D7A47] text-base">{simuladoCompletados}</p>
                  <p className="text-[#7A5260]">Completados</p>
                </div>
                <div className="bg-[#FBF0F0] rounded-lg p-2">
                  <p className={`font-semibold text-base ${simuladoCancelados > 0 ? "text-[#A32D2D]" : "text-[#2A0E18]"}`}>
                    {simuladoCancelados}
                  </p>
                  <p className="text-[#7A5260]">Cancelados</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/admin/proveedores/actividad/${p.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-bold hover:bg-[#8E1B3A]/15 transition-all"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/proveedores/${p.id}/editar`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-[#F1EFE8] text-[#7A5260] font-bold hover:bg-[#E5E3DC] transition-all"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleToggleEstado(p)}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg font-bold transition-all ${
                    p.estado === 'aprobado' 
                      ? "bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D]/10" 
                      : "bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47]/10"
                  }`}
                >
                  {p.estado === 'aprobado' ? 'Suspender' : 'Activar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden lg:block overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDFBF9]/30">
              {["Proveedor", "Recibidos", "Completados", "Cancelados", "Estado", "Última actividad", "Acciones"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8E1B3A]/5">
            {proveedoresReales.map((p) => {
              const ventas = Number(p.total_vendido || 0);
              const simuladoCompletados = Math.floor(ventas / 150) + 1;
              const simuladoCancelados = Math.floor(simuladoCompletados * 0.1);

              return (
                <tr key={p.id} className="hover:bg-[#FAF3EC]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {getInitials(p.nombre_negocio)}
                      </div>
                      <span className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2A0E18] font-bold">{simuladoCompletados + simuladoCancelados + 2}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#2D7A47]">{simuladoCompletados}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${simuladoCancelados > 0 ? "text-[#A32D2D]" : "text-[#2A0E18]"}`}>
                      {simuladoCancelados}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${p.estado === 'aprobado' ? 'bg-[#EEF8F0] text-[#2D7A47]' : 'bg-[#FBF0F0] text-[#A32D2D]'}`}>
                      {p.estado === 'aprobado' ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#7A5260]">
                    Hace {getTiempoTranscurrido(p.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/proveedores/actividad/${p.id}`}
                        title="Ver Perfil"
                        className="px-3 py-1.5 rounded-lg bg-[#8E1B3A]/5 text-[#8E1B3A] text-xs font-bold hover:bg-[#8E1B3A] hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        Ver
                      </Link>
                      <Link 
                        href={`/admin/proveedores/${p.id}/editar`}
                        title="Editar"
                        className="px-3 py-1.5 rounded-lg bg-[#FAF3EC] text-[#BC9968] text-xs font-bold hover:bg-[#BC9968] hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleToggleEstado(p)}
                        title={p.estado === 'aprobado' ? "Suspender" : "Activar"}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                          p.estado === 'aprobado' 
                            ? "bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D] hover:text-white" 
                            : "bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47] hover:text-white"
                        }`}
                      >
                        {p.estado === 'aprobado' ? 'Suspender' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación Reutilizable */}
      <ModalConfirmacion 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarCambioEstado}
        titulo={selectedProvider?.estado === "aprobado" ? "Suspender Proveedor" : "Activar Proveedor"}
        mensaje={selectedProvider?.estado === "aprobado" 
          ? `¿Estás seguro de que deseas suspender a "${selectedProvider?.nombre_negocio}"? No podrá recibir nuevos pedidos ni aparecerá en la tienda.`
          : `¿Deseas activar nuevamente a "${selectedProvider?.nombre_negocio}"? Volverá a estar visible para los clientes.`
        }
        confirmText={selectedProvider?.estado === "aprobado" ? "Suspender" : "Activar"}
        isDestructive={selectedProvider?.estado === "aprobado"}
      />
    </div>
  );
}
