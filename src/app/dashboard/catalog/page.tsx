"use client";
import { useState, useMemo } from 'react';
import { Search, Filter, Star, SlidersHorizontal, X } from 'lucide-react';
import ProductModal from '../components/modals/ProductModal';

const ALL_PRODUCTS = [
  { id: 1, title: 'Kit Café de Altura Local', price: 150, rating: 4.9, reviews: 120, category: 'Experiencias', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Selección de los mejores granos de café tostado artesanal, incluye taza de cerámica y prensa francesa.' },
  { id: 2, title: 'Cena Romántica 2 pax', price: 320, rating: 5.0, reviews: 85, category: 'Cenas', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Experiencia gastronómica inolvidable en un restaurante exclusivo con vista a la ciudad.' },
  { id: 3, title: 'Terrario Personalizado', price: 85, rating: 4.8, reviews: 42, category: 'Detalles', img: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Ecosistema autosustentable en frasco de vidrio geométrico. Perfecto para decorar la oficina.' },
  { id: 4, title: 'Caja Dulces Premium', price: 110, rating: 4.7, reviews: 210, category: 'Dulces', img: 'https://images.unsplash.com/photo-1548842407-f65c929de26e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Caja de madera con selección de chocolates belgas, alfajores artesanales y dedicatoria.' },
  { id: 5, title: 'Set Cuidado Facial Botánico', price: 180, rating: 4.9, reviews: 56, category: 'Detalles', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Productos orgánicos para el cuidado de la piel con esencias naturales.' },
  { id: 6, title: 'Cata de Vinos', price: 250, rating: 4.6, reviews: 34, category: 'Experiencias', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Degustación guiada de 4 vinos de altura con maridaje de quesos locales.' },
];

const CATEGORIES = ['Todos', 'Experiencias', 'Cenas', 'Detalles', 'Dulces'];
const PRICE_RANGES = [
  { label: 'Todos', min: 0, max: 9999 },
  { label: 'Hasta 100 Bs', min: 0, max: 100 },
  { label: '100 - 200 Bs', min: 100, max: 200 },
  { label: '200 - 300 Bs', min: 200, max: 300 },
  { label: 'Más de 300 Bs', min: 300, max: 9999 },
];

export default function CatalogPage() {
  const [activeCat, setActiveCat] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [sortBy, setSortBy] = useState('relevancia');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = useMemo(() => {
    let result = ALL_PRODUCTS;
    if (activeCat !== 'Todos') result = result.filter(p => p.category === activeCat);
    if (searchQuery.trim()) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (sortBy === 'precio-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'precio-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCat, searchQuery, priceRange, sortBy]);

  const hasFilters = activeCat !== 'Todos' || searchQuery || priceRange.label !== 'Todos' || sortBy !== 'relevancia';

  const clearFilters = () => {
    setActiveCat('Todos');
    setSearchQuery('');
    setPriceRange(PRICE_RANGES[0]);
    setSortBy('relevancia');
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-1">Catálogo de Regalos</h1>
          <p className="text-[#5C3A2E] text-sm">{filtered.length} productos encontrados</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Buscador */}
          <div className="flex items-center bg-[#FFFFFF] border border-[#F5E6D0] rounded-full px-4 py-2.5 shadow-sm flex-1 md:w-64 focus-within:ring-2 focus-within:ring-[#BC9968]">
            <Search className="w-4 h-4 text-[#B0B0B0] shrink-0" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar regalo o categoría..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-[#5C3A2E] placeholder-[#B0B0B0]" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#B0B0B0] hover:text-[#8E1B3A]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-full border shadow-sm transition-colors ${showFilters ? 'bg-[#8E1B3A] text-white border-[#8E1B3A]' : 'bg-[#FFFFFF] text-[#5C3A2E] border-[#F5E6D0] hover:bg-[#F5E6D0]'}`}>
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#F5E6D0] shadow-sm mb-6 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-3">Rango de Precio</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(r => (
                  <button key={r.label} onClick={() => setPriceRange(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${priceRange.label === r.label ? 'bg-[#8E1B3A] text-white border-[#8E1B3A]' : 'bg-[#FFFFFF] text-[#5C3A2E] border-[#F5E6D0] hover:border-[#BC9968]'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-3">Ordenar por</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="w-full border border-[#F5E6D0] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#8E1B3A] text-[#5C3A2E]">
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
              </select>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-xs text-[#AB3A50] font-semibold hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Categorías */}
      <div className="flex overflow-x-auto pb-3 mb-8 gap-3">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${activeCat === cat ? 'bg-[#8E1B3A] text-[#FFFFFF] border-[#8E1B3A]' : 'bg-[#FFFFFF] text-[#5C3A2E] border-[#F5E6D0] hover:border-[#BC9968]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-[#F5E6D0] mx-auto mb-4" />
          <p className="text-[#B0B0B0] font-medium">No encontramos regalos con esos filtros.</p>
          <button onClick={clearFilters} className="mt-3 text-[#8E1B3A] font-semibold hover:underline text-sm">Limpiar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} onClick={() => setSelectedProduct(item as any)}
              className="bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-[#F5E6D0] flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-[#FFFFFF]/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg text-[#5A0F24]">{item.price} Bs</div>
                <div className="absolute bottom-3 left-3 bg-[#5A0F24]/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg text-[#FFFFFF]">{item.category}</div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <h4 className="font-bold text-[#5C3A2E] mb-1 leading-tight">{item.title}</h4>
                <p className="text-xs text-[#B0B0B0] flex items-center gap-1 mt-3">
                  <Star className="w-3 h-3 text-[#BC9968] fill-[#BC9968]" /> {item.rating} ({item.reviews} reseñas)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </main>
  );
}
