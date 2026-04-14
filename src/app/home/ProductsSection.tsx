"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import { EmotiaIcon } from "./EmotiaIcon";
import {
  Star, ArrowRight, ChevronLeft, ChevronRight,
  Sparkles, MessageCircle, Gift
} from "lucide-react";
import { PRODUCTS, CAT_GRID, OFERTAS, TESTIMONIALS } from "./constants";

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

export default function ProductsSection() {
  const router = useRouter();
  const [added, setAdded] = useState<number[]>([]);
  
  // Carrusel SOLAMENTE para testimonios ahora
  const [emblaRefTest, emblaApiTest] = useEmblaCarousel({ loop: true, align: "start" });

  const visibleProducts = PRODUCTS.slice(0, MAX_VISIBLE); 
  // Duplicamos el arreglo para crear el efecto de bucle infinito perfecto
  const marqueeItems = [...visibleProducts, ...visibleProducts];

  const scrollPrevTest = useCallback(() => emblaApiTest?.scrollPrev(), [emblaApiTest]);
  const scrollNextTest = useCallback(() => emblaApiTest?.scrollNext(), [emblaApiTest]);

  const STEPS = [
    { num:"01", icon:<MessageCircle size={24} color={P.granate} strokeWidth={1.5}/>, title:"Cuéntanos la historia",      desc:"Dinos para quién es el regalo, qué celebran y tu presupuesto. La IA hace el resto." },
    { num:"02", icon:<Sparkles      size={24} color={P.granate} strokeWidth={1.5}/>, title:"La IA encuentra el match",   desc:"En segundos analizamos el catálogo y seleccionamos las opciones más significativas." },
    { num:"03", icon:<Gift          size={24} color={P.granate} strokeWidth={1.5}/>, title:"Sorprende de verdad",        desc:"Elige tu favorito y lo entregamos con empaque premium y tarjeta dedicatoria incluida." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        .cat-display-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
        .ofertas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
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

        /* Degradados a los lados para efecto "aparición/desaparición" */
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

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-marquee 40s linear infinite; /* Animación constante sin pausas */
        }

        /* Estilos Embla para Testimonios */
        .embla { overflow: hidden; width: 100%; padding: 10px 0 30px; }
        .embla__container { display: flex; gap: 24px; margin-left: 1rem; }
        .embla__slide_test { flex: 0 0 min(380px, 85vw); min-width: 0; }

        @media(max-width:860px) { .steps-grid { grid-template-columns: 1fr !important; gap: 20px; } .step-arrow { transform: rotate(90deg); padding: 10px 0 !important; } }
        @media(max-width:640px) { .cat-display-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* ══════════════════════════
          NUEVO CARRUSEL INFINITO VITRINA
      ══════════════════════════ */}
      <section id="productos" style={{ padding: "80px 0 20px", background: P.blanco }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>

          {/* Cabecera */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap", gap: 14 }}>
            <motion.div initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ width:24, height:2.5, background:P.dorado, borderRadius:2, display:"inline-block" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:800, color:P.dorado, letterSpacing:"0.2em", textTransform:"uppercase" }}>Selección Exclusiva</span>
              </div>
              <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight:900, color:P.bordo, margin:0, letterSpacing:"-0.02em" }}>
                Los más deseados
              </h2>
            </motion.div>
            
            <motion.button
              initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => router.push("/regalos")}
              style={{ background:P.blanco, color:P.granate, border:`1.5px solid ${P.granate}40`, padding:"12px 24px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}
            >
              Ir al Catálogo <ArrowRight size={16} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Carrusel Infinito (Funciona como un botón gigante hacia el catálogo) */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeItems.map((p, index) => (
              <motion.div 
                key={`${p.id}-${index}`} 
                whileHover={{ y:-8, borderColor: P.dorado }}
                style={{ flex: "0 0 300px", background:P.blanco, borderRadius:20, border:`1px solid ${P.beige}`, overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer", boxShadow: `0 10px 30px rgba(0,0,0,0.03)`, transition:"all 0.3s" }}
                onClick={() => router.push("/regalos")} // Todo el bloque te manda al catálogo
              >
                <div style={{ position:"relative", height:300, overflow:"hidden" }}>
                  <img src={p.imgSrc} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.08)"; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
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

      {/* ══════════════════════════
          TODAS LAS CATEGORÍAS
      ══════════════════════════ */}
      <div style={{ background:P.beige + "40", padding:"80px 24px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:32, textAlign: "center" }}>
            <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3vw, 2.4rem)", fontWeight:900, color:P.bordo }}>Explora por Categoría</h2>
          </motion.div>
          <div className="cat-display-grid">
            {CAT_GRID.map((c,i) => (
              <motion.div key={c.id}
                initial={{ opacity:0, scale:0.92 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                whileHover={{ y:-6, scale:1.03, borderColor: P.dorado, boxShadow: `0 12px 24px ${P.granate}15` }}
                onClick={() => router.push("/regalos")}
                style={{ background:P.blanco, borderRadius:16, padding:"24px 12px", textAlign:"center", cursor:"pointer", border:`1px solid ${P.beige}`, transition:"all 0.3s ease", boxShadow: `0 4px 10px rgba(0,0,0,0.02)` }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <div style={{ padding: 12, background: `${P.beige}60`, borderRadius: "50%" }}>
                    <EmotiaIcon name={c.icon} size={28} color={P.granate} />
                  </div>
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", fontWeight:800, color:P.chocolate, marginBottom:4 }}>{c.label}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:P.gris, fontWeight: 600 }}>{c.count} opciones</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          OFERTAS DEL DÍA
      ══════════════════════════ */}
      <div style={{ background:P.blanco, padding:"80px 24px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ width:24, height:2.5, background:P.carmesi, borderRadius:2, display:"inline-block" }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:800, color:P.carmesi, letterSpacing:"0.2em", textTransform:"uppercase" }}>Tiempo Limitado</span>
            </div>
            <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3vw, 2.4rem)", fontWeight:900, color:P.bordo, marginBottom:4 }}>Privilegios de Hoy</h2>
          </motion.div>
          
          <div className="ofertas-grid">
            {OFERTAS.map((o,i) => (
              <motion.div key={o.id}
                initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                whileHover={{ y:-6, boxShadow:`0 16px 40px ${P.granate}15` }}
                style={{ background:P.blanco, borderRadius:16, overflow:"hidden", border:`1px solid ${P.beige}`, cursor:"pointer", position:"relative", transition: "all 0.3s ease" }}
                onClick={() => router.push(`/producto/${o.id}`)} // Mantenemos link a producto individual aquí porque son ofertas específicas
              >
                <div style={{ position:"absolute", top:12, left:12, background:P.carmesi, color:P.blanco, fontSize:"0.75rem", fontWeight:800, padding:"4px 12px", borderRadius:100, zIndex:2, boxShadow:`0 4px 10px ${P.carmesi}40` }}>{o.pct}</div>
                <div style={{ height:180, overflow:"hidden", position:"relative" }}>
                  <img src={o.imgSrc} alt={o.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.08)"; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                </div>
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.1rem", fontWeight:800, color:P.bordo, marginBottom:8, lineHeight:1.25 }}>{o.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.3rem", fontWeight:900, color:P.granate }}>{o.newPrice}</span>
                    <span style={{ fontSize:"0.85rem", color:P.gris, textDecoration:"line-through" }}>{o.oldPrice}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          BANNER IA (Rediseño Lujo)
      ══════════════════════════ */}
      <div style={{ padding:"0 24px 80px", background:P.blanco }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ borderRadius:24, background:`linear-gradient(135deg, ${P.bordo} 0%, ${P.granate} 100%)`, padding:"56px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap", position:"relative", overflow:"hidden", boxShadow:`0 24px 60px ${P.bordo}30` }}>
            
            {/* Decoraciones abstractas fondo */}
            <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", border:`40px solid ${P.blanco}05` }} />
            <div style={{ position:"absolute", bottom:-40, left:20, width:150, height:150, borderRadius:"50%", border:`20px solid ${P.dorado}10` }} />
            
            <div style={{ position:"relative", zIndex:2, maxWidth: 600 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:800, color:P.dorado, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                <Sparkles size={14} strokeWidth={2} /> Inteligencia Artificial
              </div>
              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight:900, color:P.blanco, marginBottom:16, lineHeight:1.15 }}>
                ¿Sin ideas?<br/>Deja que la magia actúe.
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1.05rem", color:`${P.beige}90`, lineHeight:1.6 }}>
                Cuéntale a nuestra IA para quién es el detalle y en segundos diseñará la opción perfecta. Personalidad, ocasión y presupuesto, todo calculado a la perfección.
              </p>
            </div>
            
            <div style={{ position:"relative", zIndex:2, flexShrink:0 }}>
              <motion.button whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.97 }}
                onClick={() => router.push("/registro")}
                style={{ background:P.dorado, color:P.bordo, border:"none", padding:"18px 36px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"1.05rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:`0 12px 30px ${P.dorado}40` }}>
                Consultar al Asesor <ArrowRight size={18} strokeWidth={2}/>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════
          CÓMO FUNCIONA (Rediseño Lujo)
      ══════════════════════════ */}
      <div id="como-funciona" style={{ background:`${P.beige}30`, padding:"80px 24px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:56 }}>
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
                <motion.div
                  initial={{ opacity:0, y:26 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.15, duration:0.5 }}
                  whileHover={{ y:-8, boxShadow:`0 24px 50px ${P.granate}10` }}
                  style={{ background:P.blanco, borderRadius:24, padding:"40px 32px", position:"relative", overflow:"hidden", border:`1px solid ${P.beige}`, transition:"all 0.3s ease" }}
                >
                  <div style={{ position:"absolute", top:-10, right:-10, fontFamily:"'Montserrat',sans-serif", fontSize:"8rem", fontWeight:900, color:`${P.granate}08`, lineHeight:1, userSelect:"none", pointerEvents:"none" }}>{s.num}</div>
                  
                  <div style={{ width:56, height:56, borderRadius:16, background:`${P.beige}60`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                    {s.icon}
                  </div>
                  
                  <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"1.2rem", fontWeight:800, color:P.bordo, marginBottom:12, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.95rem", color:P.chocolate, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </motion.div>
                
                {i < 2 && (
                  <motion.div className="step-arrow"
                    initial={{ opacity:0, scale:0.4 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.15+0.3, type:"spring", stiffness:200 }}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}
                  >
                    <div style={{ width:48, height:48, borderRadius:"50%", background:P.blanco, border:`1.5px solid ${P.dorado}50`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 20px ${P.dorado}15`, color: P.dorado }}>
                      <ArrowRight size={20} strokeWidth={2}/>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          TESTIMONIOS (Rediseño Lujo)
      ══════════════════════════ */}
      <div style={{ background:P.blanco, padding:"80px 24px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40, flexWrap:"wrap", gap:16 }}>
            <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(1.8rem, 3vw, 2.4rem)", fontWeight:900, color:P.bordo }}>Memorias inolvidables</h2>
            <div style={{ display:"flex", gap:12 }}>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={scrollPrevTest}
                style={{ width:48, height:48, borderRadius:"50%", background:P.blanco, border:`1.5px solid ${P.beige}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:P.granate, boxShadow:`0 4px 10px ${P.granate}10` }}>
                <ChevronLeft size={20} strokeWidth={2}/>
              </motion.button>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={scrollNextTest}
                style={{ width:48, height:48, borderRadius:"50%", background:P.granate, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:P.blanco, boxShadow:`0 4px 10px ${P.granate}30` }}>
                <ChevronRight size={20} strokeWidth={2}/>
              </motion.button>
            </div>
          </motion.div>
          
          <div className="embla" ref={emblaRefTest}>
            <div className="embla__container">
              {[...TESTIMONIALS,...TESTIMONIALS].map((t,i) => (
                <div key={i} className="embla__slide_test" style={{ background:`${P.beige}20`, borderRadius:24, padding:"32px", border:`1px solid ${P.beige}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                      {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={P.dorado} color={P.dorado} />)}
                    </div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1.05rem", color:P.chocolate, lineHeight:1.7, fontStyle:"italic", marginBottom:24 }}>"{t.text}"</p>
                  </div>
                  
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:P.bordo, display:"flex", alignItems:"center", justifyContent:"center", color:P.blanco, fontWeight:800, fontSize:"1.1rem" }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, color:P.bordo, fontSize:"0.95rem" }}>{t.name}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", color:P.gris, fontSize:"0.8rem", marginTop: 2 }}>Cliente Verificado</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}