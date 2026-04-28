"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import {
  formatLongDate,
  formatOrderCode,
  getOrderStatusMeta,
  type CatalogOrder,
} from "@/lib/catalog-order-status";

type OrdersResponse = {
  authenticated?: boolean;
  orders?: CatalogOrder[];
  error?: string;
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<CatalogOrder[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    const cargarPedidos = async () => {
      try {
        const response = await fetch("/api/auth/catalog/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          setStatus("unauthorized");
          return;
        }

        const data = (await response.json()) as OrdersResponse;

        if (!response.ok) {
          throw new Error(data.error || "No pudimos cargar tus pedidos.");
        }

        setOrders(data.orders ?? []);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error cargando pedidos:", error);
        setStatus("error");
      }
    };

    void cargarPedidos();

    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-[#8E1B3A] sm:px-6 sm:py-20">
        <Loader2 className="mb-4 h-12 w-12 animate-spin" />
        <p className="font-semibold">Cargando tus pedidos...</p>
      </main>
    );
  }

  if (status === "unauthorized") {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="rounded-[32px] border border-[#E8D7C4] bg-white p-8 text-center shadow-[0_20px_40px_rgba(92,58,46,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E6] text-[#8E1B3A]">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-[#5C3A2E]">Inicia sesión para ver tus pedidos</h1>
          <p className="mt-3 text-sm leading-6 text-[#8A6F62]">
            Cuando compres en Emotia, aquí podrás revisar tus productos y el estado de cada entrega.
          </p>
          <Link
            href="/producto"
            className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#C6284F,#E04A64)] px-7 text-sm font-black text-white"
          >
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="rounded-[32px] border border-[#E8D7C4] bg-white p-8 text-center shadow-[0_20px_40px_rgba(92,58,46,0.06)]">
          <h1 className="text-3xl font-extrabold text-[#5C3A2E]">No pudimos cargar tus pedidos</h1>
          <p className="mt-3 text-sm leading-6 text-[#8A6F62]">Vuelve a intentarlo en un momento.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-12">
      <div className="mb-10">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#C6284F]">Seguimiento</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#5C3A2E] sm:text-4xl">Mis pedidos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8A6F62]">
            Aquí verás los productos que compraste, el estado actual del pedido y cualquier cambio importante.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#E8D7C4] bg-white px-5 py-10 text-center shadow-[0_20px_40px_rgba(92,58,46,0.06)] sm:rounded-[32px] sm:px-6 sm:py-12">
          <Package className="mx-auto h-12 w-12 text-[#BC9968]" />
          <h2 className="mt-4 text-2xl font-bold text-[#5C3A2E]">Aún no tienes pedidos</h2>
          <p className="mt-3 text-sm leading-6 text-[#8A6F62]">
            Cuando hagas tu primera compra, aquí aparecerán tus productos y su estado.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.estado);

            return (
              <article
                key={order.id}
                className="rounded-[28px] border border-[#E8D7C4] bg-white p-4 shadow-[0_20px_40px_rgba(92,58,46,0.06)] sm:rounded-[32px] sm:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C6284F]">
                      Pedido {formatOrderCode(order.id)}
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold text-[#5C3A2E] sm:text-2xl">{order.primaryProductName}</h2>
                    <p className="mt-1 text-sm text-[#8A6F62]">
                      {order.brandName} · {formatLongDate(order.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-black ${
                      statusMeta.tone === "pending"
                        ? "border-[#E7C9A7] bg-[#FFF1E3] text-[#AE6C2C]"
                        : statusMeta.tone === "success"
                          ? "border-[#B9DFC8] bg-[#EDF9F2] text-[#27744D]"
                          : statusMeta.tone === "danger"
                            ? "border-[#E8C1BD] bg-[#FFF0EF] text-[#B0453F]"
                            : "border-[#F2C7D1] bg-[#FFF0F3] text-[#B93557]"
                    }`}
                  >
                    {statusMeta.label}
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] border border-[#F1E1D5] bg-[#FFFCFA] p-4 sm:rounded-[28px] sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#8A6F62]">Productos del pedido</h3>
                    <span className="text-xs font-semibold text-[#9A8A82]">{order.brandName}</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.id}`}
                        className="flex flex-col gap-2 rounded-[20px] border border-[#F5E6D0] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[22px]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#5C3A2E]">{item.name}</p>
                          <p className="mt-1 text-xs text-[#8A6F62]">Cantidad: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-[#C6284F]">{statusMeta.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
