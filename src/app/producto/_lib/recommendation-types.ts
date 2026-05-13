import type { CatalogProduct } from "../product-data";

export type GiftRecommendationInput = {
  destinatario: string;
  ocasion: string;
  presupuestoMax: number | null;
  personalidad: string;
  edad: number | null;
  necesitaMensaje: boolean;
  necesitaEmpaque: boolean;
};

export type GiftRecommendationResult = {
  producto: CatalogProduct;
  score: number;
  reasons: string[];
};