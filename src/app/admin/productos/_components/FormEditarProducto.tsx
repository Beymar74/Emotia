"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { actualizarProductoAction } from "../actions"; // Crearemos esta acción en el paso 3

export default function FormEditarProducto({ producto, categorias }: { producto: any, categorias: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await actualizarProductoAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/admin/productos");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6 space-y-6">
      {error && (
        <div className="bg-[#FBF0F0] text-[#A32D2D] text-sm font-bold p-4 rounded-xl border border-[#A32D2D]/10">
          {error}
        </div>
      )}

      <input type="hidden" name="id" value={producto.id} />

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Nombre del Producto *</label>
          <input required name="nombre" defaultValue={producto.nombre} type="text" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Descripción</label>
          <textarea name="descripcion" defaultValue={producto.descripcion || ""} rows={3} className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Precio Venta (Bs) *</label>
            <input required name="precio_venta" defaultValue={Number(producto.precio_venta)} type="number" step="0.01" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Stock *</label>
            <input required name="stock" defaultValue={producto.stock} type="number" className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#7A5260] uppercase tracking-wider">Categoría</label>
            <select name="categoria_id" defaultValue={producto.categoria_id || ""} className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all">
              <option value="">Sin categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-3 border-t border-[#8E1B3A]/5">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold text-sm text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-[#8E1B3A]/20">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}