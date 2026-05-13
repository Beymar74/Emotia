import type { CatalogProduct } from "../product-data";
import type {
  GiftRecommendationInput,
  GiftRecommendationResult,
} from "./recommendation-types";

function normalize(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function inferGenero(destinatario: string) {
  const value = normalize(destinatario);

  if (
    value.includes("novia") ||
    value.includes("mama") ||
    value.includes("mamá") ||
    value.includes("madre") ||
    value.includes("hermana") ||
    value.includes("amiga") ||
    value.includes("esposa") ||
    value.includes("mujer")
  ) {
    return "mujer";
  }

  if (
    value.includes("novio") ||
    value.includes("papa") ||
    value.includes("papá") ||
    value.includes("padre") ||
    value.includes("hermano") ||
    value.includes("amigo") ||
    value.includes("esposo") ||
    value.includes("hombre")
  ) {
    return "hombre";
  }

  if (value.includes("niña") || value.includes("nina") || value.includes("hija")) {
    return "niña";
  }

  if (value.includes("niño") || value.includes("nino") || value.includes("hijo")) {
    return "niño";
  }

  return "cualquiera";
}

function matchesEdad(producto: CatalogProduct, edad: number | null) {
  if (edad === null) return true;

  const min = producto.edadMin ?? 0;
  const max = producto.edadMax ?? 120;

  return edad >= min && edad <= max;
}

function matchesText(input: string, options: string[]) {
  const normalizedInput = normalize(input);

  if (!normalizedInput) return false;

  return options
    .map(normalize)
    .some((option) => option.includes(normalizedInput) || normalizedInput.includes(option));
}

export function recommendGifts(
  productos: CatalogProduct[],
  input: GiftRecommendationInput,
  limit = 6
): GiftRecommendationResult[] {
  const generoInferido = inferGenero(input.destinatario);

  const scored = productos.map((producto) => {
    let score = 0;
    const reasons: string[] = [];

    const generoProducto = normalize(producto.generoDestinatario);

    if (input.presupuestoMax !== null) {
      if (producto.precio <= input.presupuestoMax) {
        score += 25;
        reasons.push(`Está dentro de tu presupuesto de Bs. ${input.presupuestoMax}.`);
      } else {
        score -= 20;
      }
    }

    if (matchesText(input.ocasion, producto.ocasiones)) {
      score += 30;
      reasons.push(`Coincide con la ocasión: ${input.ocasion}.`);
    }

    if (matchesText(input.personalidad, producto.personalidades)) {
      score += 20;
      reasons.push(`Tiene un estilo ${input.personalidad}.`);
    }

    if (
      generoProducto === "cualquiera" ||
      generoInferido === "cualquiera" ||
      generoProducto === generoInferido
    ) {
      score += 15;
      reasons.push("Es compatible con el destinatario.");
    }

    if (matchesEdad(producto, input.edad)) {
      score += 10;
    } else {
      score -= 10;
    }

    if (input.necesitaMensaje && producto.permiteMensaje) {
      score += 8;
      reasons.push("Permite mensaje personalizado.");
    }

    if (input.necesitaEmpaque && producto.permiteEmpaque) {
      score += 8;
      reasons.push("Permite empaque especial.");
    }

    score += Math.min(producto.rating * 2, 10);
    score += Math.min(producto.ventas, 12);

    if (reasons.length === 0) {
      reasons.push("Tiene buena afinidad general con tu búsqueda.");
    }

    return {
      producto,
      score,
      reasons,
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.producto.rating - a.producto.rating ||
        a.producto.precio - b.producto.precio
    )
    .slice(0, limit);
}