"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Importaciones modulares desde la carpeta "home"
import { COLORS, SECTION_IDS, SECTION_LABELS, testimonials, features, steps, HeartIcon, StarIcon } from './home/constants';
import { FadeIn, FloatingOrb } from './home/animations';
import Navbar from './home/Navbar';
import Footer from './home/Footer';

// ── CSS global refactorizado ──────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --garnet: #8E1B3A; --bordeaux: #5A0F24; --crimson: #AB3A50;
    --chocolate: #5C3A2E; --gold: #BC9968; --beige: #F5E6D0;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--beige); color: var(--chocolate); overflow-x: hidden; }
  
  /* Utilities ocultamiento móvil */
  @media (max-width: 768px) {
    .hidden.md\\:flex, .hidden.md\\:block { display: none !important; }
  }

  @keyframes float         { from { transform: translateY(0px) rotate(0deg); }  to { transform: translateY(-20px) rotate(5deg); } }
  @keyframes pulse-ring    { 0%   { transform: scale(1); opacity: 0.7; }        100% { transform: scale(1.5); opacity: 0; } }
  @keyframes shimmer       { 0%   { background-position: -200% center; }        100% { background-position: 200% center; } }
  @keyframes fadeSlideUp   { from { opacity: 0; transform: translateY(20px); }  to   { opacity: 1; transform: translateY(0); } }
  @keyframes blink         { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes gradientShift { 0%,100% { background-position: 0% 50%; }          50%  { background-position: 100% 50%; } }
  
  .hero-gradient {
    background: linear-gradient(135deg, var(--beige) 0%, #f0d8bc 40%, #e8c8a8 70%, var(--beige) 100%);
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite;
  }
  .text-shimmer {
    background: linear-gradient(90deg, var(--garnet), var(--gold), var(--crimson), var(--garnet));
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 3s linear infinite;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--garnet), var(--bordeaux));
    color: white; border: none; cursor: pointer; position: relative; overflow: hidden;
    font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: 0.03em;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-primary::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .btn-primary:hover::before { left: 100%; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(142,27,58,0.4); }
  
  .card-hover { transition: transform 0.4s ease, box-shadow 0.4s ease; }
  .card-hover:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(90,15,36,0.15); }
  
  .chat-bubble-ai {
    background: white; border-radius: 18px 18px 18px 4px; padding: 14px 18px;
    box-shadow: 0 4px 16px rgba(90,15,36,0.08); font-size: 0.95rem; color: var(--chocolate);
    max-width: 85%; animation: fadeSlideUp 0.4s ease; font-weight: 500;
  }
  .chat-bubble-user {
    background: linear-gradient(135deg, var(--garnet), var(--crimson));
    border-radius: 18px 18px 4px 18px; padding: 14px 18px;
    box-shadow: 0 4px 16px rgba(142,27,58,0.25); font-size: 0.95rem; color: white;
    max-width: 85%; align-self: flex-end; animation: fadeSlideUp 0.4s ease; font-weight: 500;
  }
  .typing-dots span {
    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); margin: 0 2px; animation: blink 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  
  .gradient-border {
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, var(--gold), var(--garnet)) border-box;
    border: 1px solid transparent;
  }
  .section-label {
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--beige); }
  ::-webkit-scrollbar-thumb { background: var(--garnet); border-radius: 3px; }
`;

// ─────────────────────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────────────────────
export default function EmotiaLandingPage() {
  const router = useRouter(); 
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typedText,         setTypedText]         = useState("");
  const [chatStep,          setChatStep]          = useState(0);
  const [currentSection,    setCurrentSection]    = useState(0);
  const [scrolled,          setScrolled]          = useState(false);
  const fullText = "¿Para quién es este regalo especial?";

  // ── Scroll y Navegación ────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrentSection(idx); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Animaciones Temporizadas ───────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typedText !== fullText) return;
    const t = setTimeout(() => setChatStep(1), 800);
    return () => clearTimeout(t);
  }, [typedText]);

  useEffect(() => {
    const delays: Record<number, number> = { 1: 1500, 2: 2000, 3: 1600 };
    if (!delays[chatStep]) return;
    const t = setTimeout(() => setChatStep((p) => p + 1), delays[chatStep]);
    return () => clearTimeout(t);
  }, [chatStep]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <div style={{ background: COLORS.beige, position: "relative" }}>

        {/* ── Puntos de navegación lateral (Solo Escritorio) ── */}
        <div className="hidden md:flex" style={{
          position: "fixed", right: "24px", top: "50%", transform: "translateY(-50%)",
          zIndex: 200, flexDirection: "column", gap: "10px", alignItems: "center",
        }}>
          {SECTION_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setCurrentSection(i); }}
              title={SECTION_LABELS[i]}
              style={{
                width:  currentSection === i ? "12px" : "8px",
                height: currentSection === i ? "12px" : "8px",
                borderRadius: "50%",
                background:  currentSection === i ? COLORS.garnet : `${COLORS.garnet}40`,
                border:      currentSection === i ? `2px solid ${COLORS.garnet}` : "none",
                cursor: "pointer", padding: 0, transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Componente Navbar */}
        <Navbar scrolled={scrolled} />

        {/* ════════════════════════════════════════════════════
            HERO (Alturas Flexibles)
        ════════════════════════════════════════════════════ */}
        <section id="hero" className="hero-gradient" style={{
          padding: "160px 24px 80px", 
          display: "flex", alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          <FloatingOrb size="300px" top="-80px"  left="-80px"  color={COLORS.garnet}    delay={0}   />
          <FloatingOrb size="200px" top="60%"    left="75%"    color={COLORS.gold}       delay={1}   />
          <FloatingOrb size="150px" top="20%"    left="80%"    color={COLORS.crimson}    delay={2}   />

          <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", alignItems: "center", position: "relative", zIndex: 10 }}>
            {/* Textos */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${COLORS.white}80`, backdropFilter: 'blur(10px)', border: `1px solid ${COLORS.garnet}30`, borderRadius: "100px", padding: "8px 18px", marginBottom: "24px", boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.garnet, animation: "pulse-ring 1.5s ease infinite" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: COLORS.garnet, letterSpacing: "0.05em" }}>IA DISPONIBLE 24/7 EN LA PAZ</span>
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "24px", color: COLORS.bordeaux }}>
                El regalo perfecto,{" "}
                <em><span className="text-shimmer">siempre.</span></em>
              </h1>

              <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: COLORS.chocolate, opacity: 0.9, marginBottom: "40px", maxWidth: "480px" }}>
                Nuestra IA analiza emociones, personalidades y ocasiones para encontrar el regalo artesanal ideal. Deja de adivinar. Empieza a sorprender.
              </p>

              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ padding: "16px 32px", borderRadius: "100px", fontSize: "1rem", display: "flex", alignItems: "center", gap: "10px" }} onClick={() => router.push('/login')}>
                  <span>Comenzar gratis</span>
                  <span style={{ fontSize: "1.2rem" }}>→</span>
                </button>
              </div>

              {/* Social proof */}
              <div style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex" }}>
                  {["V", "C", "S", "M"].map((l, i) => (
                    <div key={l} style={{
                      width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${COLORS.beige}`,
                      background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`,
                      display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem", fontWeight: 700, marginLeft: i > 0 ? "-10px" : "0", zIndex: 4 - i
                    }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                    {[...Array(5)].map((_, i) => <div key={i} style={{ color: COLORS.gold }}><StarIcon /></div>)}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: COLORS.chocolate, opacity: 0.8, fontWeight: 500 }}>+2,400 regalos entregados</span>
                </div>
              </div>
            </div>

            {/* Chat mockup responsivo */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)",
                borderRadius: "32px", padding: "24px", width: "100%", maxWidth: "400px",
                boxShadow: "0 24px 60px rgba(90,15,36,0.12), 0 0 0 1px rgba(188,153,104,0.3)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "20px", borderBottom: `1px solid ${COLORS.gold}30`, marginBottom: "20px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: "20px", height: "20px", color: "white" }}><HeartIcon /></div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.05rem", color: COLORS.bordeaux }}>Memora IA</div>
                    <div style={{ fontSize: "0.75rem", color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <span style={{ width: "8px", height: "8px", background: "#16a34a", borderRadius: "50%" }} /> En línea ahora
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "260px" }}>
                  <div className="chat-bubble-ai">
                    {typedText}
                    <span style={{ animation: typedText === fullText ? "none" : "blink 0.7s infinite" }}>|</span>
                  </div>
                  {chatStep >= 1 && <div className="chat-bubble-user">Para mi pareja 💕 cumple 30 años</div>}
                  {chatStep >= 2 && <div className="chat-bubble-ai">¡Qué ocasión tan especial! ¿Qué le apasiona más: la aventura o la naturaleza?</div>}
                  {chatStep >= 3 && <div className="chat-bubble-user">Le encanta la naturaleza ✈️</div>}
                  {chatStep >= 4 && (
                    <div className="chat-bubble-ai" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="typing-dots"><span /><span /><span /></div>
                      <span style={{ fontSize: "0.85rem", color: COLORS.gray }}>Analizando perfil...</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "16px", display: "flex", gap: "8px", background: `${COLORS.beige}60`, borderRadius: "100px", padding: "10px 10px 10px 20px", border: `1px solid ${COLORS.gold}40` }}>
                  <span style={{ flex: 1, fontSize: "0.85rem", color: COLORS.gray, display: 'flex', alignItems: 'center' }}>Escribe tu respuesta...</span>
                  <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: "1.1rem", fontWeight: 'bold' }}>↑</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CÓMO FUNCIONA (Paddings seguros)
        ════════════════════════════════════════════════════ */}
        <section id="como-funciona" style={{ padding: "80px 24px", background: COLORS.white }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <FadeIn direction="up">
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div className="section-label" style={{ marginBottom: "16px" }}>El proceso</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: COLORS.bordeaux, marginBottom: "20px" }}>
                  Tres pasos hacia el<br /><em>regalo perfecto</em>
                </h2>
                <p style={{ fontSize: "1.05rem", color: COLORS.chocolate, opacity: 0.8, maxWidth: "540px", margin: "0 auto" }}>
                  Un proceso diseñado para que dar un regalo sea una experiencia tan especial como recibirlo. Cero estrés.
                </p>
              </div>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
              {steps.map((step, i) => (
                <FadeIn key={step.num} direction="up" delay={i * 150}>
                  <div className="card-hover gradient-border" style={{ background: "white", borderRadius: "28px", padding: "40px 24px", position: "relative" }}>
                    <div style={{ position: "absolute", top: "16px", right: "20px", fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: 900, color: `${COLORS.garnet}08` }}>{step.num}</div>
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `linear-gradient(135deg, ${COLORS.garnet}15, ${COLORS.crimson}10)`, border: `1px solid ${COLORS.garnet}20`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.garnet, marginBottom: "20px", padding: "14px" }}>{step.icon}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: COLORS.bordeaux, marginBottom: "12px" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: COLORS.chocolate, opacity: 0.8, lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CARACTERÍSTICAS
        ════════════════════════════════════════════════════ */}
        <section id="caracteristicas" style={{ padding: "80px 24px", background: COLORS.beige }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <FadeIn direction="up">
              <div style={{ marginBottom: "32px" }}>
                <div className="section-label" style={{ marginBottom: "12px" }}>Por qué Memora</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.8rem)", fontWeight: 900, color: COLORS.bordeaux, maxWidth: "600px", lineHeight: 1.1 }}>
                  No solo recomendamos, <span style={{ color: COLORS.garnet, fontStyle: "italic" }}>conectamos.</span>
                </h2>
              </div>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              <FadeIn direction="left">
                <div className="card-hover" style={{ background: `linear-gradient(135deg, ${COLORS.bordeaux}, ${COLORS.garnet})`, borderRadius: "32px", padding: "40px", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100%" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "24px" }}>{features[0].icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>{features[0].title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontSize: "1.05rem" }}>
                    {features[0].desc} Analiza el contexto, la personalidad y el impacto sentimental para ir más allá de un catálogo.
                  </p>
                </div>
              </FadeIn>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {features.slice(1).map((f, i) => (
                  <FadeIn key={f.title} direction="right" delay={i * 100}>
                    <div className="card-hover" style={{ background: "white", borderRadius: "24px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", borderLeft: `4px solid ${COLORS.garnet}40` }}>
                      <div style={{ fontSize: "1.6rem", width: "56px", height: "56px", flexShrink: 0, background: `${COLORS.garnet}10`, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 800, color: COLORS.bordeaux, marginBottom: "4px" }}>{f.title}</h4>
                        <p style={{ fontSize: "0.9rem", color: COLORS.chocolate, opacity: 0.8 }}>{f.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            TESTIMONIOS
        ════════════════════════════════════════════════════ */}
        <section id="testimonios" style={{ padding: "80px 24px", background: COLORS.white }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
            <FadeIn direction="up">
              <div className="section-label" style={{ marginBottom: "12px" }}>Testimonios</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: COLORS.bordeaux, marginBottom: "48px" }}>
                Momentos que <em>importan</em>
              </h2>
            </FadeIn>

            {/* Ajuste de minHeight para que no se superpongan en celulares */}
            <div style={{ position: "relative", minHeight: "320px" }}>
              {testimonials.map((t, i) => (
                <div key={t.name} style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0, opacity: activeTestimonial === i ? 1 : 0, transition: "opacity 0.6s ease", pointerEvents: activeTestimonial === i ? "auto" : "none" }}>
                  <div style={{ background: `${COLORS.beige}50`, border: `1px solid ${COLORS.gold}30`, borderRadius: "32px", padding: "40px 24px", maxWidth: "760px", margin: "0 auto" }}>
                    <div style={{ fontSize: "2.5rem", color: COLORS.gold, marginBottom: "16px", fontFamily: "Georgia, serif", opacity: 0.6 }}>"</div>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: COLORS.chocolate, fontStyle: "italic", marginBottom: "24px" }}>{t.text}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800 }}>{t.avatar}</div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 700, color: COLORS.bordeaux }}>{t.name}</div>
                        <div style={{ fontSize: "0.85rem", color: COLORS.gray }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "24px" }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? "24px" : "8px", height: "8px", borderRadius: "100px", background: i === activeTestimonial ? COLORS.garnet : `${COLORS.garnet}30`, border: "none", cursor: "pointer", transition: "all 0.3s ease" }} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CTA
        ════════════════════════════════════════════════════ */}
        <section id="cta" style={{ padding: "80px 24px", margin: "0 auto", maxWidth: "1280px" }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.bordeaux} 0%, ${COLORS.garnet} 50%, ${COLORS.crimson} 100%)`, borderRadius: "40px", position: "relative", overflow: "hidden", textAlign: "center", padding: "60px 24px", boxShadow: '0 20px 40px rgba(90,15,36,0.2)' }}>
            <FadeIn direction="up">
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎁</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, color: "white", marginBottom: "16px", lineHeight: 1.1 }}>
                  El regalo perfecto<br />está a un clic
                </h2>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", maxWidth: "450px", margin: "0 auto 32px", lineHeight: 1.6 }}>
                  Únete a más de 2,400 paceños que ya encontraron la manera de sorprender de verdad.
                </p>
                <button className="btn-primary" style={{ padding: "16px 36px", borderRadius: "100px", fontSize: "1rem" }} onClick={() => router.push('/login')}>
                  Comenzar gratis
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Componente Footer */}
        <Footer />

      </div>
    </>
  );
}