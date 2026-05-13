"use client";

import React, { useMemo, useState } from "react";
import { ShoppingCart, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CatalogProduct } from "../../product-data";
import { recommendGifts } from "../../_lib/recommendation-engine";
import type { GiftRecommendationInput } from "../../_lib/recommendation-types";
import { useCart } from "../../components/cart/useCart";
import styles from "../../producto.module.css";

type SmartCatalogBannerProps = {
  productos: CatalogProduct[];
};

const INITIAL_FORM: GiftRecommendationInput = {
  destinatario: "",
  ocasion: "",
  presupuestoMax: null,
  personalidad: "",
  edad: null,
  necesitaMensaje: true,
  necesitaEmpaque: false,
};

export default function SmartCatalogBanner({ productos }: SmartCatalogBannerProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<GiftRecommendationInput>(INITIAL_FORM);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [addedProductName, setAddedProductName] = useState<string | null>(null);
  const resultados = useMemo(() => {
    if (!hasSearched) return [];
    return recommendGifts(productos, form, 6);
  }, [form, hasSearched, productos]);

  const buscarRecomendaciones = () => {
  setIsSearching(true);
  setHasSearched(false);

  window.setTimeout(() => {
    setHasSearched(true);
    setIsSearching(false);
  }, 650);
};
  const limpiar = () => {
  setForm(INITIAL_FORM);
  setHasSearched(false);
  setIsSearching(false);
};

  const agregarAlCarrito = (producto: CatalogProduct) => {
  addItem({
    id: producto.id,
    name: producto.nombre,
    brand: producto.marca,
    price: producto.precio,
    imageUrl: producto.imageUrl,
    subtitle: `${producto.categoria} / ${producto.ocasion}`,
  });

  setAddedProductName(producto.nombre);

  window.dispatchEvent(new CustomEvent("emotia-cart-highlight"));

  window.setTimeout(() => {
    setAddedProductName(null);
  }, 2600);
};
const abrirCarrito = () => {
  setIsOpen(false);

  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("emotia-cart-open"));
  }, 120);
};
  return (
    <section className={styles.smartBanner}>
      <div className={styles.smartBannerContent}>
        <div className={styles.smartIcon}>
          <Sparkles size={22} />
        </div>

        <div>
          <p className={styles.smartEyebrow}>Catálogo inteligente</p>
          <h2 className={styles.smartTitle}>¿No sabes qué regalar?</h2>
          <p className={styles.smartText}>
            Cuéntanos para quién es, la ocasión y tu presupuesto. Emotia te recomendará productos reales disponibles.
          </p>
        </div>
      </div>

      <button type="button" className={styles.smartButton} onClick={() => setIsOpen(true)}>
        Recomendar regalo
      </button>

      {isOpen && (
        <div className={styles.smartOverlay}>
          <div className={styles.smartModal}>
            <div className={styles.smartModalHeader}>
              <div>
                <p className={styles.smartEyebrow}>Asistente de regalos</p>
                <h3 className={styles.smartModalTitle}>Encuentra el detalle ideal</h3>
              </div>

              <button
                type="button"
                className={styles.smartCloseButton}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar asistente"
              >
                <X size={18} />
              </button>
            </div>
            {addedProductName && (
            <div className={styles.smartAddedNotice}>
                <div>
                <strong>Agregado al carrito</strong>
                <span>{addedProductName}</span>
                </div>

                <button type="button" onClick={abrirCarrito}>
                Ver carrito
                </button>
            </div>
            )}
            <div className={styles.smartGrid}>
              <div className={styles.smartForm}>
                <label>
                  <span>¿Para quién es?</span>
                  <input
                    value={form.destinatario}
                    onChange={(event) =>
                      setForm({ ...form, destinatario: event.target.value })
                    }
                    placeholder="Ej: mi novia, mamá, amigo, niño..."
                  />
                </label>

                <label>
                  <span>Ocasión</span>
                  <input
                    value={form.ocasion}
                    onChange={(event) =>
                      setForm({ ...form, ocasion: event.target.value })
                    }
                    placeholder="Ej: cumpleaños, aniversario, día de la madre..."
                  />
                </label>

                <label>
                  <span>Personalidad o estilo</span>
                  <input
                    value={form.personalidad}
                    onChange={(event) =>
                      setForm({ ...form, personalidad: event.target.value })
                    }
                    placeholder="Ej: romántico, elegante, divertido..."
                  />
                </label>

                <div className={styles.smartTwoColumns}>
                  <label>
                    <span>Presupuesto máximo</span>
                    <input
                      type="number"
                      min={0}
                      value={form.presupuestoMax ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          presupuestoMax: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      placeholder="Ej: 150"
                    />
                  </label>

                  <label>
                    <span>Edad aproximada</span>
                    <input
                      type="number"
                      min={0}
                      value={form.edad ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          edad: event.target.value ? Number(event.target.value) : null,
                        })
                      }
                      placeholder="Ej: 25"
                    />
                  </label>
                </div>

                <div className={styles.smartChecks}>
                  <label>
                    <input
                      type="checkbox"
                      checked={form.necesitaMensaje}
                      onChange={(event) =>
                        setForm({ ...form, necesitaMensaje: event.target.checked })
                      }
                    />
                    <span>Con mensaje personalizado</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={form.necesitaEmpaque}
                      onChange={(event) =>
                        setForm({ ...form, necesitaEmpaque: event.target.checked })
                      }
                    />
                    <span>Con empaque especial</span>
                  </label>
                </div>

                <div className={styles.smartFormActions}>
                  <button
                    type="button"
                    className={styles.smartPrimaryButton}
                    onClick={buscarRecomendaciones}
                  >
                    Ver recomendaciones
                  </button>

                  <button
                    type="button"
                    className={styles.smartSecondaryButton}
                    onClick={limpiar}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className={styles.smartResults}>
                {isSearching ? (
                    <div className={styles.smartEmpty}>
                    <div className={styles.smartLoader} />
                    <p>Analizando el catálogo y buscando las mejores opciones...</p>
                    </div>
                ) : !hasSearched ? (
                    <div className={styles.smartEmpty}>
                    <Sparkles size={34} />
                    <p>
                      Completa los datos y te mostraremos recomendaciones reales del catálogo.
                    </p>
                  </div>
                ) : resultados.length === 0 ? (
                  <div className={styles.smartEmpty}>
                    <p>
                      No encontramos coincidencias fuertes. Prueba con otro presupuesto, ocasión o estilo.
                    </p>
                  </div>
                ) : (
                  resultados.map(({ producto, reasons }) => (
                    <article key={producto.id} className={styles.smartProduct}>
                      <button
                        type="button"
                        className={styles.smartProductImage}
                        onClick={() => router.push(`/producto/${producto.id}`)}
                      >
                        {producto.imageUrl ? (
                          <img src={producto.imageUrl} alt={producto.nombre} />
                        ) : (
                          <Sparkles size={24} />
                        )}
                      </button>

                      <div className={styles.smartProductInfo}>
                        <p className={styles.smartProductBrand}>{producto.marca}</p>
                        <h4>{producto.nombre}</h4>
                        <strong>Bs. {producto.precio.toFixed(2)}</strong>

                        {reasons[0] && (
                          <p className={styles.smartReason}>{reasons[0]}</p>
                        )}

                        <div className={styles.smartProductActions}>
                          <button
                            type="button"
                            onClick={() => router.push(`/producto/${producto.id}`)}
                          >
                            Ver detalle
                          </button>

                          <button
                            type="button"
                            onClick={() => agregarAlCarrito(producto)}
                            aria-label={`Agregar ${producto.nombre} al carrito`}
                          >
                            <ShoppingCart size={15} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}