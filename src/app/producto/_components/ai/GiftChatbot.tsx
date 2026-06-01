"use client";

import React, { useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, ShoppingCart, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CatalogProduct } from "../../product-data";
import { recommendGifts } from "../../_lib/recommendation-engine";
import type { GiftRecommendationInput } from "../../_lib/recommendation-types";
import { useCart } from "../../components/cart/useCart";
import styles from "../../producto.module.css";
import { useSession } from "../../components/auth/useSession";

type GiftChatbotProps = {
  productos: CatalogProduct[];
};

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};


const INITIAL_INTENT: GiftRecommendationInput = {
  destinatario: "",
  ocasion: "",
  presupuestoMax: null,
  personalidad: "",
  edad: null,
  necesitaMensaje: true,
  necesitaEmpaque: false,
};

export default function GiftChatbot({ productos }: GiftChatbotProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isLoggedIn, loginWithGoogle } = useSession();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [recomendacionId, setRecomendacionId] = useState<number | null>(null);
  const [syncedRecommendationIds, setSyncedRecommendationIds] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [intent, setIntent] = useState<GiftRecommendationInput>(INITIAL_INTENT);
  const [hasRecommended, setHasRecommended] = useState(false);
  const [addedProductName, setAddedProductName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hola, soy el asistente IA de Emotia. Cuéntame para quién es el regalo, la ocasión, el estilo que buscas y tu presupuesto. Con eso te mostraré sugerencias reales dentro del catálogo.",
    },
  ]);

  const recomendaciones = useMemo(() => {
    if (!hasRecommended) return [];
    return recommendGifts(productos, intent, 4);
  }, [hasRecommended, intent, productos]);

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

    console.log("PATCH recomendación IA:", {
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
  const sendMessage = async () => {
    const prompt = input.trim();
    if (!isLoggedIn) {
      setShowAuthGate(true);
      return;
    }
    if (prompt.length < 4 || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
    setAddedProductName(null);

    try {
      const response = await fetch("/api/producto/recomendaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-error-${Date.now()}`,
            role: "bot",
            text: result.error || "No pude interpretar bien tu solicitud. Intenta escribir algo como: “Quiero un regalo elegante para mi mamá por menos de 250 Bs”.",
          },
        ]);
        return;
      }

      const nextIntent = result.intent as GiftRecommendationInput;
      const nextRecomendacionId =
        typeof result.recomendacionId === "number" ? result.recomendacionId : null;

      const nextRecommendations = recommendGifts(productos, nextIntent, 4);
      const nextProductIds = nextRecommendations.map(({ producto }) => producto.id);

      setIntent(nextIntent);
      setHasRecommended(true);
      setRecomendacionId(nextRecomendacionId);
      setSyncedRecommendationIds(nextProductIds.join(","));

      if (nextRecomendacionId && nextProductIds.length > 0) {
        await actualizarRecomendacionIA(nextRecomendacionId, {
          productosSugeridos: nextProductIds,
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          text: "Perfecto. Tomé en cuenta lo que buscas y seleccioné regalos que encajan con la ocasión, el presupuesto y el estilo que mencionaste. Estas son opciones reales disponibles en el catálogo de Emotia.",
        },
      ]);
    } catch (error) {
      console.error("Error chatbot regalos:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: "bot",
          text: "Ocurrió un error al consultar la IA. Intenta de nuevo en unos segundos.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
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
    }, 2400);
  };

  const abrirCarrito = () => {
    setIsOpen(false);

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("emotia-cart-open"));
    }, 120);
  };

  return (
    <>
      <button
        type="button"
        className={styles.chatbotFloatingButton}
        onClick={() => {
          if (!isLoggedIn) {
            setShowAuthGate(true);
            return;
          }

          setIsOpen(true);
        }}
        aria-label="Abrir asistente de regalos"
      >
        <span className={styles.chatbotFloatingLogoWrap}>
          <img
            src="/logo/logo-store.png"
            alt=""
            className={styles.chatbotFloatingLogo}
          />
        </span>

        <span className={styles.chatbotFloatingText}>IA</span>
      </button>
      {showAuthGate && (
  <div className={styles.aiAuthGateLayer}>
    <button
      type="button"
      className={styles.aiAuthGateBackdrop}
      onClick={() => setShowAuthGate(false)}
      aria-label="Cerrar aviso de inicio de sesión"
    />

    <div className={styles.aiAuthGateCard}>
      <button
        type="button"
        className={styles.aiAuthGateClose}
        onClick={() => setShowAuthGate(false)}
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>

      <div className={styles.aiAuthGateIcon}>
        <Sparkles size={24} />
      </div>

      <p className={styles.aiAuthGateEyebrow}>Recomendaciones inteligentes</p>

      <h3>Inicia sesión para usar la IA de Emotia</h3>

      <p>
        Así podemos guardar tus preferencias, mostrarte sugerencias más útiles
        y conectar tus recomendaciones con tu carrito.
      </p>

      <div className={styles.aiAuthGateBenefits}>
        <span>Opciones según ocasión y presupuesto</span>
        <span>Productos reales del catálogo</span>
        <span>Seguimiento de tus regalos elegidos</span>
      </div>

      <button
        type="button"
        className={styles.aiAuthGatePrimary}
        onClick={() => void loginWithGoogle()}
      >
        Iniciar sesión
      </button>

      <button
        type="button"
        className={styles.aiAuthGateSecondary}
        onClick={() => setShowAuthGate(false)}
      >
        Seguir viendo el catálogo
      </button>
    </div>
  </div>
)}
      {isOpen && (
        <div className={styles.chatbotLayer}>
          <button
            type="button"
            className={styles.chatbotBackdrop}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chatbot"
          />

          <aside className={styles.chatbotPanel}>
            <div className={styles.chatbotHeader}>
              <div className={styles.chatbotHeaderIcon}>
                <Bot size={20} />
              </div>

              <div>
                <p>Asistente IA</p>
                <h3>Regalos inteligentes</h3>
              </div>

              <button
                type="button"
                className={styles.chatbotClose}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar asistente"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.chatbotMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? styles.chatbotMessageUser
                      : styles.chatbotMessageBot
                  }
                >
                  {message.text}
                </div>
              ))}

              {isThinking && (
                <div className={styles.chatbotMessageBot}>
                  <span className={styles.chatbotThinking}>
                    <Loader2 size={15} className={styles.chatbotSpin} />
                    Analizando tu solicitud y buscando opciones dentro del catálogo...
                  </span>
                </div>
              )}

              {addedProductName && (
                <div className={styles.chatbotAddedNotice}>
                  <strong>Producto agregado</strong>
                  <span>{addedProductName}</span>
                  <p>Lo guardé en tu carrito. Puedes seguir viendo recomendaciones o revisar tu compra.</p>
                  <button type="button" onClick={abrirCarrito}>
                    Ver carrito
                  </button>
                </div>
              )}

              {hasRecommended && recomendaciones.length > 0 && (
                <div className={styles.chatbotRecommendations}>
                  {recomendaciones.map(({ producto, reasons }) => (
                    <article key={producto.id} className={styles.chatbotProductCard}>
                      <button
                        type="button"
                        className={styles.chatbotProductImage}
                        onClick={() => void verDetalleProducto(producto)}
                      >
                        {producto.imageUrl ? (
                          <img src={producto.imageUrl} alt={producto.nombre} />
                        ) : (
                          <Sparkles size={22} />
                        )}
                      </button>

                      <div className={styles.chatbotProductInfo}>
                        <p>{producto.marca}</p>
                        <h4>{producto.nombre}</h4>
                        <strong>Bs. {producto.precio.toFixed(2)}</strong>
                        {reasons[0] && <span>{reasons[0]}</span>}

                        <div className={styles.chatbotProductActions}>
                          <button
                            type="button"
                            onClick={() => void verDetalleProducto(producto)}
                          >
                            Ver
                          </button>

                          <button
                            type="button"
                            onClick={() => agregarAlCarrito(producto)}
                            aria-label={`Agregar ${producto.nombre}`}
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {hasRecommended && recomendaciones.length === 0 && !isThinking && (
                <div className={styles.chatbotMessageBot}>
                  No encontré una coincidencia clara con esos datos. Puedes probar con un presupuesto diferente, una ocasión más específica o un estilo como romántico, elegante o divertido.
                </div>
              )}
            </div>

            <div className={styles.chatbotInputBar}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ej: Quiero algo romántico para mi novia por nuestro aniversario, máximo 300 Bs"
                rows={2}
              />

              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isThinking || input.trim().length < 4}
                aria-label="Enviar mensaje"
              >
                <Send size={18} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}