import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "../producto/components/Header";
import FooterCatalogo from "../producto/_components/FooterCatalogo";
import OrdersClient from "./OrdersClient";

export default function MisPedidosPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f2_100%)]">
      <Header showSearch={false} />

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        <Link
          href="/producto"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#8E3651] transition hover:text-[#C6284F]"
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
          Volver al catalogo
        </Link>
      </div>

      <OrdersClient />
      <FooterCatalogo />
    </div>
  );
}
