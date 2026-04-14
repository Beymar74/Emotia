"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import { EmotiaIcon } from "./EmotiaIcon";
import {
  ShoppingCart, Star, ArrowRight, ChevronLeft, ChevronRight,
  Sparkles, MessageCircle, Gift, Search, Tag, Check
} from "lucide-react";
import { C, PRODUCTS, CATS, OCASIONES, CAT_GRID, OFERTAS, TESTIMONIALS } from "./constants";

const MAX_VISIBLE = 8;

export default function ProductsSection() {
  const router = useRouter();
  const [cat, setCat]         = useState("todos");
  const [ocasion, setOcasion] = useState("todas");
  const [search, setSearch]   = useState("");
  const [added, setAdded]     = useState<number[]>([]);
  const [emblaRef, emblaApi]  = useEmblaCarousel({ loop: true, align: "start" });

  const filtered = PRODUCTS.filter(p => {
    const catOk     = cat === "todos" || p.category === cat;
    const ocasionOk = ocasion === "todas" || p.ocasiones.includes(ocasion);
    const searchOk  = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return catOk && ocasionOk && searchOk;
  });
  const visible = filtered.slice(0, MAX_VISIBLE);

  const addToCart = (id: number, name: string) => {
    if (added.includes(id)) return;
    setAdded(prev => [...prev, id]);
    // Notificación elegante con ícono vectorial en lugar de emoji
    toast.success(`¡${name} añadido!`, { 
      description: "Revisa tu carrito.", 
      icon: <Gift size={16} color={C.garnet} strokeWidth={1.5} />, 
      duration: 2500 
    });
    setTimeout(() => setAdded(prev => prev.filter(x => x !== id)), 2500);
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const STEPS = [
    { num:"01", icon:<MessageCircle size={24} color={C.garnet} strokeWidth={1.5}/>, title:"Cuéntanos la historia",      desc:"Dinos para quién es el regalo, qué celebran y tu presupuesto. La IA hace el resto." },
    { num:"02", icon:<Sparkles      size={24} color={C.garnet} strokeWidth={1.5}/>, title:"La IA encuentra el match",   desc:"En segundos analizamos el catálogo y seleccionamos las opciones más significativas." },
    { num:"03", icon:<Gift          size={24} color={C.garnet} strokeWidth={1.5}/>, title:"Sorprende de verdad",        desc:"Elige tu favorito y lo entregamos con empaque premium y tarjeta dedicatoria incluida." },
  ];

  return (
    <>
      <style>{`
        .prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
        .cat-display-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
        .ofertas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
        .steps-grid{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:0;align-items:center}
        @media(max-width:860px){.steps-grid{grid-template-columns:1fr!important}.step-arrow{transform:rotate(90deg);padding:10px 0!important}}
        @media(max-width:640px){.cat-display-grid{grid-template-columns:repeat(3,1fr)!important}}
      `}</style>

      {/* ══════════════════════════
          CATÁLOGO
      ══════════════════════════ */}
      <section id="productos" style={{ padding: "64px 0 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 64px" }}>

          {/* Cabecera */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
            <motion.div initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span style={{ width:24, height:2.5, background:`linear-gradient(90deg,${C.garnet},${C.gold})`, borderRadius:2, display:"inline-block" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:700, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase" }}>Catálogo Emotia</span>
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.7rem,3vw,2.4rem)", fontWeight:900, color:C.garnet, margin:0 }}>Los más regalados esta semana</h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.gray, marginTop:4 }}>{filtered.length} productos · Favoritos de La Paz · Emotia recomienda</p>
            </motion.div>
            <motion.button
              initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              onClick={() => router.push("/producto")}
              style={{ background:C.roseLight, color:C.garnet, border:`1.5px solid rgba(198,40,79,0.2)`, padding:"10px 22px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.86rem", cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.garnet; e.currentTarget.style.color="white"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=C.roseLight; e.currentTarget.style.color=C.garnet; }}
            >
              Ver todo el catálogo <ArrowRight size={15} strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Buscador */}
          <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, background:C.cream, border:`1.5px solid rgba(255,209,179,0.6)`, borderRadius:100, padding:"9px 18px", maxWidth:420 }}>
              <Search size={15} color={C.garnet} strokeWidth={1.5} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar regalos, marcas..."
                style={{ flex:1, background:"none", border:"none", outline:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"0.87rem", color:C.choco }} />
            </div>
          </motion.div>

          {/* Filtro ocasión */}
          <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
              <Tag size={12} color={C.garnet} strokeWidth={1.5} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:700, color:C.garnet, textTransform:"uppercase", letterSpacing:"0.1em" }}>Ocasión</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {OCASIONES.map((o,i) => (
                <motion.button key={o.id}
                  initial={{ opacity:0, scale:0.88 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.035 }}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  onClick={() => setOcasion(o.id)}
                  style={{ background:ocasion===o.id?`linear-gradient(135deg,${C.garnet},${C.crimson})`:"white", color:ocasion===o.id?"white":C.choco, border:`1.5px solid ${ocasion===o.id?"transparent":"rgba(255,209,179,0.6)"}`, padding:"6px 13px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.81rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:ocasion===o.id?"0 3px 12px rgba(198,40,79,0.25)":"none", transition:"all 0.2s" }}
                >
                  <EmotiaIcon name={o.icon} size={14} color={ocasion===o.id ? "white" : C.garnet} /> {o.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Filtro categoría */}
          <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:700, color:C.gray, textTransform:"uppercase", letterSpacing:"0.1em" }}>Categoría</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {CATS.map((c,i) => (
                <motion.button key={c.id}
                  initial={{ opacity:0, scale:0.88 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.04 }}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  onClick={() => setCat(c.id)}
                  style={{ background:cat===c.id?`linear-gradient(135deg,${C.garnet},${C.rose})`:"white", color:cat===c.id?"white":C.choco, border:`1.5px solid ${cat===c.id?"transparent":"rgba(255,209,179,0.6)"}`, padding:"7px 17px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.84rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:cat===c.id?"0 4px 14px rgba(198,40,79,0.25)":"none", transition:"all 0.2s" }}
                >
                  <EmotiaIcon name={c.icon} size={14} color={cat===c.id ? "white" : C.choco} /> {c.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Grid productos */}
          <AnimatePresence mode="wait">
            {visible.length === 0 ? (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign:"center", padding:"56px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <Search size={48} strokeWidth={1.5} color={C.gray} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.35rem", color:C.garnet, marginBottom:7 }}>Sin resultados</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.gray, fontSize:"0.93rem" }}>Prueba con otra categoría u ocasión.</p>
                <motion.button whileHover={{ scale:1.04 }} onClick={() => { setCat("todos"); setOcasion("todas"); setSearch(""); }}
                  style={{ marginTop:18, background:C.garnet, color:"white", border:"none", padding:"10px 22px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:"0.9rem" }}>
                  Ver todos los regalos
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key={`${cat}-${ocasion}-${search}`}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:0.28 }}
                className="prod-grid"
              >
                {visible.map((p,i) => (
                  <motion.div key={p.id}
                    initial={{ opacity:0, y:22, scale:0.96 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    transition={{ duration:0.38, delay:i*0.05, ease:[0.22,1,0.36,1] as any }}
                    whileHover={{ y:-5, boxShadow:"0 18px 44px rgba(198,40,79,0.1)" }}
                    style={{ background:"white", borderRadius:18, border:"1px solid rgba(255,209,179,0.35)", overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer" }}
                    onClick={() => router.push(`/producto/${p.id}`)}
                  >
                    <div style={{ position:"relative", height:180, overflow:"hidden" }}>
                      <img
                        src={p.imgSrc}
                        alt={p.name}
                        style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s ease" }}
                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.08) 0%,transparent 45%)" }} />
                      <span style={{ position:"absolute", top:10, left:10, background:"rgba(255,255,255,0.96)", color:p.tagColor, border:`1px solid ${p.tagColor}22`, padding:"3px 9px", borderRadius:7, fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.04em" }}>{p.tag}</span>
                    </div>
                    <div style={{ padding:"13px 15px 15px", flex:1, display:"flex", flexDirection:"column" }}>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, color:C.gray, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2 }}>{p.brand}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:800, color:C.garnet, lineHeight:1.2, marginBottom:5 }}>{p.name}</div>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:C.gray, lineHeight:1.6, marginBottom:9, flex:1 }}>{p.description}</p>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:9 }}>
                        {p.ocasiones.slice(0,3).map(oc => {
                          const ocData = OCASIONES.find(o => o.id === oc);
                          return ocData ? (
                            <span key={oc} style={{ display: "flex", alignItems: "center", gap: 3, background:C.roseLight, color:C.garnet, fontSize:"0.59rem", fontWeight:600, padding:"2px 7px", borderRadius:100, border:`1px solid rgba(198,40,79,0.14)` }}>
                              <EmotiaIcon name={ocData.icon} size={10} color={C.garnet} /> {ocData.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:10 }}>
                        <div style={{ display:"flex", gap:1 }}>{[...Array(5)].map((_,i) => <Star key={i} size={10} fill={C.gold} color={C.gold} strokeWidth={1.5} />)}</div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.76rem", fontWeight:700, color:C.choco }}>{p.rating}</span>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:C.gray }}>({p.reviews})</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.25rem", fontWeight:900, color:C.garnet }}>{p.price}</span>
                          {p.old && <span style={{ fontSize:"0.76rem", color:C.gray, textDecoration:"line-through", marginLeft:5 }}>{p.old}</span>}
                        </div>
                        <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                          onClick={e=>{ e.stopPropagation(); addToCart(p.id, p.name); }}
                          style={{ background:added.includes(p.id)?"#22c55e":`linear-gradient(135deg,${C.garnet},${C.crimson})`, color:"white", border:"none", padding:"8px 15px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.8rem", cursor:"pointer", boxShadow:"0 3px 12px rgba(198,40,79,0.22)", display:"flex", alignItems:"center", gap:5, transition:"background 0.3s" }}
                        >
                          {added.includes(p.id) ? <><motion.span initial={{ scale:0 }} animate={{ scale:1 }}><Check size={12} strokeWidth={2} /></motion.span> Añadido</> : <><ShoppingCart size={12} strokeWidth={1.5}/> Añadir</>}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length > MAX_VISIBLE && (
            <motion.div initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginTop:36 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.86rem", color:C.gray }}>Mostrando {MAX_VISIBLE} de {filtered.length} productos</p>
              <motion.button whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}
                onClick={() => router.push("/producto")}
                style={{ background:`linear-gradient(135deg,${C.garnet},${C.crimson})`, color:"white", border:"none", padding:"13px 36px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.98rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 26px rgba(198,40,79,0.3)" }}>
                Ver todos los regalos <ArrowRight size={16} strokeWidth={1.5}/>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* ══════════════════════════
            TODAS LAS CATEGORÍAS
        ══════════════════════════ */}
        <div style={{ background:C.cream, padding:"56px 24px" }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,2.5vw,2.1rem)", fontWeight:900, color:C.garnet }}>Descubre todas las categorías</h2>
            </motion.div>
            <div className="cat-display-grid">
              {CAT_GRID.map((c,i) => (
                <motion.div key={c.id}
                  initial={{ opacity:0, scale:0.92 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                  whileHover={{ y:-4, scale:1.04 }}
                  onClick={() => { setCat(c.id); document.getElementById("productos")?.scrollIntoView({ behavior:"smooth" }); }}
                  style={{ background:c.bg, borderRadius:12, padding:"18px 10px", textAlign:"center", cursor:"pointer", border:"1.5px solid transparent", transition:"border-color 0.2s" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.borderColor="#FFD1B3"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.borderColor="transparent"; }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <EmotiaIcon name={c.icon} size={32} color={C.garnet} />
                  </div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", fontWeight:700, color:C.choco, marginBottom:2 }}>{c.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:C.gray }}>{c.count} productos</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            OFERTAS DEL DÍA
        ══════════════════════════ */}
        <div style={{ background:C.white, padding:"56px 24px" }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:8 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,2.5vw,2.1rem)", fontWeight:900, color:C.garnet, marginBottom:4 }}>Las mejores ofertas de hoy</h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.87rem", color:C.gray }}>Solo por hoy · Cantidades limitadas</p>
            </motion.div>
            <div className="ofertas-grid" style={{ marginTop:20 }}>
              {OFERTAS.map((o,i) => (
                <motion.div key={o.id}
                  initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  whileHover={{ y:-4, boxShadow:"0 12px 32px rgba(198,40,79,0.1)" }}
                  style={{ background:"white", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,209,179,0.4)", cursor:"pointer", position:"relative" }}
                  onClick={() => router.push(`/producto/${o.id}`)}
                >
                  <div style={{ position:"absolute", top:10, left:10, background:C.garnet, color:"white", fontSize:"0.72rem", fontWeight:800, padding:"3px 10px", borderRadius:100, zIndex:2 }}>{o.pct}</div>
                  <div style={{ height:120, overflow:"hidden", position:"relative" }}>
                    <img src={o.imgSrc} alt={o.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s ease" }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:800, color:C.choco, marginBottom:6, lineHeight:1.25 }}>{o.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.15rem", fontWeight:900, color:C.garnet }}>{o.newPrice}</span>
                      <span style={{ fontSize:"0.78rem", color:C.gray, textDecoration:"line-through" }}>{o.oldPrice}</span>
                      <span style={{ fontSize:"0.7rem", fontWeight:700, color:"#22a35a", background:"#e8f8ef", padding:"2px 8px", borderRadius:100 }}>Ahorras {o.save}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            BANNER IA
        ══════════════════════════ */}
        <div style={{ padding:"0 24px 56px", background:C.white }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              style={{ borderRadius:22, background:`linear-gradient(135deg,${C.garnet} 0%,${C.crimson} 55%,${C.rose} 100%)`, padding:"44px 38px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:28, flexWrap:"wrap", position:"relative", overflow:"hidden", boxShadow:"0 22px 52px rgba(198,40,79,0.24)" }}>
              <div style={{ position:"absolute", top:-45, right:-45, width:200, height:200, borderRadius:"50%", border:"50px solid rgba(255,255,255,0.05)" }} />
              <div style={{ position:"relative", zIndex:2 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:700, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:9, display:"flex", alignItems:"center", gap:5 }}>
                  <Sparkles size={12} strokeWidth={1.5} /> Inteligencia Artificial · Emotia
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,2.8vw,2rem)", fontWeight:900, color:"white", marginBottom:9, lineHeight:1.15 }}>
                  ¿No sabes qué regalar?<br/>La IA de Emotia lo resuelve.
                </h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.93rem", color:"rgba(255,255,255,0.8)", lineHeight:1.65, maxWidth:440 }}>
                  Cuéntale a nuestra IA para quién es el regalo y en 2 minutos tiene el match perfecto — personalidad, ocasión y presupuesto considerados.
                </p>
              </div>
              <div style={{ position:"relative", zIndex:2, flexShrink:0 }}>
                <motion.button whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => router.push("/registro")}
                  style={{ background:"white", color:C.garnet, border:"none", padding:"15px 32px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.97rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 10px 30px rgba(0,0,0,0.14)" }}>
                  Encontrar mi regalo ideal <ArrowRight size={16} strokeWidth={1.5}/>
                </motion.button>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"rgba(255,255,255,0.42)", textAlign:"center", marginTop:7 }}>Gratis · Sin registro obligatorio</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════
            CÓMO FUNCIONA
        ══════════════════════════ */}
        <div id="como-funciona" style={{ background:C.cream, padding:"56px 24px" }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:"center", marginBottom:44 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:9 }}>
                <span style={{ width:20, height:2, background:C.gold, borderRadius:2, display:"inline-block" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:700, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase" }}>El proceso</span>
                <span style={{ width:20, height:2, background:C.gold, borderRadius:2, display:"inline-block" }} />
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.3rem)", fontWeight:900, color:C.garnet }}>3 pasos hacia el regalo perfecto</h2>
            </motion.div>
            <div className="steps-grid">
              {STEPS.map((s,i) => (
                <React.Fragment key={s.num}>
                  <motion.div
                    initial={{ opacity:0, y:26 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.14, duration:0.5 }}
                    whileHover={{ y:-5, boxShadow:"0 22px 48px rgba(198,40,79,0.09)" }}
                    style={{ background:"white", borderRadius:20, padding:"30px 24px", position:"relative", overflow:"hidden", boxShadow:"0 4px 18px rgba(198,40,79,0.05)", border:"1px solid rgba(255,209,179,0.3)", transition:"box-shadow 0.3s" }}
                  >
                    <div style={{ position:"absolute", top:-8, right:10, fontFamily:"'Playfair Display',serif", fontSize:"7rem", fontWeight:900, color:`rgba(198,40,79,0.05)`, lineHeight:1, userSelect:"none", pointerEvents:"none" }}>{s.num}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:`rgba(198,40,79,0.07)`, border:`1.5px solid rgba(198,40,79,0.12)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.8rem", fontWeight:900, color:C.garnet, lineHeight:1, letterSpacing:"-0.05em" }}>{s.num}</span>
                    </div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:800, color:C.garnet, marginBottom:8, lineHeight:1.25 }}>{s.title}</h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:C.gray, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                  </motion.div>
                  {i < 2 && (
                    <motion.div className="step-arrow"
                      initial={{ opacity:0, scale:0.4 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.14+0.32, type:"spring", stiffness:200 }}
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"0 14px" }}
                    >
                      <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.garnet},${C.crimson})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 16px rgba(198,40,79,0.3)", flexShrink:0 }}>
                        <ArrowRight size={18} color="white" strokeWidth={1.5}/>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            TESTIMONIOS
        ══════════════════════════ */}
        <div style={{ background:C.white, padding:"56px 24px" }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:14 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,2.6vw,2rem)", fontWeight:900, color:C.garnet }}>Lo que dicen nuestros clientes</h2>
              <div style={{ display:"flex", gap:8 }}>
                <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={scrollPrev}
                  style={{ width:40, height:40, borderRadius:"50%", background:C.roseLight, border:`1.5px solid rgba(198,40,79,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.garnet }}>
                  <ChevronLeft size={18} strokeWidth={1.5}/>
                </motion.button>
                <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={scrollNext}
                  style={{ width:40, height:40, borderRadius:"50%", background:C.garnet, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"white" }}>
                  <ChevronRight size={18} strokeWidth={1.5}/>
                </motion.button>
              </div>
            </motion.div>
            <div ref={emblaRef} style={{ overflow:"hidden" }}>
              <div style={{ display:"flex", gap:18 }}>
                {[...TESTIMONIALS,...TESTIMONIALS].map((t,i) => (
                  <div key={i} style={{ flex:"0 0 min(340px,82vw)", background:C.cream, borderRadius:18, padding:"24px 22px", border:"1px solid rgba(255,209,179,0.4)" }}>
                    <div style={{ fontSize:"1.8rem", color:C.gold, opacity:0.5, lineHeight:1, marginBottom:7, fontFamily:"Georgia,serif" }}>"</div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.93rem", color:C.choco, lineHeight:1.7, fontStyle:"italic", marginBottom:18 }}>{t.text}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${C.garnet},${C.crimson})`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"0.85rem", flexShrink:0 }}>{t.avatar}</div>
                      <div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:C.garnet, fontSize:"0.88rem" }}>{t.name}</div>
                        <div style={{ display:"flex", gap:2, marginTop:2 }}>{[...Array(5)].map((_,i) => <Star key={i} size={10} fill={C.gold} color={C.gold} strokeWidth={1.5}/>)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            RAPPI — OCASIONES
        ══════════════════════════ */}
        <div style={{ background:C.garnet, padding:"44px 24px" }}>
          <div style={{ maxWidth:1320, margin:"0 auto" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:18 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,2.4vw,1.9rem)", fontWeight:900, color:"white", marginBottom:4, display: "flex", alignItems: "center", gap: 10 }}>
                <Gift size={26} strokeWidth={1.5} color="white" /> Regala por ocasión
              </h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:"rgba(255,255,255,0.6)", fontWeight:500 }}>Envío express hoy en La Paz · Solo por hoy</p>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:10 }}>
              {OCASIONES.filter(o => o.id !== "todas").map((o,i) => (
                <motion.div key={o.id}
                  initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
                  whileHover={{ scale:1.06, y:-2 }}
                  onClick={() => { document.getElementById("productos")?.scrollIntoView({ behavior:"smooth" }); }}
                  style={{ background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"16px 8px 12px", textAlign:"center", flexShrink:0, cursor:"pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <EmotiaIcon name={o.icon} size={28} color="white" />
                  </div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:700, color:"white" }}>{o.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
