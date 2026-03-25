"use client";
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Package, Star, Eye, EyeOff } from 'lucide-react';

const CATEGORIAS = ['Experiencias', 'Cenas', 'Detalles', 'Dulces', 'Flores', 'Spa'];

const MOCK_PRODUCTOS = [
  { id: 1, nombre: 'Caja Sorpresa Spa Botánico', precio: 160, categoria: 'Spa', stock: 12, activo: true, rating: 4.9, ventas: 45, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: 2, nombre: 'Kit Café de Altura', precio: 150, categoria: 'Experiencias', stock: 8, activo: true, rating: 4.8, ventas: 32, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80' },
  { id: 3, nombre: 'Terrario Geométrico', precio: 85, categoria: 'Detalles', stock: 0, activo: false, rating: 4.7, ventas: 18, img: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?w=400&q=80' },
];

type Producto = typeof MOCK_PRODUCTOS[0];

const EMPTY_FORM = { nombre: '', precio: '', categoria: 'Experiencias', stock: '', descripcion: '', img: '' };

export default function ProductosPage() {
  const [productos, setProductos] = useState(MOCK_PRODUCTOS);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openNew = () => { setForm(EMPTY_FORM); setEditando(null); setShowForm(true); };
  const openEdit = (p: Producto) => {
    setForm({ nombre: p.nombre, precio: String(p.precio), categoria: p.categoria, stock: String(p.stock), descripcion: '', img: p.img });
    setEditando(p);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.precio) return;
    if (editando) {
      setProductos(prev => prev.map(p => p.id === editando.id
        ? { ...p, nombre: form.nombre, precio: Number(form.precio), categoria: form.categoria, stock: Number(form.stock), img: form.img || p.img }
        : p
      ));
    } else {
      setProductos(prev => [...prev, {
        id: Date.now(), nombre: form.nombre, precio: Number(form.precio),
        categoria: form.categoria, stock: Number(form.stock), activo: true,
        rating: 0, ventas: 0, img: form.img || 'https://images.unsplash.com/photo-1548842407-f65c929de26e?w=400&q=80'
      }]);
    }
    setShowForm(false);
  };

  const toggleActivo = (id: number) => setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  const eliminar = (id: number) => setProductos(prev => prev.filter(p => p.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-1">Mis Productos</h1>
          <p className="text-[#5C3A2E] text-sm">{productos.length} productos registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(p => (
          <div key={p.id} className={`bg-[#FFFFFF] rounded-2xl overflow-hidden border shadow-sm transition-all ${p.activo ? 'border-[#F5E6D0]' : 'border-gray-200 opacity-60'}`}>
            <div className="h-44 relative overflow-hidden">
              <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.activo ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {p.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              {p.stock === 0 && (
                <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Sin Stock</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#5C3A2E] mb-1 leading-tight">{p.nombre}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-extrabold text-[#8E1B3A]">{p.precio} Bs</span>
                <span className="text-xs bg-[#F5E6D0] text-[#8E1B3A] px-2 py-1 rounded-full font-semibold">{p.categoria}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#B0B0B0] mb-4">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#BC9968] fill-[#BC9968]" />{p.rating}</span>
                <span>Stock: {p.stock}</span>
                <span>{p.ventas} ventas</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-[#F5E6D0] text-[#5C3A2E] hover:bg-[#F5E6D0] transition-colors text-xs font-semibold">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => toggleActivo(p.id)} className="p-2 rounded-xl border border-[#F5E6D0] text-[#B0B0B0] hover:bg-[#F5E6D0] transition-colors">
                  {p.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => eliminar(p.id)} className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5A0F24]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] p-6 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5" /> {editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nombre del Producto *</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" placeholder="Ej: Caja Sorpresa Spa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Precio (Bs) *</label>
                  <input type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})}
                    className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Categoría</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A] text-[#5C3A2E]">
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A] resize-none" rows={3} placeholder="Describe tu producto..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">URL de Imagen</label>
                <input value={form.img} onChange={e => setForm({...form, img: e.target.value})}
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" placeholder="https://..." />
              </div>
            </div>
            <div className="p-4 border-t border-[#F5E6D0] shrink-0">
              <button onClick={handleSave} className="w-full bg-[#8E1B3A] text-white py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
                {editando ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
