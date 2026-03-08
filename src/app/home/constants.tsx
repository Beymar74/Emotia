import React from 'react';

export const COLORS = {
  garnet: "#8E1B3A", bordeaux: "#5A0F24", crimson: "#AB3A50",
  chocolate: "#5C3A2E", gold: "#BC9968", beige: "#F5E6D0",
  white: "#FFFFFF", gray: "#8A7A75"
};

export const SECTION_IDS = ["hero", "como-funciona", "caracteristicas", "testimonios", "cta"];
export const SECTION_LABELS = ["Inicio", "Proceso", "Beneficios", "Testimonios", "Empezar"];

export const testimonials = [
  { name: "Lucía M.", role: "Aniversario de 2 años", text: "Nunca sabía qué regalar. La IA de Emotia me sugirió un kit botánico artesanal para mi novio y le encantó. ¡La mejor experiencia!", avatar: "L" },
  { name: "Carlos T.", role: "Cumpleaños de mamá", text: "Poder coordinar el regalo, la tarjeta y el envío desde un solo lugar me salvó la vida. El tracking funciona de maravilla.", avatar: "C" },
  { name: "Andrea P.", role: "Día de la amistad", text: "El análisis de personalidad de la IA es increíblemente preciso. Encontré un regalo que realmente conectó con mi mejor amiga.", avatar: "A" }
];

export const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

export const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
  </svg>
);

export const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: "100%", height: "100%" }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export const features = [
  { title: "Análisis Emocional", desc: "La IA interpreta las emociones detrás de cada ocasión.", icon: "🧠" },
  { title: "Personalización Total", desc: "Añade dedicatorias, elige empaques y crea algo único desde la plataforma.", icon: "✨" },
  { title: "Tracking en Tiempo Real", desc: "Monitorea tu pedido paso a paso hasta que llegue a las manos correctas.", icon: "📍" },
  { title: "Talento Local Paceño", desc: "Conectamos con los mejores artesanos y proveedores de la ciudad de La Paz.", icon: "🎁" }
];

export const steps = [
  { icon: <ChatIcon />,  num: "01", title: "Cuéntanos la ocasión",  desc: "Describe la persona, el momento especial y tu presupuesto. La IA escucha cada detalle con atención." },
  { icon: <SparkIcon />, num: "02", title: "La IA entra en acción", desc: "Nuestro algoritmo analiza emociones, personalidad y contexto para encontrar la combinación perfecta." },
  { icon: <GiftIcon />,  num: "03", title: "Recibe tu selección",   desc: "Una curaduría personalizada de regalos que realmente conectan y crean momentos inolvidables." },
];