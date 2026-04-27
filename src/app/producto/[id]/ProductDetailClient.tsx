"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Mail, MapPin, Phone, Send, Star } from "lucide-react";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import { useCart } from "../components/cart/useCart";
import { useSession } from "../components/auth/useSession";
import type { DetailProduct, ProductComment } from "../product-data";
import styles from "./detalle.module.css";

type FontOption = {
  id: string;
  label: string;
  family: string;
};

type CardTemplate = {
  id: string;
  name: string;
  accent: string;
  accentSoft: string;
  frame: string;
  designUrl: string;
  messageColor: string;
  mood: string;
  badge: string;
  ornament: "flowers" | "hearts" | "sparkles";
  sourceLabel: string;
  sourceUrl: string;
};

const tarjetas: CardTemplate[] = [
  {
    id: "t1",
    name: "Jardin Botanico",
    accent: "#A53E6C",
    accentSoft: "#FFF3F7",
    frame: "#D46A92",
    designUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777322450/emotia3_bmutfx.png",
    messageColor: "#000000",
    mood: "Floral y delicada",
    badge: "Floral",
    ornament: "flowers",
    sourceLabel: "Ver diseno",
    sourceUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777322450/emotia3_bmutfx.png",
  },
  {
    id: "t2",
    name: "Herencia Clasica",
    accent: "#5F4636",
    accentSoft: "#FFF8F0",
    frame: "#C8A47C",
    designUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323057/emotia2_cpkpzc.png",
    messageColor: "#000000",
    mood: "Sobria y elegante",
    badge: "Clasica",
    ornament: "hearts",
    sourceLabel: "Ver diseño",
    sourceUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323057/emotia2_cpkpzc.png",
  },
  {
    id: "t3",
    name: "Confetti Pop",
    accent: "#D94A6A",
    accentSoft: "#FFF6F8",
    frame: "#FFB34D",
    designUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323056/emotia1_wxoby0.png",
    messageColor: "#000000",
    mood: "Festiva y brillante",
    badge: "Fiesta",
    ornament: "sparkles",
    sourceLabel: "Ver diseño",
    sourceUrl: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323056/emotia1_wxoby0.png",
  },
];

const fuentes: FontOption[] = [
  { id: "playfair", label: "Elegante", family: "'Georgia', 'Times New Roman', serif" },
  { id: "dmSans", label: "Moderna", family: "'Inter', 'Arial', sans-serif" },
  { id: "cursive", label: "Manuscrita", family: "'Brush Script MT', 'Segoe Script', cursive" },
];

type ProductDetailClientProps = {
  producto: DetailProduct;
  comentariosIniciales: ProductComment[];
};

export default function ProductDetailClient({ producto, comentariosIniciales }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { user, isLoggedIn } = useSession();

  const [selectedCard, setSelectedCard] = useState("t1");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [message, setMessage] = useState("Para ti, con mucho cariño y un detalle pensado especialmente para este momento.");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState<ProductComment[]>(comentariosIniciales);

  const commentStorageKey = useMemo(
    () => `emotia-product-comment-${producto.id}-${user?.email ?? "guest"}`,
    [producto.id, user?.email]
  );

  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === selectedCard) || tarjetas[0],
    [selectedCard]
  );

  const fuenteActiva = useMemo(
    () => fuentes.find((fuente) => fuente.id === selectedFont) || fuentes[0],
    [selectedFont]
  );

  const commentsWithStored = useMemo(() => {
    if (!isLoggedIn || !user || typeof window === "undefined") return comments;

    try {
      const raw = window.localStorage.getItem(commentStorageKey);
      if (!raw) return comments;
      const stored = JSON.parse(raw) as ProductComment;
      if (comments.some((comment) => comment.id === stored.id)) return comments;
      return [stored, ...comments];
    } catch {
      return comments;
    }
  }, [commentStorageKey, comments, isLoggedIn, user]);

  const hasUserComment = useMemo(() => {
    if (!user?.email) return false;
    return commentsWithStored.some((comment) => comment.id === commentStorageKey);
  }, [commentStorageKey, commentsWithStored, user?.email]);

  const requireSession = () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return false;
    }

    return true;
  };

  const handleCommentSubmit = () => {
    if (!requireSession()) return;
    if (hasUserComment || commentText.trim() === "" || !user) return;

    const nextComment: ProductComment = {
      id: commentStorageKey,
      author: user.name,
      rating: commentRating,
      text: commentText.trim(),
    };

    window.localStorage.setItem(commentStorageKey, JSON.stringify(nextComment));
    setComments((prev) => [nextComment, ...prev]);
    setCommentText("");
  };

  return (
    <div className={styles.page}>
      <Header showSearch={false} />

      <div className={styles.wrapper}>
        <section className={styles.galleryColumn}>
          <Link href="/producto" className={styles.backLink}>
            <ArrowLeft size={18} strokeWidth={2.2} />
            Volver al catalogo
          </Link>

          <div className={styles.mainVisual}>
            <span className={styles.productTag}>{producto.tag}</span>
            <img src={producto.gallery[0]?.imageUrl} alt={producto.name} className={styles.mainImage} />
          </div>

          <div className={styles.galleryInfoBlock}>
            <div className={styles.deliveryCard}>
              <Link href={`/producto/marca/${producto.brandProfile.id}`} className={styles.brandHeaderRow}>
                <div className={styles.brandAvatarWrap}>
                  <img
                    src={producto.brandProfile.logoUrl}
                    alt={producto.brandProfile.name}
                    className={styles.brandAvatar}
                  />
                </div>
                <div className={styles.brandIdentity}>
                  <span className={styles.deliveryLabel}>Marca</span>
                  <strong>{producto.brand}</strong>
                  <span className={styles.brandMetaLink}>
                    Ver perfil de marca
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </span>
                </div>
              </Link>

              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={styles.starButton} aria-hidden="true">
                      <Star
                        size={16}
                        fill={producto.brandProfile.rating >= index + 1 ? "#E6885C" : "transparent"}
                        color="#E6885C"
                        strokeWidth={1.8}
                      />
                    </span>
                  ))}
                </div>
                <span className={styles.ratingValue}>{producto.brandProfile.rating.toFixed(1)}</span>
                <span className={styles.ratingCount}>Calificacion promedio de la marca</span>
              </div>
              <p className={styles.deliveryText}>{producto.brandProfile.description}</p>

              <div className={styles.brandQuickInfo}>
                <span>
                  <MapPin size={15} strokeWidth={2} />
                  {producto.brandProfile.address}
                </span>
                <span>
                  <Phone size={15} strokeWidth={2} />
                  {producto.brandProfile.phone}
                </span>
                <span>
                  <Mail size={15} strokeWidth={2} />
                  {producto.brandProfile.email}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailColumn}>
          <div className={styles.productHead}>
            <p className={styles.category}>{producto.category}</p>
            <h1 className={styles.productName}>{producto.name}</h1>
            <p className={styles.priceLine}>
              <span className={styles.price}>Bs. {producto.price.toFixed(2)}</span>
            </p>
            <p className={styles.description}>{producto.description}</p>
          </div>

          <div className={styles.customCardPanel}>
            <div className={styles.sectionHeader}>
              <h3>1. Elige un diseño</h3>
              <span>Incluido</span>
            </div>

            <div className={styles.cardGrid}>
              {tarjetas.map((tarjeta) => (
                <button
                  key={tarjeta.id}
                  type="button"
                  onClick={() => setSelectedCard(tarjeta.id)}
                  className={`${styles.templateButton} ${selectedCard === tarjeta.id ? styles.templateButtonActive : ""}`}
                >
                  <div
                    className={`${styles.templatePreview} ${styles[`templatePreview${tarjeta.ornament.charAt(0).toUpperCase()}${tarjeta.ornament.slice(1)}`]}`}
                    style={{
                      borderColor: tarjeta.frame,
                      fontFamily: fuenteActiva.family,
                      backgroundImage: `url(${tarjeta.designUrl})`,
                    }}
                  >
                    <p style={{ color: tarjeta.messageColor }}>{message || "Tu mensaje aparecera aqui"}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <h3>2. Escribe tu mensaje</h3>
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={styles.textArea}
              placeholder="Escribe aqui el mensaje para la tarjeta..."
            />

            <div className={styles.sectionHeader}>
              <h3>3. Elige el estilo de letra</h3>
            </div>

            <div className={styles.fontSelector}>
              {fuentes.map((fuente) => (
                <button
                  key={fuente.id}
                  type="button"
                  onClick={() => setSelectedFont(fuente.id)}
                  className={`${styles.fontButton} ${selectedFont === fuente.id ? styles.fontButtonActive : ""}`}
                  style={{ fontFamily: fuente.family }}
                >
                  {fuente.label}
                </button>
              ))}
            </div>

            <div
              className={`${styles.livePreview} ${styles[`templatePreview${tarjetaActiva.ornament.charAt(0).toUpperCase()}${tarjetaActiva.ornament.slice(1)}`]}`}
              style={{
                borderColor: tarjetaActiva.frame,
                backgroundImage: `url(${tarjetaActiva.designUrl})`,
                backgroundColor: tarjetaActiva.accentSoft,
              }}
            >
              <div className={styles.previewContent}>
                <p style={{ color: tarjetaActiva.messageColor, fontFamily: fuenteActiva.family }}>
                  {message || "Tu mensaje aparecera aqui en cuanto empieces a escribir."}
                </p>
              </div>
            </div>

            <button
              className={styles.btnBolsa}
              onClick={() =>
                addItem({
                  id: producto.id,
                  name: producto.name,
                  brand: producto.brand,
                  price: producto.price,
                  imageUrl: producto.gallery[0]?.imageUrl,
                  subtitle: `${tarjetaActiva.name} / ${fuenteActiva.label}`,
                })
              }
            >
              Añadir a la bolsa
            </button>
          </div>
        </section>
      </div>

      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <div>
            <p className={styles.commentsEyebrow}>Opiniones</p>
            <h2 className={styles.commentsTitle}>Comentarios del producto</h2>
          </div>
          <span className={styles.commentsCount}>{commentsWithStored.length} reseñas</span>
        </div>

        <div className={styles.commentsLayout}>
          <div className={styles.commentComposer}>
            <div className={styles.sectionHeader}>
              <h3>Comparte tu experiencia</h3>
              <span>{isLoggedIn ? "" : "Solo usuarios registrados"}</span>
            </div>

            <div className={styles.commentRatingRow}>
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.commentStar}
                  onClick={() => {
                    if (!requireSession()) return;
                    setCommentRating(index + 1);
                  }}
                  aria-label={`Puntuar con ${index + 1}`}
                >
                  <Star
                    size={18}
                    fill={commentRating >= index + 1 ? "#E6885C" : "transparent"}
                    color="#E6885C"
                    strokeWidth={1.8}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              onFocus={() => {
                if (!isLoggedIn) setIsAuthOpen(true);
              }}
              className={styles.commentArea}
              placeholder={isLoggedIn ? "Escribe tu comentario sobre el producto..." : "Inicia sesion para comentar"}
              disabled={!isLoggedIn || hasUserComment}
            />

            <button type="button" className={styles.commentButton} onClick={handleCommentSubmit} disabled={!isLoggedIn || hasUserComment}>
              <Send size={16} strokeWidth={2} />
              {hasUserComment ? "Ya comentaste este producto" : "Publicar comentario"}
            </button>
          </div>

          <div className={styles.commentList}>
            {commentsWithStored.map((comment) => (
              <article key={comment.id} className={styles.commentCard}>
                <div className={styles.commentTop}>
                  <div>
                    <strong>{comment.author}</strong>
                    <div className={styles.commentStars}>
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          fill={comment.rating >= index + 1 ? "#E6885C" : "transparent"}
                          color="#E6885C"
                          strokeWidth={1.8}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView="login" />
    </div>
  );
}
