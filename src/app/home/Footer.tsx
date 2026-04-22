"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, Music, Heart, MapPin, Mail, Gift, ArrowRight } from "lucide-react";
// NUEVA PALETA DE COLORES
const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  carmesi: "#AB3A50",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0"
};

export default function Footer() {
  const router = useRouter();

  const LINKS_NAV = [
    { label: "Catálogo de Regalos", path: "/producto" },
    { label: "Cómo Funciona", path: "/#como-funciona" },
    { label: "Para Empresas", path: "/business" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Ayuda y FAQ", path: "/ayuda" },
  ];

  const LINKS_LEGAL = [
    { label: "Términos de Servicio", path: "/terminos" },
    { label: "Política de Privacidad", path: "/privacidad" },
    { label: "Gestión de Cookies", path: "/cookies" },
  ];

  const SOCIAL = [
    { icon: <Instagram size={18} strokeWidth={2} />, href: "https://www.instagram.com/emotia.gifts1/", label: "Instagram" },
    { icon: <MessageCircle size={18} strokeWidth={2} />, href: "https://wa.me/59170000000", label: "WhatsApp" },
    { icon: <Music size={18} strokeWidth={2} />, href: "https://www.tiktok.com/@emotia.gifts0", label: "TikTok" },
  ];

  return (
    <>
      {/* ── FOOTER ESTILO BUSINESS ADAPTADO PARA CLIENTES ── */}
      <footer style={{ background: P.bordo, paddingTop: "80px", position: "relative", overflow: "hidden" }}>

        {/* MARCA DE AGUA GIGANTE DE FONDO */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "22vw",
          fontWeight: 900,
          fontFamily: "'Montserrat', sans-serif",
          color: P.blanco,
          opacity: 0.02,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          whiteSpace: "nowrap",
          letterSpacing: "-0.05em"
        }}>
          EMOTIA
        </div>

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>

          {/* GRID PRINCIPAL DE 4 COLUMNAS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px", marginBottom: "60px" }}>

            {/* COLUMNA 1: Logo y Descripción */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
                <img src="/logo/logoextendido.png" alt="Emotia"
                  style={{ height: 40, width: "auto", objectFit: "contain", display: "block", filter: "brightness(0) invert(1)", opacity: 0.95 }} />
              </motion.div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                La primera plataforma inteligente de regalos en Bolivia. Sorprende a los que más quieres con detalles únicos, empaque premium y entrega garantizada en La Paz.
              </p>

              {/* Redes Sociales */}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {SOCIAL.map((s, i) => (
                  <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    whileHover={{ scale: 1.1, backgroundColor: P.carmesi }}
                    whileTap={{ scale: 0.95 }}
                    style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: P.blanco, textDecoration: "none", transition: "background-color 0.3s" }}>
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* COLUMNA 2: Navegación */}
            <div>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
                Navegación
              </h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {LINKS_NAV.map((l, i) => (
                  <motion.button key={i} onClick={() => router.push(l.path)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", textAlign: "left", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = P.blanco}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* COLUMNA 3: Legal */}
            <div>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
                Legal
              </h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {LINKS_LEGAL.map((l, i) => (
                  <motion.button key={i} onClick={() => router.push(l.path)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", textAlign: "left", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = P.blanco}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* COLUMNA 4: Contacto */}
            <div>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
                Atención al Cliente
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "rgba(255,255,255,0.7)" }}>
                  <MapPin size={18} color={P.dorado} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", lineHeight: 1.5 }}>Av. Arce, Zona Sopocachi<br />La Paz, Bolivia</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", color: "rgba(255,255,255,0.7)" }}>
                  <Mail size={18} color={P.dorado} style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}>hola@emotia.com.bo</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/producto")}
                  style={{ marginTop: 12, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 12, padding: "14px 20px", color: P.blanco, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background-color 0.3s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Gift size={18} color={P.dorado} /> Ir al Catálogo
                  </div>
                  <ArrowRight size={18} color={P.dorado} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />

          {/* BOTTOM ROW (Copyright) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, paddingBottom: 24 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              © {new Date().getFullYear()} Emotia Technologies Bolivia S.R.L. Todos los derechos reservados.
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
              Diseñado con <Heart size={14} color={P.carmesi} fill={P.carmesi} /> en La Paz, Bolivia
            </span>
          </div>

        </div>
      </footer>
    </>
  );
}