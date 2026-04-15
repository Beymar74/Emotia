"use client";

import { useState, useTransition } from "react";
import { toggleProducto, eliminarProducto } from "../../actions";

// 1. Definimos exactamente qué recibe el componente
interface Producto {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string;
  precio: string;
  stock: number;
  activo: boolean;
}

interface ProductosClientProps {
  productos: Producto[];
  categorias: string[];
  totalProductos: number;
  activos: number;
  enRevision: number;
  desactivados: number;
}

export default function ProductosClient({ 
  productos, 
  categorias, 
  totalProductos, 
  activos, 
  enRevision, 
  desactivados 
}: ProductosClientProps) {
  
  const [isPending, startTransition] = useTransition();
  const [filtroNombre, setFiltroNombre] = useState("");

  // ... (resto de tu lógica de filtrado y funciones handleToggle/handleEliminar)

  return (
    <div className="space-y-6">
      {/* 2. Ahora puedes usar las métricas en la UI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#8E1B3A]/10">
          <p className="text-xs text-[#7A5260] uppercase font-bold">Total</p>
          <p className="text-2xl font-bold text-[#5A0F24]">{totalProductos}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#8E1B3A]/10 border-l-green-500 border-l-4">
          <p className="text-xs text-[#7A5260] uppercase font-bold">Activos</p>
          <p className="text-2xl font-bold text-green-600">{activos}</p>
        </div>
        {/* Agrega los demás si gustas... */}
      </div>

      {/* Input de búsqueda */}
      <input 
        type="text" 
        placeholder="Buscar por nombre..." 
        className="w-full p-3 rounded-xl border border-[#8E1B3A]/20 focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/50"
        onChange={(e) => setFiltroNombre(e.target.value)}
      />

      {/* Tabla de productos... */}
    </div>
  );
}