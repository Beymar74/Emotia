"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Store, Mail, Phone, Lock, FileText, ChevronRight } from "lucide-react";
import { crearProveedorAction, actualizarProveedorAction } from "../actions";

interface FormProveedorProps {
  proveedor?: any;
}

export default function FormProveedor({ proveedor }: FormProveedorProps) {
  const router = useRouter();
  const isEditing = !!proveedor;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = isEditing 
      ? await actualizarProveedorAction(formData)
      : await crearProveedorAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/admin/proveedores/actividad");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6 space-y-8">
      {error && (
        <div className="bg-[#FBF0F0] text-[#A32D2D] text-sm font-bold p-4 rounded-xl border border-[#A32D2D]/10">
          {error}
        </div>
      )}

      {isEditing && <input type="hidden" name="id" value={proveedor.id} />}

      <div className="space-y-6">
        {/* Sección: Información Básica */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#BC9968] uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#BC9968]/30"></span>
            Información del Negocio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Store size={14} /> Nombre del Negocio *
              </label>
              <input 
                required 
                name="nombre_negocio" 
                defaultValue={proveedor?.nombre_negocio} 
                type="text" 
                placeholder="Ej. Florería Rosalía"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Correo Electrónico *
              </label>
              <input 
                required 
                name="email" 
                defaultValue={proveedor?.email} 
                type="email" 
                placeholder="proveedor@ejemplo.com"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} /> Teléfono / WhatsApp
              </label>
              <input 
                name="telefono" 
                defaultValue={proveedor?.telefono} 
                type="text" 
                placeholder="+591 ..."
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Lock size={14} /> {isEditing ? "Nueva Contraseña (opcional)" : "Contraseña de Acceso *"}
              </label>
              <input 
                required={!isEditing} 
                name="password" 
                type="password" 
                placeholder={isEditing ? "Dejar en blanco para mantener" : "Mínimo 8 caracteres"}
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]" 
              />
            </div>
          </div>
        </div>

        {/* Sección: Detalles Adicionales */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-[#BC9968] uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#BC9968]/30"></span>
            Descripción del Perfil
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Resumen del Negocio
            </label>
            <textarea 
              name="descripcion" 
              defaultValue={proveedor?.descripcion || ""} 
              rows={4} 
              placeholder="Describe lo que ofrece este proveedor..."
              className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all resize-none font-medium text-[#2A0E18]" 
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3 border-t border-[#8E1B3A]/5">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="px-6 py-3 rounded-xl font-bold text-sm text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-all flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-[#8E1B3A]/20 active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
