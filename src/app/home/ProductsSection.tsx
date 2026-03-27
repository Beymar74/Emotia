"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import {
  ShoppingCart, Star, ArrowRight, ChevronLeft, ChevronRight,
  Sparkles, Tag, MessageCircle, Gift, Package,
} from "lucide-react";
import { C, PRODUCTS, CATS, OCASIONES, TESTIMONIALS } from "./constants";

export default function ProductsSection() {
  const router = useRouter();
  const [cat, setCat]         = useState("todos");
  const [ocasion, setOcasion] = useState("todas");
  const [added, setAdded]     = useState<number[]>([]);
  const [emblaRef, emblaApi]  = useEmblaCarousel({ loop: true, align: "start" });

  const MAX     = 8;
  const listAll = PRODUCTS.filter(p => {
    const catOk     = cat === "todos" || p.cat === cat;
    const ocasionOk = ocasion === "todas" || p.ocasiones.includes(ocasion);
    return catOk && ocasionOk;
  });
  const total = listAll.length;
  const list  = listAll.slice(0, MAX);

  const add = (id: number, name: string) => {
    if (added.includes(id)) return;
    setAdded(prev => [...prev, id]);
    toast.success(`¡${name} añadido!`, { description: "Revisa tu carrito.", icon: "🎁", duration: 2500 });
    setTimeout(() => setAdded(prev => prev.filter(x => x !== id)), 2500);
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const STEPS = [
    {
      num: "01",
      icon: <MessageCircle size={26} color={C.garnet} strokeWidth={1.8} />,
      title: "Cuéntanos la historia",
      desc: "Dinos para quién es el regalo, qué celebran y tu presupuesto. La IA se encarga del resto.",
    },
    {
      num: "02",
      icon: <Sparkles size={26} color={C.garnet} strokeWidth={1.8} />,
      title: "La IA encuentra el match",
      desc: "En segundos analizamos el catálogo completo y seleccionamos las opciones más significativas.",
    },
    {
      num: "03",
      icon: <Gift size={26} color={C.garnet} strokeWidth={1.8} />,
      title: "Sorprende de verdad",
      desc: "Elige tu favorito y lo entregamos con empaque premium y tarjeta dedicatoria incluida.",
    },
  ];

  return (
    <section id="productos" style={{ padding: "80px 0 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>

        {/* ── CABECERA ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 28, height: 2.5, background: `linear-gradient(90deg,${C.garnet},${C.gold})`, borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>Catálogo Emotia</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 900, color: C.bordeaux, margin: 0 }}>
              Regalos para cada ocasión
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: C.gray, marginTop: 6 }}>
              {total} producto{total !== 1 ? "s" : ""} · Envío a toda Bolivia
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/regalos")}
            style={{ background: C.beige, color: C.bordeaux, border: `1.5px solid rgba(90,15,36,0.2)`, padding: "11px 26px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.bordeaux; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.beige; e.currentTarget.style.color = C.bordeaux; }}
          >
            Ver todo el catálogo <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* ── FILTRO OCASIÓN ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Tag size={13} color={C.garnet} strokeWidth={2.5} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.garnet, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ocasión</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {OCASIONES.map((o, i) => (
              <motion.button key={o.id}
                initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setOcasion(o.id)}
                style={{
                  background: ocasion === o.id ? `linear-gradient(135deg,${C.garnet},${C.crimson})` : "white",
                  color: ocasion === o.id ? "white" : C.choco,
                  border: `1.5px solid ${ocasion === o.id ? "transparent" : "rgba(188,153,104,0.28)"}`,
                  padding: "7px 14px", borderRadius: 100,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.82rem",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                  boxShadow: ocasion === o.id ? "0 3px 12px rgba(142,27,58,0.22)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {o.emoji} {o.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── FILTRO CATEGORÍA ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.1em" }}>Categoría</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {CATS.map((c, i) => (
              <motion.button key={c.id}
                initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setCat(c.id)}
                style={{
                  background: cat === c.id ? `linear-gradient(135deg,${C.bordeaux},${C.garnet})` : "white",
                  color: cat === c.id ? "white" : C.choco,
                  border: `1.5px solid ${cat === c.id ? "transparent" : "rgba(188,153,104,0.28)"}`,
                  padding: "8px 18px", borderRadius: 100,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                  boxShadow: cat === c.id ? "0 4px 14px rgba(90,15,36,0.22)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {c.emoji} {c.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── GRID PRODUCTOS ── */}
        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", color: C.bordeaux, marginBottom: 8 }}>Sin resultados</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", color: C.gray, fontSize: "0.95rem" }}>Prueba con otra categoría u ocasión.</p>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setCat("todos"); setOcasion("todas"); }}
                style={{ marginTop: 20, background: C.bordeaux, color: "white", border: "none", padding: "11px 24px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, cursor: "pointer" }}>
                Ver todos los regalos
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key={`${cat}-${ocasion}`}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(285px,1fr))", gap: 24 }}
            >
              {list.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as any }}
                  whileHover={{ y: -5, boxShadow: "0 20px 48px rgba(90,15,36,0.12)" }}
                  style={{ background: "white", borderRadius: 22, border: "1px solid rgba(188,153,104,0.15)", overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ position: "relative", height: 200, overflow: "hidden", background: p.bg }}>
                    <img src={p.image} alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)" }} />
                    <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.95)", color: p.tagC, border: `1px solid ${p.tagC}22`, padding: "4px 10px", borderRadius: 8, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.04em" }}>
                      {p.tag}
                    </span>
                  </div>
                  <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{p.brand}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 800, color: C.bordeaux, lineHeight: 1.2, marginBottom: 6 }}>{p.name}</div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", color: C.gray, lineHeight: 1.6, marginBottom: 10, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                      {p.ocasiones.slice(0, 3).map(oc => {
                        const ocData = OCASIONES.find(o => o.id === oc);
                        return ocData ? (
                          <span key={oc} style={{ background: "rgba(188,153,104,0.1)", color: C.choco, fontSize: "0.62rem", fontWeight: 600, padding: "2px 8px", borderRadius: 100, border: "1px solid rgba(188,153,104,0.2)" }}>
                            {ocData.emoji} {ocData.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={C.gold} color={C.gold} />)}
                      </div>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: C.choco }}>{p.rating}</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem", color: C.gray }}>({p.rev})</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.35rem", fontWeight: 900, color: C.garnet }}>{p.price}</span>
                        {p.old && <span style={{ fontSize: "0.78rem", color: C.gray, textDecoration: "line-through", marginLeft: 6 }}>{p.old}</span>}
                      </div>
                      <motion.button whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
                        onClick={() => add(p.id, p.name)}
                        style={{
                          background: added.includes(p.id) ? "#16a34a" : `linear-gradient(135deg,${C.garnet},${C.bordeaux})`,
                          color: "white", border: "none", padding: "9px 18px", borderRadius: 100,
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.82rem",
                          cursor: "pointer", boxShadow: "0 3px 12px rgba(90,15,36,0.22)",
                          display: "flex", alignItems: "center", gap: 6, transition: "background 0.3s",
                        }}
                      >
                        {added.includes(p.id)
                          ? <><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span> Añadido</>
                          : <><ShoppingCart size={13} strokeWidth={2.5} /> Añadir</>
                        }
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── VER MÁS ── */}
        {total > MAX && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 44 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: C.gray }}>
              Mostrando 8 de {total} productos disponibles
            </p>
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/regalos")}
              style={{ background: `linear-gradient(135deg,${C.bordeaux},${C.garnet})`, color: "white", border: "none", padding: "15px 40px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 8px 28px rgba(90,15,36,0.3)" }}>
              Ver todos los regalos <ArrowRight size={17} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── CÓMO FUNCIONA ── */}
      {/* ══════════════════════════════════════════════ */}
      <div id="como-funciona" style={{ background: C.beige, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 24, height: 2, background: C.gold, borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>El proceso</span>
              <span style={{ width: 24, height: 2, background: C.gold, borderRadius: 2, display: "inline-block" }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 900, color: C.bordeaux }}>
              3 pasos hacia el regalo perfecto
            </h2>
          </motion.div>

          {/* PASOS CON FLECHAS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0, alignItems: "center" }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any }}
                  whileHover={{ y: -6, boxShadow: "0 24px 52px rgba(90,15,36,0.1)" }}
                  style={{ background: "white", borderRadius: 24, padding: "36px 28px", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(90,15,36,0.06)", border: "1px solid rgba(188,153,104,0.15)", transition: "box-shadow 0.3s" }}
                >
                  {/* Número gigante decorativo de fondo */}
                  <div style={{ position: "absolute", top: -10, right: 12, fontFamily: "'Playfair Display',serif", fontSize: "8rem", fontWeight: 900, color: `${C.garnet}07`, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                    {s.num}
                  </div>

                  {/* Ícono + número prominente */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg,${C.garnet}12,${C.gold}18)`, border: `1.5px solid ${C.garnet}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "3.2rem", fontWeight: 900, color: C.garnet, lineHeight: 1, letterSpacing: "-0.05em" }}>
                      {s.num}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.22rem", fontWeight: 800, color: C.bordeaux, marginBottom: 10, lineHeight: 1.25 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: C.gray, lineHeight: 1.7, margin: 0 }}>
                    {s.desc}
                  </p>
                </motion.div>

                {/* Flecha entre pasos */}
                {i < 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.18 + 0.38, duration: 0.4, type: "spring", stiffness: 200 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px" }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${C.garnet},${C.bordeaux})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(90,15,36,0.28)", flexShrink: 0 }}>
                      <ArrowRight size={21} color="white" strokeWidth={2.5} />
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile: columna simple */}
          <style>{`
            @media(max-width:860px){
              #como-funciona [style*="grid-template-columns: 1fr auto 1fr auto 1fr"]{
                grid-template-columns: 1fr !important;
              }
              #como-funciona [style*="padding: 0 18px"]{
                transform: rotate(90deg);
                padding: 12px 0 !important;
              }
            }
          `}</style>
        </div>
      </div>

      {/* ── TESTIMONIOS ── */}
      <div style={{ background: C.white, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 900, color: C.bordeaux }}>
              Lo que dicen nuestros clientes
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollPrev}
                style={{ width: 42, height: 42, borderRadius: "50%", background: C.beige, border: `1.5px solid rgba(90,15,36,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.bordeaux }}>
                <ChevronLeft size={19} strokeWidth={2.5} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollNext}
                style={{ width: 42, height: 42, borderRadius: "50%", background: C.bordeaux, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                <ChevronRight size={19} strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
          <div ref={emblaRef} style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 22 }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} style={{ flex: "0 0 min(380px,85vw)", background: C.beige, borderRadius: 22, padding: "28px 26px", border: "1px solid rgba(188,153,104,0.18)" }}>
                  <div style={{ fontSize: "2.2rem", color: C.gold, opacity: 0.45, lineHeight: 1, marginBottom: 10, fontFamily: "Georgia,serif" }}>"</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.96rem", color: C.choco, lineHeight: 1.7, fontStyle: "italic", marginBottom: 22 }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: C.bordeaux, fontSize: "0.9rem" }}>{t.name}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={C.gold} color={C.gold} />)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BANNER IA ── */}
      <div style={{ padding: "0 32px 80px", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 28, background: `linear-gradient(135deg,${C.bordeaux} 0%,${C.garnet} 55%,#AB3A50 100%)`, padding: "52px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 36, flexWrap: "wrap", position: "relative", overflow: "hidden", boxShadow: "0 24px 56px rgba(90,15,36,0.25)" }}>
            <div style={{ position: "absolute", top: -56, right: -56, width: 240, height: 240, borderRadius: "50%", border: "60px solid rgba(255,255,255,0.04)" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={13} /> Inteligencia Artificial
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: "white", marginBottom: 10, lineHeight: 1.15 }}>
                ¿No sabes qué regalar?
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.96rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, maxWidth: 460 }}>
                Cuéntale a nuestra IA para quién es el regalo y en 2 minutos tiene el match perfecto — personalidad, ocasión y presupuesto considerados.
              </p>
            </div>
            <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/registro")}
                style={{ background: "white", color: C.bordeaux, border: "none", padding: "17px 36px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 10px 32px rgba(0,0,0,0.18)" }}>
                Encontrar mi regalo ideal <ArrowRight size={17} strokeWidth={2.5} />
              </motion.button>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 9 }}>Gratis · Sin registro obligatorio</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
