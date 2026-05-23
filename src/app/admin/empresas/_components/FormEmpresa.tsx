"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Store, Mail, Phone, Lock, FileText, ChevronRight, ImageIcon, MapPin, User } from "lucide-react";
import { crearEmpresaAction } from "../actions";
import { editarProveedorAction, actualizarLogoProveedor } from "@/app/admin/proveedores/acciones";
import AvatarUploader from "@/components/AvatarUploader";

interface FormEmpresaProps {
  proveedor?: any;
}

export default function FormEmpresa({ proveedor }: FormEmpresaProps) {
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
      ? await editarProveedorAction(formData)
      : await crearEmpresaAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/admin/empresas/actividad");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo — solo al editar */}
      {isEditing && (
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
          <h3 className="text-xs font-bold text-[#BC9968] uppercase tracking-widest flex items-center gap-2 mb-5">
            <ImageIcon size={14} />
            Logo de la Empresa
          </h3>
          <div className="flex justify-center">
            <AvatarUploader
              currentUrl={proveedor?.logo_url}
              label="Logo de la empresa"
              shape="square"
              uploadPreset="emotia_preset"
              onSave={async (url) => { await actualizarLogoProveedor(proveedor.id, url); }}
              onRemove={async () => { await actualizarLogoProveedor(proveedor.id, null); }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6 space-y-8">
        {error && (
          <div className="bg-[#FBF0F0] text-[#A32D2D] text-sm font-bold p-4 rounded-xl border border-[#A32D2D]/10">
            {error}
          </div>
        )}

        {isEditing && <input type="hidden" name="id" value={proveedor.id} />}

        {/* Información del Negocio */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#BC9968] uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#BC9968]/30" />
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
                type="email"
                defaultValue={proveedor?.email}
                placeholder="empresa@ejemplo.com"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} /> Teléfono / WhatsApp
              </label>
              <input
                name="telefono"
                defaultValue={proveedor?.telefono}
                placeholder="+591 ..."
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} /> Dirección
              </label>
              <input
                name="direccion"
                defaultValue={proveedor?.direccion}
                placeholder="Ej. Av. 6 de Agosto #123, La Paz"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            {/* Contraseña solo al crear */}
            {!isEditing && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} /> Contraseña de Acceso *
                </label>
                <input
                  required
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all font-medium text-[#2A0E18]"
                />
              </div>
            )}

            {isEditing && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Estado</label>
                <select
                  name="estado"
                  defaultValue={proveedor?.estado ?? "aprobado"}
                  className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 font-medium text-[#2A0E18]"
                >
                  <option value="aprobado">Aprobado</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Descripción del Negocio
            </label>
            <textarea
              name="descripcion"
              defaultValue={proveedor?.descripcion || ""}
              rows={3}
              placeholder="Describe lo que ofrece esta empresa..."
              className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all resize-none font-medium text-[#2A0E18]"
            />
          </div>
        </div>

        {/* Datos del Representante */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-[#5C3A2E] uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#5C3A2E]/30" />
            Representante {!isEditing && <span className="text-red-500">*</span>}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Nombre completo {!isEditing && "*"}
              </label>
              <input
                required={!isEditing}
                name="rep_nombre"
                defaultValue={proveedor?.rep_nombre}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Email personal
              </label>
              <input
                name="rep_email"
                type="email"
                defaultValue={proveedor?.rep_email}
                placeholder="rep@email.com"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} /> Teléfono
              </label>
              <input
                name="rep_telefono"
                defaultValue={proveedor?.rep_telefono}
                placeholder="70000000"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 transition-all font-medium text-[#2A0E18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Año de nacimiento</label>
              <input
                name="rep_anio_nacimiento"
                type="number"
                min={1940}
                max={2010}
                defaultValue={proveedor?.rep_anio_nacimiento ?? ""}
                placeholder="Ej. 1985"
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 transition-all font-medium text-[#2A0E18]"
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
                {isEditing ? "Guardar Cambios" : "Registrar Empresa"}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
