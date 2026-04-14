"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { EmotiaIcon } from './EmotiaIcon';
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Truck, Gift, CheckCircle, Heart, ShieldCheck, Search } from "lucide-react";
import { MINI_BANNERS, OCASIONES_HERO, TRUST_ITEMS } from "./constants";

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

interface HeroSectionProps {
  onOpenRegister?: () => void;
}

export default function HeroSection({ onOpenRegister }: HeroSectionProps) {
  const router = useRouter();
  const user = useUser();
  const [searchVal, setSearchVal] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/regalos?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer-e { 0% {background-position: -200% center} 100% {background-position: 200% center} }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        
        .hero-bg {
          background: linear-gradient(135deg, ${P.blanco} 0%, ${P.beige} 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-grad-text {
          background: linear-gradient(90deg, ${P.granate}, ${P.dorado}, ${P.carmesi}, ${P.granate});
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-e 4s linear infinite;
        }

        .hero-grid { display: grid; grid-template-columns: 1fr 480px; gap: 48px; align-items: center; }
        .mini-banners { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ocasiones-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        
        @media(max-width:1024px) { .hero-grid { grid-template-columns: 1fr; } .hero-image-container { display: none; } }
        @media(max-width:640px) { .mini-banners { grid-template-columns: 1fr; } .ocasiones-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <section className="hero-bg" style={{ paddingTop: 76 }}>
        {/* Decoración de fondo */}
        <div style={{ position: "absolute", top: -100, right: -50, width: 400, height: 400, borderRadius: "50%", background: P.dorado, opacity: 0.1, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: -100, width: 300, height: 300, borderRadius: "50%", background: P.granate, opacity: 0.05, filter: "blur(60px)", pointerEvents: "none" }} />

        {/* ── HERO PRINCIPAL ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 32px", position: "relative", zIndex: 2 }}>
          <div className="hero-grid">

            {/* COLUMNA IZQUIERDA: Textos y CTA */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: P.blanco, border: `1px solid ${P.dorado}50`, borderRadius: 100, padding: "6px 16px", marginBottom: 20, width: "fit-content", boxShadow: `0 4px 15px ${P.granate}15` }}
              >
                <Star size={12} fill={P.dorado} color={P.dorado} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: P.bordo, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  La nueva forma de regalar en Bolivia
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(2.6rem, 4.5vw, 4.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16, color: P.bordo }}
              >
                Regala momentos<br />
                <span className="hero-grad-text">que nunca olvidan.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.05rem", color: P.chocolate, lineHeight: 1.6, marginBottom: 32, maxWidth: 520 }}
              >
                Sorprende a los que más quieres con detalles únicos. Desde experiencias exclusivas hasta regalos artesanales, con entrega garantizada y empaque premium en La Paz.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/regalos")}
                  style={{ background: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", padding: "14px 28px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: `0 8px 25px ${P.granate}40`, display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Gift size={16} strokeWidth={2.5} /> Explorar Catálogo
                </motion.button>

                {!user && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { if (onOpenRegister) onOpenRegister(); }}
                    style={{ background: P.blanco, color: P.granate, border: `2px solid ${P.granate}30`, padding: "12px 24px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Sparkles size={16} /> Usar Asesor IA
                  </motion.button>
                )}
              </motion.div>

              {/* Stats Rápidos */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
              >
                {[
                  { icon: <CheckCircle size={16} color={P.dorado} />, text: "Calidad Premium" },
                  { icon: <Truck size={16} color={P.dorado} />, text: "Entrega Segura" },
                  { icon: <ShieldCheck size={16} color={P.dorado} />, text: "Compra 100% Segura" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {s.icon}
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 700, color: P.chocolate }}>{s.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* COLUMNA DERECHA: Composición Visual Premium */}
            <motion.div 
              className="hero-image-container"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ position: "relative", height: 480, width: "100%" }}
            >
              <div style={{ position: "absolute", inset: "20px 0 0 40px", borderRadius: 30, overflow: "hidden", boxShadow: `0 24px 50px ${P.bordo}20` }}>
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" alt="Regalo Premium" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bordo}90 0%, transparent 40%)` }} />
                
                <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: P.blanco, lineHeight: 1.3 }}>
                    "El detalle perfecto habla por ti."
                  </p>
                </div>
              </div>

              <motion.div 
                style={{ position: "absolute", top: 40, left: 0, background: P.blanco, padding: "14px 20px", borderRadius: 16, boxShadow: `0 12px 30px ${P.granate}15`, display: "flex", alignItems: "center", gap: 12, animation: "float 6s ease-in-out infinite" }}
              >
                <div style={{ background: `${P.beige}80`, padding: 8, borderRadius: 10 }}><Gift size={20} color={P.granate} /></div>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 800, color: P.gris, textTransform: "uppercase" }}>Incluido</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 800, color: P.bordo }}>Empaque de Lujo</div>
                </div>
              </motion.div>

              <motion.div 
                style={{ position: "absolute", bottom: 80, right: -20, background: P.blanco, padding: "14px 20px", borderRadius: 16, boxShadow: `0 12px 30px ${P.granate}15`, display: "flex", alignItems: "center", gap: 12, animation: "float 7s ease-in-out infinite alternate" }}
              >
                <div style={{ background: `${P.dorado}20`, padding: 8, borderRadius: 10 }}><Heart size={20} color={P.dorado} fill={P.dorado} /></div>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 800, color: P.bordo }}>+2,400 Sonrisas</div>
                  <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                    {[...Array(5)].map((_,i) => <Star key={i} size={10} fill={P.dorado} color={P.dorado} />)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── BÚSQUEDA ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 24px", position: "relative", zIndex: 2 }}>
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", background: P.blanco, border: `1px solid ${P.dorado}50`, borderRadius: 100, padding: "8px 8px 8px 24px", maxWidth: 700, boxShadow: `0 8px 25px ${P.bordo}10` }}
          >
            <Search size={18} color={P.granate} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <input
              value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder="Ej: Desayuno sorpresa, regalo para aniversario..."
              style={{ flex: 1, border: "none", background: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", color: P.chocolate, outline: "none", marginLeft: 12 }}
            />
            <button type="submit" style={{ background: P.granate, color: P.blanco, border: "none", borderRadius: 100, padding: "12px 28px", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              Buscar <ArrowRight size={14} />
            </button>
          </motion.form>
        </div>

        {/* ── MINI BANNERS (Rediseño Premium) ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 32px", position: "relative", zIndex: 2 }}>
          <div className="mini-banners">
            {MINI_BANNERS.map((b, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 12px 30px ${P.granate}15`, borderColor: P.dorado }}
                onClick={() => router.push("/regalos")}
                style={{ background: P.blanco, borderRadius: 16, padding: "24px", cursor: "pointer", border: `1px solid ${P.beige}`, boxShadow: `0 4px 15px rgba(0,0,0,0.03)`, transition: "all 0.3s ease" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: 8, background: `${P.beige}60`, borderRadius: 10 }}>
                    <EmotiaIcon name={b.icon} size={18} color={P.granate} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.chocolate, textTransform: "uppercase", letterSpacing: "0.08em" }}>{b.tag}</span>
                </div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: P.bordo }}>{b.title}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── EXPLORA POR OCASIÓN (Rediseño Premium) ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 40px", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: P.bordo, marginBottom: 20 }}>Explora por ocasión</div>
          <div className="ocasiones-grid">
            {OCASIONES_HERO.map((o, i) => (
              <motion.div key={o.id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.7 + i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02, borderColor: P.dorado, boxShadow: `0 8px 20px ${P.granate}10` }}
                onClick={() => router.push("/regalos")}
                style={{ background: P.blanco, borderRadius: 16, overflow: "hidden", cursor: "pointer", textAlign: "center", border: `1px solid ${P.beige}`, transition: "all 0.3s ease", boxShadow: `0 2px 10px rgba(0,0,0,0.02)` }}
              >
                <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(to bottom, ${P.blanco}, ${P.beige}40)` }}>
                   <EmotiaIcon name={o.icon} size={32} color={P.granate} />
                </div>
                <div style={{ padding: "14px 8px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 800, color: P.chocolate, borderTop: `1px solid ${P.beige}50` }}>{o.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BARRA CONFIANZA ── */}
        <div style={{ background: P.blanco, borderTop: `1px solid ${P.beige}` }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
            {TRUST_ITEMS.map((item, i, arr) => (
              <div key={i} style={{ flex: "1 1 150px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 8px", borderRight: i < arr.length - 1 ? `1px solid ${P.beige}` : "none" }}>
                <EmotiaIcon name={item.icon} size={20} color={P.dorado} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 700, color: P.chocolate }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}