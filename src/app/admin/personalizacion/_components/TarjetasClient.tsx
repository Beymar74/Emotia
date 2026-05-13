"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, CheckCircle2, XCircle, Paintbrush, Loader2, Image as ImageIcon } from "lucide-react";
import { toggleTarjetaStatus, crearTarjeta } from "../actions";
import { subirImagenCloudinaryAction } from "@/app/admin/actions/upload";

export type TarjetaDB = {
  id: number;
  nombre: string;
  design_url: string;
  color_acento: string;
  color_suave: string;
  color_marco: string;
  color_mensaje: string;
  activo: boolean;
};

interface TarjetasClientProps {
  tarjetas: TarjetaDB[];
  total: number;
  activas: number;
  desactivadas: number;
}

export default function TarjetasClient({
  tarjetas,
  total,
  activas,
  desactivadas,
}: TarjetasClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "activos" | "desactivados">("todos");

  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    design_url: "",
    color_acento: "#A53E6C",
    color_suave: "#FFF3F7",
    color_marco: "#D46A92",
    color_mensaje: "#000000",
  });
  const [formError, setFormError] = useState("");

  const handleToggle = (id: number, estadoActual: boolean) => {
    startTransition(async () => {
      await toggleTarjetaStatus(id, estadoActual);
    });
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!archivoImagen) {
      setFormError("Por favor, selecciona una imagen del diseño.");
      return;
    }

    startTransition(async () => {
      // 1. Subir la imagen
      const formDataUpload = new FormData();
      formDataUpload.append("file", archivoImagen);
      
      const uploadRes = await subirImagenCloudinaryAction(formDataUpload);
      if (uploadRes?.error || !uploadRes?.url) {
        setFormError(uploadRes?.error || "Error al subir la imagen");
        return;
      }

      // 2. Crear la tarjeta
      const res = await crearTarjeta({
        ...formData,
        design_url: uploadRes.url,
      });

      if (res.success) {
        setIsModalOpen(false);
        setFormData({
          nombre: "",
          design_url: "",
          color_acento: "#A53E6C",
          color_suave: "#FFF3F7",
          color_marco: "#D46A92",
          color_mensaje: "#000000",
        });
        setArchivoImagen(null);
        setPreviewImagen(null);
      } else {
        setFormError(res.message || "Error desconocido");
      }
    });
  };

  const tarjetasFiltradas = tarjetas.filter(t => {
    if (filtro === "activos") return t.activo;
    if (filtro === "desactivados") return !t.activo;
    return true;
  });

  return (
    <div className="space-y-6 relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total Diseños", valor: total, icon: <Paintbrush size={24} />, color: "#8E1B3A" },
          { label: "Activos", valor: activas, icon: <CheckCircle2 size={24} />, color: "#2D7A47" },
          { label: "Desactivados", valor: desactivadas, icon: <XCircle size={24} />, color: "#A32D2D" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8E1B3A]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: s.color }}>
              {s.icon}
            </div>
            <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-bold mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-serif font-bold text-[#5A0F24]">{s.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-[#8E1B3A]/10 shadow-sm">
          <button 
            onClick={() => setFiltro("todos")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filtro === "todos" ? "bg-[#8E1B3A] text-white" : "bg-transparent text-[#7A5260] hover:bg-[#FDFBF9]"}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFiltro("activos")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filtro === "activos" ? "bg-[#8E1B3A] text-white" : "bg-transparent text-[#7A5260] hover:bg-[#FDFBF9]"}`}
          >
            Activos
          </button>
          <button 
            onClick={() => setFiltro("desactivados")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filtro === "desactivados" ? "bg-[#8E1B3A] text-white" : "bg-transparent text-[#7A5260] hover:bg-[#FDFBF9]"}`}
          >
            Desactivados
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden mt-4">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Tipos de Tarjeta</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#8E1B3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6e152d] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Crear diseño
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {["Visualización", "Nombre", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {tarjetasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#7A5260]">
                    No hay tarjetas que coincidan con este filtro.
                  </td>
                </tr>
              ) : (
                tarjetasFiltradas.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FDFBF9] transition-colors">
                    <td className="px-5 py-3 w-24">
                      {t.design_url ? (
                        <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden border border-[#8E1B3A]/10 flex-shrink-0">
                          <img src={t.design_url} alt={t.nombre} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-16 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#2A0E18]">{t.nombre}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        t.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"
                      }`}>
                        {t.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggle(t.id, t.activo)}
                        className="text-[11px] px-3 py-1.5 rounded-lg font-medium bg-[#F1EFE8] border border-[#8E1B3A]/10 text-[#7A5260] hover:bg-[#E5E0D8] transition-colors"
                      >
                        {t.activo ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setPreviewImagen(null); }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#8E1B3A]/10 flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-[#5A0F24]">Nuevo Diseño de Tarjeta</h2>
              <button onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setPreviewImagen(null); }} className="text-[#7A5260] hover:text-[#5A0F24]">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCrear} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="bg-[#FBF0F0] text-[#A32D2D] p-3 rounded-lg text-sm mb-4">
                  {formError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-[#7A5260] uppercase tracking-wider mb-1">Nombre del Diseño</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Vintage, Minimalista..."
                  className="w-full border border-[#8E1B3A]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A5260] uppercase tracking-wider mb-1">Imagen del Diseño</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden border border-[#8E1B3A]/10 flex-shrink-0 flex items-center justify-center">
                    {previewImagen ? (
                      <img src={previewImagen} alt="Preview" className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setArchivoImagen(file);
                          setPreviewImagen(URL.createObjectURL(file));
                        }
                      }}
                      className="block w-full text-sm text-[#7A5260]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#FAF3EC] file:text-[#8E1B3A]
                        hover:file:bg-[#E5E0D8] transition-colors cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 mt-2">Formatos: JPG, PNG, WEBP. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#8E1B3A]/10 flex justify-end gap-2 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setPreviewImagen(null); }}
                  className="px-4 py-2 text-sm font-medium text-[#7A5260] bg-[#FAF3EC] rounded-lg hover:bg-[#E5E0D8] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8E1B3A] rounded-lg hover:bg-[#6e152d] transition-colors disabled:opacity-50"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
