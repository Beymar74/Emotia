"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Store, Briefcase, ArrowRight } from "lucide-react";

const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  carmesi: "#AB3A50",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#7A5260"
};

export default function EcosystemSection() {
  const router = useRouter();

  const BRANDS = [
    {
      id: "business",
      logo: "/logo/logo-business-expandido.png",
      title: "Emotia Business",
      tag: "Portal de Productores y Empresas",
      desc: "¿Tienes una tienda, eres artesano o productor? Regístrate en nuestra plataforma para publicar tu catálogo de productos, gestionar tu inventario y vender en el ecosistema.",
      btnText: "Registrar mi Empresa",
      action: () => router.push("/business"),
      color: P.dorado,
      bgShadow: "rgba(188, 153, 104, 0.12)",
      icon: <Briefcase size={20} strokeWidth={2} />
    },
    {
      id: "store",
      logo: "/logo/logo-store-expandido.png",
      title: "Emotia Store",
      tag: "Tienda & Catálogo de Regalos",
      desc: "La vitrina comercial para nuestros clientes. Explora y compra la variedad de regalos premium, cajas sorpresa y detalles únicos ofrecidos por nuestras marcas asociadas.",
      btnText: "Explorar Tienda",
      action: () => router.push("/producto"),
      color: P.carmesi,
      bgShadow: "rgba(171, 58, 80, 0.08)",
      icon: <Store size={20} strokeWidth={2} />
    }
  ];

  return (
    <>
      <style>{`
        .eco-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 48px;
          max-width: 860px;
          margin-left: auto;
          margin-right: auto;
        }
        @media(max-width: 768px) {
          .eco-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      <section style={{ background: "linear-gradient(180deg, #FFF3E6 0%, #FFFFFF 100%)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Glow decorativo de fondo */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 250, borderRadius: "50%", background: `${P.dorado}15`, filter: "blur(70px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}
            >
              <span style={{ width: 30, height: 1.5, background: P.dorado }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.15em", textTransform: "uppercase" }}>Nuestro Ecosistema</span>
              <span style={{ width: 30, height: 1.5, background: P.dorado }} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: P.bordo, letterSpacing: "-0.01em", marginBottom: 14 }}
            >
              Un ecosistema de regalos para cada necesidad
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: P.chocolate, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}
            >
              Conectamos emociones, empresas y productores locales a través de nuestras plataformas y canales especializados.
            </motion.p>
          </div>

          {/* Grid de Marcas */}
          <div className="eco-grid">
            {BRANDS.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${brand.bgShadow}`, borderColor: `${brand.color}35` }}
                style={{
                  background: P.blanco,
                  borderRadius: 24,
                  border: `1.5px solid ${P.beige}70`,
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Detalle decorativo de la esquina */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, background: `radial-gradient(circle at top right, ${brand.color}12, transparent 70%)` }} />

                {/* Logo Image Centered & Large */}
                <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, width: "100%" }}>
                  <img
                    src={brand.logo}
                    alt={brand.title}
                    style={{ height: "100%", width: "auto", maxWidth: "95%", objectFit: "contain" }}
                  />
                </div>

                {/* Tag */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <span style={{ color: brand.color, display: "flex", alignItems: "center" }}>{brand.icon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: brand.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {brand.tag}
                  </span>
                </div>

                {/* Descripción */}
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: P.chocolate, lineHeight: 1.6, marginBottom: 32, flexGrow: 1 }}>
                  {brand.desc}
                </p>

                {/* Botón CTA */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={brand.action}
                  style={{
                    width: "100%",
                    backgroundColor: `${brand.color}10`,
                    color: brand.color,
                    border: `1px solid ${brand.color}25`,
                    borderRadius: 14,
                    padding: "14px 20px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = brand.color;
                    e.currentTarget.style.color = P.blanco;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${brand.color}10`;
                    e.currentTarget.style.color = brand.color;
                  }}
                >
                  {brand.btnText} <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
