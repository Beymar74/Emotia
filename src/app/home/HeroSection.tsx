"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star, Truck, Gift, Package, CheckCircle, Clock, MapPin } from "lucide-react";
import { C } from "./constants";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
});

const CHAT_STEPS = [
  { id:"ai-0",   role:"ai",     text:"¡Hola! ¿Para quién es el regalo? 🎁",              delay:600  },
  { id:"usr-1",  role:"user",   text:"Para mi mamá, cumple 55 años 💕",                   delay:1700 },
  { id:"ai-1",   role:"ai",     text:"¿Qué le gusta más: relajarse, vinos o chocolates?", delay:2800 },
  { id:"usr-2",  role:"user",   text:"Le encanta relajarse y el vino 🍷",                 delay:4000 },
  { id:"ai-2",   role:"ai",     text:"¿Cuál es tu presupuesto?",                          delay:5100 },
  { id:"usr-3",  role:"user",   text:"Entre Bs.150 y Bs.300",                             delay:6200 },
  { id:"result", role:"result", text:"",                                                   delay:7500 },
];

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:3, padding:"7px 11px" }}>
      {[0,1,2].map(i => (
        <motion.span key={i}
          animate={{ y:[0,-4,0] }}
          transition={{ duration:0.5, repeat:Infinity, delay:i*0.12 }}
          style={{ width:5, height:5, borderRadius:"50%", background:C.gold, display:"inline-block" }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }: { msg: typeof CHAT_STEPS[0] }) {
  const isUser = msg.role === "user";

  if (msg.role === "result") {
    return (
      <motion.div
        initial={{ opacity:0, scale:0.93, y:8 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ duration:0.45, ease:[0.22,1,0.36,1] as any }}
        style={{ background:`linear-gradient(135deg,${C.bordeaux},${C.garnet})`, borderRadius:14, padding:"11px 13px" }}
      >
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:C.gold, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7, display:"flex", alignItems:"center", gap:4 }}>
          <Sparkles size={10} /> Match encontrado por IA
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"#FEF0F3", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>🍷</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.85rem", fontWeight:800, color:"white", lineHeight:1.2, marginBottom:2 }}>Caja Cata Ciega Premium</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"0.95rem", color:C.gold }}>Bs.280</span>
              <span style={{ background:"rgba(255,255,255,0.15)", color:"white", fontSize:"0.6rem", fontWeight:700, padding:"2px 7px", borderRadius:100, display:"flex", alignItems:"center", gap:3 }}>
                <CheckCircle size={9} /> 98% match
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0, x:isUser?12:-12, y:4 }}
      animate={{ opacity:1, x:0, y:0 }}
      transition={{ duration:0.32, ease:[0.22,1,0.36,1] as any }}
      style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start" }}
    >
      {!isUser && (
        <div style={{ width:20, height:20, borderRadius:6, background:`linear-gradient(135deg,${C.garnet},${C.bordeaux})`, display:"flex", alignItems:"center", justifyContent:"center", marginRight:6, flexShrink:0, marginTop:2 }}>
          <Gift size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div style={{
        background: isUser ? `linear-gradient(135deg,${C.garnet},${C.crimson})` : "white",
        color: isUser ? "white" : C.choco,
        borderRadius: !isUser ? "3px 12px 12px 12px" : "12px 3px 12px 12px",
        padding: "7px 11px",
        fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", fontWeight:500, lineHeight:1.4,
        maxWidth:"76%",
        boxShadow: isUser ? "0 3px 10px rgba(142,27,58,0.18)" : "0 1px 6px rgba(0,0,0,0.05)",
        border: !isUser ? "1px solid rgba(188,153,104,0.14)" : "none",
      }}>
        {msg.text}
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const router   = useRouter();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [showTyping, setShowTyping]  = useState(false);
  const [done, setDone]              = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    CHAT_STEPS.forEach(step => {
      if (step.role === "ai" || step.role === "result")
        timers.push(setTimeout(() => setShowTyping(true), step.delay - 750));
      timers.push(setTimeout(() => {
        setShowTyping(false);
        setVisibleIds(prev => prev.includes(step.id) ? prev : [...prev, step.id]);
        if (step.role === "result") setDone(true);
      }, step.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse-g{0%,100%{transform:scale(1)}50%{transform:scale(1.5);opacity:0.6}}
        .hgrad{background:linear-gradient(135deg,#8E1B3A 0%,#BC9968 45%,#AB3A50 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .ldot{animation:pulse-g 2s infinite}
        .hero-grid{display:grid;grid-template-columns:1fr 420px;gap:48px;align-items:center}
        @media(max-width:1000px){.hero-grid{grid-template-columns:1fr}}
      `}</style>

      <section style={{
        background:`radial-gradient(ellipse at 72% 8%,rgba(142,27,58,0.08) 0%,transparent 48%),
                    radial-gradient(ellipse at 4% 82%,rgba(188,153,104,0.1) 0%,transparent 44%),
                    linear-gradient(155deg,#FAF5EE 0%,#FFF9F5 45%,#FEF3F6 100%)`,
        paddingTop:72, display:"flex", flexDirection:"column",
        overflow:"hidden", position:"relative",
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(142,27,58,0.045) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 32px 28px", position:"relative", zIndex:2, width:"100%" }}>
          <div className="hero-grid">

            {/* ══ COLUMNA IZQUIERDA ══ */}
            <div style={{ display:"flex", flexDirection:"column" }}>

              {/* Pill */}
              <motion.div {...fadeUp(0.04)} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"white", border:"1.5px solid rgba(142,27,58,0.18)", borderRadius:100, padding:"5px 15px", marginBottom:18, width:"fit-content", boxShadow:"0 3px 12px rgba(90,15,36,0.08)" }}>
                <span className="ldot" style={{ width:7, height:7, borderRadius:"50%", background:"#16a34a", flexShrink:0, display:"inline-block" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.7rem", color:C.bordeaux, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  Emotia · Regalos personalizados · La Paz 🇧🇴
                </span>
              </motion.div>

              {/* Título */}
              <motion.h1 {...fadeUp(0.1)} style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.8rem,4.5vw,4.4rem)", fontWeight:900, lineHeight:1.04, letterSpacing:"-0.03em", marginBottom:16, color:C.bordeaux }}>
                Regala algo<br />
                <span className="hgrad">que nunca olvidan.</span>
              </motion.h1>

              {/* Descripción */}
              <motion.p {...fadeUp(0.18)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", color:C.choco, lineHeight:1.68, marginBottom:24, opacity:0.87, maxWidth:500 }}>
              <strong style={{ color:C.garnet }}>Emotia</strong> es tu asesor inteligente de regalos personalizados.
Cuéntanos la ocasión, el perfil y tu presupuesto — nuestra IA encuentra el detalle perfecto
y lo entrega con dedicatoria incluida.
              </motion.p>

              {/* Botones */}
              <motion.div {...fadeUp(0.26)} style={{ display:"flex", gap:11, flexWrap:"wrap", marginBottom:28 }}>
                <motion.button
                  whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => scrollTo("productos")}
                  style={{ background:`linear-gradient(135deg,${C.bordeaux},${C.garnet})`, color:"white", border:"none", padding:"13px 28px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", boxShadow:"0 8px 24px rgba(90,15,36,0.3)", display:"flex", alignItems:"center", gap:7 }}
                >
                  <Gift size={16} strokeWidth={2.5} /> Ver todos los regalos <ArrowRight size={14} strokeWidth={2.5} />
                </motion.button>
                <motion.button
                  whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => router.push("/registro")}
                  style={{ background:"white", color:C.bordeaux, border:`2px solid rgba(90,15,36,0.18)`, padding:"11px 22px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.92rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}
                >
                  <Sparkles size={15} strokeWidth={2} /> Usar asistente IA
                </motion.button>
              </motion.div>

              {/* ── PRUEBA SOCIAL + STATS en una sola fila ── */}
              <motion.div {...fadeUp(0.34)} style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>

                {/* Avatares + estrellas */}
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"white", borderRadius:14, padding:"10px 16px", border:"1px solid rgba(188,153,104,0.18)", boxShadow:"0 3px 12px rgba(90,15,36,0.05)" }}>
                  <div style={{ display:"flex" }}>
                    {["V","S","C","M"].map((l,i) => (
                      <div key={i} style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.garnet},${C.crimson})`, border:"2px solid white", marginLeft:i>0?-8:0, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"0.6rem", fontWeight:800, position:"relative", zIndex:4-i }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display:"flex", gap:1, marginBottom:1 }}>
                      {[...Array(5)].map((_,i) => <Star key={i} size={10} fill={C.gold} color={C.gold} />)}
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:700, color:C.choco }}>+2,400 regalos</span>
                  </div>
                </div>

                {/* Stats inline — pequeños */}
                {[
                  { icon:<CheckCircle size={14} color={C.garnet} strokeWidth={2}/>, num:"98%",    label:"satisfacción" },
                  { icon:<Clock       size={14} color={C.garnet} strokeWidth={2}/>, num:"<2min",  label:"IA responde" },
                  { icon:<MapPin      size={14} color={C.garnet} strokeWidth={2}/>, num:"Hoy",    label:"entrega LPZ" },
                ].map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7, background:"white", borderRadius:12, padding:"9px 14px", border:"1px solid rgba(188,153,104,0.16)", boxShadow:"0 2px 10px rgba(90,15,36,0.04)" }}>
                    {s.icon}
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:900, color:C.garnet, lineHeight:1 }}>{s.num}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:600, color:C.gray, textTransform:"uppercase", letterSpacing:"0.04em" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ══ COLUMNA DERECHA: CHAT COMPACTO ══ */}
            <motion.div
              initial={{ opacity:0, x:30 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.22, ease:[0.22,1,0.36,1] as any }}
            >
              <div style={{ background:"rgba(255,255,255,0.88)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.9)", borderRadius:24, padding:18, boxShadow:"0 24px 64px rgba(90,15,36,0.12)" }}>

                {/* Header chat */}
                <div style={{ display:"flex", alignItems:"center", gap:9, paddingBottom:12, borderBottom:"1px solid rgba(188,153,104,0.13)", marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:11, overflow:"hidden", flexShrink:0, background:`linear-gradient(135deg,${C.garnet},${C.bordeaux})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(90,15,36,0.2)" }}>
                    <img src="/logo/logo.png" alt="Emotia" style={{ width:32, height:32, objectFit:"contain" }} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:"0.92rem", color:C.bordeaux }}>Emotia IA</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#16a34a", fontWeight:700, display:"flex", alignItems:"center", gap:4, marginTop:1 }}>
                      <span style={{ width:5, height:5, background:"#16a34a", borderRadius:"50%", display:"inline-block" }} /> En línea · Responde al instante
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(22,163,74,0.08)", borderRadius:100, padding:"4px 9px", flexShrink:0 }}>
                    <Truck size={11} color="#16a34a" strokeWidth={2.5} />
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.61rem", fontWeight:700, color:"#16a34a", whiteSpace:"nowrap" }}>Entrega hoy</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.56rem", color:C.gray }}>La Paz</div>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12, minHeight:220 }}>
                  <AnimatePresence initial={false}>
                    {visibleIds.map(id => {
                      const step = CHAT_STEPS.find(s => s.id === id)!;
                      return <ChatBubble key={step.id} msg={step} />;
                    })}
                    {showTyping && (
                      <motion.div key="typing"
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                        style={{ display:"flex", alignItems:"center", gap:6 }}
                      >
                        <div style={{ width:20, height:20, borderRadius:6, background:`linear-gradient(135deg,${C.garnet},${C.bordeaux})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Gift size={10} color="white" strokeWidth={2.5} />
                        </div>
                        <div style={{ background:"white", borderRadius:"3px 12px 12px 12px", border:"1px solid rgba(188,153,104,0.13)" }}>
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div style={{ display:"flex", gap:7, background:"white", borderRadius:100, padding:"5px 5px 5px 14px", border:"1px solid rgba(188,153,104,0.18)" }}>
                  <span style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#B0A09A", display:"flex", alignItems:"center" }}>
                    Describe a quien quieres sorprender...
                  </span>
                  <motion.button
                    whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                    onClick={() => router.push("/registro")}
                    style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.garnet},${C.bordeaux})`, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 3px 10px rgba(90,15,36,0.26)" }}
                  >
                    <ArrowRight size={14} color="white" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* CTA post-match */}
                {done && (
                  <motion.button
                    initial={{ opacity:0, y:7 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    onClick={() => router.push("/registro")}
                    style={{ marginTop:10, width:"100%", background:`linear-gradient(135deg,${C.bordeaux},${C.garnet})`, color:"white", border:"none", padding:"10px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:"0 5px 16px rgba(90,15,36,0.26)" }}
                  >
                    <Sparkles size={14} strokeWidth={2} /> Probar gratis ahora
                  </motion.button>
                )}
              </div>
            </motion.div>

          </div>
        </div>

        {/* BARRA CONFIANZA */}
        <motion.div
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.45 }}
          style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(10px)", borderTop:"1px solid rgba(188,153,104,0.15)", marginTop:28 }}
        >
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px", display:"flex", flexWrap:"wrap" }}>
            {[
              { icon:<Truck    size={15} color={C.garnet}/>, t:"Envío a toda Bolivia" },
              { icon:<Package  size={15} color={C.garnet}/>, t:"Empaque premium" },
              { icon:"✍️",                                    t:"Tarjeta dedicatoria" },
              { icon:"🤝",                                    t:"Artesanos bolivianos" },
              { icon:<Sparkles size={15} color={C.garnet}/>, t:"IA en 2 minutos" },
            ].map((item,i,arr) => (
              <div key={i} style={{ flex:"1 1 150px", display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"12px 8px", borderRight:i<arr.length-1?"1px solid rgba(188,153,104,0.13)":"none" }}>
                <span style={{ fontSize:"0.95rem", display:"flex", alignItems:"center" }}>{item.icon}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:600, color:C.choco }}>{item.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
