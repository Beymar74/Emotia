"use client";

import React, { useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, ShoppingCart, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CatalogProduct } from "../../product-data";
import { recommendGifts } from "../../_lib/recommendation-engine";
import type { GiftRecommendationInput } from "../../_lib/recommendation-types";
import { useCart } from "../../components/cart/useCart";
import styles from "../../producto.module.css";

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
      text: "Hola, soy el asistente de regalos de Emotia. Cuéntame para quién es el regalo, la ocasión y tu presupuesto.",
    },
  ]);

  const recomendaciones = useMemo(() => {
    if (!hasRecommended) return [];
    return recommendGifts(productos, intent, 4);
  }, [hasRecommended, intent, productos]);

  const sendMessage = async () => {
    const prompt = input.trim();

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
            text: result.error || "No pude interpretar bien tu solicitud. Prueba mencionando destinatario, ocasión y presupuesto.",
          },
        ]);
        return;
      }

      setIntent(result.intent);
      setHasRecommended(true);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          text: "Listo. Analicé tu idea y encontré estas opciones reales del catálogo.",
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
        onClick={() => setIsOpen(true)}
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
                    Interpretando tu idea...
                  </span>
                </div>
              )}

              {addedProductName && (
                <div className={styles.chatbotAddedNotice}>
                  <strong>Agregado al carrito</strong>
                  <span>{addedProductName}</span>
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
                        onClick={() => router.push(`/producto/${producto.id}`)}
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
                            onClick={() => router.push(`/producto/${producto.id}`)}
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
                  No encontré coincidencias fuertes. Prueba con otro presupuesto, ocasión o estilo.
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
                placeholder="Ej: Quiero algo romántico para mi novia, máximo 300 Bs"
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