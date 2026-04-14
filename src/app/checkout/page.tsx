"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleHelp, CreditCard, Landmark, QrCode } from "lucide-react";
import AuthModal from "../producto/components/AuthModal";
import Header from "../producto/components/Header";
import { useCart } from "../producto/components/cart/useCart";
import { useSession } from "../producto/components/auth/useSession";

const metodosPago = [
  {
    id: "qr",
    titulo: "Código QR",
    descripcion: "Escanea y paga al instante desde tu banca móvil.",
    icono: QrCode,
    destacado: true,
  },
  {
    id: "tarjeta",
    titulo: "Tarjeta de crédito o débito",
    descripcion: "Visa, Mastercard y otras tarjetas habilitadas.",
    icono: CreditCard,
  },
  {
    id: "transferencia",
    titulo: "Transferencia bancaria",
    descripcion: "Realiza una transferencia directa y confirma tu pedido.",
    icono: Landmark,
  },
];

export default function CheckoutPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("qr");
  const qrImageUrl = "URL_DE_TU_QR_AQUI";
  const { items, subtotal } = useCart();
  const { isLoggedIn } = useSession();
  const total = useMemo(() => subtotal, [subtotal]);

  const handleProceed = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      alert("Procesando pago...");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8fd]">
      <Header showSearch={false} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="mb-6">
            <Link
              href="/producto"
              className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#4B2E67] transition hover:text-[#E6398A]"
            >
              <ArrowLeft size={18} strokeWidth={2.2} />
              Volver al catálogo
            </Link>
            <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.22em] text-[#E6398A]">Pago</p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#2B1740] md:text-5xl">
              Selecciona tu método de pago
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6F6280]">
              Elige cómo quieres completar tu compra y revisa tu resumen antes de confirmar.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#7B2CBF]/20 bg-white px-6 py-12 text-center shadow-[0_20px_40px_rgba(43,23,64,0.06)]">
              <p className="text-xl font-bold text-[#2B1740]">Tu carrito está vacío</p>
              <p className="mt-3 text-sm text-[#7A678F]">Agrega productos antes de continuar con el pago.</p>
              <Link
                href="/producto"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#2B1740] px-6 text-sm font-bold text-white"
              >
                Volver al catálogo
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div
                className={`rounded-[32px] border bg-white p-6 shadow-[0_20px_40px_rgba(43,23,64,0.06)] ${
                  metodoSeleccionado === "qr" ? "border-[#E6398A]" : "border-[#7B2CBF]/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F7] text-[#E6398A]">
                      <QrCode size={28} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[#2B1740]">Código QR</h2>
                      <p className="mt-1 text-sm text-[#7A678F]">Escanea para pagar de forma inmediata.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMetodoSeleccionado("qr")}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
                      metodoSeleccionado === "qr" ? "bg-[#E6398A] text-white" : "bg-[#F3E8FF] text-[#7B2CBF]"
                    }`}
                    aria-label="Seleccionar código QR"
                  >
                    {metodoSeleccionado === "qr" ? "✓" : ""}
                  </button>
                </div>

                <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[28px] border border-[#E6398A]/15 bg-[#FFF7FB] p-6">
                  {qrImageUrl === "URL_DE_TU_QR_AQUI" ? (
                    <div className="flex h-56 w-56 flex-col items-center justify-center rounded-[26px] border border-[#7B2CBF]/10 bg-white text-center">
                      <QrCode size={44} strokeWidth={1.8} className="text-[#7B2CBF]" />
                      <span className="mt-4 max-w-[150px] text-sm font-semibold leading-6 text-[#7A678F]">
                        Espacio para el código QR del pago
                      </span>
                    </div>
                  ) : (
                    <img src={qrImageUrl} alt="Código QR de pago" className="h-56 w-56 rounded-[26px] object-cover" />
                  )}
                </div>

                <p className="mt-5 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#7B2CBF]">
                  Escanea para pagar seguro
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {metodosPago
                  .filter((metodo) => !metodo.destacado)
                  .map((metodo) => {
                    const Icono = metodo.icono;
                    const activo = metodoSeleccionado === metodo.id;

                    return (
                      <button
                        key={metodo.id}
                        type="button"
                        onClick={() => setMetodoSeleccionado(metodo.id)}
                        className={`rounded-[28px] border p-5 text-left shadow-[0_16px_30px_rgba(43,23,64,0.05)] transition ${
                          activo
                            ? "border-[#E6398A] bg-[#FFF0F7]"
                            : "border-[#7B2CBF]/10 bg-white hover:border-[#E6398A]/35"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                              activo ? "bg-white text-[#E6398A]" : "bg-[#F7F2FB] text-[#7B2CBF]"
                            }`}
                          >
                            <Icono size={24} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#2B1740]">{metodo.titulo}</h3>
                            <p className="mt-1 text-sm leading-6 text-[#7A678F]">{metodo.descripcion}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                <div className="rounded-[28px] border border-[#7B2CBF]/10 bg-white p-6 shadow-[0_16px_30px_rgba(43,23,64,0.05)]">
                  <h2 className="text-xl font-bold text-[#2B1740]">Productos en tu pedido</h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {items.map((item) => (
                      <article key={item.id} className="flex items-center gap-3 rounded-2xl bg-[#FFF7FB] p-3">
                        <Link
                          href={`/producto/${item.id}`}
                          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-center text-[11px] font-bold text-[#8d76a6]"
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <span>Imagen</span>
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-[#2B1740]">{item.name}</p>
                          <p className="mt-1 text-xs text-[#7A678F]">
                            {item.quantity} x Bs. {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-black text-[#7B2CBF]">Bs. {(item.price * item.quantity).toFixed(2)}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-[#E6398A]/12 bg-[#FFF3F8] p-7 shadow-[0_20px_40px_rgba(43,23,64,0.06)]">
            <h2 className="text-2xl font-black text-[#2B1740]">Resumen</h2>

            <div className="mt-8 flex items-center justify-between text-[17px] text-[#5F4C74]">
              <span>Subtotal</span>
              <span className="font-semibold">Bs. {subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 border-t border-[#7B2CBF]/10 pt-6">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#7A678F]">Monto total</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-5xl font-black tracking-[-0.05em] text-[#7B2CBF]">
                  Bs. {total.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#A06FBC]">Pago protegido y confirmado dentro de la plataforma.</p>
            </div>

            <button
              onClick={handleProceed}
              disabled={items.length === 0}
              className="mt-8 flex min-h-[62px] w-full items-center justify-center gap-3 rounded-full bg-[#E6398A] px-6 text-lg font-black text-white shadow-[0_18px_30px_rgba(230,57,138,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-[#D8C9E4] disabled:shadow-none"
            >
              Confirmar pago
              <ArrowRight size={20} strokeWidth={2.4} />
            </button>

            <p className="mt-5 text-center text-[13px] font-semibold text-[#7A678F]">
              Transacción segura y cifrada
            </p>
          </div>

          <div className="rounded-[28px] border border-[#7B2CBF]/10 bg-white p-6 shadow-[0_16px_30px_rgba(43,23,64,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0F7] text-[#E6398A]">
                <CircleHelp size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2B1740]">¿Necesitas ayuda?</h3>
                <p className="mt-2 text-sm leading-6 text-[#7A678F]">
                  Nuestro equipo puede ayudarte con dudas sobre tu pago, confirmación o método seleccionado.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={() => setShowAuth(false)}
      />
    </div>
  );
}
