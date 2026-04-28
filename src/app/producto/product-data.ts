export type CatalogProduct = {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  seccion: string;
  ocasion: string;
  precio: number;
  rating: number;
  ventas: number;
  tag: string;
  subTag?: string;
  imageUrl?: string;
  descripcion: string;
};

export type DetailGalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type BrandProfileSummary = {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  representativeName: string;
  representativePhone: string;
  representativeEmail: string;
  rating: number;
  totalSold: number;
};

export type DetailProduct = {
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
  gallery: DetailGalleryItem[];
  brandProfile: BrandProfileSummary;
};

export type ProductComment = {
  id: string;
  author: string;
  rating: number;
  text: string;
};

type ProductRatingRecord = {
  calificacion: number | null;
};

type ProductBaseRecord = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_venta: unknown;
  stock: number;
  imagen_url: string | null;
  ocasiones: string[];
  genero_destinatario: string | null;
  edad_max: number | null;
  permite_mensaje: boolean;
  permite_empaque: boolean;
  categorias: { nombre: string } | null;
  proveedores: {
    id?: number;
    nombre_negocio: string;
    descripcion?: string | null;
    logo_url?: string | null;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    rep_nombre?: string | null;
    rep_telefono?: string | null;
    rep_email?: string | null;
    calificacion_prom?: unknown | null;
    total_vendido?: unknown | null;
  } | null;
  detalle_pedidos: ProductRatingRecord[];
};

type ProductCommentRecord = Omit<ProductBaseRecord, "detalle_pedidos"> & {
  detalle_pedidos: Array<{
    id: number;
    calificacion: number | null;
    resena: string | null;
    pedidos: {
      usuarios: {
        nombre: string;
        apellido: string | null;
      } | null;
    } | null;
  }>;
};

const DEFAULT_PRODUCT_IMAGE = "/logo/logo-store.png";
const DEFAULT_BRAND_IMAGE = "/logo/logo-store.png";
const SECTION_PRIORITY = ["Para Ella", "Para Él", "Corporativos", "Bebés", "Para Todos"];
const LOWERCASE_WORDS = new Set(["a", "con", "de", "del", "el", "en", "la", "las", "los", "para", "y"]);

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toTitleCase(value: string | null | undefined) {
  if (!value) return "";

  return value
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && LOWERCASE_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function toTag(value: string) {
  const parts = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .filter((part) => !LOWERCASE_WORDS.has(part.toLowerCase()))
    .slice(0, 2);

  return (parts.join(" ") || "PRODUCTO").toUpperCase();
}

function clampRating(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(5, Number(value.toFixed(1))));
}

function getPrimaryOccasion(occasions: string[]) {
  return toTitleCase(occasions[0]) || "Especial";
}

function deriveSection(product: ProductBaseRecord) {
  const gender = normalizeText(product.genero_destinatario);
  const occasions = product.ocasiones.map(normalizeText);

  if (occasions.some((occasion) => occasion.includes("corporativo") || occasion.includes("empresa"))) {
    return "Corporativos";
  }

  if (gender === "mujer") return "Para Ella";
  if (gender === "hombre" || gender === "varon") return "Para Él";

  if (gender === "nina" || gender === "nino" || (product.edad_max ?? 99) <= 12) {
    return "Bebés";
  }

  return "Para Todos";
}

function deriveSubTag(product: ProductBaseRecord) {
  if (product.stock > 0 && product.stock <= 3) return "ULTIMAS";
  if (product.permite_mensaje && product.permite_empaque) return "PERSONALIZABLE";
  if (product.permite_mensaje) return "CON MENSAJE";
  if (product.permite_empaque) return "EMPAQUE";
  return undefined;
}

function getRatingSummary(product: ProductBaseRecord) {
  const ratings = product.detalle_pedidos
    .map((detalle) => detalle.calificacion)
    .filter((rating): rating is number => typeof rating === "number" && rating > 0);

  const providerRating = clampRating(toNumber(product.proveedores?.calificacion_prom ?? 0));

  if (ratings.length === 0) {
    return {
      rating: providerRating,
      reviews: 0,
    };
  }

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return {
    rating: clampRating(average),
    reviews: ratings.length,
  };
}

function buildGallery(product: ProductBaseRecord): DetailGalleryItem[] {
  const imageUrl = product.imagen_url || DEFAULT_PRODUCT_IMAGE;
  const category = product.categorias?.nombre || "Producto";

  return [
    {
      id: "g1",
      title: product.nombre,
      subtitle: `Vista principal de ${category.toLowerCase()}`,
      imageUrl,
    },
  ];
}

function buildSubtitle(product: ProductBaseRecord) {
  if (product.permite_mensaje && product.permite_empaque) {
    return "Incluye mensaje personalizado y empaque especial";
  }

  if (product.permite_mensaje) {
    return "Puedes agregar un mensaje personalizado";
  }

  if (product.permite_empaque) {
    return "Disponible con empaque especial";
  }

  return `Ideal para ${getPrimaryOccasion(product.ocasiones).toLowerCase()}`;
}

function buildBrandProfile(product: ProductBaseRecord): BrandProfileSummary {
  const provider = product.proveedores;
  const fallbackName = provider?.nombre_negocio || "Marca Emotia";
  const providerRating = clampRating(toNumber(provider?.calificacion_prom ?? 0));
  const totalSold = Math.max(0, toNumber(provider?.total_vendido ?? 0));

  return {
    id: provider?.id ?? 0,
    name: fallbackName,
    logoUrl: provider?.logo_url || DEFAULT_BRAND_IMAGE,
    description: provider?.descripcion?.trim() || "Marca disponible dentro del catalogo de Emotia Store.",
    email: provider?.email?.trim() || "No disponible",
    phone: provider?.telefono?.trim() || "No disponible",
    address: provider?.direccion?.trim() || "No disponible",
    representativeName: provider?.rep_nombre?.trim() || "Equipo de atencion",
    representativePhone: provider?.rep_telefono?.trim() || "No disponible",
    representativeEmail: provider?.rep_email?.trim() || provider?.email?.trim() || "No disponible",
    rating: providerRating,
    totalSold,
  };
}

function sortAlphabetically(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b, "es"));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function mapCatalogProduct(product: ProductBaseRecord): CatalogProduct {
  const categoria = product.categorias?.nombre || "Sin categoria";
  const ocasion = getPrimaryOccasion(product.ocasiones);
  const { rating } = getRatingSummary(product);

  return {
    id: product.id,
    nombre: product.nombre,
    marca: product.proveedores?.nombre_negocio || "Marca Emotia",
    categoria,
    seccion: deriveSection(product),
    ocasion,
    precio: toNumber(product.precio_venta),
    rating,
    ventas: product.detalle_pedidos.length,
    tag: toTag(categoria),
    subTag: deriveSubTag(product),
    imageUrl: product.imagen_url || undefined,
    descripcion: product.descripcion || "Descubre este producto disponible en Emotia.",
  };
}

export function mapDetailProduct(product: ProductBaseRecord): DetailProduct {
  const categoria = product.categorias?.nombre || "Producto";
  const ocasion = getPrimaryOccasion(product.ocasiones);
  const { rating, reviews } = getRatingSummary(product);

  return {
    id: product.id,
    category: `${categoria} / ${ocasion}`,
    name: product.nombre,
    brand: product.proveedores?.nombre_negocio || "Marca Emotia",
    price: toNumber(product.precio_venta),
    rating,
    reviews,
    description: product.descripcion || "Producto disponible en el catalogo de Emotia.",
    tag: toTitleCase(categoria),
    subtitle: buildSubtitle(product),
    gallery: buildGallery(product),
    brandProfile: buildBrandProfile(product),
  };
}

export function mapProductComments(product: ProductCommentRecord): ProductComment[] {
  return product.detalle_pedidos
    .filter((detalle) => Boolean(detalle.resena?.trim()) || typeof detalle.calificacion === "number")
    .map((detalle) => {
      const usuario = detalle.pedidos?.usuarios;
      const author = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ") || "Cliente Emotia";
      const rating = typeof detalle.calificacion === "number" && detalle.calificacion > 0 ? detalle.calificacion : 5;

      return {
        id: `db-comment-${detalle.id}`,
        author,
        rating,
        text: detalle.resena?.trim() || "Dejo una calificacion positiva para este producto.",
      };
    });
}

export function buildCatalogFilters(products: CatalogProduct[]) {
  const secciones = unique(products.map((product) => product.seccion)).sort((a, b) => {
    const left = SECTION_PRIORITY.indexOf(a);
    const right = SECTION_PRIORITY.indexOf(b);

    if (left === -1 && right === -1) return a.localeCompare(b, "es");
    if (left === -1) return 1;
    if (right === -1) return -1;
    return left - right;
  });

  return {
    secciones,
    categorias: sortAlphabetically(unique(products.map((product) => product.categoria))),
    ocasiones: sortAlphabetically(unique(products.map((product) => product.ocasion))),
    marcas: sortAlphabetically(unique(products.map((product) => product.marca))),
    maxPrecio: Math.max(25, Math.ceil(Math.max(...products.map((product) => product.precio), 25) / 5) * 5),
  };
}
