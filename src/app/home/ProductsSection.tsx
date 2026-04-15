"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, ArrowRight, MessageCircle, Gift, Sparkles, Store, TrendingUp, ShieldCheck
} from "lucide-react";
import { PRODUCTS, TESTIMONIALS } from "./constants";

// NUEVA PALETA DE COLORES DE BEYMAR
const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  carmesi: "#AB3A50",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000"
};

const MAX_VISIBLE = 8;

// 👇 MOCK DE MARCAS/ALIADOS (Puedes cambiar esto por imágenes después) 👇
const PARTNERS = [
  "Chocolates El Ceibo",
  "Bodegas Kohlberg",
  "Café Typica",
  "Florería Edén",
  "Casa Real",
  "Artesanías Waliki",
  "La Francesa",
  "Gustu"
];

export default function ProductsSection() {
  const router = useRouter();

  const visibleProducts = PRODUCTS.slice(0, MAX_VISIBLE);

  // Duplicamos los arreglos para crear el efecto de bucle infinito perfecto
  const marqueeItems = [...visibleProducts, ...visibleProducts];
  const marqueeTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
  const marqueePartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  const STEPS = [
    { num: "01", icon: <MessageCircle size={24} color={P.granate} strokeWidth={1.5} />, title: "Cuéntanos la historia", desc: "Dinos para quién es el regalo, qué celebran y tu presupuesto. La IA hace el resto." },
    { num: "02", icon: <Sparkles size={24} color={P.granate} strokeWidth={1.5} />, title: "La IA encuentra el match", desc: "En segundos analizamos el catálogo y seleccionamos las opciones más significativas." },
    { num: "03", icon: <Gift size={24} color={P.granate} strokeWidth={1.5} />, title: "Sorprende de verdad", desc: "Elige tu favorito y lo entregamos con empaque premium y tarjeta dedicatoria incluida." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        .steps-grid { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0; align-items: center; }
        
        /* ── MAGIA DEL CARRUSEL INFINITO (MARQUEE) ── */
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        
        .marquee-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 20px 0 40px;
        }

        .marquee-wrapper::before, .marquee-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-wrapper::before { left: 0; background: linear-gradient(to right, ${P.blanco}, transparent); }
        .marquee-wrapper::after { right: 0; background: linear-gradient(to left, ${P.blanco}, transparent); }

        /* Pista para Productos (40s) */
        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-marquee 40s linear infinite; 
        }
        
        /* Pista para Testimonios y Marcas (50s, un poco más lento) */
        .marquee-track-slow {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-marquee 50s linear infinite; 
        }

        @media(max-width:860px) { .steps-grid { grid-template-columns: 1fr !important; gap: 20px; } .step-arrow { transform: rotate(90deg); padding: 10px 0 !important; } }
      `}</style>

      {/* ══════════════════════════
          CARRUSEL INFINITO VITRINA
      ══════════════════════════ */}
      <section id="productos" style={{ padding: "80px 0 20px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap", gap: 14 }}>
            <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 24, height: 2.5, background: P.dorado, borderRadius: 2, display: "inline-block" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.2em", textTransform: "uppercase" }}>Selección Exclusiva</span>
              </div>
              <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: P.bordo, margin: 0, letterSpacing: "-0.02em" }}>
                Los más deseados
              </h2>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/regalos")}
              style={{ background: P.blanco, color: P.granate, border: `1.5px solid ${P.granate}40`, padding: "12px 24px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              Ir al Catálogo <ArrowRight size={16} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeItems.map((p, index) => (
              <motion.div
                key={`${p.id}-${index}`}
                whileHover={{ y: -8, borderColor: P.dorado }}
                style={{ flex: "0 0 300px", background: P.blanco, borderRadius: 20, border: `1px solid ${P.beige}`, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", boxShadow: `0 10px 30px rgba(0,0,0,0.03)`, transition: "all 0.3s" }}
                onClick={() => router.push("/regalos")}
              >
                <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
                  <img src={p.imgSrc} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.08)"; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bordo}90 0%, transparent 50%)` }} />
                  <span style={{ position: "absolute", top: 16, left: 16, background: P.blanco, color: P.granate, padding: "6px 12px", borderRadius: 100, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: `0 4px 10px rgba(0,0,0,0.1)` }}>{p.tag}</span>

                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 700, color: P.dorado, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{p.brand}</div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: P.blanco, lineHeight: 1.2, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid rgba(255,255,255,0.2)`, paddingTop: 10 }}>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: P.beige }}>{p.price}</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 700, color: P.blanco, display: "flex", alignItems: "center", gap: 4 }}>Descubrir <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          NUESTROS ALIADOS (CARRUSEL MARCAS)
      ══════════════════════════ */}
      <div style={{ padding: "40px 0 60px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 800, color: P.gris, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Trabajamos con las mejores marcas y artesanos
          </h3>
        </div>

        <div className="marquee-wrapper" style={{ padding: "10px 0" }}>
          <div className="marquee-track-slow" style={{ alignItems: "center" }}>
            {marqueePartners.map((partnerName, index) => (
              <div
                key={`partner-${index}`}
                style={{
                  flex: "0 0 auto",
                  padding: "0 40px",
                  opacity: 0.4,
                  filter: "grayscale(100%)",
                  transition: "all 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.filter = "grayscale(0%)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.4";
                  e.currentTarget.style.filter = "grayscale(100%)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: P.bordo, whiteSpace: "nowrap" }}>
                  {partnerName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          EMOTIA BUSINESS
      ══════════════════════════ */}
      <div style={{ padding: "20px 24px 80px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 24, background: `linear-gradient(135deg, ${P.bordo} 0%, ${P.granate} 100%)`, padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", position: "relative", overflow: "hidden", boxShadow: `0 24px 60px ${P.bordo}30` }}>

            <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", border: `40px solid ${P.blanco}05` }} />
            <div style={{ position: "absolute", bottom: -40, left: 20, width: 150, height: 150, borderRadius: "50%", border: `20px solid ${P.dorado}10` }} />

            <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Store size={14} strokeWidth={2} /> Emotia Business
              </div>
              <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: P.blanco, marginBottom: 16, lineHeight: 1.15 }}>
                Impulsa tus ventas con<br />nuestra red inteligente.
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.05rem", color: `${P.beige}90`, lineHeight: 1.6, marginBottom: 24 }}>
                ¿Eres artesano, tienes una tienda o creas experiencias únicas? Únete a nuestra plataforma y deja que nuestra IA conecte tus productos con los clientes ideales.
              </p>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: P.blanco, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  <TrendingUp size={16} color={P.dorado} /> Mayor alcance
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: P.blanco, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  <ShieldCheck size={16} color={P.dorado} /> Gestión simplificada
                </div>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/business")}
                style={{ background: P.dorado, color: P.bordo, border: "none", padding: "18px 36px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 12px 30px ${P.dorado}40` }}>
                Únete como Productor <ArrowRight size={18} strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════ */}
      <div id="como-funciona" style={{ background: `${P.beige}30`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 30, height: 2, background: P.dorado, display: "inline-block" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.2em", textTransform: "uppercase" }}>La Experiencia</span>
              <span style={{ width: 30, height: 2, background: P.dorado, display: "inline-block" }} />
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: P.bordo }}>El arte de regalar, en 3 pasos</h2>
          </motion.div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <motion.div
                  initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, boxShadow: `0 24px 50px ${P.granate}10` }}
                  style={{ background: P.blanco, borderRadius: 24, padding: "40px 32px", position: "relative", overflow: "hidden", border: `1px solid ${P.beige}`, transition: "all 0.3s ease" }}
                >
                  <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Montserrat',sans-serif", fontSize: "8rem", fontWeight: 900, color: `${P.granate}08`, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{s.num}</div>

                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${P.beige}60`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    {s.icon}
                  </div>

                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: P.bordo, marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", color: P.chocolate, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </motion.div>

                {i < 2 && (
                  <motion.div className="step-arrow"
                    initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: P.blanco, border: `1.5px solid ${P.dorado}50`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${P.dorado}15`, color: P.dorado }}>
                      <ArrowRight size={20} strokeWidth={2} />
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          TESTIMONIOS INFINITOS
      ══════════════════════════ */}
      <div style={{ background: P.blanco, padding: "80px 0 40px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: P.bordo }}>Memorias inolvidables</h2>
          </motion.div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track-slow">
            {marqueeTestimonials.map((t, index) => (
              <motion.div
                key={`test-${index}`}
                whileHover={{ y: -6, borderColor: P.dorado, boxShadow: `0 12px 30px ${P.granate}10` }}
                style={{ flex: "0 0 380px", background: `${P.beige}20`, borderRadius: 24, padding: "32px", border: `1px solid ${P.beige}`, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.3s ease", cursor: "default" }}
              >
                <div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={P.dorado} color={P.dorado} />)}
                  </div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.05rem", color: P.chocolate, lineHeight: 1.7, fontStyle: "italic", marginBottom: 24 }}>"{t.text}"</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: P.bordo, display: "flex", alignItems: "center", justifyContent: "center", color: P.blanco, fontWeight: 800, fontSize: "1.1rem" }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, color: P.bordo, fontSize: "0.95rem" }}>{t.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", color: P.gris, fontSize: "0.8rem", marginTop: 2 }}>Cliente Verificado</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}