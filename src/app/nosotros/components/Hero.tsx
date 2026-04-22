"use client";

import { useEffect, useRef } from "react";

// LA PALETA MAESTRA DE EMOTIA
const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .nos-fade {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-fade.nos-active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @keyframes blobPulse {
    0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
    33% { transform: scale(1.1) translate(30px, -50px); opacity: 0.7; }
    66% { transform: scale(0.9) translate(-20px, 20px); opacity: 0.6; }
    100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
  }

  .glass-pill {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  }

  .btn-dynamic {
    background: linear-gradient(135deg, ${P.granate}, ${P.carmesi});
    color: ${P.blanco};
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    box-shadow: 0 8px 25px ${P.granate}40;
  }
  .btn-dynamic:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 30px ${P.granate}60;
  }
`;

export default function HeroDinamico() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".nos-fade");
    els?.forEach((el, i) => {
      setTimeout(() => el.classList.add("nos-active"), 150 + i * 150);
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section
        ref={ref}
        style={{
          position: "relative", minHeight: "100vh", backgroundColor: P.bordo, 
          overflow: "hidden", display: "flex", alignItems: "center",
          padding: "80px 5%", fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* FONDOS DINÁMICOS */}
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: "40vw", height: "40vw",
          background: `radial-gradient(circle, ${P.granate} 0%, transparent 70%)`,
          filter: "blur(80px)", opacity: 0.5, borderRadius: "50%",
          animation: "blobPulse 15s ease-in-out infinite alternate", zIndex: 0, pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw",
          background: `radial-gradient(circle, ${P.dorado} 0%, transparent 70%)`,
          filter: "blur(100px)", opacity: 0.2, borderRadius: "50%",
          animation: "blobPulse 20s ease-in-out infinite alternate-reverse", zIndex: 0, pointerEvents: "none"
        }} />

        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: "1320px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "4rem"
        }}>
          
          {/* COLUMNA IZQUIERDA */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative" }}>
            
            <span className="nos-fade" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "100px", border: `1px solid ${P.dorado}50`,
              color: P.dorado, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "2rem", fontWeight: 700
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: P.dorado, display: "inline-block", boxShadow: `0 0 10px ${P.dorado}` }}></span>
              Nuestra Esencia
            </span>

            <h1 className="nos-fade" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(3.2rem, 6vw, 5.5rem)",
              lineHeight: 1.05, color: P.blanco, marginBottom: "1.5rem", letterSpacing: "-0.02em"
            }}>
              El arte de<br />
              <div style={{ position: "relative", display: "inline-block", color: P.dorado }}>
                regalar
                <svg style={{ position: "absolute", bottom: "-5px", left: 0, width: "100%", height: "auto", stroke: P.dorado, opacity: 0.6 }} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 195 15" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <br />con propósito.
            </h1>

            <p className="nos-fade" style={{
              fontSize: "1.1rem", color: P.beige, opacity: 0.8,
              marginBottom: "3rem", lineHeight: 1.6, maxWidth: "480px"
            }}>
              Transformamos la indecisión en una conexión emocional profunda, combinando tecnología inteligente e intuición humana.
            </p>

            <div className="nos-fade" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {[
                { label: "IA Asistente", icon: "✧" },
                { label: "Logística 360°", icon: "∞" },
                { label: "Hiper-Personalizado", icon: "♥" }
              ].map((item, idx) => (
                <div key={idx} className="glass-pill" style={{
                  padding: "10px 20px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ color: P.dorado, fontSize: "1.2rem", lineHeight: 0 }}>{item.icon}</span>
                  <span style={{ color: P.beige, fontSize: "0.85rem", fontWeight: 700 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Tarjeta Principal */}
            <div style={{
              background: P.blanco, borderRadius: "24px", padding: "clamp(2.5rem, 5vw, 3.5rem)", 
              width: "100%", maxWidth: "440px", position: "relative", zIndex: 2,
              boxShadow: `0 24px 60px rgba(0,0,0,0.3)`
            }}>
              <div style={{ 
                width: "56px", height: "56px", borderRadius: "16px", 
                background: `linear-gradient(135deg, ${P.beige}, ${P.blanco})`, 
                display: "flex", alignItems: "center", justifyContent: "center", 
                marginBottom: "2rem", border: `1px solid ${P.dorado}50`
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={P.granate} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "2rem", fontWeight: 900, color: P.bordo, marginBottom: "1.5rem", lineHeight: 1.1 }}>
                Plataforma Emotia
              </h3>
              
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: P.chocolate, lineHeight: 1.7, fontSize: "1rem", marginBottom: "3rem" }}>
                Un ecosistema digital donde la inteligencia artificial se encuentra con la sensibilidad humana. Resolviendo el dilema de qué regalar.
              </p>

              <a href="/registro" className="btn-dynamic" style={{
                display: "inline-flex", padding: "16px 36px", borderRadius: "100px", textDecoration: "none",
                fontWeight: 800, fontSize: "0.95rem", alignItems: "center", justifyContent: "center", width: "100%"
              }}>
                Explorar Experiencia
              </a>
            </div>

            {/* Elemento Superpuesto */}
            <div style={{
              position: "absolute", top: "-5%", right: "-10%",
              background: P.dorado, padding: "2rem", borderRadius: "24px",
              width: "280px", zIndex: 3, boxShadow: `0 20px 40px rgba(0,0,0,0.2)`
            }}>
              <div style={{ fontSize: "3rem", color: P.blanco, lineHeight: 0.8, marginBottom: "1rem", fontFamily: "serif", fontWeight: 900 }}>"</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: P.bordo, lineHeight: 1.4 }}>
                Cada regalo cuenta una historia. Nosotros la escribimos.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}