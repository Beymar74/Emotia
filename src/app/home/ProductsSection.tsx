"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, ArrowRight, Gift, Sparkles, Store
} from "lucide-react";
import { PRODUCTS, TESTIMONIALS } from "./constants";

export interface ProductItem {
  id: number | string;
  name: string;
  price: string | number;
  tag?: string;
  brand?: string;
  imgSrc?: string;
}

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const MAX_VISIBLE = 8;

// MOCK DE MARCAS/ALIADOS 
const PARTNERS = [
  "Chocolates El Ceibo", "Bodegas Kohlberg", "Café Typica", "Florería Edén",
  "Casa Real", "Artesanías Waliki", "La Francesa", "Gustu"
];

export default function ProductsSection({
  initialProducts,
  initialBrands
}: {
  initialProducts?: ProductItem[];
  initialBrands?: string[];
}) {
  const router = useRouter();
  
  const visibleProducts = initialProducts && initialProducts.length > 0 ? initialProducts.slice(0, MAX_VISIBLE) : PRODUCTS.slice(0, MAX_VISIBLE); 
  const marqueeItems = [...visibleProducts, ...visibleProducts];
  const marqueeTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]; 
  
  const visibleBrands = initialBrands && initialBrands.length > 0 ? initialBrands : PARTNERS;
  const marqueePartners = [...visibleBrands, ...visibleBrands, ...visibleBrands, ...visibleBrands]; 

  const STEPS = [
    { 
      num: "01", 
      badge: "DESCUBRE",
      color: P.dorado,
      icon: <Store size={26} color={P.dorado} strokeWidth={2}/>, 
      title: "Explora el catálogo", 
      desc: "Navega por nuestra selección de detalles creados por artesanos y marcas locales. Encuentra tu obsequio ideal filtrando por ocasión o categoría." 
    },
    { 
      num: "02", 
      badge: "CONECTA",
      color: P.carmesi,
      icon: <Sparkles size={26} color={P.carmesi} strokeWidth={2}/>, 
      title: "Usa nuestro Asesor IA",   
      desc: "¿No sabes qué elegir? Cuéntale a nuestra IA sobre esa persona especial y ella encontrará el match perfecto en segundos." 
    },
    { 
      num: "03", 
      badge: "EMOCIONA",
      color: P.granate,
      icon: <Gift size={26} color={P.granate} strokeWidth={2}/>, 
      title: "Personaliza y sorprende",        
      desc: "Dale tu toque único añadiendo una dedicatoria. Selecciona nuestro empaque premium y garantizamos una entrega segura hasta sus manos." 
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .steps-grid { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0; align-items: start; }
        @keyframes scroll-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-wrapper { overflow: hidden; width: 100%; position: relative; padding: 20px 0 40px; }
        .marquee-wrapper::before, .marquee-wrapper::after { content: ""; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .marquee-wrapper::before { left: 0; background: linear-gradient(to right, ${P.blanco}, transparent); }
        .marquee-wrapper::after { right: 0; background: linear-gradient(to left, ${P.blanco}, transparent); }
        .marquee-track { display: flex; gap: 24px; width: max-content; animation: scroll-marquee 40s linear infinite; }
        .marquee-track-slow { display: flex; gap: 24px; width: max-content; animation: scroll-marquee 50s linear infinite; }
        .marquee-track-partners { display: flex; gap: 24px; width: max-content; animation: scroll-marquee 50s linear infinite; }
        .marquee-track:hover, .marquee-track-slow:hover { animation-play-state: paused; }
        @media(max-width:860px) { .steps-grid { grid-template-columns: 1fr !important; gap: 40px; } .step-arrow { transform: rotate(90deg); padding: 10px 0 !important; justify-content: flex-start !important; padding-left: 30px !important; } }
      `}</style>

      {/* CARRUSEL INFINITO VITRINA */}
      <section id="productos" style={{ padding: "80px 0 20px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap", gap: 14 }}>
            <motion.div initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ width:24, height:2.5, background:P.dorado, borderRadius:2, display:"inline-block" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:800, color:P.dorado, letterSpacing:"0.2em", textTransform:"uppercase" }}>Selección Exclusiva</span>
              </div>
              <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight:900, color:P.bordo, margin:0, letterSpacing:"-0.02em" }}>Los más deseados</h2>
            </motion.div>
            <motion.button
              initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => router.push("/producto")}
              style={{ background:P.blanco, color:P.granate, border:`1.5px solid ${P.granate}40`, padding:"12px 24px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}
            >
              Ir al Catálogo <ArrowRight size={16} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeItems.map((p, index) => (
              <motion.div 
                key={`${p.id}-${index}`} whileHover={{ y:-8, borderColor: P.dorado }}
                style={{ flex: "0 0 300px", background:P.blanco, borderRadius:20, border:`1px solid ${P.beige}`, overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer", boxShadow: `0 10px 30px rgba(0,0,0,0.03)`, transition:"all 0.3s" }}
                onClick={() => router.push(`/producto/${p.id}`)}
              >
                <div style={{ position:"relative", height:300, overflow:"hidden" }}>
                  <img src={p.imgSrc} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }} onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.08)"; }} onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, ${P.bordo}90 0%, transparent 50%)` }} />
                  <span style={{ position:"absolute", top:16, left:16, background:P.blanco, color:P.granate, padding:"6px 12px", borderRadius:100, fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase", boxShadow:`0 4px 10px rgba(0,0,0,0.1)` }}>{p.tag}</span>
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:700, color:P.dorado, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom: 6 }}>{p.brand}</div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.3rem", fontWeight:800, color:P.blanco, lineHeight:1.2, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop: `1px solid rgba(255,255,255,0.2)`, paddingTop: 10 }}>
                      <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.1rem", fontWeight:800, color:P.beige }}>{p.price}</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:700, color:P.blanco, display:"flex", alignItems:"center", gap:4 }}>Descubrir <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NUESTROS ALIADOS */}
      <div style={{ padding: "40px 0 60px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 24 }}>
           <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight:800, color:P.gris, letterSpacing:"0.15em", textTransform:"uppercase" }}>Trabajamos con las mejores marcas y artesanos</h3>
        </div>
        <div className="marquee-wrapper" style={{ padding: "10px 0" }}>
           <div className="marquee-track-partners" style={{ alignItems: "center" }}>
             {marqueePartners.map((partnerName, index) => (
                <div key={`partner-${index}`} style={{ flex: "0 0 auto", padding: "0 40px", opacity: 0.4, filter: "grayscale(100%)", transition: "all 0.3s ease", cursor: "default" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "grayscale(0%)"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; e.currentTarget.style.filter = "grayscale(100%)"; }}>
                   <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: P.bordo, whiteSpace: "nowrap" }}>{partnerName}</span>
                </div>
             ))}
           </div>
        </div>
      </div>



      {/* CÓMO FUNCIONA (DISEÑO INFOGRÁFICO - 0% BOTONES) */}
      <div id="como-funciona" style={{ background:`${P.beige}30`, padding:"80px 24px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:80 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <span style={{ width:30, height:2, background:P.dorado, display:"inline-block" }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:800, color:P.dorado, letterSpacing:"0.2em", textTransform:"uppercase" }}>La Experiencia</span>
              <span style={{ width:30, height:2, background:P.dorado, display:"inline-block" }} />
            </div>
            <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight:900, color:P.bordo }}>El arte de regalar, en 3 pasos</h2>
          </motion.div>
          
          <div className="steps-grid">
            {STEPS.map((s,i) => (
              <React.Fragment key={s.num}>
                {/* Flujo infográfico directamente sobre el fondo (sin contenedor blanco) */}
                <motion.div 
                  initial={{ opacity:0, y:20 }} 
                  whileInView={{ opacity:1, y:0 }} 
                  viewport={{ once:true }} 
                  transition={{ delay:i*0.15, duration:0.5 }} 
                  style={{ 
                    position:"relative", 
                    padding:"0 20px", // Padding horizontal solo para espaciado
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1
                  } as React.CSSProperties}
                >
                  {/* Número gigante como marca de agua en el fondo */}
                  <div style={{ position:"absolute", top:-50, left:20, fontFamily:"'Montserrat',sans-serif", fontSize:"10rem", fontWeight:900, color:`${P.granate}08`, lineHeight:0.8, userSelect:"none", pointerEvents:"none", zIndex: -1 }}>
                    {s.num}
                  </div>
                  
                  {/* Icono encapsulado para destacar */}
                  <div style={{ width:64, height:64, borderRadius:20, background:P.blanco, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:`0 8px 24px ${s.color}15`, border:`1px solid ${s.color}20` }}>
                    {s.icon}
                  </div>

                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: s.color, letterSpacing: "0.15em", marginBottom: 12, display: "block" }}>
                    {s.badge}
                  </span>
                  
                  <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.4rem", fontWeight:800, color:P.bordo, marginBottom:16, lineHeight:1.2 }}>{s.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", color:P.chocolate, lineHeight:1.6, margin:0 }}>{s.desc}</p>
                </motion.div>

                {/* Flecha sutil sin el círculo tipo botón */}
                {i < 2 && (
                  <motion.div className="step-arrow" initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:i*0.15+0.3 }} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 10px", marginTop: "32px", zIndex: 1 }}>
                    <div style={{ color: `${P.granate}30` }}><ArrowRight size={40} strokeWidth={1}/></div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIOS INFINITOS (PRUEBA SOCIAL DE ALTA CONFIANZA) */}
      <div style={{ background: P.blanco, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 40 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 24, height: 2, background: P.dorado }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.dorado, letterSpacing: "0.15em", textTransform: "uppercase" }}>Experiencias Reales</span>
              <span style={{ width: 24, height: 2, background: P.dorado }} />
            </div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: P.bordo }}>Lo que dicen nuestros clientes</h2>
          </motion.div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-track-slow">
            {marqueeTestimonials.map((t, index) => (
              <motion.div
                key={`test-${index}`}
                whileHover={{ borderColor: P.dorado, boxShadow: `0 16px 35px ${P.granate}10`, y: -4 }}
                style={{
                  flex: "0 0 380px",
                  backgroundColor: P.blanco,
                  borderRadius: 24,
                  padding: "32px",
                  border: `1.5px solid ${P.beige}80`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  boxShadow: "0 8px 24px rgba(90, 15, 36, 0.02)"
                } as React.CSSProperties}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={P.dorado} color={P.dorado} />
                      ))}
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#16a34a",
                      backgroundColor: "#f0fdf4",
                      padding: "4px 10px",
                      borderRadius: 100,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M3 5l1.5 1.5L8.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Compra Verificada
                    </span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: P.chocolate, lineHeight: 1.65, fontStyle: "italic", marginBottom: 24 }}>
                    &quot;{t.text}&quot;
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${P.beige}50`, paddingTop: 16 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: P.blanco,
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    boxShadow: `0 4px 12px ${P.granate}20`
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: P.bordo, fontSize: "0.95rem" }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", color: P.gris, fontSize: "0.75rem", marginTop: 2 }}>
                      Cliente Satisfecho
                    </div>
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