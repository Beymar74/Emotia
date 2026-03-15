import React, { useState } from 'react';
import { Search, Filter, Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

// ─── Datos Mock del Catálogo ───
const PRODUCTS = [
  { id: 1, title: 'Caja Botánica "Calma"', category: 'Plantas & Bienestar', price: '180', rating: 4.8, reviews: 124, isNew: true, img: '🪴', vendor: 'Vivero Illimani' },
  { id: 2, title: 'Kit "Tarde de Café"', category: 'Gastronomía', price: '220', rating: 4.9, reviews: 89, isNew: false, img: '☕', vendor: 'Café Coroico Premium' },
  { id: 3, title: 'Experiencia Spa en Casa', category: 'Cuidado Personal', price: '250', rating: 4.7, reviews: 56, isNew: false, img: '🕯️', vendor: 'Esencias Andinas' },
  { id: 4, title: 'Arreglo "Amanecer Paceño"', category: 'Flores', price: '150', rating: 4.6, reviews: 210, isNew: false, img: '💐', vendor: 'Florería Girasol' },
  { id: 5, title: 'Set de Chocolates Finos', category: 'Gastronomía', price: '120', rating: 4.9, reviews: 340, isNew: true, img: '🍫', vendor: 'Cacao Amazónico' },
  { id: 6, title: 'Joyería Artesanal en Plata', category: 'Accesorios', price: '350', rating: 5.0, reviews: 42, isNew: false, img: '💍', vendor: 'Orfebrería Illampu' },
  { id: 7, title: 'Cena Romántica para Dos', category: 'Experiencias', price: '450', rating: 4.8, reviews: 15, isNew: true, img: '🍷', vendor: 'Restaurante Sopocachi' },
  { id: 8, title: 'Set de Cuadernos Tejidos', category: 'Artesanía', price: '90', rating: 4.5, reviews: 78, isNew: false, img: '📓', vendor: 'Arte Textil Andino' },
];

const CATEGORIES = ["Todos", "Sugerencias IA ✨", "Plantas & Bienestar", "Gastronomía", "Flores", "Experiencias", "Artesanía"];

export default function Catalogo({ navigate }: { navigate: (t: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCategory = activeCategory === "Todos" || (activeCategory === "Sugerencias IA ✨" && p.rating >= 4.8) || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* ─── Encabezado del Catálogo ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '8px' }}>
            Explora el <em style={{ color: COLORS.garnet }}>catálogo</em>
          </h1>
          <p style={{ color: COLORS.gray, fontSize: '1rem', maxWidth: '500px' }}>
            Encuentra el detalle perfecto apoyando a emprendedores, artesanos y productores locales de La Paz.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Barra de Búsqueda */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: `1px solid rgba(188, 153, 104, 0.3)`, borderRadius: '100px', padding: '10px 20px', width: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Search size={18} color={COLORS.gray} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o tienda..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: '8px', width: '100%', fontSize: '0.9rem', color: COLORS.choco, fontFamily: 'inherit' }}
            />
          </div>
          <button style={{ background: 'white', border: `1px solid rgba(188, 153, 104, 0.3)`, borderRadius: '100px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: COLORS.choco, fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      {/* ─── Píldoras de Categorías ─── */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              background: activeCategory === cat ? COLORS.garnet : 'white',
              color: activeCategory === cat ? 'white' : COLORS.choco,
              border: activeCategory === cat ? 'none' : `1px solid rgba(188, 153, 104, 0.3)`,
              padding: '8px 20px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              boxShadow: activeCategory === cat ? `0 4px 12px ${COLORS.garnet}40` : '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Grilla de Productos ─── */}
      {filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', position: 'relative' }} 
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(90, 15, 36, 0.08)`; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Etiqueta Nuevo */}
              {product.isNew && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: COLORS.gold, color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', zIndex: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Nuevo
                </div>
              )}
              
              {/* Botón Favorito */}
              <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Heart size={18} color={COLORS.gray} />
              </button>

              {/* Imagen/Placeholder del Producto */}
              <div style={{ height: '220px', background: `linear-gradient(135deg, ${COLORS.beige}40, ${COLORS.beige})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', position: 'relative' }}>
                {product.img}
              </div>

              {/* Info del Producto */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ color: COLORS.gold, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: COLORS.choco, fontWeight: 600 }}>
                    <Star size={14} fill={COLORS.gold} color={COLORS.gold} /> {product.rating}
                  </div>
                </div>
                
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.title}
                </h3>
                
                <p style={{ color: COLORS.gray, fontSize: '0.85rem', marginBottom: '16px' }}>por {product.vendor}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: COLORS.garnet }}>
                    {product.price} <span style={{ fontSize: '0.8rem', color: COLORS.gray, fontWeight: 500 }}>Bs.</span>
                  </div>
                  <button style={{ background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, color: 'white', border: 'none', padding: '10px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: `0 4px 12px ${COLORS.garnet}30`, transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <ShoppingBag size={16} /> Personalizar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: COLORS.bordeaux, marginBottom: '8px' }}>No encontramos resultados</h3>
          <p style={{ color: COLORS.gray }}>Intenta con otros términos o cambia la categoría de búsqueda.</p>
        </div>
      )}
    </div>
  );
}