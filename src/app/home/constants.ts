// constants.ts — Solo datos puros, sin JSX
// Los iconos están en icons.tsx y los steps en steps.tsx

export const COLORS = {
  garnet:    "#8E1B3A",
  bordeaux:  "#5A0F24",
  crimson:   "#AB3A50",
  chocolate: "#5C3A2E",
  gold:      "#BC9968",
  beige:     "#F5E6D0",
  white:     "#FFFFFF",
  gray:      "#9B8EA0",
};

export const SECTION_IDS    = ["hero", "como-funciona", "caracteristicas", "testimonios", "cta"];
export const SECTION_LABELS = ["Inicio", "Cómo funciona", "Características", "Testimonios", "Comenzar"];

export const testimonials = [
  {
    text:   "Encontré el regalo perfecto para mi mamá en menos de 5 minutos. Nunca había visto algo tan personalizado y especial. ¡Lloró de alegría!",
    name:   "Valentina C.",
    role:   "Diseñadora gráfica · La Paz",
    avatar: "V",
  },
  {
    text:   "Llevaba semanas sin idea para el cumpleaños de mi novio. Emotia entendió exactamente lo que necesitaba. El mejor regalo que le he dado.",
    name:   "Sofía M.",
    role:   "Estudiante universitaria · La Paz",
    avatar: "S",
  },
  {
    text:   "Lo uso para todos mis clientes corporativos ahora. Las recomendaciones son increíblemente precisas y los artesanos son de primer nivel.",
    name:   "Carlos R.",
    role:   "Ejecutivo de ventas · La Paz",
    avatar: "C",
  },
];

export const features = [
  {
    icon:  "🧠",
    title: "IA Emocional Profunda",
    desc:  "No solo sugiere productos, comprende vínculos, momentos y emociones para crear conexiones que duran.",
  },
  {
    icon:  "🎨",
    title: "Artesanos Locales Verificados",
    desc:  "Red curada de los mejores artesanos paceños, con estándares de calidad garantizados.",
  },
  {
    icon:  "⚡",
    title: "Recomendación en 2 minutos",
    desc:  "Responde 5 preguntas y recibe opciones personalizadas al instante.",
  },
  {
    icon:  "📦",
    title: "Entrega el mismo día",
    desc:  "Servicio express en toda la ciudad de La Paz y alrededores.",
  },
];
