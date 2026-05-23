export type SeedVisualDesign = {
  nombre: string;
  preview_url: string;
  descripcion: string;
};


export const DISENOS_EMPAQUE: SeedVisualDesign[] = [
  {
    nombre: "Caja clasica",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779391718/caja_1_enhtxm.png",
    descripcion: "Caja rigida tradicional con acabado limpio y elegante.",
  },
  {
    nombre: "Caja con tapa transparente",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779391747/caja_2_dlemoh.png",
    descripcion: "Caja de presencia alta para regalos mas especiales.",
  },
  {
    nombre: "Bolsa",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779391718/bolsa_1_s9dpxb.png",
    descripcion: "Bolsa estructurada para una entrega ligera y bonita.",
  },
  {
    nombre: "Sin empaque",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779391815/ninguno_jwzxbq.webp",
    descripcion: "Solo el producto, sin caja ni empaque adicional.",
  },
];

export const DISENOS_ENVOLTURA: SeedVisualDesign[] = [
  {
    nombre: "Niños",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779390814/envoltura_3_phmyvk.jpg",
    descripcion: "Envoltura para regalo de niños",
  },
  {
    nombre: "Niñas",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779390790/envoltura_2_ah7pe3.jpg",
    descripcion: "Envoltura para regalo de niñas",
  },
  {
    nombre: "Corazones",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779390790/envoltura_4_ihlrnp.jpg",
    descripcion: "Ideal para mujeres o regalos con un toque de amor y cariño.",
  },
  {
    nombre: "Neutro",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779390882/envoltura_5_mkrdgy.jpg",
    descripcion: "Diseño Minimalista.",
  },
];

export const DISENOS_LISTON: SeedVisualDesign[] = [
  {
    nombre: "Diseño 1",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779389905/mo%C3%B1o_8_srygp5.png",
    descripcion: "Liston satinado en tono blush con brillo sutil.",
  },
  {
    nombre: "Diseño 2",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779389883/mo%C3%B1o_5_dl3unu.png",
    descripcion: "Ligero y delicado, ideal para detalles suaves.",
  },
  {
    nombre: "Diseño 3",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779389874/mo%C3%B1o_1_vt2d5j.png",
    descripcion: "Acabado con mas textura y presencia visual.",
  },
  {
    nombre: "Diseño 4",
    preview_url: "https://res.cloudinary.com/dcq7xfyyn/image/upload/v1779389978/emojis.com_mo%C3%B1os-blancos_d0tbmx.png",
    descripcion: "Estilo natural tipo yute para arreglos mas calidos.",
  },
];
