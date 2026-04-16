'use client'

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { crearUsuarioAction } from "@/app/acciones"; // Ajusta la ruta a tu archivo

export default function ModalNuevoUsuario({ variante = "boton" }: { variante?: "boton" | "tarjeta" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await crearUsuarioAction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {variante === "boton" ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group bg-[#8E1B3A] hover:bg-[#5A0F24] text-white text-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#8E1B3A]/20 active:scale-95"
        >
          <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
          Nuevo Usuario
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#8E1B3A]/5 border-2 border-dashed border-[#8E1B3A]/30 hover:border-[#8E1B3A]/60 text-[#8E1B3A] flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 hover:bg-[#8E1B3A]/10 group active:scale-95 min-h-[110px]"
        >
          <div className="bg-white p-2.5 rounded-full mb-2 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <UserPlus size={20} />
          </div>
          <span className="font-serif font-bold text-sm">Nuevo Usuario</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#FDFBF9] border-b border-[#8E1B3A]/10 px-6 py-4 flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-[#5A0F24]">Agregar Usuario</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#7A5260] hover:text-[#8E1B3A] transition-colors p-1 rounded-full hover:bg-black/5">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-[#FBF0F0] text-[#A32D2D] text-xs font-bold p-3 rounded-xl border border-[#A32D2D]/10">
                  {error}
                </div>
              )}

              {/* Fila 1: Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Nombre *</label>
                  <input required name="nombre" type="text" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" placeholder="Ej. Ana" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Apellido</label>
                  <input name="apellido" type="text" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" placeholder="Ej. López" />
                </div>
              </div>

              {/* Fila 2: Email y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Email *</label>
                  <input required name="email" type="email" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" placeholder="ana@ejemplo.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Teléfono</label>
                  <input name="telefono" type="tel" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" placeholder="+591 7000000" />
                </div>
              </div>

              {/* Fila 3: Plan y Rol */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Plan</label>
                  <select name="plan" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]">
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Rol de Sistema</label>
                  <select name="tipo" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]">
                    <option value="usuario">Usuario Estándar</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#8E1B3A]/20">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}