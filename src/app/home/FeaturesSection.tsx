"use client";

import { useEffect, useRef } from "react";
// En tu código final puedes importar tus propios componentes de animación/constantes.

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
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .nos-reveal {
    opacity: 0;
    transform: translateY(35px);
    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Tarjeta Principal Izquierda */
  .main-feature-card {
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }
  .main-feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 50px rgba(90, 15, 36, 0.15);
  }

  /* Tarjetas Secundarias Derecha */
  .small-feature-card {
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
  }
  .small-feature-card:hover {
    transform: translateX(6px);
    border-left-color: ${COLORS.doradoEnvejecido};
    box-shadow: 0 12px 25px rgba(90, 15, 36, 0.08) !important;
  }

  /* Tarjetas de Métricas */
  .metric-card {
    transition: transform 0.4s ease, background 0.4s ease;
  }
  .metric-card:hover {
    transform: translateY(-5px);
    background: ${COLORS.blanco};
    box-shadow: 0 12px 30px rgba(90, 15, 36, 0.06) !important;
  }
  .metric-card:hover .metric-num {
    color: ${COLORS.carmesi};
  }
`;

// Iconos SVG Premium
const Icons = {
  brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  magic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
};

const featuresData = [
  { 
    icon: Icons.brain, 
    title: "Inteligencia Emocional IA", 
    desc: "Analiza contexto, personalidad e impacto sentimental para ir más allá de un catálogo. Encontramos el regalo que realmente conecta." 
  },
  { 
    icon: Icons.heart, 
    title: "Personalización Auténtica", 
    desc: "Adaptamos cada recomendación al perfil único del destinatario y la ocasión." 
  },
  { 
    icon: Icons.shield, 
    title: "Confianza Total", 
    desc: "Pasarelas seguras y tracking en tiempo real, eliminando toda incertidumbre." 
  },
  { 
    icon: Icons.magic, 
    title: "Experiencia Sin Fricciones", 
    desc: "Un flujo fluido e intuitivo que transforma la compra en un absoluto placer." 
  },
];

const metricsData = [
  { num: "2,400+", label: "Regalos entregados" },
  { num: "98%",    label: "Satisfacción" },
  { num: "120+",   label: "Artesanos locales" },
  { num: "< 2min", label: "Tiempo de respuesta" },
];

// Hook local para animaciones de aparición al hacer scroll
function useLocalReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nos-visible");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Componentes extraídos para limpieza
function MetricCard({ num, label, index }: { num: string; label: string; index: number }) {
  const ref = useLocalReveal();
  return (
    <div 
      ref={ref} 
      className="nos-reveal metric-card" 
      style={{ 
        background: "rgba(255, 255, 255, 0.6)", 
        backdropFilter: "blur(10px)",
        borderRadius: "20px", 
        padding: "20px 16px", // Padding ligeramente reducido
        textAlign: "center", 
        boxShadow: "0 4px 15px rgba(90, 15, 36, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        transitionDelay: `${index * 0.1}s`
      }}
    >
      <div 
        className="metric-num"
        style={{ 
          fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, // Letra un poco más ajustada
          color: COLORS.granate, lineHeight: 1, marginBottom: "8px", transition: "color 0.3s ease" 
        }}
      >
        {num}
      </div>
      <div style={{ 
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: COLORS.marronChocolate, 
        textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 
      }}>
        {label}
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const headerRef = useLocalReveal();
  const leftCardRef = useLocalReveal();
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Redujimos el padding global para evitar que se extienda demasiado en vertical */}
      <section id="caracteristicas" style={{ padding: "clamp(4rem, 6vw, 5rem) 24px", background: COLORS.beige }}>
        <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
          
          {/* ── CABECERA ── */}
          <div ref={headerRef} className="nos-reveal" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
              <span style={{ width: "20px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", 
                letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.doradoEnvejecido
              }}>
                Por qué Emotia
              </span>
            </div>
            
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", 
              fontWeight: 900, color: COLORS.bordoOscuro, maxWidth: "650px", lineHeight: 1.1 
            }}>
              No solo recomendamos,{" "}
              <span style={{ color: COLORS.granate, fontStyle: "italic", fontWeight: 400 }}>conectamos.</span>
            </h2>
          </div>

          {/* ── GRID DE CARACTERÍSTICAS ── */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", 
            gap: "1.5rem", // Reducido para acortar la altura
            marginBottom: "2.5rem"
          }}>
            
            {/* Tarjeta Principal Izquierda (Grande) */}
            <div 
              ref={leftCardRef} 
              className="nos-reveal main-feature-card" 
              style={{ 
                background: `linear-gradient(145deg, ${COLORS.bordoOscuro}, ${COLORS.granate} 80%)`, 
                borderRadius: "32px", 
                padding: "clamp(1.8rem, 3vw, 2.5rem)", // Padding más compacto
                color: COLORS.blanco, 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "flex-end", 
                minHeight: "340px", // Min height reducido para igualar la columna derecha compactada
                position: "relative", 
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(90, 15, 36, 0.15)"
              }}
            >
              {/* Decoraciones circulares */}
              <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", border: "40px solid rgba(255,255,255,0.03)" }} />
              <div style={{ position: "absolute", top: "15%", right: "15%", width: "25%", height: "25%", borderRadius: "50%", border: `15px solid ${COLORS.doradoEnvejecido}20` }} />
              
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ 
                  width: "55px", height: "55px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.1)", 
                  backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center",
                  color: COLORS.doradoEnvejecido, marginBottom: "1.2rem"
                }}>
                  <div style={{ width: "28px", height: "28px" }}>
                    {featuresData[0].icon}
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.8rem", lineHeight: 1.15 }}>
                  {featuresData[0].title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontSize: "1rem", fontWeight: 300 }}>
                  {featuresData[0].desc}
                </p>
              </div>
            </div>

            {/* Lista de Tarjetas Secundarias Derecha */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", justifyContent: "center" }}>
              {featuresData.slice(1).map((f, i) => {
                const itemRef = useLocalReveal();
                return (
                  <div 
                    key={f.title} 
                    ref={itemRef}
                    className="nos-reveal small-feature-card" 
                    style={{ 
                      background: COLORS.blanco, 
                      borderRadius: "20px", 
                      padding: "1.4rem 1.8rem", // Padding reducido para que todo encaje mejor
                      display: "flex", 
                      gap: "1.2rem", 
                      alignItems: "center", 
                      boxShadow: "0 4px 15px rgba(90, 15, 36, 0.04)",
                      transitionDelay: `${i * 0.15}s`
                    }}
                  >
                    <div style={{ 
                      width: "48px", height: "48px", flexShrink: 0, background: `${COLORS.granate}0C`, 
                      borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                      color: COLORS.granate
                    }}>
                      <div style={{ width: "24px", height: "24px" }}>
                        {f.icon}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: COLORS.bordoOscuro, marginBottom: "0.3rem" }}>
                        {f.title}
                      </h4>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: COLORS.marronChocolate, lineHeight: 1.5, fontWeight: 400 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── GRID DE MÉTRICAS ── */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "1rem", 
            marginTop: "2.5rem" 
          }}>
            {metricsData.map((m, idx) => (
              <MetricCard key={m.label} num={m.num} label={m.label} index={idx} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
