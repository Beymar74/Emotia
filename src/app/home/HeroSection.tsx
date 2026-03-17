"use client";

import React from "react";

// Paleta de colores estricta
const COLORS = {
  granate: "#8E1B3A",
  bordoOscuro: "#5A0F24",
  carmesi: "#AB3A50",
  marronChocolate: "#5C3A2E",
  doradoEnvejecido: "#BC9968",
  beige: "#F5E6D0",
  cremaHeader: "#FAF5EE",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  @keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(142, 27, 58, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(142, 27, 58, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
  }

  @keyframes floatSlow {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(15px, -25px) scale(1.05); }
  }
  
  @keyframes pulseDot {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(142, 27, 58, 0.5); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(142, 27, 58, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(142, 27, 58, 0); }
  }
  .status-dot {
    width: 6px;
    height: 6px;
    background-color: ${COLORS.granate};
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  .btn-primary-hero {
    background: linear-gradient(135deg, ${COLORS.doradoEnvejecido}, #9A7B50);
    color: ${COLORS.negro};
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    box-shadow: 0 8px 20px rgba(188, 153, 104, 0.25);
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 12px 24px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary-hero:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(188, 153, 104, 0.4);
  }

  .btn-secondary-hero {
    background: transparent;
    color: ${COLORS.bordoOscuro};
    border: 1px solid rgba(90, 15, 36, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 12px 24px;
    border-radius: 100px;
  }
  .btn-secondary-hero:hover {
    background: rgba(90, 15, 36, 0.04);
    border-color: ${COLORS.bordoOscuro};
  }

  .chat-bubble-ai {
    background: ${COLORS.blanco};
    color: ${COLORS.marronChocolate};
    border-radius: 14px 14px 14px 4px;
    padding: 10px 14px;
    font-size: 0.85rem;
    line-height: 1.4;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    border: 1px solid rgba(188, 153, 104, 0.15);
    align-self: flex-start;
    max-width: 88%;
    font-family: 'DM Sans', sans-serif;
    animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .chat-bubble-user {
    background: linear-gradient(135deg, ${COLORS.granate}, ${COLORS.carmesi});
    color: ${COLORS.blanco};
    border-radius: 14px 14px 4px 14px;
    padding: 10px 14px;
    font-size: 0.85rem;
    line-height: 1.4;
    box-shadow: 0 4px 12px rgba(142, 27, 58, 0.15);
    align-self: flex-end;
    max-width: 88%;
    font-family: 'DM Sans', sans-serif;
    animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95) translateY(5px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .floating-card-result {
    position: absolute;
    bottom: -20px;
    left: -40px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 1);
    box-shadow: 0 15px 35px rgba(90, 15, 36, 0.1);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 20;
    animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
  }

  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .typing-dots span {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: ${COLORS.doradoEnvejecido};
    border-radius: 50%;
    margin: 0 2px;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  @keyframes blinkCursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .text-shimmer {
    background: linear-gradient(90deg, ${COLORS.granate}, ${COLORS.doradoEnvejecido}, ${COLORS.granate});
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer {
    to { background-position: 200% center; }
  }

  @media (max-width: 900px) {
    .floating-card-result {
      left: 10px;
      bottom: -30px;
      right: 10px;
    }
  }
`;

// Iconos en línea
const ConciergeIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 12a5.5 5.5 0 0 1 8.25-4.76 5.5 5.5 0 0 1 10.75 4.76c0 4.42-3.02 8.01-7.5 9.77a2.74 2.74 0 0 1-2.96 0C6.52 20.01 3.5 16.42 3.5 12Z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const GiftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    <rect x="3" y="8" width="18" height="12" rx="1" fill="none"/>
    <path d="M12 8v12"/>
    <path d="M19 8c0-2-1.5-3.5-3.5-3.5S12 6.5 12 8"/>
    <path d="M5 8c0-2 1.5-3.5 3.5-3.5S12 6.5 12 8"/>
    <line x1="3" y1="8" x2="21" y2="8"/>
  </svg>
);

// ── INTERFAZ DE PROPS ──────────────────────────────────────────────────────────
interface HeroSectionProps {
  typedText: string;
  chatStep: number;
  fullText: string;
}

// ── COMPONENTE ─────────────────────────────────────────────────────────────────
export default function HeroSection({ typedText, chatStep, fullText }: HeroSectionProps) {
  const avatars = ["E", "M", "S", "L"];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section
        id="hero"
        className="bg-grid-pattern"
        style={{
          backgroundColor: COLORS.cremaHeader,
          padding: "clamp(5rem, 8vw, 120px) 24px clamp(3rem, 5vw, 60px)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Orbes de Fondo */}
        <div style={{ position: "absolute", width: "400px", height: "400px", top: "-5%", left: "-5%", background: `radial-gradient(circle, ${COLORS.granate} 0%, transparent 60%)`, filter: "blur(80px)", opacity: 0.05, animation: "floatSlow 12s infinite alternate", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "300px", height: "300px", top: "40%", right: "-5%", background: `radial-gradient(circle, ${COLORS.doradoEnvejecido} 0%, transparent 60%)`, filter: "blur(60px)", opacity: 0.08, animation: "floatSlow 15s infinite alternate-reverse", pointerEvents: "none" }} />

        <div style={{
          maxWidth: "1150px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))",
          gap: "clamp(2rem, 5vw, 4rem)",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}>

          {/* ── IZQUIERDA ── */}
          <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>

            {/* Insignia */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)",
              border: `1px solid rgba(188, 153, 104, 0.3)`, borderRadius: "100px",
              padding: "4px 14px", marginBottom: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}>
              <div className="status-dot" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: COLORS.bordoOscuro, letterSpacing: "0.08em" }}>
                IA DISPONIBLE 24/7 EN LA PAZ
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
              fontWeight: 900, lineHeight: 1.08, marginBottom: "1.2rem", color: COLORS.bordoOscuro,
              letterSpacing: "-0.02em",
            }}>
              El regalo perfecto, <br />
              <em><span className="text-shimmer">siempre.</span></em>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              lineHeight: 1.6, color: COLORS.marronChocolate, marginBottom: "2rem", maxWidth: "460px",
              opacity: 0.9,
            }}>
              Nuestra IA analiza emociones, personalidades y ocasiones para encontrar el regalo artesanal ideal. Deja de adivinar. Empieza a sorprender.
            </p>

            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn-primary-hero">
                Comenzar gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="btn-secondary-hero">
                Ver cómo funciona
              </button>
            </div>

            {/* Prueba Social */}
            <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(255, 255, 255, 0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.6)", width: "fit-content" }}>
              <div style={{ display: "flex" }}>
                {avatars.map((l, i) => (
                  <div key={i} style={{
                    width: "30px", height: "30px", borderRadius: "50%", border: `2px solid ${COLORS.cremaHeader}`,
                    background: `linear-gradient(135deg, ${COLORS.granate}, ${COLORS.carmesi})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700, marginLeft: i > 0 ? "-10px" : "0", zIndex: 4 - i, position: "relative", boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: COLORS.doradoEnvejecido }}><StarIcon /></span>)}
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: COLORS.marronChocolate, fontWeight: 600 }}>
                  +2,400 regalos únicos
                </span>
              </div>
            </div>
          </div>

          {/* ── DERECHA: Chat ── */}
          <div className="fade-in-up" style={{ animationDelay: "0.3s", display: "flex", justifyContent: "center", width: "100%", position: "relative" }}>

            {/* Tarjeta del Chat */}
            <div style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid rgba(255, 255, 255, 0.9)`,
              borderRadius: "24px",
              padding: "20px",
              width: "100%",
              maxWidth: "380px",
              boxShadow: `0 25px 50px rgba(90, 15, 36, 0.08), inset 0 2px 4px rgba(255,255,255,0.5)`,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              zIndex: 10,
            }}>

              {/* Cabecera */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "14px", borderBottom: `1px solid rgba(188, 153, 104, 0.15)`, marginBottom: "16px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${COLORS.granate}, ${COLORS.bordoOscuro})`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "8px", flexShrink: 0, boxShadow: "0 4px 10px rgba(142, 27, 58, 0.15)",
                }}>
                  <ConciergeIcon />
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1rem", color: COLORS.bordoOscuro }}>Emotia AI</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, marginTop: "2px" }}>
                    <span style={{ width: "6px", height: "6px", background: "#16a34a", borderRadius: "50%" }} /> En línea
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "230px", justifyContent: "flex-start" }}>

                <div className="chat-bubble-ai">
                  {typedText}
                  {typedText !== fullText && (
                    <span style={{ animation: "blinkCursor 0.8s infinite", marginLeft: "2px", fontWeight: "bold", color: COLORS.granate }}>|</span>
                  )}
                </div>

                {chatStep >= 1 && (
                  <div className="chat-bubble-user">
                    Mi pareja 💕 cumple 30
                  </div>
                )}

                {chatStep >= 2 && (
                  <div className="chat-bubble-ai">
                    ¡Genial! ¿Le apasiona la aventura, la gastronomía o el arte?
                  </div>
                )}

                {chatStep >= 3 && (
                  <div className="chat-bubble-user">
                    Probar vinos nuevos 🍷
                  </div>
                )}

                {chatStep >= 4 && (
                  <div className="chat-bubble-ai" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px" }}>
                    <div className="typing-dots"><span></span><span></span><span></span></div>
                    <span style={{ fontSize: "0.8rem", color: COLORS.doradoEnvejecido, fontWeight: 500, fontStyle: "italic" }}>
                      Analizando...
                    </span>
                  </div>
                )}
              </div>

              {/* Input falso */}
              <div style={{
                marginTop: "10px", display: "flex", gap: "10px", background: `rgba(255, 255, 255, 1)`,
                borderRadius: "100px", padding: "6px 6px 6px 16px", border: `1px solid rgba(188, 153, 104, 0.2)`,
              }}>
                <span style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: COLORS.gris, display: "flex", alignItems: "center" }}>
                  Escribir...
                </span>
                <button style={{
                  width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer",
                  background: `linear-gradient(135deg, ${COLORS.granate}, ${COLORS.bordoOscuro})`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

            </div>

            {/* Tarjeta flotante de resultado */}
            {chatStep >= 4 && (
              <div className="floating-card-result">
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px", background: `${COLORS.cremaHeader}`,
                  border: `1px solid ${COLORS.doradoEnvejecido}40`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.doradoEnvejecido,
                }}>
                  <GiftIcon />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: COLORS.granate, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                    Match Encontrado
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: COLORS.bordoOscuro, fontWeight: 700 }}>
                    Caja Cata Ciega de Vinos
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}