"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { crearRepresentanteAction } from "@/app/admin/proveedores/acciones";

export default function ModalNuevoRepresentante({
  variante = "boton",
}: {
  variante?: "boton" | "tarjeta";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await crearRepresentanteAction(formData);
    setIsSubmitting(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {variante === "boton" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-[#5C3A2E] hover:bg-[#3E2210] text-white text-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#5C3A2E]/20 active:scale-95"
        >
          <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
          Nuevo Representante
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#5C3A2E]/5 border-2 border-dashed border-[#5C3A2E]/30 hover:border-[#5C3A2E]/60 text-[#5C3A2E] flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 hover:bg-[#5C3A2E]/10 group active:scale-95 min-h-[110px]"
        >
          <div className="bg-white p-2.5 rounded-full mb-2 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <UserPlus size={20} className="text-[#5C3A2E]" />
          </div>
          <span className="text-xs font-bold text-center leading-tight">Nuevo Representante</span>
          <span className="text-[10px] text-[#5C3A2E]/60 mt-0.5">+ empresa vinculada</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#8E1B3A]/10">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2A0E18]">Nuevo Representante</h2>
                <p className="text-xs text-[#7A5260] mt-0.5">Registra el representante y su empresa vinculada</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#FAF3EC] hover:bg-[#8E1B3A]/10 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-[#7A5260]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Datos del Representante */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C3A2E]">
                  Datos del Representante
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="rep_nombre"
                      required
                      placeholder="Ej. Juan Pérez"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">Email personal</label>
                    <input
                      name="rep_email"
                      type="email"
                      placeholder="rep@email.com"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">Teléfono</label>
                    <input
                      name="rep_telefono"
                      placeholder="70000000"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">Año de nacimiento</label>
                    <input
                      name="rep_anio_nacimiento"
                      type="number"
                      min={1940}
                      max={2010}
                      placeholder="Ej. 1985"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#5C3A2E]/20 text-[#2A0E18]"
                    />
                  </div>
                </div>
              </div>

              {/* Datos de la Empresa */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A3A5C]">
                  Empresa Vinculada
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">
                      Nombre del negocio <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nombre_negocio"
                      required
                      placeholder="Ej. Flores del Valle"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">
                      Email de acceso <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="empresa@email.com"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">Teléfono empresa</label>
                    <input
                      name="telefono"
                      placeholder="70000000"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 text-[#2A0E18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A5260] mb-1">Dirección</label>
                    <input
                      name="direccion"
                      placeholder="Ej. Av. 6 de Agosto #123"
                      className="w-full text-sm border border-[#8E1B3A]/15 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 text-[#2A0E18]"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#8E1B3A]/15 text-sm font-semibold text-[#7A5260] hover:bg-[#FAF3EC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#5C3A2E] hover:bg-[#3E2210] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Creando...</>
                  ) : (
                    "Crear Representante"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
