'use client'

import { useState, useTransition } from "react";
import Link from "next/link";
import { X, Loader2, Edit3, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toggleEstadoUsuario, editarUsuarioAction } from "../acciones";

export default function BotonesAccion({ usuario, esAdmin }: { usuario: any, esAdmin: boolean }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar Suspender / Activar
  const handleToggleEstado = () => {
    startTransition(async () => {
      await toggleEstadoUsuario(usuario.id, usuario.activo);
    });
  };

  // Manejar Guardado de Edición
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await editarUsuarioAction(formData);
    setIsSubmitting(false);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {/* BOTÓN VER PERFIL */}
        <Link 
          href={`/admin/usuarios/${usuario.id}`} 
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[#8E1B3A]/10 text-[#8E1B3A] font-bold hover:bg-[#8E1B3A] hover:text-white transition-all shadow-sm flex items-center justify-center"
        >
          Ver Perfil
        </Link>

        {/* BOTÓN EDITAR */}
        <button 
          onClick={() => setIsEditModalOpen(true)} 
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-bold hover:bg-[#BC9968] hover:text-white transition-all shadow-sm"
        >
          Editar
        </button>

        {/* BOTÓN SUSPENDER / ACTIVAR */}
        {!esAdmin && (
          <button 
            onClick={handleToggleEstado}
            disabled={isPending}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center min-w-[75px] ${
              usuario.activo 
                ? "bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D] hover:text-white" 
                : "bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47] hover:text-white"
            }`}
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : (usuario.activo ? 'Suspender' : 'Activar')}
          </button>
        )}
      </div>

      {/* MODAL DE EDICIÓN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#8E1B3A]/10">
            <div className="bg-[#FDFBF9] border-b border-[#8E1B3A]/10 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5A0F24]">Editar Perfil</h2>
                <p className="text-[10px] text-[#7A5260] uppercase tracking-widest font-bold">Actualización de datos maestros</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-[#7A5260] hover:text-[#8E1B3A] transition-colors p-2 rounded-full hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <input type="hidden" name="id" value={usuario.id} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">Nombre</label>
                  <input required name="nombre" defaultValue={usuario.nombre} type="text" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">Apellido</label>
                  <input name="apellido" defaultValue={usuario.apellido || ''} type="text" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">Teléfono</label>
                <input name="telefono" defaultValue={usuario.telefono || ''} type="tel" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">Plan</label>
                  <select name="plan" defaultValue={usuario.plan} className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18] appearance-none cursor-pointer">
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">Rol</label>
                  <select name="tipo" defaultValue={usuario.tipo} className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18] appearance-none cursor-pointer">
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-colors shadow-lg shadow-[#8E1B3A]/20 flex justify-center items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
