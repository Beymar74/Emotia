import { getFeaturedProducts } from "@/lib/services/productService";
import HomeClientWrapper from "./HomeClientWrapper";

export default async function HomePage() {
  // Obtenemos los productos reales, primero intenta en Upstash, si no hay, va a Neon.
  const products = await getFeaturedProducts();

  return <HomeClientWrapper initialProducts={products} />;
}