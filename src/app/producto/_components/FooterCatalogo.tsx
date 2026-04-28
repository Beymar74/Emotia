"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Mail, MapPin, X } from "lucide-react";
import { FaTiktok, FaInstagram } from "react-icons/fa6";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  carmesi: "#AB3A50",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  choco: "#5C3A2E",
};

const enlacesEmotia = [
  { label: "Catalogo", href: "/producto" },
  { label: "Para Empresas", href: "/business" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Ayuda", href: "gmail-support" },
];

const enlacesBusiness = [
  { label: "Como funciona", href: "/business#pasos" },
  { label: "Tecnologia", href: "/business#beneficios" },
  { label: "Historias", href: "/business#testimonios" },
  { label: "Comunidad", href: "/business#unirse" },
];

const enlacesLegales = [
  { id: "terminos", label: "Terminos de Servicio" },
  { id: "privacidad", label: "Politica de Privacidad" },
] as const;

export default function FooterCatalogo() {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState<"terminos" | "privacidad" | null>(null);

  const abrirGmailSoporte = () => {
    const asunto = encodeURIComponent("Solicitud de ayuda o soporte - Emotia");
    const cuerpo = encodeURIComponent(
      [
        "Hola equipo de Emotia,",
        "",
        "Necesito ayuda o soporte con lo siguiente:",
        "",
        "- Motivo de la consulta:",
        "- Numero de pedido (si aplica):",
        "- Detalles adicionales:",
        "",
        "Quedo atento(a) a su respuesta.",
        "",
        "Gracias.",
      ].join("\n"),
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=emotia.support@gmail.com&su=${asunto}&body=${cuerpo}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <footer className="relative mt-16 font-sans">
        <div
          className="relative overflow-hidden px-6 pb-12 pt-20 md:px-12"
          style={{ background: `linear-gradient(180deg, ${P.bordoNegro} 0%, ${P.bordoOscuro} 100%)` }}
        >
          <div
            className="pointer-events-none absolute left-0 top-10 w-full select-none text-center text-[14vw] font-black opacity-[0.03]"
            style={{ color: P.blanco, fontFamily: "'Montserrat', sans-serif" }}
          >
            PRODUCTOS
          </div>

          <div
            className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-1 gap-12 border-b pb-16 md:grid-cols-12"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="space-y-6 md:col-span-4">
              <img
                src="/logo/logoextendido.png"
                alt="Emotia"
                className="h-10 cursor-pointer object-contain transition-transform hover:scale-105"
                style={{ filter: "brightness(0) invert(1)" }}
                onClick={() => router.push("/")}
              />
              <p
                className="max-w-sm text-sm leading-relaxed"
                style={{ color: P.beige, opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}
              >
                Explora regalos pensados para sorprender mejor. En el catalogo de Emotia reunimos detalles,
                marcas y ocasiones para que encontrar el regalo ideal sea mas simple.
              </p>

              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.instagram.com/emotia.gifts1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  style={{ background: "rgba(0,0,0,0.25)", color: P.beige }}
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.tiktok.com/@emotia.gifts0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  style={{ background: "rgba(0,0,0,0.25)", color: P.beige }}
                >
                  <FaTiktok size={19} />
                </a>
              </div>
            </div>

            <div className="space-y-6 md:col-span-2">
              <h4
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}
              >
                Emotia
              </h4>
              <ul className="space-y-4">
                {enlacesEmotia.map((enlace) => (
                  <li key={enlace.label}>
                    <motion.button
                      type="button"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => (enlace.href === "gmail-support" ? abrirGmailSoporte() : router.push(enlace.href))}
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                      style={{ color: P.beige, opacity: 0.76, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 md:col-span-3">
              <h4
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}
              >
                Emotia Business
              </h4>
              <ul className="space-y-4">
                {enlacesBusiness.map((enlace) => (
                  <li key={enlace.label}>
                    <motion.button
                      type="button"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => router.push(enlace.href)}
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                      style={{ color: P.beige, opacity: 0.76, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 md:col-span-3">
              <h4
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}
              >
                Legal y contacto
              </h4>
              <ul className="space-y-4">
                {enlacesLegales.map((enlace) => (
                  <li key={enlace.id}>
                    <motion.button
                      type="button"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setModalAbierto(enlace.id)}
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                      style={{ color: P.beige, opacity: 0.76, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4" style={{ color: P.beige, opacity: 0.82 }}>
                  <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Av. Arce, Zona Sopocachi
                    <br />
                    La Paz, Bolivia
                  </p>
                </div>
                <div className="flex items-center gap-4" style={{ color: P.beige, opacity: 0.82 }}>
                  <Mail size={20} className="shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    emotia.support@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-[1320px] flex-col items-center justify-between gap-4 px-4 md:flex-row">
            <p
              className="text-xs font-medium"
              style={{ color: P.beige, opacity: 0.5, fontFamily: "'DM Sans', sans-serif" }}
            >
              © 2026 Emotia Technologies Bolivia S.R.L. Todos los derechos reservados.
            </p>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(245, 230, 208, 0.5)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Diseñado con <Heart size={14} color={P.carmesi} fill={P.carmesi} /> en La Paz, Bolivia
            </span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAbierto(null)}
              className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="absolute left-0 top-0 h-2 w-full" style={{ background: P.dorado }} />
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X size={24} style={{ color: P.bordoNegro }} />
              </button>

              <div className="max-h-[70vh] overflow-y-auto">
                {modalAbierto === "terminos" ? (
                  <div className="p-2">
                    <h3
                      className="mb-4 text-2xl font-black"
                      style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Terminos de Servicio
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                      <p>
                        Al unirte como Socio Proveedor a Emotia Business, aceptas nuestros terminos de colaboracion
                        corporativa.
                      </p>
                      <p>
                        <strong>1. Calidad Garantizada:</strong> Te comprometes a mantener los mas altos estandares
                        artesanales.
                      </p>
                      <p>
                        <strong>2. Pagos y Comisiones:</strong> Emotia retiene una tarifa de intermediacion por cada
                        venta exitosa.
                      </p>
                    </div>
                  </div>
                ) : null}

                {modalAbierto === "privacidad" ? (
                  <div className="p-2">
                    <h3
                      className="mb-4 text-2xl font-black"
                      style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Politica de Privacidad
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                      <p>En Emotia valoramos y protegemos la informacion de tu negocio.</p>
                      <p>
                        <strong>Datos Recopilados:</strong> Guardamos informacion de ventas estrictamente para el
                        funcionamiento del panel.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6 text-right">
                <button
                  type="button"
                  onClick={() => setModalAbierto(null)}
                  className="rounded-xl px-6 py-2.5 font-bold text-white transition-transform hover:scale-105"
                  style={{ background: P.bordoNegro }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
