"use client";

import { useState, useTransition } from "react";
import Link from "next/link"; // Importamos Link para la navegación
import { toggleProducto, eliminarProducto } from "../actions"; 
import { Search, Filter, MoreVertical, Star, Package, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import ModalConfirmacion from "./ModalConfirmacion";

type EstadoProd = "activo" | "desactivado" | "revision";

interface Producto {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string;
  precio: string;
  stock: number;
  calificacion: string;
  estado: EstadoProd;
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

const estadoPill: Record<EstadoProd, string> = {
  activo: "bg-[#EEF8F0] text-[#2D7A47]",
  desactivado: "bg-[#FBF0F0] text-[#A32D2D]",
  revision: "bg-[#FDF5E6] text-[#8C5E08]",
};

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
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // Estado para el modal de eliminación
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) || 
                        p.proveedor.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchCategoria = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    const matchEstado = filtroEstado === "Todos" || p.estado === filtroEstado;
    
    return matchNombre && matchCategoria && matchEstado;
  });

  // --- HANDLERS (Acciones de Servidor) ---
  const handleToggle = (id: number, estadoActual: boolean) => {
    startTransition(async () => {
      await toggleProducto(id, estadoActual);
    });
  };

  const handleEliminar = (id: number) => {
    setIdAEliminar(id);
    setModalEliminarOpen(true);
  };

  const confirmarEliminacion = () => {
    if (idAEliminar === null) return;
    startTransition(async () => {
      await eliminarProducto(idAEliminar);
      setIdAEliminar(null);
    });
  };

  // Extraer iniciales para el avatar del proveedor
  const getInitials = (nombre: string) => {
    if (!nombre) return "PR";
    return nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* MÉTRICAS GLOBALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8E1B3A]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Package size={24}/></div>
          <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-bold mb-1">Total Catálogo</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif font-bold text-[#5A0F24]">{totalProductos}</p>
            <div className="h-1 w-6 rounded-full bg-[#8E1B3A]" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8E1B3A]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-[#2D7A47] group-hover:opacity-20 transition-opacity"><CheckCircle2 size={24}/></div>
          <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-bold mb-1">Activos</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif font-bold text-[#2A0E18]">{activos}</p>
            <div className="h-1 w-6 rounded-full bg-[#2D7A47]" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8E1B3A]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-[#8C5E08] group-hover:opacity-20 transition-opacity"><AlertCircle size={24}/></div>
          <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-bold mb-1">En Revisión</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif font-bold text-[#2A0E18]">{enRevision}</p>
            <div className="h-1 w-6 rounded-full bg-[#8C5E08]" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8E1B3A]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-[#A32D2D] group-hover:opacity-20 transition-opacity"><XCircle size={24}/></div>
          <p className="text-[10px] text-[#7A5260] uppercase tracking-wider font-bold mb-1">Desactivados</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif font-bold text-[#2A0E18]">{desactivados}</p>
            <div className="h-1 w-6 rounded-full bg-[#A32D2D]" />
          </div>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS (Filtros y Búsqueda) */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#8E1B3A]/10 p-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={18} />
          <input
            type="text"
            placeholder="Buscar por producto o proveedor..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="w-full bg-white text-sm border border-[#8E1B3A]/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="flex-1 lg:w-48 bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:border-[#8E1B3A]/30"
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="flex-1 lg:w-40 bg-white text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2.5 outline-none text-[#7A5260] cursor-pointer hover:border-[#8E1B3A]/30"
          >
            <option value="Todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="revision">En revisión</option>
            <option value="desactivado">Desactivado</option>
          </select>
        </div>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden relative">
        {/* Overlay de carga */}
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
          </div>
        )}

        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Inventario Global</h3>
          <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {productosFiltrados.length} Resultados
          </span>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-[#7A5260] text-sm">No se encontraron productos con los filtros actuales.</div>
        ) : (
          <>
            {/* Vista Mobile (Tarjetas) */}
            <div className="block lg:hidden p-3 space-y-3">
              {productosFiltrados.map((p) => (
                <div key={p.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-3 relative">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {getInitials(p.proveedor)}
                    </div>
                    <div className="pr-6">
                      <p className="text-sm font-bold text-[#2A0E18] leading-tight mb-0.5">{p.nombre}</p>
                      <p className="text-xs text-[#7A5260] truncate">{p.proveedor}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-[#7A5260] bg-[#FAF3EC] px-2 py-1 rounded-md">{p.categoria}</span>
                    <span className="text-xs font-bold text-[#5A0F24]">{p.precio}</span>
                    <div className="flex items-center gap-1 text-xs text-[#8C5E08]">
                      <Star size={12} fill="currentColor" /> {p.calificacion}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-[#8E1B3A]/5 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${estadoPill[p.estado]}`}>
                        {p.estado}
                      </span>
                      <span className="text-xs text-[#7A5260]">Stock: <strong className={p.stock < 5 ? "text-[#A32D2D]" : ""}>{p.stock}</strong></span>
                    </div>
                    
                    {/* Botones de Acción Mobile */}
                    <div className="flex flex-wrap gap-1">
                      <Link href={`/admin/productos/${p.id}`} className="p-1.5 hover:bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A] transition-colors text-xs font-medium">
                        Ver
                      </Link>
                      <Link href={`/admin/productos/${p.id}/editar`} className="p-1.5 hover:bg-[#8C5E08]/5 rounded-lg text-[#8C5E08] transition-colors text-xs font-medium">
                        Editar
                      </Link>
                      <button onClick={() => handleToggle(p.id, p.activo)} className="p-1.5 hover:bg-[#7A5260]/10 rounded-lg text-[#7A5260] transition-colors text-xs font-medium">
                        {p.activo ? 'Pausar' : 'Activar'}
                      </button>
                      <button onClick={() => handleEliminar(p.id)} className="p-1.5 hover:bg-[#A32D2D]/5 rounded-lg text-[#A32D2D] transition-colors text-xs font-medium">
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Desktop (Tabla) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#FDFBF9]/30">
                    {["Producto", "Proveedor", "Categoría", "Precio", "Stock", "Cal.", "Estado", "Acciones"].map((h) => (
                      <th key={h} className="px-5 py-3 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E1B3A]/5">
                  {productosFiltrados.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FDFBF9] transition-colors group">
                      <td className="px-5 py-3">
                        <p className="text-sm font-bold text-[#2A0E18] max-w-[200px] truncate" title={p.nombre}>{p.nombre}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {getInitials(p.proveedor)}
                          </div>
                          <span className="text-xs text-[#7A5260] max-w-[150px] truncate" title={p.proveedor}>{p.proveedor}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#7A5260]">{p.categoria}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#5A0F24]">{p.precio}</td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-medium ${p.stock < 5 ? 'text-[#A32D2D]' : 'text-[#2A0E18]'}`}>
                          {p.stock} <span className="text-[10px] text-[#7A5260] font-normal uppercase">u.</span>
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-xs font-medium text-[#8C5E08]">
                          <Star size={12} fill="currentColor" /> {p.calificacion}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${estadoPill[p.estado]}`}>
                          {p.estado}
                        </span>
                      </td>
                      
                      {/* Botones de Acción Desktop */}
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/productos/${p.id}`}
                            className="text-[11px] px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity bg-[#8E1B3A]/10 text-[#8E1B3A]"
                          >
                            Ver
                          </Link>
                          <Link 
                            href={`/admin/productos/${p.id}/editar`}
                            className="text-[11px] px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity bg-[#FDF5E6] text-[#8C5E08]"
                          >
                            Editar
                          </Link>
                          <button 
                            onClick={() => handleToggle(p.id, p.activo)} 
                            className="text-[11px] px-3 py-1.5 rounded-lg font-medium hover:bg-[#F1EFE8] transition-colors border border-[#8E1B3A]/10 text-[#7A5260]"
                          >
                            {p.activo ? 'Pausar' : 'Activar'}
                          </button>
                          <button 
                            onClick={() => handleEliminar(p.id)}
                            className="text-[11px] px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity bg-[#FBF0F0] text-[#A32D2D]"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ModalConfirmacion
        isOpen={modalEliminarOpen}
        onClose={() => setModalEliminarOpen(false)}
        onConfirm={confirmarEliminacion}
        titulo="Eliminar Producto"
        mensaje="¿Estás seguro de que deseas eliminar este producto? Esta acción lo desactivará del catálogo y no podrá deshacerse fácilmente."
        confirmText="Eliminar"
        cancelText="Volver"
        isDestructive={true}
      />
    </div>
  );
}