"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Star } from "lucide-react";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import { useCart } from "../components/cart/useCart";
import { useSession } from "../components/auth/useSession";
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
  mood: string;
  badge: string;
  ornament: "flowers" | "hearts" | "sparkles";
  sourceLabel: string;
  sourceUrl: string;
};

type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

type ProductDetail = {
  id: number;
  category: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  tag: string;
  subtitle: string;
  gallery: GalleryItem[];
};

type ProductComment = {
  id: string;
  author: string;
  rating: number;
  text: string;
};

const tarjetas: CardTemplate[] = [
  {
    id: "t1",
    name: "Jardín Botánico",
    accent: "#A53E6C",
    accentSoft: "#FFF3F7",
    frame: "#D46A92",
    designUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' rx='24' fill='%23fffafc'/%3E%3Cg fill='none' stroke='%23d46a92' stroke-width='2.5' stroke-linecap='round'%3E%3Crect x='18' y='18' width='364' height='204' rx='22'/%3E%3Cpath d='M45 54c10-18 26-28 49-28 8 0 19 4 27 13-15 0-28 9-36 25-12-5-25-8-40-10z'/%3E%3Cpath d='M355 54c-10-18-26-28-49-28-8 0-19 4-27 13 15 0 28 9 36 25 12-5 25-8 40-10z'/%3E%3Cpath d='M45 186c10 18 26 28 49 28 8 0 19-4 27-13-15 0-28-9-36-25-12 5-25 8-40 10z'/%3E%3Cpath d='M355 186c-10 18-26 28-49 28-8 0-19-4-27-13 15 0 28-9 36-25 12 5 25 8 40 10z'/%3E%3Cpath d='M72 64c0-12 10-22 22-22M328 64c0-12-10-22-22-22M72 176c0 12 10 22 22 22M328 176c0 12-10 22-22 22'/%3E%3C/g%3E%3Cg fill='%23f6bfd0'%3E%3Ccircle cx='92' cy='54' r='4'/%3E%3Ccircle cx='308' cy='54' r='4'/%3E%3Ccircle cx='92' cy='186' r='4'/%3E%3Ccircle cx='308' cy='186' r='4'/%3E%3C/g%3E%3C/svg%3E",
    mood: "Floral y delicada",
    badge: "Floral",
    ornament: "flowers",
    sourceLabel: "Freepik ornate floral border",
    sourceUrl: "https://www.freepik.com/premium-vector/ornate-decorative-frame-with-floral-border_422246794.htm",
  },
  {
    id: "t2",
    name: "Herencia Clásica",
    accent: "#5F4636",
    accentSoft: "#FFF8F0",
    frame: "#C8A47C",
    designUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' rx='24' fill='%23fffdf9'/%3E%3Cg fill='none' stroke='%23c8a47c' stroke-width='2.2' stroke-linecap='round'%3E%3Crect x='18' y='18' width='364' height='204' rx='18'/%3E%3Crect x='30' y='30' width='340' height='180' rx='12' stroke-dasharray='2 10'/%3E%3Cpath d='M58 52c10 0 18-8 18-18 0 10 8 18 18 18-10 0-18 8-18 18 0-10-8-18-18-18z'/%3E%3Cpath d='M342 52c-10 0-18-8-18-18 0 10-8 18-18 18 10 0 18 8 18 18 0-10 8-18 18-18z'/%3E%3Cpath d='M58 188c10 0 18 8 18 18 0-10 8-18 18-18-10 0-18-8-18-18 0 10-8 18-18 18z'/%3E%3Cpath d='M342 188c-10 0-18 8-18 18 0-10-8-18-18-18 10 0 18-8 18-18 0 10 8 18 18 18z'/%3E%3Cpath d='M200 36l10 8h26l-12 10 6 12-16-7-14 10 2-15-13-8h16z'/%3E%3Cpath d='M200 204l10-8h26l-12-10 6-12-16 7-14-10 2 15-13 8h16z'/%3E%3C/g%3E%3C/svg%3E",
    mood: "Sobria y elegante",
    badge: "Clásica",
    ornament: "hearts",
    sourceLabel: "Vecteezy ornate vintage frame",
    sourceUrl: "https://www.vecteezy.com/vector-art/36036365-classic-frame-and-border-element-ornate-vintage-ornament-vector-isolated-on-white-background-decorative-line-for-frame-page-template-poster-new-year-greeting-card-invitation",
  },
  {
    id: "t3",
    name: "Confetti Pop",
    accent: "#D94A6A",
    accentSoft: "#FFF6F8",
    frame: "#FFB34D",
    designUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' rx='24' fill='%23fffdfb'/%3E%3Crect x='18' y='18' width='364' height='204' rx='22' fill='none' stroke='%23ffb34d' stroke-width='2.4'/%3E%3Cg opacity='.95'%3E%3Ccircle cx='70' cy='48' r='5' fill='%23ff6f91'/%3E%3Ccircle cx='110' cy='34' r='4' fill='%2350c7b8'/%3E%3Ccircle cx='150' cy='50' r='4' fill='%23ffb34d'/%3E%3Ccircle cx='290' cy='40' r='4' fill='%2358a6ff'/%3E%3Ccircle cx='330' cy='58' r='5' fill='%23ff6f91'/%3E%3Ccircle cx='344' cy='182' r='4' fill='%23ffb34d'/%3E%3Ccircle cx='300' cy='196' r='5' fill='%2350c7b8'/%3E%3Ccircle cx='96' cy='192' r='4' fill='%2358a6ff'/%3E%3Ccircle cx='58' cy='176' r='5' fill='%23ff6f91'/%3E%3Cpath d='M88 62l10 8M142 34l-7 11M306 62l10-10M330 166l13 6M78 168l-10 10M264 40l14 7' stroke='%23d94a6a' stroke-width='2.6' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E",
    mood: "Festiva y brillante",
    badge: "Fiesta",
    ornament: "sparkles",
    sourceLabel: "Freepik confetti celebration border",
    sourceUrl: "https://www.freepik.com/premium-vector/vibrant-confetti-streamer-border-celebrations_424638969.htm",
  },
];

const fuentes: FontOption[] = [
  { id: "playfair", label: "Elegante", family: "'Georgia', 'Times New Roman', serif" },
  { id: "dmSans", label: "Moderna", family: "'Inter', 'Arial', sans-serif" },
  { id: "cursive", label: "Manuscrita", family: "'Brush Script MT', 'Segoe Script', cursive" },
];

const productos: ProductDetail[] = [
  {
    id: 1,
    category: "Novedades / Flores",
    name: 'Ramo Premium "Amanecer Rosa"',
    brand: "Florería La Rosa",
    price: 85,
    rating: 4.9,
    reviews: 128,
    description: "Bouquet elegante con rosas, papel coreano y tarjeta personalizada.",
    tag: "Nuevo",
    subtitle: "Entrega en 24 horas",
    gallery: [
      { id: "g1", title: "Vista principal del ramo", subtitle: "Arreglo completo", imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle floral", subtitle: "Texturas y tonos", imageUrl: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 2,
    category: "Colección Dulce / Dulces",
    name: "Caja Gourmet de Trufas Belgas",
    brand: "Sweet Emotions",
    price: 42.5,
    rating: 4.8,
    reviews: 94,
    description: "Sabores delicados con presentación elegante para sorprender con un mensaje hecho a medida.",
    tag: "Favorito",
    subtitle: "Hecho artesanalmente",
    gallery: [
      { id: "g1", title: "Caja gourmet especial", subtitle: "Presentación frontal", imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle de trufas", subtitle: "Vista cercana", imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 3,
    category: "Decoración / Celebraciones",
    name: 'Set Globos "Celebración Mágica"',
    brand: "Miniso",
    price: 55,
    rating: 4.7,
    reviews: 76,
    description: "Kit listo para ambientar celebraciones con un look delicado y moderno.",
    tag: "Nuevo",
    subtitle: "Listo para regalo",
    gallery: [
      { id: "g1", title: "Set completo decorativo", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Composición de globos", subtitle: "Color y detalle", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 4,
    category: "Joyas / Para Ella",
    name: "Collar Plata Ley 925",
    brand: "Nuba",
    price: 120,
    rating: 4.7,
    reviews: 67,
    description: "Joya minimalista para un detalle sofisticado y memorable.",
    tag: "Joyas",
    subtitle: "Acabado premium",
    gallery: [
      { id: "g1", title: "Collar principal", subtitle: "Vista frontal", imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle del metal", subtitle: "Cerca del acabado", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 5,
    category: "Flores / Para Ella",
    name: 'Diseño Floral "Paraíso Tropical"',
    brand: "Florería La Rosa",
    price: 95,
    rating: 4.6,
    reviews: 52,
    description: "Arreglo vibrante con follajes y flores exóticas de alto impacto.",
    tag: "Flores",
    subtitle: "Diseño exclusivo",
    gallery: [
      { id: "g1", title: "Diseño tropical", subtitle: "Vista del arreglo", imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalles exóticos", subtitle: "Texturas naturales", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 6,
    category: "Bebidas / Para Él",
    name: "Vino Tinto Selección Reserva",
    brand: "Michelline",
    price: 150,
    rating: 4.9,
    reviews: 88,
    description: "Etiqueta seleccionada para ocasiones especiales y obsequios ejecutivos.",
    tag: "Top",
    subtitle: "Selección premium",
    gallery: [
      { id: "g1", title: "Botella reserva", subtitle: "Presentación principal", imageUrl: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Copa y maridaje", subtitle: "Inspiración de regalo", imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 7,
    category: "Colección Dulce / Dulces",
    name: "Macarons Franceses x12",
    brand: "Michelline",
    price: 65,
    rating: 4.9,
    reviews: 71,
    description: "Caja delicada con sabores surtidos y acabado premium.",
    tag: "Dulces",
    subtitle: "Caja delicada",
    gallery: [
      { id: "g1", title: "Caja de macarons", subtitle: "Presentación principal", imageUrl: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle de sabores", subtitle: "Texturas y color", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 8,
    category: "Decoración / Para Él",
    name: "Lámpara de Escritorio LED",
    brand: "Miniso",
    price: 89,
    rating: 4.5,
    reviews: 41,
    description: "Accesorio funcional con estética limpia para escritorio o estudio.",
    tag: "Deco",
    subtitle: "Luz cálida",
    gallery: [
      { id: "g1", title: "Lámpara de escritorio", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Ambiente de trabajo", subtitle: "Uso en escritorio", imageUrl: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 9,
    category: "Bienestar / Para Ella",
    name: 'Caja Spa "Calma Total"',
    brand: "Nuba",
    price: 134,
    rating: 4.8,
    reviews: 59,
    description: "Incluye velas, aceites, sales y texturas para una experiencia relajante.",
    tag: "Spa",
    subtitle: "Momento relax",
    gallery: [
      { id: "g1", title: "Caja spa completa", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Aceites y velas", subtitle: "Detalle del set", imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 10,
    category: "Desayunos / Para Ella",
    name: "Desayuno Sorpresa Signature",
    brand: "Sweet Emotions",
    price: 110,
    rating: 4.9,
    reviews: 85,
    description: "Bandeja de desayuno con flores, repostería y detalles personalizados.",
    tag: "Breakfast",
    subtitle: "Entrega mañanera",
    gallery: [
      { id: "g1", title: "Desayuno completo", subtitle: "Presentación principal", imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Mesa de desayuno", subtitle: "Detalle de bandeja", imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 11,
    category: "Bebidas / Corporativos",
    name: "Kit Ejecutivo de Café",
    brand: "Michelline",
    price: 98,
    rating: 4.7,
    reviews: 49,
    description: "Blend especial, taza y empaque sobrio para regalos de oficina.",
    tag: "Office",
    subtitle: "Regalo ejecutivo",
    gallery: [
      { id: "g1", title: "Kit de café", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Café y accesorios", subtitle: "Detalle del set", imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 12,
    category: "Joyas / Amor",
    name: "Pulsera Charm Corazón",
    brand: "Nuba",
    price: 76,
    rating: 4.6,
    reviews: 53,
    description: "Pieza delicada de uso diario con un acento romántico.",
    tag: "Joyas",
    subtitle: "Detalle romántico",
    gallery: [
      { id: "g1", title: "Pulsera principal", subtitle: "Vista frontal", imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle del charm", subtitle: "Cerca del corazón", imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 13,
    category: "Bebés / Baby Shower",
    name: "Box Recién Nacido",
    brand: "Miniso",
    price: 140,
    rating: 4.8,
    reviews: 64,
    description: "Set con accesorios suaves y presentación ideal para bienvenida.",
    tag: "Baby",
    subtitle: "Regalo de bienvenida",
    gallery: [
      { id: "g1", title: "Caja de bebé", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Accesorios suaves", subtitle: "Detalle del contenido", imageUrl: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 14,
    category: "Flores / Aniversario",
    name: "Rosas Eternas en Cúpula",
    brand: "Florería La Rosa",
    price: 180,
    rating: 5,
    reviews: 102,
    description: "Detalle decorativo de larga duración con acabado de boutique.",
    tag: "Flores",
    subtitle: "Edición especial",
    gallery: [
      { id: "g1", title: "Rosas en cúpula", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle del arreglo", subtitle: "Acabado boutique", imageUrl: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 15,
    category: "Colección Dulce / Dulces",
    name: "Mini Cake de Pistacho",
    brand: "Sweet Emotions",
    price: 58,
    rating: 4.7,
    reviews: 43,
    description: "Pastel pequeño de textura suave para celebraciones íntimas.",
    tag: "Dulces",
    subtitle: "Postre especial",
    gallery: [
      { id: "g1", title: "Mini cake", subtitle: "Vista principal", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Detalle del pastel", subtitle: "Cerca del topping", imageUrl: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 16,
    category: "Experiencias / Para Él",
    name: "Set Terraza & Vino",
    brand: "Michelline",
    price: 210,
    rating: 4.9,
    reviews: 58,
    description: "Selección pensada para compartir una noche especial.",
    tag: "Experiencia",
    subtitle: "Para compartir",
    gallery: [
      { id: "g1", title: "Terraza & vino", subtitle: "Experiencia principal", imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80" },
      { id: "g2", title: "Momento para dos", subtitle: "Inspiración de uso", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
];

const comentariosBase: Record<number, ProductComment[]> = {
  1: [{ id: "c1", author: "María", rating: 5, text: "Llegó precioso y con una presentación muy delicada." }],
  2: [{ id: "c2", author: "Camila", rating: 5, text: "Las trufas se ven premium y el empaque eleva mucho el regalo." }],
  3: [{ id: "c3", author: "Jorge", rating: 4, text: "Muy lindo para baby shower, se arma rápido y luce bastante." }],
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DetalleProducto({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const producto = productos.find((item) => item.id === productId) || productos[0];
  const { addItem } = useCart();
  const { user, isLoggedIn } = useSession();

  const [selectedCard, setSelectedCard] = useState("t1");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [message, setMessage] = useState("Para ti, con mucho carino y un detalle pensado especialmente para este momento.");
  const [selectedImage, setSelectedImage] = useState("g1");
  const [userRating, setUserRating] = useState<number>(producto.rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState<ProductComment[]>(() => comentariosBase[producto.id] || []);

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

  const imagenActiva = useMemo(
    () => producto.gallery.find((imagen: GalleryItem) => imagen.id === selectedImage) || producto.gallery[0],
    [producto.gallery, selectedImage]
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

  const handleRatingClick = (rating: number) => {
    if (!requireSession()) return;
    setUserRating(rating);
    setCommentRating(rating);
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
            <img src={imagenActiva.imageUrl} alt={producto.name} className={styles.mainImage} />
          </div>

          <div className={styles.galleryInfoBlock}>
            <div className={styles.thumbRow}>
              {producto.gallery.map((imagen: GalleryItem, index: number) => (
                <button
                  key={imagen.id}
                  type="button"
                  className={`${styles.thumbPlaceholder} ${selectedImage === imagen.id ? styles.thumbPlaceholderActive : ""}`}
                  onClick={() => setSelectedImage(imagen.id)}
                >
                  <img src={imagen.imageUrl} alt={imagen.title} className={styles.thumbImage} />
                  <span className={styles.thumbNumber}>0{index + 1}</span>
                  <span className={styles.thumbTitle}>{imagen.title}</span>
                </button>
              ))}
            </div>

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
                      onClick={() => handleRatingClick(index + 1)}
                      aria-label={`Calificar con ${index + 1} estrella${index === 0 ? "" : "s"}`}
                    >
                      <Star
                        size={16}
                        fill={(hoverRating ?? userRating) >= index + 1 ? "#E6885C" : "transparent"}
                        color="#E6885C"
                        strokeWidth={1.8}
                      />
                    </button>
                  ))}
                </div>
                <span className={styles.ratingValue}>{userRating.toFixed(1)}</span>
                <span className={styles.ratingCount}>{isLoggedIn ? "Tu calificación" : "Inicia sesión para calificar"}</span>
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
                      backgroundImage: `url(${tarjeta.designUrl})`,
                    }}
                  >
                    <span className={styles.templateBadge} style={{ background: tarjeta.accent }}>
                      {tarjeta.badge}
                    </span>
                    <p>{message || "Tu mensaje aparecera aqui"}</p>
                  </div>
                  <div className={styles.templateMeta}>
                    <strong>{tarjeta.name}</strong>
                    <span>{tarjeta.mood}</span>
                    <a
                      href={tarjeta.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.templateSource}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Ver borde fuente
                    </a>
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
                backgroundImage: `url(${tarjetaActiva.designUrl})`,
                backgroundColor: tarjetaActiva.accentSoft,
              }}
            >
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

            <p className={styles.previewSourceNote}>
              Referencia visual del borde:{" "}
              <a href={tarjetaActiva.sourceUrl} target="_blank" rel="noreferrer">
                {tarjetaActiva.sourceLabel}
              </a>
            </p>

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
              Anadir a la bolsa
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
              <span>{isLoggedIn ? "Puedes dejar una reseña" : "Solo usuarios registrados"}</span>
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
              placeholder={isLoggedIn ? "Escribe tu comentario sobre el producto..." : "Inicia sesión para comentar"}
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
