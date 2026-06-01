import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const PASSWORD = "Emotia2026!";

type ProductoSeed = {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  ocasiones: string[];
  personalidades: string[];
  genero?: string;
  edadMin?: number;
  edadMax?: number;
  permiteMensaje?: boolean;
  permiteEmpaque?: boolean;
};

type ProveedorSeed = {
  nombre: string;
  descripcion: string;
  email: string;
  telefono: string;
  direccion: string;
  representante: string;
  repAnio: number;
  categorias: string[];
  rating: number;
  totalVendido: number;
  logoText: string;
  productos: ProductoSeed[];
};

const categoriasCatalogo = [
  { nombre: "Flores", descripcion: "Ramos, bouquets y arreglos florales para ocasiones especiales." },
  { nombre: "Chocolates", descripcion: "Cajas dulces, bombones, trufas y detalles gourmet." },
  { nombre: "Salud y Belleza", descripcion: "Regalos de bienestar, spa, fragancias y cuidado personal." },
  { nombre: "Peluches", descripcion: "Regalos tiernos, suaves y afectivos." },
  { nombre: "Tecnología", descripcion: "Detalles gamer, accesorios tech y regalos modernos." },
  { nombre: "Decoración", descripcion: "Detalles para hogar, oficina y ambientes especiales." },
  { nombre: "Accesorios y Bisutería", descripcion: "Joyería, bisutería y accesorios personales." },
  { nombre: "Juguetes", descripcion: "Regalos infantiles, creativos y educativos." },
  { nombre: "Sorpresas", descripcion: "Cajas sorpresa, combos personalizados y detalles especiales." },
  { nombre: "Papelería", descripcion: "Tarjetas, libretas, envolturas y detalles escritos." },
];

function toProduct(row: Array<string | number | string[] | boolean | undefined>): ProductoSeed {
  return {
    nombre: String(row[0] || ""),
    descripcion: String(row[1] || ""),
    categoria: String(row[2] || ""),
    precio: Number(row[3] || 0),
    stock: Number(row[4] || 0),
    ocasiones: Array.isArray(row[5]) ? row[5].map(String) : [],
    personalidades: Array.isArray(row[6]) ? row[6].map(String) : [],
    genero: typeof row[7] === "string" ? row[7] : "cualquiera",
    edadMin: typeof row[8] === "number" ? row[8] : 8,
    edadMax: typeof row[9] === "number" ? row[9] : 80,
    permiteMensaje: typeof row[10] === "boolean" ? row[10] : true,
    permiteEmpaque: typeof row[11] === "boolean" ? row[11] : true,
  };
}

function makePlaceholder(text: string, width = 600, height = 600) {
  return `https://placehold.co/${width}x${height}/8E1B3A/FFF7F1?text=${encodeURIComponent(text)}`;
}

const proveedores: ProveedorSeed[] = [
  {
    nombre: "Florería Aurora",
    descripcion: "Tienda de arreglos florales, ramos personalizados y detalles para fechas especiales.",
    email: "aurora.flores@emotia.test",
    telefono: "70124581",
    direccion: "Av. Montenegro #1245, San Miguel, La Paz",
    representante: "Laura Méndez",
    repAnio: 1991,
    categorias: ["floreria", "regalos_personalizados"],
    rating: 4.8,
    totalVendido: 18450,
    logoText: "AUR",
    productos: [
      ["Ramo Rosas Aurora", "Ramo elegante de rosas rojas con envoltura premium.", "Flores", 145, 18, ["aniversario", "amor", "día de la madre"], ["romántico", "elegante"]],
      ["Ramo Girasoles Felices", "Bouquet alegre de girasoles para cumpleaños y agradecimientos.", "Flores", 120, 20, ["cumpleaños", "agradecimiento"], ["alegre", "detallista"]],
      ["Caja Floral Romántica", "Caja decorativa con flores mixtas y tarjeta personalizada.", "Flores", 180, 12, ["aniversario", "amor"], ["romántico", "premium"]],
      ["Arreglo Floral Cumpleaños", "Arreglo colorido ideal para celebrar cumpleaños.", "Flores", 135, 15, ["cumpleaños"], ["divertido", "sorpresa"]],
      ["Bouquet Primaveral", "Flores frescas en tonos suaves con presentación moderna.", "Flores", 110, 24, ["primavera", "agradecimiento"], ["elegante", "minimalista"]],
      ["Ramo Tulipanes Elegantes", "Ramo delicado de tulipanes con envoltura de lujo.", "Flores", 210, 10, ["aniversario", "evento formal"], ["elegante", "premium"]],
      ["Flores con Tarjeta Personalizada", "Detalle floral con tarjeta escrita para la ocasión.", "Flores", 95, 25, ["amistad", "agradecimiento"], ["detallista", "tierno"]],
      ["Centro de Mesa Floral", "Arreglo para mesa de evento o decoración de hogar.", "Decoración", 160, 9, ["evento formal"], ["elegante", "minimalista"]],
      ["Mini Bouquet Sorpresa", "Bouquet pequeño para detalles espontáneos.", "Flores", 75, 30, ["amistad", "sorpresa"], ["tierno", "sorpresa"]],
      ["Ramo Premium Día de la Madre", "Ramo especial con flores seleccionadas para mamá.", "Flores", 240, 11, ["día de la madre"], ["elegante", "premium"]],
    ].map(toProduct),
  },
  {
    nombre: "Dulce Encanto Chocolatería",
    descripcion: "Chocolatería artesanal con cajas dulces, bombones y regalos gourmet.",
    email: "dulce.encanto@emotia.test",
    telefono: "70124582",
    direccion: "Calle 21 #880, Calacoto, La Paz",
    representante: "Camila Rojas",
    repAnio: 1993,
    categorias: ["chocolateria", "reposteria"],
    rating: 4.7,
    totalVendido: 22180,
    logoText: "DUL",
    productos: [
      ["Caja Bombones Clásicos", "Caja de bombones surtidos para regalo elegante.", "Chocolates", 95, 28, ["cumpleaños", "agradecimiento"], ["elegante", "detallista"]],
      ["Chocolates Corazón Romántico", "Chocolates en caja de corazón para pareja.", "Chocolates", 130, 16, ["aniversario", "amor"], ["romántico", "tierno"]],
      ["Trufas Premium Surtidas", "Trufas artesanales con sabores seleccionados.", "Chocolates", 165, 14, ["evento formal", "agradecimiento"], ["premium", "elegante"]],
      ["Mini Box Dulce Sorpresa", "Pequeña caja dulce para detalles casuales.", "Chocolates", 55, 35, ["amistad", "sorpresa"], ["sorpresa", "divertido"]],
      ["Canasta Chocolates y Galletas", "Canasta con chocolates, galletas y presentación especial.", "Chocolates", 190, 12, ["cumpleaños", "día de la madre"], ["detallista", "premium"]],
      ["Tabletas Artesanales Variadas", "Pack de tabletas de chocolate artesanal.", "Chocolates", 85, 22, ["amistad", "agradecimiento"], ["foodie", "minimalista"]],
      ["Chocolate Personalizado con Mensaje", "Chocolate con dedicatoria personalizada.", "Chocolates", 75, 26, ["amor", "cumpleaños"], ["detallista", "romántico"]],
      ["Brownies Gift Box", "Caja de brownies decorados para regalo.", "Chocolates", 105, 18, ["cumpleaños"], ["foodie", "divertido"]],
      ["Caja Dulce Cumpleaños", "Caja temática con dulces y chocolates.", "Sorpresas", 115, 20, ["cumpleaños"], ["sorpresa", "tierno"]],
      ["Pack Chocolates Elegantes", "Selección elegante de chocolates para ocasiones formales.", "Chocolates", 150, 15, ["evento formal", "agradecimiento"], ["elegante", "premium"]],
    ].map(toProduct),
  },
  {
    nombre: "Aroma & Calma Spa Gifts",
    descripcion: "Regalos de bienestar, aromaterapia, cuidado personal y experiencias relajantes para fechas especiales.",
    email: "aroma.calma@emotia.test",
    telefono: "70124583",
    direccion: "Av. Arce #2100, Sopocachi, La Paz",
    representante: "Mariana Salvatierra",
    repAnio: 1992,
    categorias: ["regalos_personalizados", "decoracion"],
    rating: 4.7,
    totalVendido: 16800,
    logoText: "SPA",
    productos: [
      ["Kit Spa Lavanda Relax", "Caja con vela de lavanda, sales de baño y jabón artesanal.", "Salud y Belleza", 135, 18, ["cumpleaños", "día de la madre", "agradecimiento"], ["relajado", "elegante", "detallista"]],
      ["Set Velas Aromáticas Serena", "Trío de velas aromáticas con notas florales y cítricas.", "Decoración", 95, 24, ["agradecimiento", "amistad"], ["minimalista", "elegante"]],
      ["Caja Bienestar Mujer", "Set de autocuidado con crema, aceite y tarjeta dedicatoria.", "Salud y Belleza", 180, 12, ["día de la madre", "cumpleaños"], ["premium", "detallista"]],
      ["Difusor Bambú Antiestrés", "Difusor de varillas con aroma suave para dormitorio u oficina.", "Decoración", 120, 16, ["evento formal", "agradecimiento"], ["minimalista", "relajado"]],
      ["Pack Jabones Botánicos", "Cuatro jabones artesanales con esencias naturales.", "Salud y Belleza", 78, 28, ["amistad", "agradecimiento"], ["natural", "detallista"]],
      ["Aceites Esenciales Calma", "Set de aceites de lavanda, eucalipto y naranja dulce.", "Salud y Belleza", 150, 13, ["cumpleaños"], ["relajado", "premium"]],
      ["Caja Ritual Noche Tranquila", "Pack de té, vela, antifaz y sales para descanso.", "Sorpresas", 165, 10, ["cumpleaños", "agradecimiento"], ["relajado", "sorpresa"]],
      ["Crema Corporal Vainilla", "Crema hidratante con aroma cálido y presentación de regalo.", "Salud y Belleza", 88, 21, ["amistad", "cumpleaños"], ["tierno", "detallista"]],
      ["Kit Home Spa Premium", "Set completo de spa con empaque especial.", "Salud y Belleza", 230, 8, ["día de la madre", "evento formal"], ["premium", "elegante"]],
      ["Mini Box Aromaterapia", "Detalle pequeño con vela mini, jabón y tarjeta.", "Sorpresas", 65, 32, ["amistad", "sorpresa"], ["tierno", "minimalista"]],
    ].map(toProduct),
  },
  {
    nombre: "Kawaii Planet",
    descripcion: "Tienda de peluches, accesorios tiernos y detalles kawaii para regalos especiales.",
    email: "kawaii.planet@emotia.test",
    telefono: "70124584",
    direccion: "Calle Comercio #445, Centro, La Paz",
    representante: "Andrea Paredes",
    repAnio: 1996,
    categorias: ["regalos_personalizados", "textiles"],
    rating: 4.6,
    totalVendido: 17600,
    logoText: "KAW",
    productos: [
      ["Peluche Conejito Kawaii", "Peluche suave en tonos pastel.", "Peluches", 95, 20, ["cumpleaños", "amistad"], ["kawaii", "tierno"]],
      ["Llavero Gatito Pastel", "Llavero pequeño de gatito estilo cute.", "Accesorios y Bisutería", 35, 40, ["amistad"], ["kawaii", "minimalista"]],
      ["Libreta Cute Dreams", "Libreta decorada para notas y dedicatorias.", "Papelería", 45, 30, ["cumpleaños", "agradecimiento"], ["kawaii", "creativo"]],
      ["Set Stickers Kawaii", "Pack de stickers para cartas y regalos.", "Papelería", 25, 50, ["amistad"], ["kawaii", "divertido"]],
      ["Taza Osito Tierno", "Taza con diseño de osito para regalo casual.", "Decoración", 65, 24, ["cumpleaños"], ["tierno", "kawaii"]],
      ["Mochi Peluche Mini", "Mini peluche redondo de textura suave.", "Peluches", 58, 32, ["sorpresa", "amistad"], ["kawaii", "sorpresa"]],
      ["Caja Sorpresa Kawaii", "Caja con accesorios sorpresa estilo kawaii.", "Sorpresas", 135, 13, ["cumpleaños"], ["kawaii", "sorpresa"]],
      ["Lapiceros Pastel Pack", "Set de lapiceros pastel para papelería creativa.", "Papelería", 38, 35, ["amistad"], ["creativo", "kawaii"]],
      ["Cojín Nube Suave", "Cojín decorativo con forma de nube.", "Decoración", 90, 15, ["cumpleaños"], ["tierno", "minimalista"]],
      ["Regalo Kawaii Cumpleaños", "Combo de peluche, stickers y tarjeta.", "Sorpresas", 150, 12, ["cumpleaños"], ["kawaii", "detallista"]],
    ].map(toProduct),
  },
  {
    nombre: "GeekBox Bolivia",
    descripcion: "Regalos gamer, accesorios tecnológicos y detalles para fanáticos geek.",
    email: "geekbox.bo@emotia.test",
    telefono: "70124585",
    direccion: "Av. 6 de Marzo #3020, El Alto",
    representante: "Diego Arce",
    repAnio: 1990,
    categorias: ["regalos_personalizados", "decoracion"],
    rating: 4.5,
    totalVendido: 19990,
    logoText: "GBX",
    productos: [
      ["Mousepad Gamer RGB", "Mousepad amplio con estilo gamer.", "Tecnología", 115, 18, ["cumpleaños"], ["gamer", "tecnológico"]],
      ["Lámpara LED Gamer", "Lámpara decorativa LED para escritorio.", "Decoración", 145, 16, ["cumpleaños"], ["gamer", "tecnológico"]],
      ["Taza Level Up", "Taza con diseño gamer para regalo.", "Decoración", 55, 30, ["cumpleaños", "amistad"], ["gamer", "divertido"]],
      ["Soporte Celular Gamer", "Soporte para celular con diseño moderno.", "Tecnología", 70, 25, ["amistad"], ["tecnológico", "minimalista"]],
      ["Mini Figura Coleccionable", "Figura decorativa para escritorio geek.", "Decoración", 85, 20, ["cumpleaños"], ["fanático", "gamer"]],
      ["Caja Sorpresa Geek", "Caja con accesorios gamer y detalles sorpresa.", "Sorpresas", 165, 10, ["cumpleaños"], ["gamer", "sorpresa"]],
      ["Llavero Control Retro", "Llavero inspirado en controles clásicos.", "Accesorios y Bisutería", 35, 40, ["amistad"], ["gamer", "retro"]],
      ["Audífonos Básicos Gamer", "Audífonos de entrada para uso diario.", "Tecnología", 180, 9, ["cumpleaños"], ["gamer", "tecnológico"]],
      ["Organizador Escritorio Tech", "Organizador para gadgets y escritorio.", "Decoración", 95, 15, ["evento formal"], ["minimalista", "tecnológico"]],
      ["Pack Gamer Cumpleaños", "Combo gamer con taza, llavero y accesorio.", "Sorpresas", 150, 14, ["cumpleaños"], ["gamer", "detallista"]],
    ].map(toProduct),
  },
  {
    nombre: "Casa Bonita Deco",
    descripcion: "Decoración para hogar, detalles de mesa, cerámica y regalos cálidos para espacios especiales.",
    email: "casa.bonita@emotia.test",
    telefono: "70124586",
    direccion: "Calle Rosendo Gutiérrez #650, Sopocachi, La Paz",
    representante: "Valeria Quiroga",
    repAnio: 1994,
    categorias: ["decoracion", "ceramica"],
    rating: 4.6,
    totalVendido: 15850,
    logoText: "CAS",
    productos: [
      ["Portarretrato Madera Clara", "Portarretrato decorativo para fotos familiares o de pareja.", "Decoración", 75, 22, ["aniversario", "día de la madre"], ["minimalista", "detallista"]],
      ["Florero Cerámico Arena", "Florero de cerámica en tono neutro para hogar moderno.", "Decoración", 125, 14, ["evento formal", "agradecimiento"], ["elegante", "minimalista"]],
      ["Set Posavasos Terrazo", "Cuatro posavasos decorativos con acabado tipo terrazo.", "Decoración", 58, 30, ["amistad", "agradecimiento"], ["minimalista", "creativo"]],
      ["Vela Decorativa Ambar", "Vela en frasco ámbar con aroma cálido para sala o dormitorio.", "Decoración", 82, 24, ["cumpleaños", "agradecimiento"], ["elegante", "relajado"]],
      ["Maceta Minimalista Blanca", "Maceta decorativa para escritorio con diseño limpio.", "Decoración", 70, 18, ["amistad", "evento formal"], ["minimalista", "natural"]],
      ["Bandeja Dorada Deco", "Bandeja metálica para joyas, velas o mesa de centro.", "Decoración", 140, 12, ["evento formal"], ["elegante", "premium"]],
      ["Cojín Hogar Cálido", "Cojín decorativo suave en tonos beige.", "Decoración", 95, 20, ["cumpleaños", "agradecimiento"], ["tierno", "minimalista"]],
      ["Cuadro Frase Inspiradora", "Cuadro pequeño con frase positiva y marco liviano.", "Decoración", 68, 26, ["amistad", "graduación"], ["creativo", "detallista"]],
      ["Difusor Home Deluxe", "Difusor de ambiente con diseño decorativo premium.", "Decoración", 118, 16, ["día de la madre", "evento formal"], ["premium", "elegante"]],
      ["Kit Rincón Acogedor", "Combo de vela, maceta mini y portarretrato.", "Sorpresas", 185, 9, ["cumpleaños", "agradecimiento"], ["detallista", "elegante"]],
    ].map(toProduct),
  },
  {
    nombre: "Joyería Luna Clara",
    descripcion: "Bisutería fina, accesorios delicados y joyas personalizadas para regalos elegantes.",
    email: "luna.clara@emotia.test",
    telefono: "70124587",
    direccion: "Av. Ballivián #1508, Calacoto, La Paz",
    representante: "Sofía Vargas",
    repAnio: 1991,
    categorias: ["joyeria", "regalos_personalizados"],
    rating: 4.9,
    totalVendido: 28600,
    logoText: "LUN",
    productos: [
      ["Collar Inicial Dorado", "Collar con dije de inicial en tono dorado.", "Accesorios y Bisutería", 120, 25, ["cumpleaños", "aniversario"], ["elegante", "detallista"]],
      ["Pulsera Corazón Minimalista", "Pulsera fina con dije de corazón.", "Accesorios y Bisutería", 95, 28, ["amor", "aniversario"], ["romántico", "minimalista"]],
      ["Aretes Perla Elegante", "Aretes de perla sintética con presentación de regalo.", "Accesorios y Bisutería", 110, 20, ["evento formal", "día de la madre"], ["elegante", "premium"]],
      ["Set Anillos Delicados", "Set de anillos finos combinables.", "Accesorios y Bisutería", 135, 16, ["cumpleaños", "amistad"], ["elegante", "creativo"]],
      ["Collar Luna y Estrella", "Collar con dijes de luna y estrella.", "Accesorios y Bisutería", 125, 18, ["cumpleaños", "amor"], ["tierno", "romántico"]],
      ["Pulsera Grabada Amor", "Pulsera personalizable con palabra corta o fecha.", "Accesorios y Bisutería", 150, 12, ["aniversario", "amor"], ["romántico", "detallista"]],
      ["Caja Joyería Romántica", "Combo de collar, pulsera y tarjeta personalizada.", "Sorpresas", 240, 8, ["aniversario"], ["romántico", "premium"]],
      ["Tobillera Verano", "Tobillera delicada para regalo casual.", "Accesorios y Bisutería", 70, 30, ["amistad", "cumpleaños"], ["minimalista", "juvenil"]],
      ["Collar Mamá Especial", "Collar con dije familiar para Día de la Madre.", "Accesorios y Bisutería", 165, 10, ["día de la madre"], ["elegante", "detallista"]],
      ["Set Joyería Premium Clara", "Set elegante de collar y aretes para ocasión formal.", "Accesorios y Bisutería", 260, 7, ["evento formal", "aniversario"], ["premium", "elegante"]],
    ].map(toProduct),
  },
  {
    nombre: "Sabores Gourmet",
    descripcion: "Canastas gourmet, snacks premium, desayunos sorpresa y regalos gastronómicos.",
    email: "sabores.gourmet@emotia.test",
    telefono: "70124588",
    direccion: "Av. Busch #1190, Miraflores, La Paz",
    representante: "Rodrigo Beltrán",
    repAnio: 1989,
    categorias: ["reposteria", "chocolateria"],
    rating: 4.6,
    totalVendido: 23800,
    logoText: "GOU",
    productos: [
      ["Canasta Gourmet Clásica", "Canasta con galletas, chocolates, café y frutos secos.", "Sorpresas", 220, 10, ["cumpleaños", "agradecimiento"], ["foodie", "premium"]],
      ["Pack Café y Galletas", "Set de café molido y galletas artesanales.", "Chocolates", 115, 22, ["amistad", "agradecimiento"], ["foodie", "detallista"]],
      ["Caja Snacks Premium", "Selección de snacks dulces y salados para compartir.", "Sorpresas", 140, 18, ["cumpleaños", "evento formal"], ["sorpresa", "foodie"]],
      ["Set Té Artesanal", "Caja con infusiones, miel y galletas.", "Sorpresas", 125, 16, ["día de la madre", "agradecimiento"], ["relajado", "elegante"]],
      ["Desayuno Sorpresa Andino", "Desayuno con panes, jugo, fruta y detalle dulce.", "Sorpresas", 185, 12, ["cumpleaños", "día de la madre"], ["detallista", "sorpresa"]],
      ["Pack Quesos y Frutos Secos", "Tabla lista para regalo con sabores salados.", "Sorpresas", 210, 9, ["evento formal", "agradecimiento"], ["premium", "foodie"]],
      ["Mermeladas Artesanales Trio", "Tres mermeladas de fruta en presentación de regalo.", "Chocolates", 78, 26, ["amistad", "agradecimiento"], ["natural", "detallista"]],
      ["Caja Gourmet Cumpleaños", "Caja temática con dulces, snacks y mini tarjeta.", "Sorpresas", 155, 14, ["cumpleaños"], ["sorpresa", "divertido"]],
      ["Pack Dulce y Salado", "Combinación equilibrada de chocolates, galletas y snacks.", "Chocolates", 135, 20, ["amistad", "cumpleaños"], ["foodie", "detallista"]],
      ["Canasta Familiar Especial", "Canasta grande para compartir en familia.", "Sorpresas", 280, 7, ["navidad", "agradecimiento"], ["familiar", "premium"]],
    ].map(toProduct),
  },
  {
    nombre: "MiniMundo Kids",
    descripcion: "Regalos infantiles, juguetes educativos, kits creativos y detalles para Día del Niño.",
    email: "minimundo.kids@emotia.test",
    telefono: "70124589",
    direccion: "Av. Satélite #720, El Alto",
    representante: "Natalia Flores",
    repAnio: 1995,
    categorias: ["regalos_personalizados", "textiles"],
    rating: 4.4,
    totalVendido: 14300,
    logoText: "KID",
    productos: [
      ["Kit Arte Infantil ColorMix", "Set de crayones, hojas y stickers para creatividad.", "Juguetes", 85, 25, ["cumpleaños", "día del niño"], ["infantil", "creativo"], "cualquiera", 4, 12],
      ["Rompecabezas Animales 60 piezas", "Puzzle educativo con animales para niños.", "Juguetes", 70, 24, ["cumpleaños", "día del niño"], ["infantil", "educativo"], "cualquiera", 5, 10],
      ["Peluche Dino Amigo", "Peluche de dinosaurio suave y resistente.", "Peluches", 98, 18, ["cumpleaños", "día del niño"], ["infantil", "tierno"], "cualquiera", 3, 10],
      ["Bloques Creativos Kids", "Bloques de construcción para juego imaginativo.", "Juguetes", 135, 14, ["cumpleaños"], ["creativo", "infantil"], "cualquiera", 4, 9],
      ["Libro Cuentos Ilustrados", "Libro de cuentos cortos con ilustraciones coloridas.", "Juguetes", 60, 28, ["día del niño", "cumpleaños"], ["educativo", "tierno"], "cualquiera", 4, 11],
      ["Mochila Infantil Arcoíris", "Mochila pequeña para niños con diseño colorido.", "Peluches", 115, 16, ["cumpleaños"], ["infantil", "divertido"], "cualquiera", 4, 9],
      ["Juego Memoria Divertida", "Juego de memoria con tarjetas ilustradas.", "Juguetes", 55, 32, ["día del niño"], ["educativo", "divertido"], "cualquiera", 5, 12],
      ["Set Pintura Niños", "Kit de pintura lavable con pinceles y hojas.", "Juguetes", 90, 20, ["cumpleaños"], ["creativo", "infantil"], "cualquiera", 5, 12],
      ["Caja Sorpresa Día del Niño", "Caja con juguete, dulce y tarjeta infantil.", "Sorpresas", 145, 12, ["día del niño"], ["sorpresa", "infantil"], "cualquiera", 4, 10],
      ["Muñeco Aventura Kids", "Muñeco de aventura para juego narrativo.", "Juguetes", 120, 15, ["cumpleaños"], ["infantil", "divertido"], "cualquiera", 4, 11],
    ].map(toProduct),
  },
  {
    nombre: "Paper Love Studio",
    descripcion: "Papelería creativa, tarjetas personalizadas, envolturas premium y detalles escritos.",
    email: "paper.love@emotia.test",
    telefono: "70124590",
    direccion: "Calle Sagárnaga #315, Centro, La Paz",
    representante: "Daniela Cortés",
    repAnio: 1993,
    categorias: ["papeleria_creativa", "regalos_personalizados"],
    rating: 4.5,
    totalVendido: 12650,
    logoText: "PAP",
    productos: [
      ["Tarjeta Cumpleaños Acuarela", "Tarjeta artesanal con ilustración tipo acuarela.", "Papelería", 32, 45, ["cumpleaños"], ["creativo", "detallista"]],
      ["Tarjeta Amor Personalizada", "Tarjeta romántica con espacio para dedicatoria.", "Papelería", 35, 40, ["amor", "aniversario"], ["romántico", "detallista"]],
      ["Papel Regalo Elegante", "Set de papeles premium para envolver regalos.", "Papelería", 48, 34, ["evento formal", "cumpleaños"], ["elegante", "minimalista"]],
      ["Set Sobres Decorados", "Sobres decorativos para cartas y tarjetas.", "Papelería", 28, 50, ["amistad", "agradecimiento"], ["creativo", "detallista"]],
      ["Libreta Gratitud", "Libreta para notas, frases y agradecimientos.", "Papelería", 65, 28, ["agradecimiento", "amistad"], ["minimalista", "detallista"]],
      ["Kit Carta Romántica", "Set de hojas, sobre, sticker y tarjeta para pareja.", "Papelería", 55, 24, ["amor", "aniversario"], ["romántico", "creativo"]],
      ["Stickers Para Regalo", "Pack de stickers decorativos para envolturas.", "Papelería", 25, 55, ["cumpleaños", "amistad"], ["creativo", "kawaii"]],
      ["Caja Mensaje Sorpresa", "Caja pequeña con tarjetas desplegables para mensajes.", "Sorpresas", 90, 16, ["aniversario", "cumpleaños"], ["sorpresa", "detallista"]],
      ["Tarjeta Día de la Madre Floral", "Tarjeta floral con dedicatoria para mamá.", "Papelería", 38, 30, ["día de la madre"], ["tierno", "detallista"]],
      ["Pack Envoltura Premium", "Set de papel, lazo, tarjeta y etiqueta para regalo.", "Papelería", 75, 22, ["evento formal", "cumpleaños"], ["premium", "elegante"]],
    ].map(toProduct),
  },
  {
    nombre: "Perfumes Violeta",
    descripcion: "Fragancias, splash, cremas aromáticas y sets de regalo para distintas ocasiones.",
    email: "perfumes.violeta@emotia.test",
    telefono: "70124591",
    direccion: "Av. 16 de Julio #1480, Prado, La Paz",
    representante: "Gabriela Molina",
    repAnio: 1990,
    categorias: ["regalos_personalizados"],
    rating: 4.4,
    totalVendido: 17400,
    logoText: "VIO",
    productos: [
      ["Perfume Floral Violeta", "Fragancia floral suave en presentación de regalo.", "Salud y Belleza", 155, 18, ["cumpleaños", "día de la madre"], ["elegante", "romántico"]],
      ["Perfume Amaderado Urbano", "Fragancia amaderada para uso diario.", "Salud y Belleza", 170, 16, ["cumpleaños", "evento formal"], ["elegante", "minimalista"]],
      ["Body Splash Vainilla", "Splash corporal dulce y juvenil.", "Salud y Belleza", 75, 28, ["amistad", "cumpleaños"], ["tierno", "juvenil"]],
      ["Mini Perfumes Set Viaje", "Set de tres mini fragancias para probar o regalar.", "Salud y Belleza", 135, 20, ["cumpleaños", "sorpresa"], ["sorpresa", "detallista"]],
      ["Crema Corporal Aromática", "Crema con aroma floral y textura ligera.", "Salud y Belleza", 68, 26, ["amistad", "día de la madre"], ["tierno", "detallista"]],
      ["Fragancia Elegante Noche", "Perfume intenso para ocasiones formales.", "Salud y Belleza", 220, 9, ["evento formal", "aniversario"], ["premium", "elegante"]],
      ["Pack Perfume y Tarjeta", "Fragancia con tarjeta personalizada incluida.", "Sorpresas", 185, 12, ["cumpleaños", "amor"], ["romántico", "detallista"]],
      ["Perfume Dulce Romántico", "Fragancia dulce para detalle de pareja.", "Salud y Belleza", 145, 15, ["amor", "aniversario"], ["romántico", "tierno"]],
      ["Splash Frutal Juvenil", "Splash fresco de uso diario.", "Salud y Belleza", 70, 30, ["amistad", "cumpleaños"], ["juvenil", "divertido"]],
      ["Set Fragancias Premium", "Set de fragancia, crema y splash en caja elegante.", "Sorpresas", 260, 7, ["día de la madre", "evento formal"], ["premium", "elegante"]],
    ].map(toProduct),
  },
  {
    nombre: "Pétalos & Regalos",
    descripcion: "Combos románticos de flores, dulces, peluches y detalles personalizados para sorprender.",
    email: "petalos.regalos@emotia.test",
    telefono: "70124592",
    direccion: "Calle Jaimes Freyre #550, Sopocachi, La Paz",
    representante: "Paola Herrera",
    repAnio: 1994,
    categorias: ["floreria", "chocolateria", "regalos_personalizados"],
    rating: 4.8,
    totalVendido: 30100,
    logoText: "PET",
    productos: [
      ["Combo Rosas y Chocolates", "Rosas rojas con caja de bombones clásicos.", "Sorpresas", 210, 12, ["amor", "aniversario"], ["romántico", "detallista"]],
      ["Caja Amor Sorpresa", "Caja decorada con flores, dulces y tarjeta.", "Sorpresas", 180, 14, ["amor", "aniversario"], ["sorpresa", "romántico"]],
      ["Ramo con Peluche Tierno", "Ramo floral acompañado de peluche pequeño.", "Flores", 195, 10, ["cumpleaños", "amor"], ["tierno", "romántico"]],
      ["Flores y Tarjeta Romántica", "Detalle floral con tarjeta personalizada.", "Flores", 130, 18, ["amor", "agradecimiento"], ["romántico", "detallista"]],
      ["Desayuno Floral Especial", "Desayuno sorpresa con mini bouquet.", "Sorpresas", 230, 8, ["cumpleaños", "día de la madre"], ["sorpresa", "premium"]],
      ["Mini Box Te Quiero", "Caja pequeña con rosas mini y chocolates.", "Sorpresas", 95, 25, ["amor", "amistad"], ["tierno", "detallista"]],
      ["Combo Aniversario Premium", "Flores, chocolates y vela en empaque premium.", "Sorpresas", 280, 6, ["aniversario"], ["premium", "romántico"]],
      ["Caja Rosas Eternas", "Rosas preservadas en caja decorativa.", "Flores", 260, 7, ["aniversario", "evento formal"], ["premium", "elegante"]],
      ["Regalo Pareja Elegante", "Combo de flores blancas, tarjeta y chocolates finos.", "Sorpresas", 245, 9, ["aniversario", "amor"], ["elegante", "romántico"]],
      ["Detalle Romántico Express", "Detalle rápido con flor, chocolate y dedicatoria.", "Sorpresas", 85, 30, ["amor", "sorpresa"], ["romántico", "sorpresa"]],
    ].map(toProduct),
  },
  {
    nombre: "ArteManos Bolivia",
    descripcion: "Artesanías, cerámica, textiles y regalos hechos a mano con inspiración local.",
    email: "artemanos.bo@emotia.test",
    telefono: "70124593",
    direccion: "Calle Linares #790, Centro, La Paz",
    representante: "Martín Choque",
    repAnio: 1987,
    categorias: ["artesanias", "textiles", "ceramica"],
    rating: 4.6,
    totalVendido: 15400,
    logoText: "ART",
    productos: [
      ["Llavero Artesanal Andino", "Llavero tejido con diseño andino colorido.", "Accesorios y Bisutería", 30, 50, ["amistad", "turismo"], ["artesanal", "detallista"]],
      ["Pulsera Tejida Colores", "Pulsera artesanal regulable en tonos vivos.", "Accesorios y Bisutería", 42, 40, ["amistad", "cumpleaños"], ["artesanal", "creativo"]],
      ["Taza Pintada a Mano", "Taza cerámica con pintura artesanal.", "Decoración", 85, 20, ["cumpleaños", "agradecimiento"], ["artesanal", "elegante"]],
      ["Mini Cuadro Cholita", "Cuadro pequeño con ilustración cultural.", "Decoración", 95, 16, ["turismo", "agradecimiento"], ["cultural", "creativo"]],
      ["Bolsa Tela Decorada", "Bolsa reutilizable con diseño artesanal.", "Decoración", 70, 22, ["amistad", "cumpleaños"], ["natural", "artesanal"]],
      ["Caja Artesanal Regalo", "Caja de madera decorada para regalos especiales.", "Sorpresas", 120, 14, ["evento formal", "agradecimiento"], ["artesanal", "detallista"]],
      ["Porta Incienso Cerámico", "Porta incienso hecho en cerámica.", "Decoración", 68, 24, ["agradecimiento", "amistad"], ["relajado", "artesanal"]],
      ["Muñeca Decorativa Andina", "Muñeca decorativa inspirada en vestimenta tradicional.", "Decoración", 110, 12, ["turismo", "cumpleaños"], ["cultural", "tierno"]],
      ["Set Artesanía Familiar", "Combo de taza, llavero y pulsera artesanal.", "Sorpresas", 155, 10, ["agradecimiento", "familia"], ["detallista", "artesanal"]],
      ["Recuerdo Cultural Premium", "Caja premium con piezas artesanales seleccionadas.", "Sorpresas", 240, 6, ["evento formal", "turismo"], ["premium", "cultural"]],
    ].map(toProduct),
  },
  {
    nombre: "Fit & Healthy Gifts",
    descripcion: "Regalos fitness, bienestar activo, snacks saludables y accesorios deportivos.",
    email: "fit.healthy@emotia.test",
    telefono: "70124594",
    direccion: "Av. Costanera #220, Obrajes, La Paz",
    representante: "Carla Medina",
    repAnio: 1991,
    categorias: ["regalos_personalizados"],
    rating: 4.3,
    totalVendido: 11900,
    logoText: "FIT",
    productos: [
      ["Botella Motivacional 1L", "Botella con marcas de horario para hidratación.", "Salud y Belleza", 85, 28, ["cumpleaños", "amistad"], ["fitness", "práctico"]],
      ["Banda Elástica Fitness", "Banda de resistencia para entrenamiento básico.", "Salud y Belleza", 60, 35, ["cumpleaños"], ["fitness", "activo"]],
      ["Toalla Gym Premium", "Toalla deportiva absorbente en empaque de regalo.", "Salud y Belleza", 75, 24, ["amistad", "cumpleaños"], ["fitness", "práctico"]],
      ["Snack Box Saludable", "Caja con barras, frutos secos y snacks saludables.", "Sorpresas", 120, 18, ["cumpleaños", "agradecimiento"], ["saludable", "foodie"]],
      ["Shaker Deportivo Negro", "Shaker para suplementos o bebidas deportivas.", "Salud y Belleza", 70, 26, ["cumpleaños"], ["fitness", "minimalista"]],
      ["Kit Yoga Inicial", "Mat básico, banda y guía de hábitos.", "Salud y Belleza", 190, 10, ["cumpleaños", "día de la madre"], ["relajado", "fitness"]],
      ["Agenda Hábitos Saludables", "Agenda para seguimiento de alimentación y ejercicio.", "Papelería", 65, 30, ["año nuevo", "cumpleaños"], ["organizado", "minimalista"]],
      ["Pack Energía Natural", "Combo de snacks naturales y botella.", "Sorpresas", 145, 14, ["agradecimiento", "cumpleaños"], ["saludable", "detallista"]],
      ["Set Fitness Cumpleaños", "Banda, shaker y snack saludable en caja.", "Sorpresas", 170, 12, ["cumpleaños"], ["fitness", "sorpresa"]],
      ["Combo Wellness Activo", "Kit de bienestar con botella, toalla y agenda.", "Sorpresas", 220, 8, ["cumpleaños", "agradecimiento"], ["fitness", "premium"]],
    ].map(toProduct),
  },
  {
    nombre: "Premium Office Gifts",
    descripcion: "Regalos corporativos, papelería ejecutiva y detalles elegantes para oficina.",
    email: "premium.office@emotia.test",
    telefono: "70124595",
    direccion: "Av. Camacho #1223, Centro, La Paz",
    representante: "Fernando Ribera",
    repAnio: 1988,
    categorias: ["papeleria_creativa", "regalos_personalizados"],
    rating: 4.5,
    totalVendido: 19600,
    logoText: "OFF",
    productos: [
      ["Agenda Ejecutiva Premium", "Agenda de tapa rígida con diseño profesional.", "Papelería", 120, 22, ["evento formal", "agradecimiento"], ["elegante", "organizado"]],
      ["Bolígrafo Metálico Elegante", "Bolígrafo metálico en estuche individual.", "Papelería", 85, 28, ["evento formal", "graduación"], ["elegante", "minimalista"]],
      ["Organizador de Escritorio", "Organizador moderno para oficina o home office.", "Decoración", 140, 14, ["evento formal", "agradecimiento"], ["minimalista", "práctico"]],
      ["Taza Corporativa Minimalista", "Taza sobria para regalo laboral.", "Decoración", 58, 32, ["agradecimiento", "evento formal"], ["minimalista", "elegante"]],
      ["Porta Tarjetas Ejecutivo", "Porta tarjetas con acabado símil cuero.", "Accesorios y Bisutería", 95, 20, ["evento formal", "graduación"], ["elegante", "profesional"]],
      ["Libreta Cuero Sintético", "Libreta elegante para notas de trabajo.", "Papelería", 105, 18, ["evento formal", "agradecimiento"], ["profesional", "elegante"]],
      ["Set Oficina Elegante", "Combo de agenda, bolígrafo y porta tarjetas.", "Sorpresas", 240, 10, ["evento formal", "graduación"], ["premium", "profesional"]],
      ["Caja Regalo Corporativa", "Caja ejecutiva con taza, libreta y snack.", "Sorpresas", 210, 12, ["agradecimiento", "evento formal"], ["profesional", "detallista"]],
      ["Termo Ejecutivo Negro", "Termo metálico sobrio para oficina.", "Decoración", 130, 16, ["evento formal", "cumpleaños"], ["minimalista", "práctico"]],
      ["Pack Agradecimiento Laboral", "Detalle corporativo con tarjeta, bolígrafo y chocolate.", "Sorpresas", 150, 18, ["agradecimiento"], ["detallista", "profesional"]],
    ].map(toProduct),
  },
];

async function getOrCreateCategoria(nombre: string) {
  const existente = await prisma.categorias.findFirst({
    where: { nombre },
    select: { id: true },
  });

  if (existente) return existente.id;

  const created = await prisma.categorias.create({
    data: {
      nombre,
      descripcion:
        categoriasCatalogo.find((c) => c.nombre === nombre)?.descripcion ||
        `Categoría ${nombre}`,
      activo: true,
    },
    select: { id: true },
  });

  return created.id;
}

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  for (const categoria of categoriasCatalogo) {
    await getOrCreateCategoria(categoria.nombre);
  }

  let proveedoresProcesados = 0;
  let productosProcesados = 0;

  for (const item of proveedores) {
    const proveedor = await prisma.proveedores.upsert({
      where: { email: item.email },
      update: {
        nombre_negocio: item.nombre,
        descripcion: item.descripcion,
        logo_url: makePlaceholder(item.logoText, 400, 400),
        categorias: item.categorias,
        redes_sociales: {
          instagram: `https://instagram.com/${item.email.split("@")[0].replaceAll(".", "_")}`,
          whatsapp: `https://wa.me/591${item.telefono}`,
        },
        password_hash: passwordHash,
        telefono: item.telefono,
        direccion: item.direccion,
        rep_nombre: item.representante,
        rep_email: item.email,
        rep_telefono: item.telefono,
        rep_anio_nacimiento: item.repAnio,
        estado: "aprobado",
        calificacion_prom: item.rating,
        total_vendido: item.totalVendido,
      },
      create: {
        nombre_negocio: item.nombre,
        descripcion: item.descripcion,
        logo_url: makePlaceholder(item.logoText, 400, 400),
        categorias: item.categorias,
        redes_sociales: {
          instagram: `https://instagram.com/${item.email.split("@")[0].replaceAll(".", "_")}`,
          whatsapp: `https://wa.me/591${item.telefono}`,
        },
        email: item.email,
        password_hash: passwordHash,
        telefono: item.telefono,
        direccion: item.direccion,
        rep_nombre: item.representante,
        rep_email: item.email,
        rep_telefono: item.telefono,
        rep_anio_nacimiento: item.repAnio,
        estado: "aprobado",
        calificacion_prom: item.rating,
        total_vendido: item.totalVendido,
      },
    });

    proveedoresProcesados++;

    await prisma.productos.deleteMany({
      where: {
        proveedor_id: proveedor.id,
      },
    });

    for (const producto of item.productos) {
      const categoriaId = await getOrCreateCategoria(producto.categoria);

      await prisma.productos.create({
        data: {
          proveedor_id: proveedor.id,
          categoria_id: categoriaId,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio_base: producto.precio * 0.75,
          precio_venta: producto.precio,
          stock: producto.stock,
          imagen_url: makePlaceholder(producto.nombre, 700, 700),
          ocasiones: producto.ocasiones,
          personalidades: producto.personalidades,
          genero_destinatario: producto.genero || "cualquiera",
          edad_min: producto.edadMin ?? 10,
          edad_max: producto.edadMax ?? 80,
          permite_mensaje: producto.permiteMensaje ?? true,
          permite_empaque: producto.permiteEmpaque ?? true,
          activo: true,
        },
      });

      productosProcesados++;
    }
  }

  console.log("Seed finalizado");
  console.log(`Proveedores procesados: ${proveedoresProcesados}`);
  console.log(`Productos procesados: ${productosProcesados}`);
  console.log(`Password de prueba para todos: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
