"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ShoppingCart, SlidersHorizontal, Sparkles } from "lucide-react";
import Header from "../components/Header";
import { useCart } from "../components/cart/useCart";
import type { CatalogProduct } from "../product-data";
import styles from "../producto.module.css";

type ProductSectionAction =
  | { kind: "orden"; value: "ventas" | "rating" | "precio-asc" }
  | { kind: "precio"; value: number }
  | { kind: "categoria"; value: string };

type ProductSection = {
  id: string;
  title: string;
  subtitle: string;
  tone: "garnet" | "peach" | "cream";
  items: CatalogProduct[];
  action?: ProductSectionAction;
};

type CatalogoClientProps = {
  productos: CatalogProduct[];
  secciones: string[];
  categorias: string[];
  ocasiones: string[];
  marcas: string[];
  precioMaximoInicial: number;
};

export default function CatalogoClient({
  productos,
  secciones,
  categorias,
  ocasiones,
  marcas,
  precioMaximoInicial,
}: CatalogoClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [seccion, setSeccion] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [ocasion, setOcasion] = useState("Todas");
  const [marca, setMarca] = useState("Todas");
  const [maxPrecio, setMaxPrecio] = useState(precioMaximoInicial);
  const [orden, setOrden] = useState("destacados");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sliderMin = 25;
  const sliderMax = Math.max(precioMaximoInicial, sliderMin);

  const productosFiltrados = useMemo(() => {
    const queryValue = query.trim().toLowerCase();

    const base = productos.filter((producto) => {
      const matchesQuery =
        queryValue === "" ||
        producto.nombre.toLowerCase().includes(queryValue) ||
        producto.marca.toLowerCase().includes(queryValue) ||
        producto.categoria.toLowerCase().includes(queryValue) ||
        producto.ocasion.toLowerCase().includes(queryValue);

      const matchesSeccion = seccion === "Todas" || producto.seccion === seccion;
      const matchesCategoria = categoria === "Todas" || producto.categoria === categoria;
      const matchesOcasion = ocasion === "Todas" || producto.ocasion === ocasion;
      const matchesMarca = marca === "Todas" || producto.marca === marca;
      const matchesPrecio = producto.precio <= maxPrecio;

      return matchesQuery && matchesSeccion && matchesCategoria && matchesOcasion && matchesMarca && matchesPrecio;
    });

    const sorted = [...base];

    switch (orden) {
      case "ventas":
        sorted.sort((a, b) => b.ventas - a.ventas || b.rating - a.rating || a.precio - b.precio);
        break;
      case "precio-asc":
        sorted.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        sorted.sort((a, b) => b.precio - a.precio);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "nombre":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        break;
      default:
        sorted.sort((a, b) => b.rating - a.rating || a.precio - b.precio);
    }

    return sorted;
  }, [categoria, marca, maxPrecio, ocasion, orden, productos, query, seccion]);

  const limpiarFiltros = () => {
    setQuery("");
    setSeccion("Todas");
    setCategoria("Todas");
    setOcasion("Todas");
    setMarca("Todas");
    setMaxPrecio(precioMaximoInicial);
    setOrden("destacados");
  };

  const abrirDetalle = (productId: number) => {
    router.push(`/producto/${productId}`);
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>, producto: CatalogProduct) => {
    event.stopPropagation();

    addItem({
      id: producto.id,
      name: producto.nombre,
      brand: producto.marca,
      price: producto.precio,
      imageUrl: producto.imageUrl,
      subtitle: `${producto.categoria} / ${producto.ocasion}`,
    });
  };

  const handleOpenDetails = (event: React.MouseEvent<HTMLButtonElement>, productId: number) => {
    event.stopPropagation();
    abrirDetalle(productId);
  };

  const handleSectionViewAll = (section: ProductSection) => {
    if (!section.action) return;

    setQuery("");
    setSeccion("Todas");
    setCategoria("Todas");
    setOcasion("Todas");
    setMarca("Todas");
    setMaxPrecio(precioMaximoInicial);
    setOrden("destacados");

    if (section.action.kind === "orden") {
      setOrden(section.action.value);
      return;
    }

    if (section.action.kind === "precio") {
      setMaxPrecio(Math.min(section.action.value, precioMaximoInicial));
      setOrden("precio-asc");
      return;
    }

    setCategoria(section.action.value);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    seccion !== "Todas" ||
    categoria !== "Todas" ||
    ocasion !== "Todas" ||
    marca !== "Todas" ||
    maxPrecio !== precioMaximoInicial;

  const productSections = useMemo<ProductSection[]>(() => {
    if (productosFiltrados.length === 0) return [];

    if (hasActiveFilters) {
      return [
        {
          id: "resultados",
          title: "Resultados del catalogo",
          subtitle: "Productos que coinciden con tu busqueda y filtros activos.",
          tone: "cream",
          items: productosFiltrados,
          action: undefined,
        },
      ];
    }

    const usedProducts = new Set<number>();
    const takeUnique = (items: CatalogProduct[], limit = 6) => {
      const picked = items.filter((item) => !usedProducts.has(item.id)).slice(0, limit);
      picked.forEach((item) => usedProducts.add(item.id));
      return picked;
    };

    const byVentas = [...productosFiltrados]
      .sort((a, b) => b.ventas - a.ventas || b.rating - a.rating || a.precio - b.precio)
      .slice(0, 18);

    const byRating = [...productosFiltrados]
      .sort((a, b) => b.rating - a.rating || b.ventas - a.ventas || a.precio - b.precio)
      .slice(0, 18);

    const preciosOrdenados = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
    const economicoIndex = Math.min(preciosOrdenados.length - 1, Math.max(0, Math.floor(preciosOrdenados.length * 0.35)));
    const precioTopeEconomico = Math.max(50, Math.ceil((preciosOrdenados[economicoIndex]?.precio ?? 100) / 10) * 10);
    const economicos = preciosOrdenados.filter((producto) => producto.precio <= precioTopeEconomico);

    const categoriasDestacadas = [...new Set(productosFiltrados.map((producto) => producto.categoria))]
      .map((nombreCategoria) => ({
        nombreCategoria,
        items: productosFiltrados
          .filter((producto) => producto.categoria === nombreCategoria)
          .sort((a, b) => b.ventas - a.ventas || b.rating - a.rating || a.precio - b.precio),
      }))
      .sort((a, b) => b.items.length - a.items.length)
      .slice(0, 2);

    const categorySections: ProductSection[] = categoriasDestacadas.map((group, index) => ({
      id: `categoria-${group.nombreCategoria.toLowerCase().replace(/\s+/g, "-")}`,
      title: group.nombreCategoria,
      subtitle:
        index === 0
          ? "Una seccion dedicada a una de las categorias mas fuertes del catalogo."
          : "Otra categoria destacada para que el recorrido se sienta mas completo.",
      tone: index % 2 === 0 ? "peach" : "garnet",
      items: takeUnique(group.items),
      action: { kind: "categoria", value: group.nombreCategoria },
    }));

    const sections: ProductSection[] = [
      {
        id: "mas-comprados",
        title: "Mas comprados",
        subtitle: "Los regalos que mas salen y que la gente vuelve a elegir.",
        tone: "garnet",
        items: takeUnique(byVentas),
        action: { kind: "orden", value: "ventas" },
      },
      {
        id: "mejor-valorados",
        title: "Mejor valorados",
        subtitle: "Productos con mejor respuesta y mejor impresion dentro del catalogo.",
        tone: "peach",
        items: takeUnique(byRating),
        action: { kind: "orden", value: "rating" },
      },
      {
        id: "detalles-economicos",
        title: `Detalles por menos de Bs. ${precioTopeEconomico}`,
        subtitle: "Opciones bonitas y faciles de elegir cuando quieres algo mas ligero de precio.",
        tone: "cream",
        items: takeUnique(economicos.sort((a, b) => a.precio - b.precio || b.rating - a.rating)),
        action: { kind: "precio", value: precioTopeEconomico },
      },
      ...categorySections,
    ];

    return sections.filter((section) => section.items.length > 0);
  }, [hasActiveFilters, productosFiltrados]);

  return (
    <div className={styles.pageContainer}>
      <Header
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar regalos, marcas, categorias u ocasion..."
      />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <div>
              <h2 className={styles.filterTitle}>Filtros</h2>
            </div>
            <button
              type="button"
              className={styles.mobileFilterToggle}
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              aria-expanded={mobileFiltersOpen}
              aria-label={mobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <span className={styles.filterIconWrap}>
                <SlidersHorizontal size={18} strokeWidth={2} />
              </span>
              <ChevronDown
                size={18}
                strokeWidth={2.2}
                className={`${styles.mobileFilterChevron} ${mobileFiltersOpen ? styles.mobileFilterChevronOpen : ""}`}
              />
            </button>
          </div>

          <div className={`${styles.sidebarBody} ${mobileFiltersOpen ? styles.sidebarBodyOpen : ""}`}>
            <section className={styles.section}>
              <h4 className={styles.label}>Secciones</h4>
              <div className={styles.chipGrid}>
                {["Todas", ...secciones].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.chip} ${seccion === item ? styles.activeChip : ""}`}
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
                {["Todas", ...categorias].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.chip} ${categoria === item ? styles.activeChip : ""}`}
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
                {["Todas", ...ocasiones].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.chip} ${ocasion === item ? styles.activeChip : ""}`}
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
              <select className={styles.selectControl} value={marca} onChange={(event) => setMarca(event.target.value)}>
                {["Todas", ...marcas].map((item) => (
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
                min={sliderMin}
                max={sliderMax}
                step="5"
                value={maxPrecio}
                onChange={(event) => setMaxPrecio(Number(event.target.value))}
              />
              <div className={styles.priceDisplay}>
                <span className={styles.priceInput}>Bs. {sliderMin}</span>
                <span className={styles.separator}>-</span>
                <span className={styles.priceInput}>Bs. {sliderMax}</span>
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
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.heroBar}>
            <div>
              <h1 className={styles.heroTitle}>Catálogo</h1>
            </div>
            <div className={styles.toolbarRight}>
              <span className={styles.resultsCount}>{productosFiltrados.length} productos</span>
              <select className={styles.sortDropdown} value={orden} onChange={(event) => setOrden(event.target.value)}>
                <option value="destacados">Ordenar: destacados</option>
                <option value="ventas">Ordenar: mas comprados</option>
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
                  <div
                    className={`${styles.sectionShell} ${
                      section.tone === "garnet"
                        ? styles.sectionShellGarnet
                        : section.tone === "peach"
                          ? styles.sectionShellPeach
                          : styles.sectionShellCream
                    }`}
                  >
                    <div className={styles.sectionIntro}>
                      <div>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                        <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                      </div>
                      {!hasActiveFilters && section.action ? (
                        <button
                          type="button"
                          className={styles.sectionLink}
                          onClick={() => handleSectionViewAll(section)}
                        >
                          Ver todo
                        </button>
                      ) : null}
                    </div>

                    <div className={`${styles.productRail} ${hasActiveFilters ? styles.productRailFiltered : ""}`}>
                      {section.items.map((producto) => (
                        <article
                          key={`${section.id}-${producto.id}`}
                          className={styles.productCard}
                          onClick={() => abrirDetalle(producto.id)}
                          onKeyDown={(event) => {
                            if (event.target !== event.currentTarget) return;
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              abrirDetalle(producto.id);
                            }
                          }}
                          role="link"
                          tabIndex={0}
                          aria-label={`Ver detalle de ${producto.nombre}`}
                        >
                          <div className={styles.imgArea}>
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
                            <p className={styles.brandName}>{producto.marca}</p>
                            <h3 className={styles.productTitle}>{producto.nombre}</h3>
                            <p className={styles.currentPrice}>Bs. {producto.precio.toFixed(2)}</p>

                            <div className={styles.footerRow}>
                              <button
                                type="button"
                                className={styles.btnOutline}
                                onClick={(event) => handleOpenDetails(event, producto.id)}
                              >
                                Ver mas detalles
                              </button>
                              <button
                                type="button"
                                className={styles.btnFilled}
                                aria-label={`Agregar ${producto.nombre} al carrito`}
                                onClick={(event) => handleAddToCart(event, producto)}
                              >
                                <ShoppingCart size={16} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
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
