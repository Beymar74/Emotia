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
import { DISENOS_EMPAQUE, DISENOS_ENVOLTURA, DISENOS_LISTON } from "@/lib/personalization-designs";
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

type VisualDesignDB = {
  id: number;
  nombre: string;
  preview_url: string;
  descripcion: string | null;
};

type PersonalizationSelection = {
  selectedCard: string;
  selectedFont: string;
  cardMessage: string;
  fieldValues: Record<string, string>;
};

type ProductDetailClientProps = {
  producto: DetailProduct;
  comentariosIniciales: ProductComment[];
  tarjetasDB: TarjetaDB[];
  empaquesDB: VisualDesignDB[];
  envolturasDB: VisualDesignDB[];
  listonesDB: VisualDesignDB[];
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

type PersonalizationChoice = {
  id: string;
  label: string;
  description?: string;
  imageUrl?: string;
  swatchColors?: string[];
  textOnly?: boolean;
};

type PersonalizationDependency = {
  fieldId: string;
  equals?: string[];
  notEquals?: string[];
};

type ChoiceField = {
  id: string;
  type: "choice";
  label: string;
  helper: string;
  defaultValue?: string;
  summaryLabel?: string;
  dependsOn?: PersonalizationDependency;
  choices: PersonalizationChoice[];
  resolveChoices?: (fieldValues: Record<string, string>) => PersonalizationChoice[];
};

type TextField = {
  id: string;
  type: "text";
  label: string;
  helper: string;
  placeholder: string;
  defaultValue?: string;
  summaryLabel?: string;
  dependsOn?: PersonalizationDependency;
  rows?: number;
};

type NumberField = {
  id: string;
  type: "number";
  label: string;
  helper: string;
  placeholder: string;
  defaultValue?: string;
  summaryLabel?: string;
  dependsOn?: PersonalizationDependency;
  min?: number;
  max?: number;
};

type PersonalizationField = ChoiceField | TextField | NumberField;

type PersonalizationSection = {
  id: string;
  title: string;
  description: string;
  fields: PersonalizationField[];
};

type PersonalizationSummaryItem = {
  label: string;
  value: string;
};

type ProductPersonalizationConfig = {
  availabilityLabel: string;
  lead: string;
  features: string[];
  sections: PersonalizationSection[];
};

type VisualChoiceCatalog = {
  packaging: PersonalizationChoice[];
  wrapping: PersonalizationChoice[];
  ribbon: PersonalizationChoice[];
};

type PersonalizationModalProps = {
  isOpen: boolean;
  initialSelection: PersonalizationSelection;
  tarjetas: CardTemplate[];
  config: ProductPersonalizationConfig;
  onClose: () => void;
  onApply: (selection: PersonalizationSelection) => void;
};

const DEFAULT_MESSAGE = "Para ti, con mucho cariño y un detalle pensado especialmente para este momento.";
const EMPTY_MESSAGE = "Tu mensaje aparecerá aquí cuando personalices la tarjeta.";
const CART_HIGHLIGHT_EVENT = "emotia-cart-highlight";
const DEFAULT_CARD_ID = "t-fallback";

const fuentes: FontOption[] = [
  { id: "playfair", label: "Elegante", family: "'Georgia', 'Times New Roman', serif" },
  { id: "dmSans", label: "Moderna", family: "'Inter', 'Arial', sans-serif" },
  { id: "cursive", label: "Manuscrita", family: "'Brush Script MT', 'Segoe Script', cursive" },
];

const fallbackCardTemplate: CardTemplate = {
  id: DEFAULT_CARD_ID,
  name: "Tarjeta clasica",
  accent: "#E6885C",
  accentSoft: "#FFF7F3",
  frame: "#E6B09A",
  designUrl: "",
  messageColor: "#5C3A2E",
  sourceLabel: "Tarjeta clasica",
  sourceUrl: "",
};

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

function normalizeProductText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toChoiceId(value: string) {
  return normalizeProductText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapVisualDesignChoice(entry: { nombre: string; preview_url: string; descripcion?: string | null }): PersonalizationChoice {
  return {
    id: toChoiceId(entry.nombre),
    label: entry.nombre,
    description: entry.descripcion ?? undefined,
    imageUrl: entry.preview_url,
  };
}

function getChoiceFieldChoices(field: ChoiceField, fieldValues: Record<string, string>) {
  return field.resolveChoices ? field.resolveChoices(fieldValues) : field.choices;
}

function buildChoiceSwatchBackground(colors: string[]) {
  if (colors.length === 0) {
    return "linear-gradient(135deg, #f7d9d7 0%, #f3e7e1 100%)";
  }

  if (colors.length === 1) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 100%)`;
  }

  const step = 100 / (colors.length - 1);
  const gradientStops = colors.map((color, index) => `${color} ${Math.round(index * step)}%`).join(", ");
  return `linear-gradient(135deg, ${gradientStops})`;
}

function createChoiceAlias(baseChoice: PersonalizationChoice | undefined, id: string, label: string, description: string): PersonalizationChoice {
  return {
    id,
    label,
    description,
    imageUrl: baseChoice?.imageUrl,
    swatchColors: baseChoice?.imageUrl ? undefined : ["#fffaf4", "#f2e5d8", "#e7d4c7"],
  };
}

function buildVisualChoiceCatalog(
  empaquesDB: VisualDesignDB[],
  envolturasDB: VisualDesignDB[],
  listonesDB: VisualDesignDB[]
): VisualChoiceCatalog {
  const fallbackPackaging = DISENOS_EMPAQUE.map(mapVisualDesignChoice);
  const fallbackWrapping = DISENOS_ENVOLTURA.map(mapVisualDesignChoice);
  const fallbackRibbon = DISENOS_LISTON.map(mapVisualDesignChoice);

  return {
    packaging: empaquesDB.length > 0 ? empaquesDB.map(mapVisualDesignChoice) : fallbackPackaging,
    wrapping: envolturasDB.length > 0 ? envolturasDB.map(mapVisualDesignChoice) : fallbackWrapping,
    ribbon: listonesDB.length > 0 ? listonesDB.map(mapVisualDesignChoice) : fallbackRibbon,
  };
}

function inferProductKind(producto: DetailProduct) {
  const fingerprint = normalizeProductText(`${producto.baseCategory} ${producto.name} ${producto.description}`);

  if (
    fingerprint.includes("flor") ||
    fingerprint.includes("ramo") ||
    fingerprint.includes("rosa") ||
    fingerprint.includes("bouquet") ||
    fingerprint.includes("tulipan") ||
    fingerprint.includes("girasol") ||
    fingerprint.includes("orquidea")
  ) {
    return "flowers";
  }

  if (
    fingerprint.includes("pastel") ||
    fingerprint.includes("torta") ||
    fingerprint.includes("cake") ||
    fingerprint.includes("cupcake")
  ) {
    return "cake";
  }

  if (
    fingerprint.includes("chocolate") ||
    fingerprint.includes("desayuno") ||
    fingerprint.includes("gourmet") ||
    fingerprint.includes("bebida") ||
    fingerprint.includes("snack") ||
    fingerprint.includes("postre") ||
    fingerprint.includes("galleta") ||
    fingerprint.includes("fruta") ||
    fingerprint.includes("helado")
  ) {
    return "food";
  }

  return "generic";
}

function inferSpecificFlowerType(fingerprint: string) {
  if (
    fingerprint.includes("mixto") ||
    fingerprint.includes("combin") ||
    fingerprint.includes("surtid") ||
    fingerprint.includes("varias flores")
  ) {
    return "mixto";
  }
  if (fingerprint.includes("rosa")) return "rosas";
  if (fingerprint.includes("tulipan")) return "tulipanes";
  if (fingerprint.includes("girasol")) return "girasoles";
  if (fingerprint.includes("orquidea")) return "orquideas";
  if (fingerprint.includes("lilium") || fingerprint.includes("lirio")) return "lirios";
  return "";
}

function inferFlowerQuantity(fingerprint: string) {
  const match = fingerprint.match(/(\d+)\s*(rosa|rosas|flor|flores|tulipan|tulipanes|girasol|girasoles|orquidea|orquideas)/);
  return match?.[1] ?? "";
}

function buildFlowerColorChoices(flowerType: string): PersonalizationChoice[] {
  const roseChoices: PersonalizationChoice[] = [
    {
      id: "original",
      label: "Original",
      description: "Mantener los tonos del arreglo tal como fue diseñado.",
      swatchColors: ["#fff8f0", "#f1e0d2", "#e4c7bb"],
    },
    {
      id: "rojo",
      label: "Rojo vino",
      description: "Inspirado en rosas borgona y petalos aterciopelados.",
      swatchColors: ["#8f3d4f", "#c96a73", "#f1d3d0"],
    },
    {
      id: "rosado",
      label: "Rosado peonia",
      description: "Suave, romantico y parecido a flores en tonos blush.",
      swatchColors: ["#f4c7d5", "#e8a9bf", "#fff0f4"],
    },
    {
      id: "blanco",
      label: "Marfil",
      description: "Elegante, limpio y cercano a rosas crema y gardenias.",
      swatchColors: ["#f7f1e5", "#efe2cf", "#fffaf2"],
    },
    {
      id: "amarillo",
      label: "Amarillo mantequilla",
      description: "Calido y luminoso, como rosas crema dorada.",
      swatchColors: ["#f6dc8c", "#f1c76a", "#fff2cb"],
    },
  ];

  const mixedChoice: PersonalizationChoice = {
    id: "mixto",
    label: "Mixto floral",
    description: "Combinacion delicada de varios tonos florales.",
    textOnly: true,
  };

  const softChoices: PersonalizationChoice[] = [
    roseChoices[0],
    roseChoices[2],
    roseChoices[3],
    {
      id: "lila",
      label: "Lila suave",
      description: "Tono floral delicado para arreglos frescos y elegantes.",
      swatchColors: ["#d9c7eb", "#bda2d7", "#f3edfb"],
    },
    {
      id: "durazno",
      label: "Durazno",
      description: "Calido y suave, ideal para un look primaveral.",
      swatchColors: ["#f4c6ab", "#efb28a", "#fff0e3"],
    },
  ];

  if (flowerType === "mixto") {
    return [...roseChoices, mixedChoice];
  }

  if (flowerType === "girasoles") {
    return [];
  }

  if (flowerType === "rosas") {
    return roseChoices;
  }

  if (flowerType === "tulipanes" || flowerType === "orquideas" || flowerType === "lirios") {
    return softChoices;
  }

  return [];
}

function buildPersonalizationConfig(producto: DetailProduct, visualCatalog: VisualChoiceCatalog): ProductPersonalizationConfig {
  const kind = inferProductKind(producto);
  const fingerprint = normalizeProductText(`${producto.baseCategory} ${producto.name} ${producto.description}`);
  const categoryFingerprint = normalizeProductText(`${producto.baseCategory} ${producto.category}`);
  const isSurpriseCategory = categoryFingerprint.includes("sorpresa");
  const inferredFlowerType = inferSpecificFlowerType(fingerprint);
  const inferredFlowerQuantity = inferFlowerQuantity(fingerprint);
  const defaultPackagingChoiceId = visualCatalog.packaging[0]?.id ?? "";
  const packagingNoneChoice =
    visualCatalog.packaging.find((choice) => normalizeProductText(choice.label).includes("sin empaque")) ??
    mapVisualDesignChoice(DISENOS_EMPAQUE.find((choice) => normalizeProductText(choice.nombre).includes("sin empaque")) ?? DISENOS_EMPAQUE[0]);
  const packagingNoneChoiceId = packagingNoneChoice?.id ?? "sin-empaque";
  const wrappingChoices = [
    createChoiceAlias(packagingNoneChoice, "sin-envoltura", "Ninguna", "Sin envoltura adicional."),
    ...visualCatalog.wrapping,
  ];
  const ribbonChoices = [
    createChoiceAlias(packagingNoneChoice, "sin-liston", "Ninguno", "Sin liston decorativo."),
    ...visualCatalog.ribbon,
  ];
  const defaultWrappingChoiceId = wrappingChoices[0]?.id ?? "";
  const defaultRibbonChoiceId = ribbonChoices[0]?.id ?? "";
  const flowerTypeChoices: PersonalizationChoice[] = [
    { id: "mixto", label: "Mixto", description: "Combinacion variada y armoniosa." },
    { id: "rosas", label: "Rosas", description: "Mas clasico y romantico." },
    { id: "girasoles", label: "Girasoles", description: "Mas alegre y vibrante." },
    { id: "tulipanes", label: "Tulipanes", description: "Mas delicado y moderno." },
    { id: "orquideas", label: "Orquideas", description: "Mas fino y sofisticado." },
    { id: "lirios", label: "Lirios", description: "Presencia elegante y fresca." },
  ];
  const resolvedFlowerType = inferredFlowerType || "mixto";
  const sections: PersonalizationSection[] = [];
  const features = ["Tarjeta"];

  if (isSurpriseCategory) {
    return {
      availabilityLabel: "Tarjeta incluida",
      lead: "Este producto ya viene armado, por lo que la personalización disponible se concentra solo en la tarjeta.",
      features,
      sections,
    };
  }

  if (producto.allowsPackaging) {
    sections.push({
      id: "packaging",
      title: "Empaque y envoltura",
      description: "Define si llevará empaque y cómo quieres presentarlo.",
      fields: [
        {
          id: "packagingType",
          type: "choice",
          label: "Tipo de empaque",
          helper: "Escoge caja, sombrerera, bolsa o marca que prefieres sin empaque.",
          defaultValue: defaultPackagingChoiceId,
          summaryLabel: "Empaque",
          choices: visualCatalog.packaging,
        },
        {
          id: "wrappingDesign",
          type: "choice",
          label: "Diseño de la envoltura",
          helper: "Aqui ya se define el color y el estilo visual de la envoltura.",
          defaultValue: defaultWrappingChoiceId,
          summaryLabel: "Envoltura",
          dependsOn: { fieldId: "packagingType", notEquals: [packagingNoneChoiceId] },
          choices: wrappingChoices,
        },
      ],
    });
    features.push("Empaque");
  }

  if (kind === "flowers") {
    sections.push({
      id: "flowers",
      title: "Detalles florales",
      description: "Ajusta acabados propios de arreglos y ramos.",
      fields: [
        ...(inferredFlowerType
          ? []
          : [
              {
                id: "flowerType",
                type: "choice",
                label: "Tipo de flores",
                helper: "Como este producto no especifica una flor dominante, puedes elegirla.",
                defaultValue: "mixto",
                summaryLabel: "Tipo flor",
                choices: flowerTypeChoices,
              },
            ]),
        {
          id: "flowerColor",
          type: "choice",
          label: "Color de las flores",
          helper: "Elige el tono principal cuando el tipo de flor lo permita.",
          defaultValue: buildFlowerColorChoices(resolvedFlowerType)[0]?.id ?? "",
          summaryLabel: "Color flores",
          choices: buildFlowerColorChoices(resolvedFlowerType),
          resolveChoices: (fieldValues) => buildFlowerColorChoices(inferredFlowerType || fieldValues.flowerType || "mixto"),
        },
        ...(inferredFlowerQuantity
          ? []
          : [
              {
                id: "flowerQuantity",
                type: "number",
                label: "Cantidad de flores",
                helper: "Si este producto no define cuantas flores llevara, aqui puedes indicarlo.",
                placeholder: "Ej. 12",
                defaultValue: "",
                summaryLabel: "Cantidad flores",
                min: 1,
                max: 300,
              } satisfies NumberField,
            ]),
        {
          id: "ribbonDesign",
          type: "choice",
          label: "Diseño del liston",
          helper: "Elige el estilo visual del liston o deja ninguno si no lo necesitas.",
          defaultValue: defaultRibbonChoiceId,
          summaryLabel: "Liston",
          choices: ribbonChoices,
        },
      ],
    });
    features.push("Flores");
    features.push("Liston");
  }

  if (kind === "cake") {
    sections.push({
      id: "cake",
      title: "Detalle de la torta",
      description: "Define si llevara escritura y que dira.",
      fields: [
        {
          id: "cakeWritingMode",
          type: "choice",
          label: "Escritura en la torta",
          helper: "Tambien puedes dejar la torta sin escritura.",
          defaultValue: "none",
          summaryLabel: "Escritura",
          choices: [
            { id: "none", label: "Sin escritura", description: "La torta ira sin texto." },
            { id: "short", label: "Con escritura", description: "Agregar dedicatoria corta." },
          ],
        },
        {
          id: "cakeWritingText",
          type: "text",
          label: "Texto para la torta",
          helper: "Escribe una frase corta para la superficie del pastel.",
          placeholder: "Ejemplo: Feliz cumple, Ana",
          defaultValue: "",
          summaryLabel: "Texto torta",
          dependsOn: { fieldId: "cakeWritingMode", equals: ["short"] },
          rows: 3,
        },
      ],
    });
    features.push("Escritura en torta");
  }

  if (kind === "cake" || kind === "food") {
    sections.push({
      id: "food-notes",
      title: "Alergias e indicaciones",
      description: "Ayuda a definir restricciones o cuidados alimentarios.",
      fields: [
        {
          id: "hasAllergies",
          type: "choice",
          label: "¿Hay alergias alimentarias?",
          helper: "Si la respuesta es no, no hace falta completar nada mas.",
          defaultValue: "no",
          summaryLabel: "Alergias",
          choices: [
            { id: "no", label: "No", description: "Sin restricciones indicadas." },
            { id: "si", label: "Si", description: "Hay ingredientes o trazas a evitar." },
          ],
        },
        {
          id: "allergiesDetail",
          type: "text",
          label: "¿Cuales alergias o ingredientes evitar?",
          helper: "Ejemplo: sin frutos secos, sin lactosa, evitar gluten.",
          placeholder: "Ejemplo: alergia a mani, nueces y lactosa",
          defaultValue: "",
          summaryLabel: "Detalle alergias",
          dependsOn: { fieldId: "hasAllergies", equals: ["si"] },
          rows: 3,
        },
      ],
    });
    features.push("Alergias");
  }

  if (kind === "generic" && !producto.allowsPackaging) {
    sections.push({
      id: "generic",
      title: "Indicaciones del producto",
      description: "Por ahora este producto permite una personalizacion mas simple.",
      fields: [
        {
          id: "productNote",
          type: "text",
          label: "Indicacion adicional",
          helper: "Si no deseas agregar nada extra, dejalo vacio.",
          placeholder: "Ejemplo: presentacion sobria, tonos suaves, sin detalles extra",
          defaultValue: "",
          summaryLabel: "Indicacion",
          rows: 3,
        },
      ],
    });
    features.push("Indicaciones");
  }

  return {
    availabilityLabel: features.length > 1 ? `${features.length} areas personalizables` : "Tarjeta incluida",
    lead:
      kind === "flowers"
        ? "Personaliza la tarjeta, las flores, el empaque y los acabados del ramo antes de agregarlo a la bolsa."
        : kind === "cake"
          ? "Personaliza la tarjeta, la presentacion, la escritura y las indicaciones alimentarias de la torta."
          : kind === "food"
            ? "Personaliza la tarjeta, la presentacion y las indicaciones alimentarias de este producto."
            : "Personaliza la tarjeta y los detalles disponibles de este producto antes de comprar.",
    features,
    sections,
  };
}

function createDefaultFieldValues(sections: PersonalizationSection[]) {
  return sections.reduce<Record<string, string>>((acc, section) => {
    section.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        if (field.type === "choice") {
          const availableChoices = getChoiceFieldChoices(field, acc);
          acc[field.id] =
            availableChoices.find((choice) => choice.id === field.defaultValue)?.id ??
            availableChoices[0]?.id ??
            field.defaultValue;
        } else {
          acc[field.id] = field.defaultValue;
        }
      } else if (field.type === "choice") {
        acc[field.id] = getChoiceFieldChoices(field, acc)[0]?.id ?? "";
      } else {
        acc[field.id] = "";
      }
    });
    return acc;
  }, {});
}

function isFieldVisible(field: PersonalizationField, fieldValues: Record<string, string>) {
  if (!field.dependsOn) return true;

  const currentValue = fieldValues[field.dependsOn.fieldId] ?? "";
  const matchesEquals = field.dependsOn.equals ? field.dependsOn.equals.includes(currentValue) : true;
  const matchesNotEquals = field.dependsOn.notEquals ? !field.dependsOn.notEquals.includes(currentValue) : true;

  return matchesEquals && matchesNotEquals;
}

function getChoiceLabel(field: ChoiceField, value: string, fieldValues: Record<string, string>) {
  return getChoiceFieldChoices(field, fieldValues).find((choice) => choice.id === value)?.label ?? value;
}

function buildPersonalizationSummary(
  selection: PersonalizationSelection,
  sections: PersonalizationSection[],
  tarjetas: CardTemplate[]
) {
  const summary: PersonalizationSummaryItem[] = [];
  const tarjetaActiva = tarjetas.find((tarjeta) => tarjeta.id === selection.selectedCard) ?? tarjetas[0] ?? fallbackCardTemplate;
  const fuenteActiva = fuentes.find((fuente) => fuente.id === selection.selectedFont) ?? fuentes[0];

  summary.push({ label: "Tarjeta", value: tarjetaActiva.name });
  summary.push({ label: "Letra", value: fuenteActiva.label });

  if (selection.cardMessage.trim()) {
    summary.push({ label: "Mensaje", value: selection.cardMessage.trim() });
  }

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!isFieldVisible(field, selection.fieldValues)) return;

      const rawValue = selection.fieldValues[field.id] ?? "";
      if (!rawValue.trim()) return;

      if (field.type === "choice") {
        const availableChoices = getChoiceFieldChoices(field, selection.fieldValues);
        if (availableChoices.length === 0) return;
        if (!availableChoices.some((choice) => choice.id === rawValue)) return;

        summary.push({
          label: field.summaryLabel ?? field.label,
          value: getChoiceLabel(field, rawValue, selection.fieldValues),
        });
        return;
      }

      summary.push({
        label: field.summaryLabel ?? field.label,
        value: rawValue.trim(),
      });
    });
  });

  return summary;
}

function buildCartSubtitle(summary: PersonalizationSummaryItem[], fallback: string) {
  const compact = summary
    .filter((item) => !["Mensaje", "Texto torta", "Indicacion", "Detalle alergias"].includes(item.label))
    .slice(0, 4)
    .map((item) => `${item.label}: ${item.value}`);

  return compact.length > 0 ? compact.join(" · ") : fallback;
}

function CardPreview({ tarjeta, fuente, message, className, messageClassName, contentClassName }: CardPreviewProps) {
  const displayMessage = message.trim() || EMPTY_MESSAGE;

  return (
    <div
      className={className}
      style={{
        borderColor: tarjeta.frame,
        backgroundImage: tarjeta.designUrl ? `url(${tarjeta.designUrl})` : undefined,
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

function PersonalizationModal({ isOpen, initialSelection, tarjetas, config, onClose, onApply }: PersonalizationModalProps) {
  const [draftSelectedCard, setDraftSelectedCard] = useState(initialSelection.selectedCard);
  const [draftSelectedFont, setDraftSelectedFont] = useState(initialSelection.selectedFont);
  const [draftCardMessage, setDraftCardMessage] = useState(initialSelection.cardMessage);
  const [draftFieldValues, setDraftFieldValues] = useState<Record<string, string>>(initialSelection.fieldValues);

  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === draftSelectedCard) || tarjetas[0] || fallbackCardTemplate,
    [draftSelectedCard, tarjetas]
  );
  const fuenteActiva = useMemo(
    () => fuentes.find((fuente) => fuente.id === draftSelectedFont) || fuentes[0],
    [draftSelectedFont]
  );
  const summaryItems = useMemo(
    () =>
      buildPersonalizationSummary(
        {
          selectedCard: draftSelectedCard,
          selectedFont: draftSelectedFont,
          cardMessage: draftCardMessage,
          fieldValues: draftFieldValues,
        },
        config.sections,
        tarjetas
      ),
    [config.sections, draftCardMessage, draftFieldValues, draftSelectedCard, draftSelectedFont, tarjetas]
  );

  useEffect(() => {
    if (tarjetas.length > 0 && !tarjetas.find((t) => t.id === draftSelectedCard)) {
      setDraftSelectedCard(tarjetas[0].id);
    }
  }, [tarjetas, draftSelectedCard]);

  useEffect(() => {
    setDraftFieldValues((prev) => {
      let next = prev;
      let changed = false;

      config.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type !== "choice") return;

          const availableChoices = getChoiceFieldChoices(field, next);
          const currentValue = next[field.id] ?? "";

          if (availableChoices.length === 0) {
            if (currentValue !== "") {
              next = { ...next, [field.id]: "" };
              changed = true;
            }
            return;
          }

          if (!availableChoices.some((choice) => choice.id === currentValue)) {
            next = { ...next, [field.id]: availableChoices[0]?.id ?? "" };
            changed = true;
          }
        });
      });

      return changed ? next : prev;
    });
  }, [config.sections, draftFieldValues]);

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
            <p className={styles.modalDescription}>{config.lead}</p>
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
                <span>Siempre disponible</span>
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
                        message={draftCardMessage}
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
                value={draftCardMessage}
                onChange={(event) => setDraftCardMessage(event.target.value)}
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

              {config.sections.map((section, sectionIndex) => (
                <section key={section.id} className={styles.personalizationOptionSection}>
                  <div className={styles.sectionHeader}>
                    <h3>{sectionIndex + 4}. {section.title}</h3>
                    <span>{section.description}</span>
                  </div>

                  <div className={styles.fieldStack}>
                    {section.fields.map((field) => {
                      if (!isFieldVisible(field, draftFieldValues)) {
                        return null;
                      }

                      if (field.type === "choice") {
                        const choices = getChoiceFieldChoices(field, draftFieldValues);
                        if (choices.length === 0) {
                          return null;
                        }

                        const visualChoices = choices.some(
                          (choice) =>
                            (!choice.textOnly && Boolean(choice.imageUrl)) ||
                            (!choice.textOnly && Array.isArray(choice.swatchColors) && choice.swatchColors.length > 0)
                        );

                        return (
                          <div key={field.id} className={styles.optionFieldBlock}>
                            <div className={styles.optionFieldHead}>
                              <h4>{field.label}</h4>
                              <p>{field.helper}</p>
                            </div>

                            <div
                              className={`${styles.choiceGrid} ${visualChoices ? styles.choiceGridVisual : ""} ${!choices.some((choice) => choice.imageUrl) && visualChoices ? styles.choiceGridSwatch : ""}`}
                            >
                              {choices.map((choice) => {
                                const isActive = (draftFieldValues[field.id] ?? "") === choice.id;
                                const visualChoiceLabel = choice.description
                                  ? `${choice.label}. ${choice.description}`
                                  : choice.label;
                                const isImageChoice = !choice.textOnly && Boolean(choice.imageUrl);
                                const isSwatchChoice = !choice.textOnly && Boolean(choice.swatchColors?.length);
                                const isTextOnlyChoice = Boolean(choice.textOnly);

                                return (
                                  <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() =>
                                      setDraftFieldValues((prev) => ({
                                        ...prev,
                                        [field.id]: choice.id,
                                      }))
                                    }
                                    className={`${styles.choiceButton} ${isImageChoice ? styles.choiceButtonVisual : ""} ${isImageChoice ? styles.choiceButtonImageOnly : ""} ${isSwatchChoice ? styles.choiceButtonSwatch : ""} ${isTextOnlyChoice && visualChoices ? styles.choiceButtonInlineText : ""} ${isActive ? styles.choiceButtonActive : ""}`}
                                    aria-label={isImageChoice || isSwatchChoice ? visualChoiceLabel : undefined}
                                    title={isImageChoice || isSwatchChoice ? choice.label : undefined}
                                  >
                                    {isImageChoice ? (
                                      <div className={styles.choiceVisualImageWrap}>
                                        <img src={choice.imageUrl} alt={choice.label} className={styles.choiceVisualImage} />
                                      </div>
                                    ) : isSwatchChoice ? (
                                      <div
                                        className={styles.choiceSwatchPreview}
                                        aria-hidden="true"
                                        style={{ backgroundImage: buildChoiceSwatchBackground(choice.swatchColors ?? []) }}
                                      />
                                    ) : null}
                                    {isImageChoice ? null : isSwatchChoice ? (
                                      <div className={`${styles.choiceTextBody} ${styles.choiceTextBodyCompact}`}>
                                        <strong>{choice.label}</strong>
                                      </div>
                                    ) : (
                                      <div className={styles.choiceTextBody}>
                                        <strong>{choice.label}</strong>
                                        {choice.description ? <span>{choice.description}</span> : null}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === "number") {
                        return (
                          <div key={field.id} className={styles.optionFieldBlock}>
                            <div className={styles.optionFieldHead}>
                              <h4>{field.label}</h4>
                              <p>{field.helper}</p>
                            </div>

                            <input
                              type="number"
                              min={field.min}
                              max={field.max}
                              value={draftFieldValues[field.id] ?? ""}
                              onChange={(event) =>
                                setDraftFieldValues((prev) => ({
                                  ...prev,
                                  [field.id]: event.target.value,
                                }))
                              }
                              className={styles.inputField}
                              placeholder={field.placeholder}
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={field.id} className={styles.optionFieldBlock}>
                          <div className={styles.optionFieldHead}>
                            <h4>{field.label}</h4>
                            <p>{field.helper}</p>
                          </div>

                          <textarea
                            value={draftFieldValues[field.id] ?? ""}
                            onChange={(event) =>
                              setDraftFieldValues((prev) => ({
                                ...prev,
                                [field.id]: event.target.value,
                              }))
                            }
                            className={`${styles.textArea} ${styles.inlineTextArea}`}
                            placeholder={field.placeholder}
                            rows={field.rows ?? 3}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <aside className={styles.modalPreviewColumn}>
              <div className={styles.modalPreviewPanel}>
                <p className={styles.modalPreviewEyebrow}>Vista previa</p>
                <h3 className={styles.modalPreviewTitle}>Resumen de tu personalización</h3>
                <p className={styles.modalPreviewText}>Revisa la tarjeta y los detalles elegidos antes de guardarlos.</p>

                <CardPreview
                  tarjeta={tarjetaActiva}
                  fuente={fuenteActiva}
                  message={draftCardMessage}
                  className={`${styles.livePreview} ${styles.modalLivePreview}`}
                />

                <div className={styles.previewSummaryList}>
                  {summaryItems.map((item) => (
                    <div key={`${item.label}-${item.value}`} className={styles.previewSummaryCard}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
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
                cardMessage: draftCardMessage,
                fieldValues: draftFieldValues,
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

export default function ProductDetailClient({
  producto,
  comentariosIniciales,
  tarjetasDB,
  empaquesDB,
  envolturasDB,
  listonesDB,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { user, isLoggedIn } = useSession();

  const [liveTarjetasDB, setLiveTarjetasDB] = useState<TarjetaDB[]>(tarjetasDB);
  const visualChoiceCatalog = useMemo(
    () => buildVisualChoiceCatalog(empaquesDB, envolturasDB, listonesDB),
    [empaquesDB, envolturasDB, listonesDB]
  );
  const personalizationConfig = useMemo(
    () => buildPersonalizationConfig(producto, visualChoiceCatalog),
    [producto, visualChoiceCatalog]
  );

  // Mapear los diseños de tarjeta que vienen de la BD
  const tarjetas = useMemo(() => {
    const mapped = liveTarjetasDB.map(mapTarjetaDB);
    return mapped.length > 0 ? mapped : [fallbackCardTemplate];
  }, [liveTarjetasDB]);

  const [selectedCard, setSelectedCard] = useState(() => tarjetas[0]?.id ?? DEFAULT_CARD_ID);
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [cardMessage, setCardMessage] = useState(DEFAULT_MESSAGE);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => createDefaultFieldValues(personalizationConfig.sections));
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

  useEffect(() => {
    setFieldValues((prev) => ({
      ...createDefaultFieldValues(personalizationConfig.sections),
      ...prev,
    }));
  }, [personalizationConfig.sections]);

  const commentStorageKey = useMemo(
    () => `emotia-product-comment-${producto.id}-${user?.email ?? "guest"}`,
    [producto.id, user?.email]
  );
  const tarjetaActiva = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === selectedCard) || tarjetas[0] || fallbackCardTemplate,
    [selectedCard, tarjetas]
  );
  const fuenteActiva = useMemo(
    () => fuentes.find((fuente) => fuente.id === selectedFont) || fuentes[0],
    [selectedFont]
  );
  const savedPersonalization = useMemo(
    () => ({ selectedCard, selectedFont, cardMessage, fieldValues }),
    [cardMessage, fieldValues, selectedCard, selectedFont]
  );
  const personalizationSummary = useMemo(
    () => buildPersonalizationSummary(savedPersonalization, personalizationConfig.sections, tarjetas),
    [personalizationConfig.sections, savedPersonalization, tarjetas]
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
    setCardMessage(selection.cardMessage);
    setFieldValues(selection.fieldValues);
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
      subtitle: hasSavedPersonalization ? buildCartSubtitle(personalizationSummary, producto.subtitle) : producto.subtitle,
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
              <span>{personalizationConfig.availabilityLabel}</span>
            </div>

            <p className={styles.personalizationLead}>
              {personalizationConfig.lead}
            </p>

            <div className={styles.personalizationFeatureRow}>
              {personalizationConfig.features.map((feature) => (
                <span key={feature} className={styles.personalizationFeaturePill}>
                  {feature}
                </span>
              ))}
            </div>

            <button type="button" className={styles.personalizeButton} onClick={() => setIsPersonalizationOpen(true)}>
              <Sparkles size={18} strokeWidth={2.1} />
              Personaliza este producto
            </button>

            <div className={styles.personalizationPreviewBox}>
              <div className={styles.personalizationPreviewHeader}>
                <div>
                  <p className={styles.personalizationPreviewEyebrow}>Vista previa</p>
                  <h4 className={styles.personalizationPreviewTitle}>Así se verá la personalización de este producto</h4>
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
                    message={cardMessage}
                    className={`${styles.livePreview} ${styles.showcaseCardPreview}`}
                    messageClassName={styles.showcaseCardMessage}
                  />

                  <div className={styles.previewSummaryList}>
                    {personalizationSummary.map((item) => (
                      <div key={`${item.label}-${item.value}`} className={styles.previewSummaryCard}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.personalizationEmptyState}>
                  <p className={styles.personalizationEmptyTitle}>Todavia no configuraste este producto.</p>
                  <p className={styles.personalizationEmptyCopy}>
                    Cuando guardes la personalización aquí verás la tarjeta, el empaque y los detalles especiales elegidos.
                  </p>
                  <div className={styles.personalizationFeatureRow}>
                    {personalizationConfig.features.map((feature) => (
                      <span key={feature} className={styles.personalizationFeaturePill}>
                        {feature}
                      </span>
                    ))}
                  </div>
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
          initialSelection={{ selectedCard, selectedFont, cardMessage, fieldValues }}
          tarjetas={tarjetas}
          config={personalizationConfig}
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
