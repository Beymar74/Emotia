export type CatalogOrderItem = {
  id: number;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

export type CatalogOrder = {
  id: number;
  estado: string;
  total: number;
  createdAt: string;
  itemCount: number;
  primaryProductName: string;
  productImageUrl: string | null;
  brandName: string;
  brandLogoUrl: string | null;
  items: CatalogOrderItem[];
};

export type OrderStatusTone = "pending" | "active" | "success" | "danger";

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; helper: string; tone: OrderStatusTone; step: 1 | 2 | 3; actionLabel: string }
> = {
  pendiente: {
    label: "Pendiente",
    helper: "La empresa todavia debe aceptar tu pedido.",
    tone: "pending",
    step: 1,
    actionLabel: "Ver estado",
  },
  confirmado: {
    label: "Confirmado",
    helper: "Tu pedido ya fue aceptado y entrara a preparacion.",
    tone: "active",
    step: 2,
    actionLabel: "Ver seguimiento",
  },
  en_preparacion: {
    label: "En preparacion",
    helper: "La marca esta armando tu pedido.",
    tone: "active",
    step: 2,
    actionLabel: "Ver seguimiento",
  },
  entregado: {
    label: "Entregado",
    helper: "Tu pedido ya llego a destino.",
    tone: "success",
    step: 3,
    actionLabel: "Ver detalle",
  },
  cancelado: {
    label: "Cancelado",
    helper: "Este pedido fue cancelado.",
    tone: "danger",
    step: 1,
    actionLabel: "Ver detalle",
  },
};

export function getOrderStatusMeta(status: string) {
  return (
    ORDER_STATUS_MAP[status] ?? {
      label: "Actualizado",
      helper: "Tu pedido tiene una nueva actualizacion.",
      tone: "active" as const,
      step: 2 as const,
      actionLabel: "Ver detalle",
    }
  );
}

export function formatOrderCode(id: number) {
  return `EM-${String(id).padStart(4, "0")}`;
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
