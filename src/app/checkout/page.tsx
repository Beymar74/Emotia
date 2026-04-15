"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleHelp, CreditCard, Landmark, MapPin, QrCode, ShieldCheck, Truck } from "lucide-react";
import AuthModal from "../producto/components/AuthModal";
import Header from "../producto/components/Header";
import { useCart } from "../producto/components/cart/useCart";
import { useSession } from "../producto/components/auth/useSession";

type MetodoPago = "qr" | "tarjeta" | "transferencia";
type ZonaEntrega = "centro" | "zona-sur" | "miraflores";

const metodosPago: Array<{
  id: MetodoPago;
  titulo: string;
  descripcion: string;
  icono: typeof QrCode;
}> = [
  {
    id: "qr",
    titulo: "Código QR",
    descripcion: "Escanea y paga al instante desde tu banca móvil.",
    icono: QrCode,
  },
  {
    id: "tarjeta",
    titulo: "Tarjeta de débito",
    descripcion: "Paga con tu tarjeta y confirma al instante.",
    icono: CreditCard,
  },
  {
    id: "transferencia",
    titulo: "Transferencia bancaria",
    descripcion: "Haz la transferencia y sube tu comprobante.",
    icono: Landmark,
  },
];

const zonasEntrega: Array<{ id: ZonaEntrega; label: string; eta: string; extra: number }> = [
  { id: "centro", label: "Centro", eta: "Entrega estimada hoy en 1 a 2 horas", extra: 0 },
  { id: "zona-sur", label: "Zona Sur", eta: "Entrega estimada hoy en 2 a 4 horas", extra: 8 },
  { id: "miraflores", label: "Miraflores / Sopocachi", eta: "Entrega estimada hoy en 2 a 3 horas", extra: 5 },
];

export default function CheckoutPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [codigoPedido] = useState(() => `EMO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago>("qr");
  const [zonaEntrega, setZonaEntrega] = useState<ZonaEntrega>("centro");
  const [direccion, setDireccion] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [telefono, setTelefono] = useState("");
  const [referencia, setReferencia] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [fechaTarjeta, setFechaTarjeta] = useState("");
  const [cvvTarjeta, setCvvTarjeta] = useState("");
  const [comprobante, setComprobante] = useState<File | null>(null);
  const qrImageUrl = "URL_DE_TU_QR_AQUI";
  const cuentaBancaria = "Banco Unión - Cuenta corriente 100-2458796";
  const { items, subtotal } = useCart();
  const { isLoggedIn } = useSession();

  const zonaActiva = useMemo(
    () => zonasEntrega.find((zona) => zona.id === zonaEntrega) || zonasEntrega[0],
    [zonaEntrega]
  );

  const total = useMemo(() => subtotal + zonaActiva.extra, [subtotal, zonaActiva.extra]);

  const direccionCompleta = direccion.trim().length > 6 && destinatario.trim() !== "" && telefono.trim() !== "";

  const metodoListo =
    metodoSeleccionado === "qr" ||
    (metodoSeleccionado === "tarjeta" &&
      numeroTarjeta.replace(/\s/g, "").length >= 16 &&
      nombreTarjeta.trim() !== "" &&
      fechaTarjeta.trim().length >= 5 &&
      cvvTarjeta.trim().length >= 3) ||
    (metodoSeleccionado === "transferencia" && Boolean(comprobante));

  const handleProceed = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }

    if (!direccionCompleta || !metodoListo) {
      alert("Completa la dirección de entrega y los datos del método de pago antes de confirmar.");
      return;
    }

    setShowSuccessModal(true);
  };

  const renderPanelPago = () => {
    if (metodoSeleccionado === "tarjeta") {
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
              <CreditCard size={28} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#5C3A2E]">Tarjeta de débito</h2>
              <p className="mt-1 text-sm text-[#8A6F62]">Ingresa los datos tal como aparecen en tu tarjeta.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Número de tarjeta</span>
              <input
                value={numeroTarjeta}
                onChange={(event) => setNumeroTarjeta(event.target.value)}
                placeholder="1234 5678 9012 3456"
                className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Nombre en la tarjeta</span>
              <input
                value={nombreTarjeta}
                onChange={(event) => setNombreTarjeta(event.target.value)}
                placeholder="Como figura en la tarjeta"
                className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
              />
            </label>

            <label>
              <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Vencimiento</span>
              <input
                value={fechaTarjeta}
                onChange={(event) => setFechaTarjeta(event.target.value)}
                placeholder="MM/AA"
                className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
              />
            </label>

            <label>
              <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">CVV</span>
              <input
                value={cvvTarjeta}
                onChange={(event) => setCvvTarjeta(event.target.value)}
                placeholder="123"
                className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
              />
            </label>
          </div>
        </div>
      );
    }

    if (metodoSeleccionado === "transferencia") {
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
              <Landmark size={28} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#5C3A2E]">Transferencia bancaria</h2>
              <p className="mt-1 text-sm text-[#8A6F62]">Transfiere a esta cuenta y adjunta tu comprobante.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E6885C]/16 bg-[linear-gradient(180deg,#FFF8F4_0%,#FFF4F6_100%)] p-5">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Cuenta bancaria</p>
            <p className="mt-3 text-xl font-black text-[#5C3A2E]">{cuentaBancaria}</p>
            <p className="mt-2 text-sm leading-6 text-[#8A6F62]">Titular: Emotia Store SRL. Usa el nombre del destinatario como referencia.</p>
          </div>

          <label className="block rounded-[28px] border border-dashed border-[#C6284F]/30 bg-white p-6 text-center transition hover:border-[#C6284F]">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
              <ShieldCheck size={24} strokeWidth={2} />
            </span>
            <span className="mt-4 block text-lg font-black text-[#5C3A2E]">Sube tu comprobante</span>
            <span className="mt-2 block text-sm text-[#8A6F62]">
              {comprobante ? comprobante.name : "Selecciona una imagen o PDF del depósito"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(event) => setComprobante(event.target.files?.[0] || null)}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
              <QrCode size={28} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#5C3A2E]">Código QR</h2>
              <p className="mt-1 text-sm text-[#8A6F62]">Escanea para pagar de forma inmediata.</p>
            </div>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6284F] text-sm font-black text-white">✓</span>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-[#E6885C]/16 bg-[linear-gradient(180deg,#FFF8F4_0%,#FFF4F6_100%)] p-6">
          {qrImageUrl === "URL_DE_TU_QR_AQUI" ? (
            <div className="flex h-60 w-60 flex-col items-center justify-center rounded-[26px] border border-[#E6885C]/14 bg-white text-center">
              <QrCode size={52} strokeWidth={1.8} className="text-[#C6284F]" />
              <span className="mt-4 max-w-[170px] text-sm font-semibold leading-6 text-[#8A6F62]">Espacio para el código QR del pago</span>
            </div>
          ) : (
            <img src={qrImageUrl} alt="Código QR de pago" className="h-60 w-60 rounded-[26px] object-cover" />
          )}
        </div>

        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#8E3651]">Escanea para pagar seguro</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f2_100%)]">
      <Header showSearch={false} />

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-6 py-8 xl:grid-cols-[minmax(0,1.3fr)_420px]">
        <section className="space-y-6">
          <div>
            <Link
              href="/producto"
              className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#8E3651] transition hover:text-[#C6284F]"
            >
              <ArrowLeft size={18} strokeWidth={2.2} />
              Volver al catálogo
            </Link>
            <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.22em] text-[#C6284F]">Pago</p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#5C3A2E] md:text-5xl">Selecciona tu método de pago</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#8A6F62]">
              Completa la dirección de entrega, revisa el tiempo estimado y elige cómo quieres pagar tu pedido.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#E6885C]/25 bg-white px-6 py-12 text-center shadow-[0_20px_40px_rgba(92,58,46,0.06)]">
              <p className="text-xl font-bold text-[#5C3A2E]">Tu carrito está vacío</p>
              <p className="mt-3 text-sm text-[#8A6F62]">Agrega productos antes de continuar con el pago.</p>
              <Link
                href="/producto"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#C6284F] px-6 text-sm font-bold text-white"
              >
                Volver al catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-[32px] border border-[#E6885C]/14 bg-white p-6 shadow-[0_18px_36px_rgba(92,58,46,0.06)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
                    <MapPin size={22} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Entrega</p>
                    <h2 className="text-2xl font-black text-[#5C3A2E]">¿A dónde enviamos tu regalo?</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Destinatario</span>
                    <input
                      value={destinatario}
                      onChange={(event) => setDestinatario(event.target.value)}
                      placeholder="Nombre de la persona"
                      className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Teléfono</span>
                    <input
                      value={telefono}
                      onChange={(event) => setTelefono(event.target.value)}
                      placeholder="Número de contacto"
                      className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Zona</span>
                    <select
                      value={zonaEntrega}
                      onChange={(event) => setZonaEntrega(event.target.value as ZonaEntrega)}
                      className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
                    >
                      {zonasEntrega.map((zona) => (
                        <option key={zona.id} value={zona.id}>
                          {zona.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Referencia</span>
                    <input
                      value={referencia}
                      onChange={(event) => setReferencia(event.target.value)}
                      placeholder="Edificio, piso, referencia"
                      className="min-h-[58px] w-full rounded-[20px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Dirección exacta</span>
                    <textarea
                      value={direccion}
                      onChange={(event) => setDireccion(event.target.value)}
                      placeholder="Calle, avenida, número de casa o departamento"
                      className="min-h-[120px] w-full rounded-[24px] border border-[#E6885C]/18 bg-[#FFFDFC] px-5 py-4 text-[#5C3A2E] outline-none transition focus:border-[#C6284F] focus:ring-4 focus:ring-[#C6284F]/10"
                    />
                  </label>
                </div>

                <div className="mt-5 rounded-[24px] border border-[#E6885C]/14 bg-[linear-gradient(180deg,#FFF8F4_0%,#FFF4F6_100%)] p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#C6284F]">
                      <Truck size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Tiempo estimado</p>
                      <p className="mt-2 text-lg font-black text-[#5C3A2E]">{zonaActiva.eta}</p>
                      <p className="mt-2 text-sm leading-6 text-[#8A6F62]">Costo de envío para esta zona: Bs. {zonaActiva.extra.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                <div className="space-y-4">
                  {metodosPago.map((metodo) => {
                    const Icono = metodo.icono;
                    const activo = metodoSeleccionado === metodo.id;

                    return (
                      <button
                        key={metodo.id}
                        type="button"
                        onClick={() => setMetodoSeleccionado(metodo.id)}
                        className={`w-full rounded-[28px] border p-5 text-left shadow-[0_16px_30px_rgba(43,23,64,0.05)] transition ${
                          activo ? "border-[#C6284F] bg-[#FFF5F6]" : "border-[#E6885C]/12 bg-white hover:border-[#C6284F]/30"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${activo ? "bg-white text-[#C6284F]" : "bg-[#FFF3E6] text-[#8E3651]"}`}>
                            <Icono size={24} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#5C3A2E]">{metodo.titulo}</h3>
                            <p className="mt-1 text-sm leading-6 text-[#8A6F62]">{metodo.descripcion}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  <div className="rounded-[28px] border border-[#E6885C]/12 bg-white p-6 shadow-[0_16px_30px_rgba(92,58,46,0.05)]">
                    <h2 className="text-xl font-bold text-[#5C3A2E]">Productos en tu pedido</h2>
                    <div className="mt-4 flex flex-col gap-3">
                      {items.map((item) => (
                        <article key={item.id} className="flex items-center gap-3 rounded-2xl bg-[linear-gradient(180deg,#FFF8F4_0%,#FFF4F6_100%)] p-3">
                          <Link
                            href={`/producto/${item.id}`}
                            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-center text-[11px] font-bold text-[#9A8A82]"
                          >
                            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : <span>Imagen</span>}
                          </Link>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-[#5C3A2E]">{item.name}</p>
                            <p className="mt-1 text-xs text-[#8A6F62]">{item.quantity} x Bs. {item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm font-black text-[#C6284F]">Bs. {(item.price * item.quantity).toFixed(2)}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-[#E6885C]/14 bg-white p-6 shadow-[0_20px_40px_rgba(43,23,64,0.06)]">
                  {renderPanelPago()}
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-[#E6885C]/14 bg-[linear-gradient(180deg,#FFF5F6_0%,#FFF3E6_100%)] p-7 shadow-[0_20px_40px_rgba(92,58,46,0.06)]">
            <h2 className="text-2xl font-black text-[#5C3A2E]">Resumen</h2>

            <div className="mt-8 space-y-4 text-[17px] text-[#7C5342]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">Bs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envío</span>
                <span className="font-semibold">Bs. {zonaActiva.extra.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-[#E6885C]/14 pt-6">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#8A6F62]">Monto total</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-5xl font-black tracking-[-0.05em] text-[#C6284F]">Bs. {total.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-sm text-[#8A6F62]">Pago protegido y confirmado dentro de la plataforma.</p>
            </div>

            <button
              onClick={handleProceed}
              disabled={items.length === 0}
              className="mt-8 flex min-h-[62px] w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#C6284F,#E04A64)] px-6 text-lg font-black text-white shadow-[0_18px_30px_rgba(198,40,79,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-[#D8C9E4] disabled:shadow-none"
            >
              Confirmar pago
              <ArrowRight size={20} strokeWidth={2.4} />
            </button>

            <p className="mt-5 text-center text-[13px] font-semibold text-[#8A6F62]">Transacción segura y cifrada</p>
          </div>

          <div className="rounded-[28px] border border-[#E6885C]/12 bg-white p-6 shadow-[0_16px_30px_rgba(92,58,46,0.05)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE3E8,#FFF3E6)] text-[#C6284F]">
                <CircleHelp size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#5C3A2E]">¿Necesitas ayuda?</h3>
                <p className="mt-2 text-sm leading-6 text-[#8A6F62]">Nuestro equipo puede ayudarte con dudas sobre la entrega, el pago o la validación de tu comprobante.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={() => {
          setShowAuth(false);
          if (direccionCompleta && metodoListo) {
            setShowSuccessModal(true);
          }
        }}
      />

      {showSuccessModal ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-[rgba(44,27,20,0.48)] px-4 backdrop-blur-[6px]">
          <div className="w-full max-w-[520px] rounded-[32px] border border-[#E6885C]/16 bg-[linear-gradient(180deg,#FFFDFC_0%,#FFF4F6_100%)] p-8 text-center shadow-[0_28px_80px_rgba(92,58,46,0.22)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C6284F,#E04A64)] text-4xl font-black text-white">
              ✓
            </div>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.22em] text-[#8A6F62]">Pago confirmado</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#5C3A2E]">Tu pedido fue registrado con éxito</h2>
            <p className="mt-4 text-base leading-7 text-[#8A6F62]">
              Recibimos tu pago y estamos preparando la entrega. Te notificaremos cualquier actualización del envío.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#E6885C]/14 bg-white/80 p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#8A6F62]">Pedido</span>
                <span className="text-base font-black text-[#C6284F]">{codigoPedido}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#8A6F62]">Total</span>
                <span className="text-base font-black text-[#5C3A2E]">Bs. {total.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#8A6F62]">Entrega</span>
                <span className="text-sm font-semibold text-[#5C3A2E]">{zonaActiva.eta}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex min-h-[56px] flex-1 items-center justify-center rounded-full border border-[#E6885C]/20 bg-white px-6 text-sm font-black text-[#8E3651]"
              >
                Seguir revisando
              </button>
              <Link
                href="/producto"
                className="flex min-h-[56px] flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C6284F,#E04A64)] px-6 text-sm font-black text-white shadow-[0_18px_30px_rgba(198,40,79,0.22)]"
              >
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
