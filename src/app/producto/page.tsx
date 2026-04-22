"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, ShoppingCart, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import Header from './components/Header';
import { useCart } from './components/cart/useCart';
import styles from './producto.module.css';

type Producto = {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  seccion: string;
  ocasion: string;
  precio: number;
  rating: number;
  tag: string;
  subTag?: string;
  imageUrl?: string;
  descripcion: string;
};

const productosData: Producto[] = [
  { id: 1, nombre: 'Ramo Premium "Amanecer Rosa"', marca: 'Florería La Rosa', categoria: 'Flores', seccion: 'Para Ella', ocasion: 'Cumpleaños', precio: 85, rating: 4.9, tag: 'FLORES', subTag: 'NUEVO', imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80', descripcion: 'Bouquet elegante con rosas, papel coreano y tarjeta personalizada.' },
  { id: 2, nombre: 'Caja Gourmet de Trufas Belgas', marca: 'Sweet Emotions', categoria: 'Dulces', seccion: 'Corporativos', ocasion: 'Agradecimiento', precio: 42.5, rating: 5.0, tag: 'DULCES', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80', descripcion: 'Selección premium de trufas artesanales con presentación de lujo.' },
  { id: 3, nombre: 'Set Globos "Celebración Mágica"', marca: 'Miniso', categoria: 'Decoración', seccion: 'Bebés', ocasion: 'Baby Shower', precio: 55, rating: 4.8, tag: 'DECO', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80', descripcion: 'Kit listo para ambientar celebraciones con un look delicado y moderno.' },
  { id: 4, nombre: 'Collar Plata Ley 925', marca: 'Nuba', categoria: 'Joyas', seccion: 'Para Ella', ocasion: 'Aniversario', precio: 120, rating: 4.7, tag: 'JOYAS', imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80', descripcion: 'Joya minimalista para un detalle sofisticado y memorable.' },
  { id: 5, nombre: 'Diseño Floral "Paraíso Tropical"', marca: 'Florería La Rosa', categoria: 'Flores', seccion: 'Para Ella', ocasion: 'Amor', precio: 95, rating: 4.6, tag: 'FLORES', imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=80', descripcion: 'Arreglo vibrante con follajes y flores exóticas de alto impacto.' },
  { id: 6, nombre: 'Vino Tinto Selección Reserva', marca: 'Michelline', categoria: 'Bebidas', seccion: 'Para Él', ocasion: 'Corporativo', precio: 150, rating: 4.9, tag: 'BEBIDAS', subTag: 'TOP', imageUrl: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=900&q=80', descripcion: 'Etiqueta seleccionada para ocasiones especiales y obsequios ejecutivos.' },
  { id: 7, nombre: 'Macarons Franceses x12', marca: 'Michelline', categoria: 'Dulces', seccion: 'Para Ella', ocasion: 'Cumpleaños', precio: 65, rating: 4.9, tag: 'DULCES', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=900&q=80', descripcion: 'Caja delicada con sabores surtidos y acabado premium.' },
  { id: 8, nombre: 'Lámpara de Escritorio LED', marca: 'Miniso', categoria: 'Decoración', seccion: 'Para Él', ocasion: 'Graduación', precio: 89, rating: 4.5, tag: 'DECO', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', descripcion: 'Accesorio funcional con estética limpia para escritorio o estudio.' },
  { id: 9, nombre: 'Caja Spa "Calma Total"', marca: 'Nuba', categoria: 'Bienestar', seccion: 'Para Ella', ocasion: 'Agradecimiento', precio: 134, rating: 4.8, tag: 'SPA', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', descripcion: 'Incluye velas, aceites, sales y texturas para una experiencia relajante.' },
  { id: 10, nombre: 'Desayuno Sorpresa Signature', marca: 'Sweet Emotions', categoria: 'Desayunos', seccion: 'Para Ella', ocasion: 'Cumpleaños', precio: 110, rating: 4.9, tag: 'BREAKFAST', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80', descripcion: 'Bandeja de desayuno con flores, repostería y detalles personalizados.' },
  { id: 11, nombre: 'Kit Ejecutivo de Café', marca: 'Michelline', categoria: 'Bebidas', seccion: 'Corporativos', ocasion: 'Corporativo', precio: 98, rating: 4.7, tag: 'OFFICE', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', descripcion: 'Blend especial, taza y empaque sobrio para regalos de oficina.' },
  { id: 12, nombre: 'Pulsera Charm Corazón', marca: 'Nuba', categoria: 'Joyas', seccion: 'Para Ella', ocasion: 'Amor', precio: 76, rating: 4.6, tag: 'JOYAS', imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80', descripcion: 'Pieza delicada de uso diario con un acento romántico.' },
  { id: 13, nombre: 'Box Recién Nacido', marca: 'Miniso', categoria: 'Bebés', seccion: 'Bebés', ocasion: 'Baby Shower', precio: 140, rating: 4.8, tag: 'BABY', subTag: 'GIFT BOX', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80', descripcion: 'Set con accesorios suaves y presentación ideal para bienvenida.' },
  { id: 14, nombre: 'Rosas Eternas en Cúpula', marca: 'Florería La Rosa', categoria: 'Flores', seccion: 'Para Ella', ocasion: 'Aniversario', precio: 180, rating: 5.0, tag: 'FLORES', imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80', descripcion: 'Detalle decorativo de larga duración con acabado de boutique.' },
  { id: 15, nombre: 'Mini Cake de Pistacho', marca: 'Sweet Emotions', categoria: 'Dulces', seccion: 'Para Él', ocasion: 'Cumpleaños', precio: 58, rating: 4.7, tag: 'DULCES', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', descripcion: 'Pastel pequeño de textura suave para celebraciones íntimas.' },
  { id: 16, nombre: 'Set Terraza & Vino', marca: 'Michelline', categoria: 'Experiencias', seccion: 'Para Él', ocasion: 'Aniversario', precio: 210, rating: 4.9, tag: 'EXPERIENCIA', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80', descripcion: 'Selección pensada para compartir una noche especial.' },
];

const secciones = ['Todas', 'Para Ella', 'Para Él', 'Corporativos', 'Bebés'];
const categorias = ['Todas', 'Flores', 'Joyas', 'Dulces', 'Decoración', 'Bebidas', 'Bienestar', 'Desayunos', 'Bebés', 'Experiencias'];
const ocasiones = ['Todas', 'Cumpleaños', 'Aniversario', 'Agradecimiento', 'Amor', 'Baby Shower', 'Graduación', 'Corporativo'];
const marcas = ['Todas', 'Florería La Rosa', 'Michelline', 'Miniso', 'Nuba', 'Sweet Emotions'];

type ProductSection = {
  id: string;
  title: string;
  subtitle: string;
  items: Producto[];
};

export default function CatalogoPage() {
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [seccion, setSeccion] = useState('Todas');
  const [categoria, setCategoria] = useState('Todas');
  const [ocasion, setOcasion] = useState('Todas');
  const [marca, setMarca] = useState('Todas');
  const [maxPrecio, setMaxPrecio] = useState(250);
  const [orden, setOrden] = useState('destacados');

  const productosFiltrados = useMemo(() => {
    const base = productosData.filter((producto) => {
      const matchesQuery =
        query.trim() === '' ||
        producto.nombre.toLowerCase().includes(query.toLowerCase()) ||
        producto.marca.toLowerCase().includes(query.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(query.toLowerCase()) ||
        producto.ocasion.toLowerCase().includes(query.toLowerCase());

      const matchesSeccion = seccion === 'Todas' || producto.seccion === seccion;
      const matchesCategoria = categoria === 'Todas' || producto.categoria === categoria;
      const matchesOcasion = ocasion === 'Todas' || producto.ocasion === ocasion;
      const matchesMarca = marca === 'Todas' || producto.marca === marca;
      const matchesPrecio = producto.precio <= maxPrecio;

      return matchesQuery && matchesSeccion && matchesCategoria && matchesOcasion && matchesMarca && matchesPrecio;
    });

    const sorted = [...base];

    switch (orden) {
      case 'precio-asc':
        sorted.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        sorted.sort((a, b) => b.precio - a.precio);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'nombre':
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        sorted.sort((a, b) => b.rating - a.rating || a.precio - b.precio);
    }

    return sorted;
  }, [categoria, marca, maxPrecio, ocasion, orden, query, seccion]);

  const limpiarFiltros = () => {
    setQuery('');
    setSeccion('Todas');
    setCategoria('Todas');
    setOcasion('Todas');
    setMarca('Todas');
    setMaxPrecio(250);
    setOrden('destacados');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    seccion !== 'Todas' ||
    categoria !== 'Todas' ||
    ocasion !== 'Todas' ||
    marca !== 'Todas' ||
    maxPrecio !== 250;

  const productSections = useMemo<ProductSection[]>(() => {
    if (productosFiltrados.length === 0) return [];

    if (hasActiveFilters) {
      return [
        {
          id: 'resultados',
          title: 'Resultados del catálogo',
          subtitle: 'Productos que coinciden con tu búsqueda y filtros activos.',
          items: productosFiltrados,
        },
      ];
    }

    const destacados = productosFiltrados.slice(0, 4);
    const paraElla = productosFiltrados.filter((producto) => producto.seccion === 'Para Ella').slice(0, 5);
    const corporativos = productosFiltrados.filter((producto) => producto.seccion === 'Corporativos' || producto.ocasion === 'Corporativo').slice(0, 5);

    return [
      {
        id: 'destacados',
        title: 'Vuelve a ver estos artículos',
        subtitle: 'Selección breve para explorar rápido sin agrandar de más las tarjetas.',
        items: destacados,
      },
      {
        id: 'para-ella',
        title: 'Regalos personalizados para mamá',
        subtitle: 'Detalles con un aire más emocional, delicado y personal.',
        items: paraElla.length > 0 ? paraElla : productosFiltrados.slice(4, 9),
      },
      {
        id: 'corporativos',
        title: 'Selecciones ejecutivas en tus compras',
        subtitle: 'Opciones sobrias, premium y fáciles de comparar.',
        items: corporativos.length > 0 ? corporativos : productosFiltrados.slice(8, 13),
      },
    ].filter((section) => section.items.length > 0);
  }, [hasActiveFilters, productosFiltrados]);

  return (
    <div className={styles.pageContainer}>
      <Header
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar regalos, marcas, categorías u ocasión..."
      />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <div>
              <h2 className={styles.filterTitle}>Filtros inteligentes</h2>
            </div>
            <span className={styles.filterIconWrap}>
              <SlidersHorizontal size={18} strokeWidth={2} />
            </span>
          </div>

          <section className={styles.section}>
            <h4 className={styles.label}>Secciones</h4>
            <div className={styles.chipGrid}>
              {secciones.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.chip} ${seccion === item ? styles.activeChip : ''}`}
                  onClick={() => setSeccion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h4 className={styles.label}>Categorias</h4>
            <div className={styles.chipGrid}>
              {categorias.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.chip} ${categoria === item ? styles.activeChip : ''}`}
                  onClick={() => setCategoria(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h4 className={styles.label}>Ocasion</h4>
            <div className={styles.chipGrid}>
              {ocasiones.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.chip} ${ocasion === item ? styles.activeChip : ''}`}
                  onClick={() => setOcasion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.selectHeader}>
              <h4 className={styles.label}>Marca</h4>
              <ChevronDown size={15} strokeWidth={2} className={styles.selectHeaderIcon} />
            </div>
            <select className={styles.selectControl} value={marca} onChange={(e) => setMarca(e.target.value)}>
              {marcas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          <section className={styles.section}>
            <div className={styles.priceHeader}>
              <h4 className={styles.label}>Precio maximo</h4>
              <span className={styles.priceValue}>Bs. {maxPrecio}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="25"
              max="250"
              step="5"
              value={maxPrecio}
              onChange={(e) => setMaxPrecio(Number(e.target.value))}
            />
            <div className={styles.priceDisplay}>
              <span className={styles.priceInput}>Bs. 25</span>
              <span className={styles.separator}>-</span>
              <span className={styles.priceInput}>Bs. 250</span>
            </div>
          </section>

          <div className={styles.sidebarActions}>
            <button type="button" className={styles.btnApply}>
              {productosFiltrados.length} resultados
            </button>
            <button type="button" className={styles.btnClear} onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.heroBar}>
            <div>
              <h1 className={styles.heroTitle}>Catálogo</h1>
            </div>
            <div className={styles.toolbarRight}>
              <span className={styles.resultsCount}>{productosFiltrados.length} productos</span>
              <select className={styles.sortDropdown} value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="destacados">Ordenar: destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="rating">Mejor calificados</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <Sparkles size={24} strokeWidth={2} />
              <h3>No encontramos productos con esos filtros</h3>
              <p>Prueba otra marca, sube el presupuesto o limpia los filtros para ver mas opciones.</p>
              <button type="button" className={styles.btnApply} onClick={limpiarFiltros}>
                Ver todo el catalogo
              </button>
            </div>
          ) : (
            <div className={styles.catalogSections}>
              {productSections.map((section) => (
                <section key={section.id} className={styles.catalogSection}>
                  <div className={styles.sectionIntro}>
                    <div>
                      <h2 className={styles.sectionTitle}>{section.title}</h2>
                      <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                    </div>
                    {!hasActiveFilters ? <span className={styles.sectionLink}>Ver todo</span> : null}
                  </div>

                  <div className={`${styles.productRail} ${hasActiveFilters ? styles.productRailFiltered : ""}`}>
                    {section.items.map((producto) => (
                      <article key={`${section.id}-${producto.id}`} className={styles.productCard}>
                        <div className={styles.imgArea}>
                          <div className={styles.cardTop}>
                            <span className={styles.mainTag}>{producto.tag}</span>
                            <button type="button" className={styles.favBtn} aria-label={`Guardar ${producto.nombre}`}>
                              <Heart size={16} strokeWidth={2} />
                            </button>
                          </div>

                          {producto.subTag ? <span className={styles.subTag}>{producto.subTag}</span> : null}

                          {producto.imageUrl ? (
                            <img src={producto.imageUrl} alt={producto.nombre} className={styles.actualImg} />
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span className={styles.placeholderLabel}>Espacio para imagen</span>
                              <span className={styles.placeholderHint}>Aqui puedes colocar la foto del producto</span>
                            </div>
                          )}
                        </div>

                        <div className={styles.detailsArea}>
                          <div className={styles.metaRow}>
                            <p className={styles.brandName}>{producto.marca}</p>
                            <span className={styles.ratingPill}>
                              <Star size={13} fill="currentColor" strokeWidth={1.7} />
                              {producto.rating.toFixed(1)}
                            </span>
                          </div>

                          <h3 className={styles.productTitle}>{producto.nombre}</h3>
                          <p className={styles.productDescription}>{producto.descripcion}</p>

                          <div className={styles.infoRow}>
                            <span className={styles.infoChip}>{producto.categoria}</span>
                            <span className={styles.infoChip}>{producto.ocasion}</span>
                          </div>

                          <div className={styles.footerRow}>
                            <div className={styles.priceStack}>
                              <p className={styles.currentPrice}>Bs. {producto.precio.toFixed(2)}</p>
                              <p className={styles.sectionHint}>{producto.seccion}</p>
                            </div>

                            <div className={styles.buttonGroup}>
                              <Link href={`/producto/${producto.id}`} className={styles.btnOutline}>
                                Ver detalle
                              </Link>
                              <button
                                type="button"
                                className={styles.btnFilled}
                                aria-label={`Agregar ${producto.nombre} al carrito`}
                                onClick={() =>
                                  addItem({
                                    id: producto.id,
                                    name: producto.nombre,
                                    brand: producto.marca,
                                    price: producto.precio,
                                    imageUrl: producto.imageUrl,
                                    subtitle: `${producto.categoria} / ${producto.ocasion}`,
                                  })
                                }
                              >
                                <ShoppingCart size={16} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
