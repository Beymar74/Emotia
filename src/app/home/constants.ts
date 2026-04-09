// ─────────────────────────────────────────────
// EMOTIA — Clientes · constants.ts v4 (Experiencias + Regalos)
// ─────────────────────────────────────────────

export const C = {
  garnet:     "#C6284F",
  crimson:    "#E04A64",
  rose:       "#FF6B81",
  peach:      "#FFD1B3",
  cream:      "#FFF3E6",
  white:      "#FFFFFF",
  gold:       "#E6B85C",
  garnetSoft: "#F28CA3",
  roseLight:  "#FFE3E8",
  choco:      "#5C3A2E",
  gray:       "#9A8A82",
};

export const PRODUCTS = [
  { id:1,  imgSrc:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&q=80", bg:"#FEF0F3", name:"Caja Cata Ciega Premium",    description:"4 vinos reserva tarijeños con guía de maridaje y copa de cristal.",      price:"Bs.280", old:"Bs.320", tag:"MÁS VENDIDO",  tagColor:"#C6284F", category:"vinos",          ocasiones:["cumpleaños","aniversario","agradecimiento"],                  rating:"4.9", reviews:"142", brand:"Viñedos Tarijeños" },
  { id:2,  imgSrc:"https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop&q=80",   bg:"#FDF7EE", name:"Trufas Cacao Amazónico",      description:"12 trufas rellenas de frutos exóticos bolivianos. Sin preservantes.",    price:"Bs.120", old:null,     tag:"NUEVO",        tagColor:"#7A4F1A", category:"chocolates",     ocasiones:["cumpleaños","san-valentin","agradecimiento","amistad"],       rating:"4.9", reviews:"89",  brand:"Chocobeni" },
  { id:3,  imgSrc:"https://images.unsplash.com/photo-1608181831718-c9fc5b1cac8c?w=400&h=300&fit=crop&q=80", bg:"#F4EEE8", name:"Set Velas Relajación",        description:"Cera de abeja pura con esencias naturales de los valles paceños.",       price:"Bs.180", old:null,     tag:"ARTESANAL",    tagColor:"#5C3A2E", category:"spa",            ocasiones:["cumpleaños","agradecimiento","amistad","sin-ocasion"],        rating:"4.8", reviews:"67",  brand:"Aromasol" },
  { id:4,  imgSrc:"https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=300&fit=crop&q=80", bg:"#F5EAEB", name:"Canasta Andina Deluxe",       description:"8 productos gourmet artesanales con empaque premium y dedicatoria.",      price:"Bs.450", old:"Bs.500", tag:"EXCLUSIVO",    tagColor:"#5A0F24", category:"canastas",       ocasiones:["cumpleaños","aniversario","navidad","agradecimiento"],        rating:"5.0", reviews:"203", brand:"Sabores del Ande" },
  { id:5,  imgSrc:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",   bg:"#EEF4FB", name:"Box Sorpresa Personalizado",  description:"Arma tu caja ideal. Tú eliges los productos y nosotros lo empacamos.",   price:"Bs.220", old:null,     tag:"POPULAR",      tagColor:"#185FA5", category:"personalizados", ocasiones:["cumpleaños","aniversario","san-valentin","amistad","navidad"], rating:"4.9", reviews:"118", brand:"Emotia Originals" },
  { id:6,  imgSrc:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&q=80", bg:"#EDF5EE", name:"Kit Ritual Spa en Casa",      description:"Sales de baño, aceites y mascarillas 100% naturales de los Yungas.",     price:"Bs.260", old:null,     tag:"ORGÁNICO",     tagColor:"#3B6D11", category:"spa",            ocasiones:["cumpleaños","agradecimiento","sin-ocasion","amistad"],        rating:"4.8", reviews:"55",  brand:"Tierra Viva" },
  { id:7,  imgSrc:"https://images.unsplash.com/photo-1547586696-ea22b4d4235d?w=400&h=300&fit=crop&q=80",   bg:"#F3EBF4", name:"Singani Reserva Vintage",    description:"Botella edición especial con caja de madera grabada y copa incluida.",   price:"Bs.320", old:null,     tag:"EDICIÓN LTD",  tagColor:"#534AB7", category:"vinos",          ocasiones:["aniversario","navidad","agradecimiento","cumpleaños"],        rating:"4.8", reviews:"41",  brand:"Casa Real" },
  { id:8,  imgSrc:"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&q=80", bg:"#FEF5E4", name:"Mieles & Mermeladas Gourmet", description:"Set de 3 mieles artesanales y 2 mermeladas de los valles de Cochabamba.", price:"Bs.95",  old:null,     tag:"NATURAL",      tagColor:"#854F0B", category:"chocolates",     ocasiones:["agradecimiento","amistad","sin-ocasion","navidad"],           rating:"4.7", reviews:"76",  brand:"Abejas del Valle" },
  { id:9,  imgSrc:"https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&q=80",   bg:"#FEF9F0", name:"Peluche Llama Andina",        description:"Peluche de llama artesanal hecho a mano en Bolivia.",                    price:"Bs.85",  old:null,     tag:"ARTESANAL",    tagColor:"#7A4F1A", category:"juguetes",       ocasiones:["cumpleaños","navidad","amistad","sin-ocasion"],               rating:"4.9", reviews:"94",  brand:"Manualidades del Altiplano" },
  { id:10, imgSrc:"https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop&q=80", bg:"#EEF4FB", name:"Juego de Mesa Familiar",      description:"Pack de 3 juegos clásicos reimaginados para noches en familia.",         price:"Bs.160", old:"Bs.195", tag:"FAVORITO",     tagColor:"#185FA5", category:"juguetes",       ocasiones:["cumpleaños","navidad","amistad","sin-ocasion"],               rating:"4.8", reviews:"73",  brand:"Lúdico Bolivia" },
  { id:11, imgSrc:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop&q=80", bg:"#FFF0F8", name:"Set Creativo Acuarelas",      description:"Kit completo de acuarelas profesionales, lienzos y pinceles.",           price:"Bs.130", old:null,     tag:"CREATIVO",     tagColor:"#8E1B3A", category:"juguetes",       ocasiones:["cumpleaños","navidad","amistad","sin-ocasion"],               rating:"4.9", reviews:"61",  brand:"Arte Vivo" },
  { id:12, imgSrc:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80", bg:"#F5EAEB", name:"Muñeca Cholita Artesanal",    description:"Muñeca con traje tradicional paceño, hecha a mano por artesanas.",       price:"Bs.110", old:null,     tag:"ÚNICO",        tagColor:"#5A0F24", category:"juguetes",       ocasiones:["cumpleaños","navidad","agradecimiento","sin-ocasion"],        rating:"5.0", reviews:"48",  brand:"Artesanas de La Paz" },
  // NUEVO PRODUCTO TIPO EXPERIENCIA:
  { id:13, imgSrc:"https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=300&fit=crop&q=80", bg:"#FDF7EE", name:"Cena Degustación para Dos",    description:"Experiencia gastronómica de 5 tiempos en restaurante exclusivo de la Zona Sur.", price:"Bs.450", old:null, tag:"MEMORABLE",  tagColor:"#C6284F", category:"experiencias",   ocasiones:["aniversario","san-valentin"],                                 rating:"5.0", reviews:"34",  brand:"Emotia Experiences" },
];

export const OFERTAS = [
  { id:1, imgSrc:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&q=80", bg:"#FEF0F3", name:"Caja Cata Ciega Premium",    newPrice:"Bs.238", oldPrice:"Bs.280", save:"Bs.42",  pct:"-15%" },
  { id:4, imgSrc:"https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=300&fit=crop&q=80", bg:"#F5EAEB", name:"Canasta Andina Deluxe",      newPrice:"Bs.360", oldPrice:"Bs.450", save:"Bs.90",  pct:"-20%" },
  { id:6, imgSrc:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&q=80", bg:"#EDF5EE", name:"Kit Ritual Spa en Casa",     newPrice:"Bs.234", oldPrice:"Bs.260", save:"Bs.26",  pct:"-10%" },
  { id:7, imgSrc:"https://images.unsplash.com/photo-1547586696-ea22b4d4235d?w=400&h=300&fit=crop&q=80",   bg:"#F3EBF4", name:"Singani Reserva Vintage",    newPrice:"Bs.282", oldPrice:"Bs.320", save:"Bs.38",  pct:"-12%" },
];

export const CATS = [
  { id:"todos",          label:"Todos",               icon:"LayoutGrid" },
  { id:"experiencias",   label:"Experiencias",        icon:"Ticket" }, // <-- NUEVA CATEGORÍA
  { id:"vinos",          label:"Vinos & Licores",     icon:"Wine" },
  { id:"chocolates",     label:"Chocolates",          icon:"Coffee" }, 
  { id:"canastas",       label:"Canastas",            icon:"ShoppingBag" },
  { id:"spa",            label:"Spa & Bienestar",     icon:"Flower2" },
  { id:"juguetes",       label:"Juguetes",            icon:"Puzzle" },
  { id:"personalizados", label:"Personalizados",      icon:"Sparkles" },
];

export const CAT_GRID = [
  { id:"experiencias",   label:"Experiencias",        icon:"Ticket",      count:15, bg:"#FDF7EE" }, // <-- NUEVA CATEGORÍA
  { id:"vinos",          label:"Vinos & Licores",     icon:"Wine",        count:12, bg:"#FEF0F3" },
  { id:"chocolates",     label:"Chocolates",          icon:"Coffee",      count:8,  bg:"#FDF7EE" },
  { id:"canastas",       label:"Canastas",            icon:"ShoppingBag", count:6,  bg:"#F5EAEB" },
  { id:"spa",            label:"Spa & Bienestar",     icon:"Flower2",     count:9,  bg:"#EDF5EE" },
  { id:"juguetes",       label:"Juguetes",            icon:"Puzzle",      count:14, bg:"#FEF9F0" },
  { id:"personalizados", label:"Personalizados",      icon:"Sparkles",    count:5,  bg:"#FFE3E8" },
];

export const OCASIONES = [
  { id:"todas",          label:"Cualquier ocasión",   icon:"Calendar" },
  { id:"cumpleaños",     label:"Cumpleaños",          icon:"Gift" },
  { id:"aniversario",    label:"Aniversario",         icon:"Heart" },
  { id:"san-valentin",   label:"San Valentín",        icon:"HeartHandshake" },
  { id:"navidad",        label:"Navidad",             icon:"TreePine" },
  { id:"agradecimiento", label:"Agradecimiento",      icon:"Mail" },
  { id:"amistad",        label:"Amistad",             icon:"Users" },
  { id:"sin-ocasion",    label:"Sin ocasión",         icon:"Smile" },
];

export const OCASIONES_HERO = [
  { id:"cumpleaños",     label:"Cumpleaños",          icon:"Gift",        bg:"#FFE3E8" },
  { id:"aniversario",    label:"Aniversario",         icon:"Heart",       bg:"#FEF0F3" },
  { id:"sin-ocasion",    label:"Sin ocasión",         icon:"Smile",       bg:"#FDF7EE" },
  { id:"navidad",        label:"Navidad",             icon:"TreePine",    bg:"#EDF5EE" },
  { id:"amistad",        label:"Amistad",             icon:"Users",       bg:"#F3EBF4" },
];

export const MINI_BANNERS = [
  { bg:"#FEF0F3", icon:"Wine",     acento:"#C6284F", tag:"Vinos selectos",   title:"Tarijeños premium",  link:"vinos" },
  { bg:"#FDF7EE", icon:"Coffee",   acento:"#7A4F1A", tag:"Chocolates",       title:"Cacao amazónico",    link:"chocolates" },
  { bg:"#FFE3E8", icon:"Sparkles", acento:"#C6284F", tag:"Nuevo en Emotia",  title:"Personalizados IA",  link:"personalizados" },
];

export const TESTIMONIALS = [
  { text:"La selección de obsequios corporativos superó mis expectativas. Servicio impecable y elegante.", name:"Carlos R.", avatar:"CR" },
  { text:"Encontré un regalo verdaderamente especial en pocos minutos. La presentación es de primera categoría.", name:"Valentina C.", avatar:"VC" },
  { text:"El empaque premium y los detalles artesanales marcan una gran diferencia. Totalmente recomendado.", name:"María L.", avatar:"ML" },
  { text:"Una experiencia de usuario intuitiva que simplifica la búsqueda del detalle perfecto.", name:"Sofía M.", avatar:"SM" },
];

export const TRUST_ITEMS = [
  { icon:"Truck",        label:"Envíos a nivel nacional" },
  { icon:"Package",      label:"Empaque premium garantizado" },
  { icon:"PenTool",      label:"Dedicatorias personalizadas" },
  { icon:"Award",        label:"Selección artesanal exclusiva" },
  { icon:"Cpu",          label:"Curaduría inteligente (IA)" },
  { icon:"ShieldCheck",  label:"Transacciones seguras" },
];

// 👇 TEXTOS DE LA IA ACTUALIZADOS PARA PREGUNTAR POR EXPERIENCIAS 👇
export const CHAT_STEPS = [
  { id:"ai-0",   role:"ai",     text:"Bienvenido a Emotia. Para poder asistirle, ¿a quién está dirigido el obsequio?", delay:700  },
  { id:"usr-1",  role:"user",   text:"Es para mi madre. Cumple 55 años.", delay:1900 },
  { id:"ai-1",   role:"ai",     text:"Entendido. ¿Preferiría darle un regalo físico tradicional o invitarla a una experiencia memorable (como un spa o cena)?", delay:3000 },
  { id:"usr-2",  role:"user",   text:"Le vendría muy bien un día de relajación en un spa.", delay:4200 },
  { id:"ai-2",   role:"ai",     text:"Perfecto. Finalmente, ¿cuál sería el rango de inversión aproximado para este detalle?", delay:5300 },
  { id:"usr-3",  role:"user",   text:"El presupuesto está entre Bs.150 y Bs.300.", delay:6400 },
  { id:"result", role:"result", text:"", delay:7700 },
];