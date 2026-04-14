"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import Header from "../components/Header";
import { useCart } from "../components/cart/useCart";
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
  mood: string;
  badge: string;
  ornament: "flowers" | "hearts" | "sparkles";
};

type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  palette: string;
  accent: string;
};

const tarjetas: CardTemplate[] = [
  {
    id: "t1",
    name: "Luz Serena",
    accent: "#E6398A",
    accentSoft: "#FCE7F3",
    frame: "#F7C7DE",
    mood: "Delicada y romantica",
    badge: "Floral",
    ornament: "flowers",
  },
  {
    id: "t2",
    name: "Noche Violeta",
    accent: "#7B2CBF",
    accentSoft: "#F3E8FF",
    frame: "#D7BCF8",
    mood: "Elegante y profunda",
    badge: "Especial",
    ornament: "hearts",
  },
  {
    id: "t3",
    name: "Brillo Festivo",
    accent: "#FF6B00",
    accentSoft: "#FFF1E8",
    frame: "#FFD0AF",
    mood: "Calida y celebratoria",
    badge: "Fiesta",
    ornament: "sparkles",
  },
];

const fuentes: FontOption[] = [
  { id: "playfair", label: "Elegante", family: "'Georgia', 'Times New Roman', serif" },
  { id: "dmSans", label: "Moderna", family: "'Inter', 'Arial', sans-serif" },
  { id: "cursive", label: "Manuscrita", family: "'Brush Script MT', 'Segoe Script', cursive" },
];

const productos = [
  {
    id: 1,
    category: "Novedades / Flores",
    name: 'Ramo Especial "Amanecer Rosa"',
    brand: "Floreria La Rosa",
    price: 85,
    rating: 4.9,
    reviews: 128,
    description:
      "Un arreglo pensado para momentos especiales, con acabado premium y una tarjeta personalizada que acompana el detalle.",
    tag: "Edicion Especial",
    subtitle: "Entrega en 24 horas",
    gallery: [
      {
        id: "g1",
        title: "Vista principal del ramo",
        subtitle: "Imagen principal",
        palette: "radial-gradient(circle at top left, rgba(230,57,138,0.4), transparent 25%), radial-gradient(circle at bottom right, rgba(255,255,255,0.12), transparent 26%), #2b1740",
        accent: "#E6398A",
      },
      {
        id: "g2",
        title: "Detalle de petalos",
        subtitle: "Textura cercana",
        palette: "radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 24%), linear-gradient(135deg, #4c173f 0%, #7b2cbf 45%, #e6398a 100%)",
        accent: "#F7C7DE",
      },
    ] as GalleryItem[],
  },
  {
    id: 2,
    category: "Coleccion Dulce / Dulces",
    name: "Caja Gourmet de Trufas Belgas",
    brand: "Sweet Emotions",
    price: 42.5,
    rating: 4.8,
    reviews: 94,
    description:
      "Sabores delicados con presentacion elegante para sorprender con un mensaje hecho a medida.",
    tag: "Favorito",
    subtitle: "Hecho artesanalmente",
    gallery: [
      {
        id: "g1",
        title: "Caja gourmet especial",
        subtitle: "Presentacion frontal",
        palette: "radial-gradient(circle at top left, rgba(255,107,0,0.24), transparent 26%), linear-gradient(135deg, #2b1740 0%, #4b2e67 48%, #7b2cbf 100%)",
        accent: "#FF6B00",
      },
      {
        id: "g2",
        title: "Detalle de trufas",
        subtitle: "Vista cercana",
        palette: "radial-gradient(circle at center, rgba(255,255,255,0.22), transparent 22%), linear-gradient(145deg, #6c3f1f 0%, #a35d2a 50%, #ffd0af 100%)",
        accent: "#FFD0AF",
      },
    ] as GalleryItem[],
  },
  {
    id: 3,
    category: "Decoracion / Celebraciones",
    name: 'Set de Globos "Celebracion Magica"',
    brand: "Miniso",
    price: 55,
    rating: 4.7,
    reviews: 76,
    description:
      "Ideal para acompanar festejos con una tarjeta visualmente memorable y muy personal.",
    tag: "Nuevo",
    subtitle: "Listo para regalo",
    gallery: [
      {
        id: "g1",
        title: "Set completo decorativo",
        subtitle: "Vista principal",
        palette: "radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 22%), linear-gradient(135deg, #7b2cbf 0%, #e6398a 52%, #ff6b00 100%)",
        accent: "#FFFFFF",
      },
      {
        id: "g2",
        title: "Composicion de globos",
        subtitle: "Color y detalle",
        palette: "radial-gradient(circle at bottom left, rgba(255,255,255,0.28), transparent 22%), linear-gradient(145deg, #2b1740 0%, #7b2cbf 42%, #f7c7de 100%)",
        accent: "#F7C7DE",
      },
    ] as GalleryItem[],
  },
];

type PageProps = {
  params: Promise<{ id: string }>;
};

function CardOrnaments({
  ornament,
  color,
}: {
  ornament: CardTemplate["ornament"];
  color: string;
}) {
  const symbols =
    ornament === "flowers"
      ? ["✿", "❀", "✿", "❀"]
      : ornament === "hearts"
        ? ["♥", "♡", "♥", "♡"]
        : ["✦", "✧", "✦", "✧"];

  return (
    <div className={styles.ornamentLayer} aria-hidden="true">
      {symbols.map((symbol, index) => (
        <span key={`${ornament}-${index}`} className={`${styles.ornament} ${styles[`ornament${index + 1}`]}`} style={{ color }}>
          {symbol}
        </span>
      ))}
    </div>
  );
}

export default function DetalleProducto({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const producto = productos.find((item) => item.id === productId) || productos[0];

  const [selectedCard, setSelectedCard] = useState("t1");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [message, setMessage] = useState("Para ti, con mucho carino y un detalle pensado especialmente para este momento.");
  const [selectedImage, setSelectedImage] = useState("g1");
  const [userRating, setUserRating] = useState<number>(producto.rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const { addItem } = useCart();

  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === selectedCard) || tarjetas[0],
    [selectedCard]
  );

  const fuenteActiva = useMemo(
    () => fuentes.find((fuente) => fuente.id === selectedFont) || fuentes[0],
    [selectedFont]
  );

  const imagenActiva = useMemo(
    () => producto.gallery.find((imagen: GalleryItem) => imagen.id === selectedImage) || producto.gallery[0],
    [producto.gallery, selectedImage]
  );

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
            <div className={styles.imagePlaceholder} style={{ background: imagenActiva.palette }}>
              <span className={styles.placeholderTitle}>{imagenActiva.title}</span>
              <span className={styles.placeholderText}>{imagenActiva.subtitle}</span>
            </div>
          </div>

          <div className={styles.thumbRow}>
            {producto.gallery.map((imagen: GalleryItem, index: number) => (
              <button
                key={imagen.id}
                type="button"
                className={`${styles.thumbPlaceholder} ${selectedImage === imagen.id ? styles.thumbPlaceholderActive : ""}`}
                style={{ background: imagen.palette }}
                onClick={() => setSelectedImage(imagen.id)}
              >
                <span className={styles.thumbNumber}>0{index + 1}</span>
                <span className={styles.thumbTitle}>{imagen.title}</span>
              </button>
            ))}
            <div className={styles.deliveryCard}>
              <span className={styles.deliveryLabel}>Marca</span>
              <strong>{producto.brand}</strong>
              <div className={styles.ratingRow} onMouseLeave={() => setHoverRating(null)}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={styles.starButton}
                      onMouseEnter={() => setHoverRating(index + 1)}
                      onFocus={() => setHoverRating(index + 1)}
                      onClick={() => setUserRating(index + 1)}
                      aria-label={`Calificar con ${index + 1} estrella${index === 0 ? "" : "s"}`}
                    >
                      <Star
                        size={16}
                        fill={(hoverRating ?? userRating) >= index + 1 ? "#FFB648" : "transparent"}
                        color="#FFB648"
                        strokeWidth={1.8}
                      />
                    </button>
                  ))}
                </div>
                <span className={styles.ratingValue}>{userRating.toFixed(1)}</span>
                <span className={styles.ratingCount}>Tu calificación</span>
              </div>
              <p className={styles.ratingHint}>Promedio actual: {producto.rating.toFixed(1)} basado en {producto.reviews} reseñas.</p>
              <p className={styles.deliveryText}>{producto.description}</p>
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
              <h3>1. Elige un diseño generico de tarjeta</h3>
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
                      color: tarjeta.accent,
                      fontFamily: fuenteActiva.family,
                    }}
                  >
                    <CardOrnaments ornament={tarjeta.ornament} color={tarjeta.accent} />
                    <span className={styles.templateBadge} style={{ background: tarjeta.accent }}>
                      {tarjeta.badge}
                    </span>
                    <p>{message || "Tu mensaje aparecera aqui"}</p>
                  </div>
                  <div className={styles.templateMeta}>
                    <strong>{tarjeta.name}</strong>
                    <span>{tarjeta.mood}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <h3>2. Escribe tu mensaje</h3>
              <span>Vista previa en vivo</span>
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={styles.textArea}
              placeholder="Escribe aqui el mensaje para la tarjeta..."
            />

            <div className={styles.sectionHeader}>
              <h3>3. Elige el estilo de letra</h3>
              <span>Personaliza el look</span>
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
                color: tarjetaActiva.accent,
              }}
            >
              <CardOrnaments ornament={tarjetaActiva.ornament} color={tarjetaActiva.accent} />
              <div className={styles.previewRibbon} style={{ background: tarjetaActiva.accent }}>
                {tarjetaActiva.name}
              </div>
              <div className={styles.previewContent}>
                <span className={styles.previewBadge} style={{ color: tarjetaActiva.accent }}>
                  {tarjetaActiva.badge}
                </span>
                <p style={{ color: tarjetaActiva.accent, fontFamily: fuenteActiva.family }}>
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
                  brand: producto.category,
                  price: producto.price,
                  subtitle: `${tarjetaActiva.name} / ${fuenteActiva.label}`,
                })
              }
            >
              Anadir a la bolsa
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
