"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Mail, MapPin, Phone, Send, ShoppingCart, Sparkles, Star, X } from "lucide-react";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import { useCart } from "../components/cart/useCart";
import { useSession } from "../components/auth/useSession";
import type { DetailProduct, ProductComment } from "../product-data";
import styles from "./detalle.module.css";
import { getTarjetasActivas } from "./actions";

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
  sourceLabel: string;
  sourceUrl: string;
};

type TarjetaDB = {
  id: number;
  nombre: string;
  design_url: string;
  color_acento: string;
  color_suave: string;
  color_marco: string;
  color_mensaje: string;
  ornamento: string;
};

type PersonalizationSelection = {
  selectedCard: string;
  selectedFont: string;
  message: string;
};

type ProductDetailClientProps = {
  producto: DetailProduct;
  comentariosIniciales: ProductComment[];
  tarjetasDB: TarjetaDB[];
};

type FlyingCartAnimation = {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageUrl?: string;
};

type CardPreviewProps = {
  tarjeta: CardTemplate;
  fuente: FontOption;
  message: string;
  className: string;
  messageClassName?: string;
  contentClassName?: string;
};

type PersonalizationModalProps = {
  isOpen: boolean;
  initialSelection: PersonalizationSelection;
  tarjetas: CardTemplate[];
  onClose: () => void;
  onApply: (selection: PersonalizationSelection) => void;
};

const DEFAULT_MESSAGE = "Para ti, con mucho cariño y un detalle pensado especialmente para este momento.";
const EMPTY_MESSAGE = "Tu mensaje aparecerá aquí cuando personalices la tarjeta.";
const CART_HIGHLIGHT_EVENT = "emotia-cart-highlight";

const fuentes: FontOption[] = [
  { id: "playfair", label: "Elegante", family: "'Georgia', 'Times New Roman', serif" },
  { id: "dmSans", label: "Moderna", family: "'Inter', 'Arial', sans-serif" },
  { id: "cursive", label: "Manuscrita", family: "'Brush Script MT', 'Segoe Script', cursive" },
];

/** Mapea un registro de tarjeta_disenos de la BD al formato CardTemplate del componente. */
function mapTarjetaDB(t: TarjetaDB): CardTemplate {
  return {
    id: `t${t.id}`,
    name: t.nombre,
    accent: t.color_acento,
    accentSoft: t.color_suave,
    frame: t.color_marco,
    designUrl: t.design_url,
    messageColor: t.color_mensaje,
    sourceLabel: "Ver diseño",
    sourceUrl: t.design_url,
  };
}

function CardPreview({ tarjeta, fuente, message, className, messageClassName, contentClassName }: CardPreviewProps) {
  const displayMessage = message.trim() || EMPTY_MESSAGE;

  return (
    <div
      className={className}
      style={{
        borderColor: tarjeta.frame,
        backgroundImage: `url(${tarjeta.designUrl})`,
        backgroundColor: tarjeta.accentSoft,
      }}
    >
      <div className={contentClassName || styles.previewContent}>
        <p className={messageClassName} style={{ color: tarjeta.messageColor, fontFamily: fuente.family }}>
          {displayMessage}
        </p>
      </div>
    </div>
  );
}

function PersonalizationModal({ isOpen, initialSelection, tarjetas, onClose, onApply }: PersonalizationModalProps) {
  const [draftSelectedCard, setDraftSelectedCard] = useState(initialSelection.selectedCard);
  const [draftSelectedFont, setDraftSelectedFont] = useState(initialSelection.selectedFont);
  const [draftMessage, setDraftMessage] = useState(initialSelection.message);

  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === draftSelectedCard) || tarjetas[0],
    [draftSelectedCard, tarjetas]
  );
  const fuenteActiva = useMemo(
    () => fuentes.find((fuente) => fuente.id === draftSelectedFont) || fuentes[0],
    [draftSelectedFont]
  );

  useEffect(() => {
    if (tarjetas.length > 0 && !tarjetas.find((t) => t.id === draftSelectedCard)) {
      setDraftSelectedCard(tarjetas[0].id);
    }
  }, [tarjetas, draftSelectedCard]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="personalizacion-producto">
      <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>Personalización</p>
            <h2 id="personalizacion-producto" className={styles.modalTitle}>
              Personaliza este producto
            </h2>
            <p className={styles.modalDescription}>Elige la tarjeta, escribe tu mensaje y revisa cómo se verá antes de guardarlo.</p>
          </div>

          <button type="button" className={styles.modalCloseButton} onClick={onClose} aria-label="Cerrar personalización">
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalContentGrid}>
            <div className={styles.modalFormColumn}>
              <div className={styles.sectionHeader}>
                <h3>1. Elige una tarjeta</h3>
              </div>

              <div className={styles.cardGrid}>
                {tarjetas.map((tarjeta) => {
                  const isActive = draftSelectedCard === tarjeta.id;
                  const cardFont = fuentes.find((fuente) => fuente.id === draftSelectedFont) || fuentes[0];

                  return (
                    <button
                      key={tarjeta.id}
                      type="button"
                      onClick={() => setDraftSelectedCard(tarjeta.id)}
                      className={`${styles.templateButton} ${isActive ? styles.templateButtonActive : ""}`}
                    >
                      <CardPreview
                        tarjeta={tarjeta}
                        fuente={cardFont}
                        message={draftMessage}
                        className={styles.templatePreview}
                        contentClassName={styles.templatePreviewContent}
                        messageClassName={styles.templatePreviewMessage}
                      />
                      <div className={styles.templateMeta}>
                        <strong>{tarjeta.name}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.sectionHeader}>
                <h3>2. Escribe tu mensaje</h3>
                <span>Hasta donde quieras emocionar</span>
              </div>

              <textarea
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                className={styles.textArea}
                placeholder="Escribe aquí el mensaje para la tarjeta..."
              />

              <div className={styles.sectionHeader}>
                <h3>3. Elige el estilo de letra</h3>
                <span>{fuenteActiva.label}</span>
              </div>

              <div className={styles.fontSelector}>
                {fuentes.map((fuente) => (
                  <button
                    key={fuente.id}
                    type="button"
                    onClick={() => setDraftSelectedFont(fuente.id)}
                    className={`${styles.fontButton} ${draftSelectedFont === fuente.id ? styles.fontButtonActive : ""}`}
                    style={{ fontFamily: fuente.family }}
                  >
                    {fuente.label}
                  </button>
                ))}
              </div>
            </div>

            <aside className={styles.modalPreviewColumn}>
              <div className={styles.modalPreviewPanel}>
                <p className={styles.modalPreviewEyebrow}>Vista previa</p>
                <h3 className={styles.modalPreviewTitle}>Así quedará tu tarjeta</h3>

                <CardPreview
                  tarjeta={tarjetaActiva}
                  fuente={fuenteActiva}
                  message={draftMessage}
                  className={`${styles.livePreview} ${styles.modalLivePreview}`}
                />
              </div>
            </aside>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalSecondaryButton} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.modalPrimaryButton}
            onClick={() =>
              onApply({
                selectedCard: draftSelectedCard,
                selectedFont: draftSelectedFont,
                message: draftMessage,
              })
            }
          >
            Guardar personalización
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailClient({ producto, comentariosIniciales, tarjetasDB }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { user, isLoggedIn } = useSession();

  const [liveTarjetasDB, setLiveTarjetasDB] = useState<TarjetaDB[]>(tarjetasDB);

  // Mapear los diseños de tarjeta que vienen de la BD
  const tarjetas = useMemo(() => liveTarjetasDB.map(mapTarjetaDB), [liveTarjetasDB]);

  const [selectedCard, setSelectedCard] = useState(() => tarjetas[0]?.id ?? "t1");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [hasSavedPersonalization, setHasSavedPersonalization] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState<ProductComment[]>(comentariosIniciales);
  const [flyingAnimations, setFlyingAnimations] = useState<FlyingCartAnimation[]>([]);

  useEffect(() => {
    if (!isPersonalizationOpen) return;
    const interval = setInterval(async () => {
      try {
        const activeCards = await getTarjetasActivas();
        setLiveTarjetasDB(activeCards);
      } catch (error) {
        console.error("Error al obtener tarjetas activas:", error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isPersonalizationOpen]);

  useEffect(() => {
    if (tarjetas.length > 0 && !tarjetas.find((t) => t.id === selectedCard)) {
      setSelectedCard(tarjetas[0].id);
    }
  }, [tarjetas, selectedCard]);

  const commentStorageKey = useMemo(
    () => `emotia-product-comment-${producto.id}-${user?.email ?? "guest"}`,
    [producto.id, user?.email]
  );
  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === selectedCard) || tarjetas[0],
    [selectedCard, tarjetas]
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

  const averageCommentRating = useMemo(() => {
    if (commentsWithStored.length === 0) return producto.rating;

    const total = commentsWithStored.reduce((sum, comment) => sum + comment.rating, 0);
    return Number((total / commentsWithStored.length).toFixed(1));
  }, [commentsWithStored, producto.rating]);

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

  const handleApplyPersonalization = (selection: PersonalizationSelection) => {
    setSelectedCard(selection.selectedCard);
    setSelectedFont(selection.selectedFont);
    setMessage(selection.message);
    setHasSavedPersonalization(true);
    setIsPersonalizationOpen(false);
  };

  const triggerAddToCartAnimation = (button: HTMLButtonElement) => {
    if (typeof window === "undefined") return;

    const cartTarget = document.querySelector('[data-cart-target="catalog-cart-button"]') as HTMLElement | null;
    if (!cartTarget) return;

    const sourceRect = button.getBoundingClientRect();
    const targetRect = cartTarget.getBoundingClientRect();
    const animationId = Date.now() + Math.floor(Math.random() * 1000);

    setFlyingAnimations((prev) => [
      ...prev,
      {
        id: animationId,
        startX: sourceRect.left + sourceRect.width / 2 - 28,
        startY: sourceRect.top + sourceRect.height / 2 - 28,
        endX: targetRect.left + targetRect.width / 2 - 28,
        endY: targetRect.top + targetRect.height / 2 - 28,
        imageUrl: producto.gallery[0]?.imageUrl,
      },
    ]);

    window.setTimeout(() => {
      setFlyingAnimations((prev) => prev.filter((item) => item.id !== animationId));
      window.dispatchEvent(new CustomEvent(CART_HIGHLIGHT_EVENT));
    }, 900);
  };

  const handleAddToCart = (button: HTMLButtonElement) => {
    addItem({
      id: producto.id,
      name: producto.name,
      brand: producto.brand,
      price: producto.price,
      imageUrl: producto.gallery[0]?.imageUrl,
      subtitle: hasSavedPersonalization ? `${tarjetaActiva.name} / ${fuenteActiva.label}` : producto.subtitle,
    });

    triggerAddToCartAnimation(button);
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
              <h3>Personalización</h3>
              <span>Tarjeta incluida</span>
            </div>

            <p className={styles.personalizationLead}>
              Abre la personalización para elegir la tarjeta, escribir tu mensaje y ver cómo acompañará al producto.
            </p>

            <button type="button" className={styles.personalizeButton} onClick={() => setIsPersonalizationOpen(true)}>
              <Sparkles size={18} strokeWidth={2.1} />
              Personaliza este producto
            </button>

            <div className={styles.personalizationPreviewBox}>
              <div className={styles.personalizationPreviewHeader}>
                <div>
                  <p className={styles.personalizationPreviewEyebrow}>Vista previa</p>
                  <h4 className={styles.personalizationPreviewTitle}>Así se verá tu tarjeta junto al producto</h4>
                </div>
                <span className={styles.personalizationPreviewState}>
                  {hasSavedPersonalization ? "Personalización guardada" : "Pendiente de personalizar"}
                </span>
              </div>

              {hasSavedPersonalization ? (
                <div className={styles.personalizationShowcase}>
                  <div className={styles.productShowcaseCard}>
                    <div className={styles.productShowcaseImageWrap}>
                      <img src={producto.gallery[0]?.imageUrl} alt={producto.name} className={styles.productShowcaseImage} />
                    </div>
                  </div>

                  <CardPreview
                    tarjeta={tarjetaActiva}
                    fuente={fuenteActiva}
                    message={message}
                    className={`${styles.livePreview} ${styles.showcaseCardPreview}`}
                    messageClassName={styles.showcaseCardMessage}
                  />
                </div>
              ) : (
                <div className={styles.personalizationEmptyState}>
                  Tu vista previa aparecerá aquí cuando guardes la personalización de la tarjeta.
                </div>
              )}
            </div>

            <button
              className={styles.btnBolsa}
              onClick={(event) => handleAddToCart(event.currentTarget)}
            >
              Añadir a la bolsa
            </button>
          </div>
        </section>
      </div>

      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <div>
            <p className={styles.commentsEyebrow}>Opiniones del producto</p>
            <h2 className={styles.commentsTitle}>Calificación y reseñas</h2>
          </div>

          <div className={styles.commentsSummary}>
            <div className={styles.commentStars}>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  fill={averageCommentRating >= index + 1 ? "#E6885C" : "transparent"}
                  color="#E6885C"
                  strokeWidth={1.8}
                />
              ))}
            </div>
            <span className={styles.commentsScore}>{averageCommentRating.toFixed(1)} de 5</span>
            <span className={styles.commentsCount}>{commentsWithStored.length} reseñas</span>
          </div>
        </div>

        <div className={styles.commentsLayout}>
          <div className={styles.commentComposer}>
            <div className={styles.sectionHeader}>
              <h3>Deja tu calificación y reseña</h3>
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
              placeholder={isLoggedIn ? "Cuéntanos qué te pareció este producto..." : "Inicia sesión para dejar tu reseña"}
              disabled={!isLoggedIn || hasUserComment}
            />

            <button type="button" className={styles.commentButton} onClick={handleCommentSubmit} disabled={!isLoggedIn || hasUserComment}>
              <Send size={16} strokeWidth={2} />
              {hasUserComment ? "Ya dejaste tu reseña" : "Publicar reseña"}
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

      {isPersonalizationOpen ? (
        <PersonalizationModal
          isOpen={isPersonalizationOpen}
          initialSelection={{ selectedCard, selectedFont, message }}
          tarjetas={tarjetas}
          onClose={() => setIsPersonalizationOpen(false)}
          onApply={handleApplyPersonalization}
        />
      ) : null}

      {flyingAnimations.map((animation) => (
        <div
          key={animation.id}
          className={styles.flyingCartChip}
          style={
            {
              "--cart-start-x": `${animation.startX}px`,
              "--cart-start-y": `${animation.startY}px`,
              "--cart-end-x": `${animation.endX}px`,
              "--cart-end-y": `${animation.endY}px`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <div className={styles.flyingCartThumb}>
            {animation.imageUrl ? <img src={animation.imageUrl} alt="" className={styles.flyingCartThumbImage} /> : null}
          </div>
          <div className={styles.flyingCartIconWrap}>
            <ShoppingCart size={15} strokeWidth={2.2} />
          </div>
        </div>
      ))}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView="login" />
    </div>
  );
}
