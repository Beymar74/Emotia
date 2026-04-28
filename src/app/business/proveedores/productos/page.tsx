"use client";

import React, { useState, useRef } from "react";
import { 
  Search, Plus, Filter, Edit3, Trash2, ImageIcon,
  X, PackagePlus, Settings2, Loader2, UploadCloud
} from "lucide-react";

// Tipo para nuestros productos
interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: string;
  stock: number;
  activo: boolean;
  imagen: string | null;
}

export default function ProductosPage() {
  // Estados para modales y carga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Referencia para el input de archivo oculto (Subida de imágenes)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  // Estado para el formulario (Agregar o Editar)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "Personalizados",
    permiteMensaje: true,
    empaquePremium: false
  });

  // Datos simulados iniciales
  const [productos, setProductos] = useState<Producto[]>([
    { id: "PRD-001", nombre: "Caja Sorpresa Premium", categoria: "Regalos Compuestos", precio: "150", stock: 12, activo: true, imagen: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&h=150&fit=crop&q=80" },
    { id: "PRD-002", nombre: "Arreglo Floral + Peluche", categoria: "Flores", precio: "220", stock: 5, activo: true, imagen: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=150&h=150&fit=crop&q=80" },
    { id: "PRD-003", nombre: "Taza Personalizada Mágica", categoria: "Personalizados", precio: "45", stock: 0, activo: false, imagen: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=150&h=150&fit=crop&q=80" },
    { id: "PRD-004", nombre: "Set de Chocolates Artesanales", categoria: "Dulces", precio: "85", stock: 30, activo: true, imagen: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=150&h=150&fit=crop&q=80" },
  ]);

  // --- LÓGICA DE FILTRADO (Búsqueda + Categorías) ---
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || producto.id.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = filtroCategoria === "Todas" || producto.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  // --- LÓGICA DE ACCIONES DE LA TABLA ---
  const toggleActivo = (id: string) => {
    setProductos(productos.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  };

  const handleEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" de tu catálogo?`)) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const abrirModalNuevo = () => {
    setProductoEditando(null);
    setFormData({ nombre: "", precio: "", stock: "", categoria: "Personalizados", permiteMensaje: true, empaquePremium: false });
    setImagenPreview(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormData({ 
      nombre: producto.nombre, 
      precio: producto.precio, 
      stock: producto.stock.toString(), 
      categoria: producto.categoria,
      permiteMensaje: true, 
      empaquePremium: false 
    });
    setImagenPreview(producto.imagen);
    setIsModalOpen(true);
  };

  // --- LÓGICA DE SUBIDA DE IMAGEN ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Creamos una URL temporal para mostrar la vista previa
      const imageUrl = URL.createObjectURL(file);
      setImagenPreview(imageUrl);
    }
  };

  // --- LÓGICA DE GUARDAR (Nuevo o Editar) ---
  const handleGuardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      if (productoEditando) {
        // Editando existente
        setProductos(productos.map(p => p.id === productoEditando.id ? {
          ...p,
          nombre: formData.nombre,
          precio: formData.precio,
          stock: parseInt(formData.stock),
          categoria: formData.categoria,
          imagen: imagenPreview
        } : p));
      } else {
        // Creando nuevo
        const nuevoProducto: Producto = {
          id: `PRD-00${productos.length + 5}`, // Generador de ID simple
          nombre: formData.nombre,
          categoria: formData.categoria,
          precio: formData.precio,
          stock: parseInt(formData.stock),
          activo: true,
          imagen: imagenPreview || "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=150&h=150&fit=crop&q=80" // Imagen por defecto si no suben
        };
        setProductos([nuevoProducto, ...productos]);
      }
      setIsSaving(false);
      setIsModalOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Catálogo de Productos</h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">Gestiona tu inventario, precios y opciones de personalización.</p>
        </div>
        
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 active:scale-95"
        >
          <Plus size={18} /> Añadir Producto
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between z-10 relative">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* SELECTOR DE CATEGORÍAS FUNCIONAL */}
        <div className="relative w-full md:w-56 shrink-0">
          <select 
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="appearance-none w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <option value="Todas">Todas las Categorías</option>
            <option value="Regalos Compuestos">Regalos Compuestos</option>
            <option value="Flores">Flores</option>
            <option value="Personalizados">Personalizados</option>
            <option value="Dulces">Dulces</option>
          </select>
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#B0B0B0] text-[11px] uppercase tracking-[0.15em] font-black bg-gray-50/50">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-[#F5E6D0]/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          {producto.imagen ? (
                            <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-400" /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#1A1A1A]">{producto.nombre}</div>
                          <div className="text-xs text-[#BC9968] font-semibold">{producto.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{producto.categoria}</td>
                    <td className="px-6 py-4 font-bold text-[#3D0A1A]">Bs. {producto.precio}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${producto.stock > 0 ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {producto.stock > 0 ? `${producto.stock} und.` : 'Agotado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleActivo(producto.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${producto.activo ? 'bg-[#8E1B3A]' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${producto.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    
                    {/* BOTONES DE ACCIÓN FUNCIONALES */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => abrirModalEditar(producto)}
                          className="p-2 text-gray-400 hover:text-[#BC9968] hover:bg-[#F5E6D0]/50 rounded-lg transition-colors"
                          title="Editar Producto"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleEliminar(producto.id, producto.nombre)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <PackagePlus size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-bold text-gray-700 text-lg">No hay resultados</p>
                    <p className="text-sm mt-1">Intenta ajustando los filtros o la búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AÑADIR / EDITAR PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D0A1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fb]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#F5E6D0] text-[#8E1B3A] rounded-xl flex items-center justify-center">
                  {productoEditando ? <Edit3 size={20} /> : <PackagePlus size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#3D0A1A]">
                    {productoEditando ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Configura los detalles para tu catálogo</p>
                </div>
              </div>
              <button 
                onClick={() => !isSaving && setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                disabled={isSaving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <form id="productForm" onSubmit={handleGuardarProducto} className="space-y-8">
                
                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">1. Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto *</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Ej. Caja Sorpresa de Cumpleaños" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none transition-all" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Precio (Bs.) *</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        placeholder="0.00" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Stock Disponible *</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="Cantidad en inventario" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none transition-all" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Categoría *</label>
                      <select 
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none transition-all bg-white"
                      >
                        <option value="Regalos Compuestos">Regalos Compuestos</option>
                        <option value="Flores">Flores</option>
                        <option value="Personalizados">Personalizados</option>
                        <option value="Dulces">Dulces</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    2. Imagen Principal
                  </h3>
                  
                  {/* INPUT DE ARCHIVO OCULTO */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                  
                  {/* ZONA DE CLICK PARA SUBIR IMAGEN */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center
                      ${imagenPreview ? 'border-gray-200 bg-gray-50 p-2' : 'border-gray-300 hover:bg-gray-50 hover:border-[#BC9968] p-8'}`}
                  >
                    {imagenPreview ? (
                      <>
                        <img src={imagenPreview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <p className="text-white font-bold flex items-center gap-2"><UploadCloud size={18} /> Cambiar Imagen</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                          <ImageIcon size={28} />
                        </div>
                        <p className="text-sm font-bold text-[#1A1A1A]">Haz clic para subir una foto</p>
                        <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG (Recomendado 500x500px)</p>
                      </>
                    )}
                  </div>
                </section>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                form="productForm"
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#8E1B3A] text-white hover:bg-[#5A0F24] shadow-md transition-all active:scale-95 disabled:opacity-70"
              >
                {isSaving ? (
                  <>Guardando... <Loader2 size={16} className="animate-spin" /></>
                ) : (
                  productoEditando ? "Guardar Cambios" : "Añadir al Catálogo"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}