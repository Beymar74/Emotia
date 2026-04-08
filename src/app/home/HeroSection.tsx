"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EmotiaIcon } from './EmotiaIcon';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star, Truck, Gift, CheckCircle, Clock, MapPin, Search } from "lucide-react";
import { C, CHAT_STEPS, TRUST_ITEMS, MINI_BANNERS, OCASIONES_HERO } from "./constants";

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 3, padding: "7px 11px" }}>
      {[0, 1, 2].map(i => (
        <motion.span key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.13 }}
          style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, display: "inline-block" }}
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
        initial={{ opacity: 0, scale: 0.93, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
        style={{ background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, borderRadius: 14, padding: "10px 13px" }}
      >
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <Sparkles size={10} strokeWidth={2} /> Match encontrado por IA
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#FEF0F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {/* 👇 Cambiamos la copa de vino por una flor de Spa 👇 */}
            <EmotiaIcon name="Flower2" size={18} color={C.garnet} /> 
          </div>
          <div>
            {/* 👇 Cambiamos el título a un paquete de Spa 👇 */}
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.85rem", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 2 }}>Día de Spa Relajación Total</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* 👇 Ajustamos el precio para que encaje en el presupuesto (Bs. 150 - 300) 👇 */}
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "0.92rem", color: C.gold }}>Bs.250</span>
              <span style={{ background: "rgba(255,255,255,0.18)", color: "white", fontSize: "0.58rem", fontWeight: 700, padding: "2px 7px", borderRadius: 100, display: "flex", alignItems: "center", gap: 3 }}>
                <CheckCircle size={8} strokeWidth={2} /> 99% match
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 12 : -12, y: 4 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      {!isUser && (
        <div style={{ width: 20, height: 20, borderRadius: 6, background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 6, flexShrink: 0, marginTop: 2 }}>
          <Gift size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div style={{
        background: isUser ? `linear-gradient(135deg,${C.garnet},${C.crimson})` : "white",
        color: isUser ? "white" : C.choco,
        borderRadius: !isUser ? "3px 12px 12px 12px" : "12px 3px 12px 12px",
        padding: "6px 12px",
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 500, lineHeight: 1.45,
        maxWidth: "88%", // <-- AUMENTADO PARA QUE EL TEXTO SEA MÁS ANCHO Y MENOS ALTO
        boxShadow: isUser ? `0 3px 10px rgba(198,40,79,0.2)` : "0 1px 6px rgba(0,0,0,0.05)",
        border: !isUser ? "1px solid rgba(255,209,179,0.3)" : "none",
      }}>
        {msg.text}
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [searchVal, setSearchVal]   = useState("");
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [done, setDone]             = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    CHAT_STEPS.forEach(step => {
      if (step.role === "ai" || step.role === "result")
        timers.push(setTimeout(() => setShowTyping(true), step.delay - 800));
      timers.push(setTimeout(() => {
        setShowTyping(false);
        setVisibleIds(prev => prev.includes(step.id) ? prev : [...prev, step.id]);
        if (step.role === "result") setDone(true);
      }, step.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer-e{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse-live{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.6);opacity:.4}}
        @keyframes grad-flow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .hero-grad-text{background:linear-gradient(90deg,#C6284F,#E6B85C,#E04A64,#C6284F);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-e 4s linear infinite}
        .live-dot{animation:pulse-live 2s infinite}
        .hero-bg{background:linear-gradient(135deg,#FFF3E6 0%,#FFE3E8 40%,#FFF3E6 70%,#FFD1B3 100%);background-size:300% 300%;animation:grad-flow 10s ease infinite}
        
        /* 👇 COLUMNA DERECHA ENSANCHADA DE 420px A 460px 👇 */
        .hero-grid{display:grid;grid-template-columns:1fr 460px;gap:36px;align-items:center}
        
        .mini-banners{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .ocasiones-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        @media(max-width:1024px){.hero-grid{grid-template-columns:1fr}}
        @media(max-width:640px){.mini-banners{grid-template-columns:1fr 1fr}.ocasiones-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>

      <section className="hero-bg" style={{ paddingTop: 76, overflow: "hidden", position: "relative" }}>
        {/* Dot pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(198,40,79,0.045) 1px,transparent 1px)`, backgroundSize: "26px 26px", pointerEvents: "none" }} />
        {/* Orbs */}
        <div style={{ position: "absolute", top: -60, right: "8%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,129,0.1)", filter: "blur(55px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(230,184,92,0.09)", filter: "blur(50px)", pointerEvents: "none" }} />

        {/* ── HERO PRINCIPAL ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "36px 24px 28px", position: "relative", zIndex: 2 }}>
          <div className="hero-grid">

            {/* COLUMNA IZQUIERDA */}
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* Pill */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", border: `1.5px solid rgba(255,209,179,0.7)`, borderRadius: 100, padding: "5px 15px", marginBottom: 16, width: "fit-content", boxShadow: "0 3px 14px rgba(198,40,79,0.09)" }}
              >
                <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: C.garnet, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Emotia · Regalos personalizados · La Paz
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
                style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,4vw,4rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 14, color: C.garnet }}
              >
                Regala momentos<br />
                <span className="hero-grad-text">que nunca olvidan.</span>
              </motion.h1>

              {/* Desc */}
              <motion.p
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.98rem", color: C.choco, lineHeight: 1.7, marginBottom: 24, opacity: 0.88, maxWidth: 480 }}
              >
                <strong style={{ color: C.garnet }}>Emotia</strong> es tu asesor inteligente de regalos y experiencias.
                Cuéntanos la ocasión y nuestra IA encuentra el detalle perfecto, 
                desde artesanías locales hasta cenas exclusivas en La Paz.
              </motion.p>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.27 }}
                style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/registro")}
                  style={{ background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, color: "white", border: "none", padding: "12px 26px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.93rem", cursor: "pointer", boxShadow: "0 8px 22px rgba(198,40,79,0.32)", display: "flex", alignItems: "center", gap: 7 }}
                >
                  <Sparkles size={15} strokeWidth={2.5} /> Probar IA gratis <ArrowRight size={14} strokeWidth={2.5} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "white", color: C.garnet, border: `2px solid rgba(198,40,79,0.2)`, padding: "10px 20px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Gift size={15} strokeWidth={2} /> Ver todos los regalos
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}
                style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
              >
                {/* Avatares */}
                <div style={{ display: "flex", alignItems: "center", gap: 9, background: "white", borderRadius: 14, padding: "9px 14px", border: "1px solid rgba(255,209,179,0.5)", boxShadow: "0 3px 12px rgba(198,40,79,0.06)" }}>
                  <div style={{ display: "flex" }}>
                    {['V','S','C','M'].map((l, i) => (
                      <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, border: "2px solid white", marginLeft: i > 0 ? -7 : 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.58rem", fontWeight: 800, position: "relative", zIndex: 4 - i }}>{l}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 1, marginBottom: 1 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={9} fill={C.gold} color={C.gold} strokeWidth={1.5} />)}
                    </div>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700, color: C.choco }}>+2,400 regalos</span>
                  </div>
                </div>
                {[
                  { icon: <CheckCircle size={13} color={C.garnet} strokeWidth={2} />, num: "98%",   label: "satisfacción" },
                  { icon: <Clock       size={13} color={C.garnet} strokeWidth={2} />, num: "<2min", label: "IA responde" },
                  { icon: <MapPin      size={13} color={C.garnet} strokeWidth={2} />, num: "Hoy",   label: "entrega LPZ" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", borderRadius: 11, padding: "8px 12px", border: "1px solid rgba(255,209,179,0.4)", boxShadow: "0 2px 10px rgba(198,40,79,0.05)" }}>
                    {s.icon}
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontWeight: 900, color: C.garnet, lineHeight: 1 }}>{s.num}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* COLUMNA DERECHA: CHAT */}
            <motion.div
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] as any }}
            >
              <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,209,179,0.55)", borderRadius: 22, padding: 18, boxShadow: "0 24px 60px rgba(198,40,79,0.12)" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 9, paddingBottom: 11, borderBottom: "1px solid rgba(255,209,179,0.25)", marginBottom: 11 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <img src="/logo/logo.png" alt="Emotia" style={{ width: 30, height: 30, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "0.9rem", color: C.garnet }}>Emotia IA</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.63rem", color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                      <span style={{ width: 5, height: 5, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} /> En línea · Responde al instante
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.08)", borderRadius: 100, padding: "3px 8px", flexShrink: 0 }}>
                    <Truck size={10} color="#22c55e" strokeWidth={2.5} />
                    <div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.59rem", fontWeight: 700, color: "#22c55e", whiteSpace: "nowrap" }}>Entrega hoy</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.53rem", color: C.gray }}>La Paz</div>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                {/* 👇 MIN-HEIGHT REDUCIDO PARA QUE SEA MÁS COMPACTO 👇 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 11, minHeight: 210 }}>
                  <AnimatePresence initial={false}>
                    {visibleIds.map(id => {
                      const step = CHAT_STEPS.find(s => s.id === id)!;
                      return <ChatBubble key={step.id} msg={step} />;
                    })}
                    {showTyping && (
                      <motion.div key="typing"
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Gift size={10} color="white" strokeWidth={2.5} />
                        </div>
                        <div style={{ background: "white", borderRadius: "3px 12px 12px 12px", border: "1px solid rgba(255,209,179,0.3)" }}>
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div style={{ display: "flex", gap: 7, background: C.cream, borderRadius: 100, padding: "5px 5px 5px 13px", border: "1px solid rgba(255,209,179,0.45)" }}>
                  <span style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: "0.77rem", color: "#C0A898", display: "flex", alignItems: "center" }}>
                    Describe a quien quieres sorprender...
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    onClick={() => router.push("/registro")}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 10px rgba(198,40,79,0.28)" }}
                  >
                    <ArrowRight size={13} color="white" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {done && (
                  <motion.button
                    initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/registro")}
                    style={{ marginTop: 9, width: "100%", background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, color: "white", border: "none", padding: "9px", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.83rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 5px 16px rgba(198,40,79,0.28)" }}
                  >
                    <Sparkles size={13} strokeWidth={2} /> Probar gratis ahora
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── BÚSQUEDA PROMINENTE ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 20px", position: "relative", zIndex: 2 }}>
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
            style={{ display: "flex", alignItems: "center", background: "white", border: `2px solid rgba(255,209,179,0.7)`, borderRadius: 100, padding: "7px 7px 7px 22px", maxWidth: 620, boxShadow: "0 4px 20px rgba(198,40,79,0.08)" }}
          >
            <Search size={15} color={C.garnet} strokeWidth={2} style={{ flexShrink: 0 }} />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Ej: regalo para mamá 55 años, presupuesto Bs.200..."
              style={{ flex: 1, border: "none", background: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: C.choco, outline: "none", marginLeft: 10 }}
            />
            <button type="submit" style={{ background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, color: "white", border: "none", borderRadius: 100, padding: "9px 22px", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.84rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Sparkles size={13} /> Buscar con IA
            </button>
          </motion.form>
        </div>

        {/* ── EXPLORA POR OCASIÓN ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 24px", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 800, color: C.choco, marginBottom: 12 }}>Explora por ocasión</div>
          <div className="ocasiones-grid">
            {OCASIONES_HERO.map((o, i) => (
              <motion.div key={o.id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
                whileHover={{ y: -3, scale: 1.03 }}
                onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: o.bg, borderRadius: 10, overflow: "hidden", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <EmotiaIcon name={o.icon} size={32} color={C.garnet} />
                </div>
                <div style={{ padding: "0px 6px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: C.choco }}>{o.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BARRA CONFIANZA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,209,179,0.3)" }}
        >
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
            {TRUST_ITEMS.map((item, i, arr) => (
              <div key={i} style={{ flex: "1 1 130px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px 8px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,209,179,0.25)" : "none" }}>
                <EmotiaIcon name={item.icon} size={18} color={C.choco} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.76rem", fontWeight: 600, color: C.choco }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}