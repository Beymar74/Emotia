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
   const [recomendacionId, setRecomendacionId] = useState<number | null>(null);
  const [syncedRecommendationIds, setSyncedRecommendationIds] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<GiftRecommendationInput>(INITIAL_FORM);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [addedProductName, setAddedProductName] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiError, setAiError] = useState("");
  const resultados = useMemo(() => {
    if (!hasSearched) return [];
    return recommendGifts(productos, form, 6);
  }, [form, hasSearched, productos]);


const actualizarRecomendacionIA = async (
  recomendacionIdActual: number | null,
  data: {
    productosSugeridos?: number[];
    productoElegido?: number;
    convertidaEnCompra?: boolean;
  }
) => {
  if (!recomendacionIdActual) {
    console.warn("No hay recomendacionId para actualizar:", data);
    return;
  }

  try {
    const response = await fetch("/api/producto/recomendaciones", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recomendacionId: recomendacionIdActual,
        ...data,
      }),
    });

    const rawText = await response.text();

    let result: any = null;

    try {
      result = rawText ? JSON.parse(rawText) : null;
    } catch {
      result = {
        success: false,
        error: "La respuesta del servidor no fue JSON.",
        rawText,
      };
    }

    console.log("PATCH recomendación IA catálogo inteligente:", {
      status: response.status,
      ok: response.ok,
      body: result,
    });

    if (!response.ok) {
  console.warn("No se pudo actualizar recomendación IA:", {
    status: response.status,
    statusText: response.statusText,
    body: result,
  });
}
  } catch (error) {
    console.error("Error actualizando recomendación IA:", error);
  }
};
  const buscarRecomendaciones = async () => {
  setIsSearching(true);
  setHasSearched(false);
  setAiError("");

  const nextResults = recommendGifts(productos, form, 6);
  const nextProductIds = nextResults.map(({ producto }) => producto.id);

  try {
    const response = await fetch("/api/producto/recomendaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: form,
        productosSugeridos: nextProductIds,
      }),
    });

    const rawText = await response.text();

    let result: any = null;

    try {
      result = rawText ? JSON.parse(rawText) : null;
    } catch {
      result = null;
    }

    if (response.ok && result?.success) {
      setRecomendacionId(
        typeof result.recomendacionId === "number"
          ? result.recomendacionId
          : null
      );

      setSyncedRecommendationIds(nextProductIds.join(","));
    } else {
      console.warn("No se pudo registrar recomendación manual:", {
        status: response.status,
        result,
      });
    }
  } catch (error) {
    console.warn("Error registrando recomendación manual:", error);
  }

  window.setTimeout(() => {
    setHasSearched(true);
    setIsSearching(false);
  }, 650);
};
const interpretarConIA = async () => {
  const prompt = freeText.trim();

  if (prompt.length < 4) {
    setAiError("Escribe una idea un poco más completa.");
    return;
  }

  try {
    setIsInterpreting(true);
    setAiError("");

    const response = await fetch("/api/producto/recomendaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setAiError(result.error || "No se pudo interpretar tu idea.");
      return;
    }

    const nextForm = result.intent as GiftRecommendationInput;
    const nextRecomendacionId =
      typeof result.recomendacionId === "number" ? result.recomendacionId : null;

    const nextResults = recommendGifts(productos, nextForm, 6);
    const nextProductIds = nextResults.map(({ producto }) => producto.id);

    setForm(nextForm);
    setRecomendacionId(nextRecomendacionId);
    setSyncedRecommendationIds(nextProductIds.join(","));
    setHasSearched(false);
    setIsSearching(true);

    if (nextRecomendacionId && nextProductIds.length > 0) {
      await actualizarRecomendacionIA(nextRecomendacionId, {
        productosSugeridos: nextProductIds,
      });
    }

    window.setTimeout(() => {
      setHasSearched(true);
      setIsSearching(false);
    }, 650);
  } catch (error) {
    console.error("Error interpretando con IA:", error);
    setAiError("Ocurrió un error al interpretar tu idea.");
  } finally {
    setIsInterpreting(false);
  }
};
  const limpiar = () => {
  setForm(INITIAL_FORM);
  setFreeText("");
  setHasSearched(false);
  setIsSearching(false);
  setIsInterpreting(false);
  setAiError("");
};

  const verDetalleProducto = async (producto: CatalogProduct) => {
    await actualizarRecomendacionIA(recomendacionId, {
      productoElegido: producto.id,
      convertidaEnCompra: false,
    });

    router.push(`/producto/${producto.id}`);
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
  void actualizarRecomendacionIA(recomendacionId, {
    productoElegido: producto.id,
    convertidaEnCompra: false,
  });

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
                <h3 className={styles.smartModalTitle}>Encuentra recomendaciones pensadas para tu ocasión</h3>
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
              <div className={styles.smartAiBox}>
                <label>
                  <span>Cuéntanos qué regalo estás buscando</span>
                  <textarea
                    value={freeText}
                    onChange={(event) => setFreeText(event.target.value)}
                    placeholder="Ej: Quiero un regalo elegante para mi mamá por el Día de la Madre, por menos de 250 Bs"
                    rows={4}
                  />
                </label>

                {aiError ? <p className={styles.smartAiError}>{aiError}</p> : null}

                <button
                  type="button"
                  className={styles.smartAiButton}
                  onClick={interpretarConIA}
                  disabled={isInterpreting}
                >
                  {isInterpreting ? "Analizando..." : "Buscar recomendaciones con IA"}
                </button>
              </div>
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
                    <p>Analizando tu idea y comparando productos reales del catálogo...</p>
                    </div>
                ) : !hasSearched ? (
                    <div className={styles.smartEmpty}>
                    <Sparkles size={34} />
                    <p>
                      Escribe una idea o completa los campos para recibir recomendaciones según ocasión, estilo y presupuesto.
                    </p>
                  </div>
                ) : resultados.length === 0 ? (
                  <div className={styles.smartEmpty}>
                    <p>
                      No encontramos una coincidencia clara. Prueba ajustando el presupuesto, la ocasión o el estilo del regalo.
                    </p>
                  </div>
                ) : (
                  resultados.map(({ producto, reasons }) => (
                    <article key={producto.id} className={styles.smartProduct}>
                      <button
                        type="button"
                        className={styles.smartProductImage}
                        onClick={() => void verDetalleProducto(producto)}
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
                            onClick={() => void verDetalleProducto(producto)}
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