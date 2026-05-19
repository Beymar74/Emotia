"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import {
  cambiarEstadoProveedorAction,
  editarProveedorAction,
} from "../acciones";

type Props = {
  proveedor: any;
};

export default function BotonesAccionProveedor({ proveedor }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estadoActual = proveedor.estado || "pendiente";

  const cambiarEstado = (nuevoEstado: "activo" | "pendiente" | "suspendido") => {
    startTransition(async () => {
      await cambiarEstadoProveedorAction(proveedor.id, nuevoEstado);
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const resultado = await editarProveedorAction(formData);
    setIsSubmitting(false);

    if (resultado?.error) {
      alert(resultado.error);
      return;
    }

    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/proveedores/${proveedor.id}`}
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[#8E1B3A]/10 text-[#8E1B3A] font-bold hover:bg-[#8E1B3A] hover:text-white transition-all shadow-sm flex items-center justify-center"
        >
          Ver Perfil
        </Link>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-bold hover:bg-[#BC9968] hover:text-white transition-all shadow-sm"
        >
          Editar
        </button>

        {estadoActual !== "activo" ? (
          <button
            onClick={() => cambiarEstado("activo")}
            disabled={isPending}
            className="text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center min-w-[75px] bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47] hover:text-white"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : "Activar"}
          </button>
        ) : (
          <button
            onClick={() => cambiarEstado("suspendido")}
            disabled={isPending}
            className="text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center min-w-[75px] bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D] hover:text-white"
          >
            {isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              "Suspender"
            )}
          </button>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#8E1B3A]/10">
            <div className="bg-[#FDFBF9] border-b border-[#8E1B3A]/10 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5A0F24]">
                  Editar proveedor
                </h2>
                <p className="text-[10px] text-[#7A5260] uppercase tracking-widest font-bold">
                  Datos del negocio y representante
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#7A5260] hover:text-[#8E1B3A] transition-colors p-2 rounded-full hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <input type="hidden" name="id" value={proveedor.id} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Negocio
                    </label>
                    <input
                      required
                      name="nombre_negocio"
                      defaultValue={proveedor.nombre_negocio}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Email login
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      defaultValue={proveedor.email}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Teléfono negocio
                    </label>
                    <input
                      name="telefono"
                      defaultValue={proveedor.telefono || ""}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      defaultValue={proveedor.estado || "pendiente"}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="activo">Activo</option>
                      <option value="suspendido">Suspendido</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    defaultValue={proveedor.direccion || ""}
                    className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Representante
                    </label>
                    <input
                      name="rep_nombre"
                      defaultValue={proveedor.rep_nombre || ""}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Email representante
                    </label>
                    <input
                      type="email"
                      name="rep_email"
                      defaultValue={proveedor.rep_email || ""}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                      Teléfono representante
                    </label>
                    <input
                      name="rep_telefono"
                      defaultValue={proveedor.rep_telefono || ""}
                      className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider ml-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    defaultValue={proveedor.descripcion || ""}
                    rows={3}
                    className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18] resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-colors shadow-lg shadow-[#8E1B3A]/20 flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Guardar Cambios"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}