"use client";

import { useEffect, useRef } from "react";

// Paleta de colores estricta según tu solicitud
const COLORS = {
  // Primarios
  granate: "#8E1B3A",
  bordoOscuro: "#5A0F24",
  carmesi: "#AB3A50",
  // Secundarios
  marronChocolate: "#5C3A2E",
  doradoEnvejecido: "#BC9968",
  beige: "#F5E6D0",
  // Neutros
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* Animaciones de entrada (Solo para la izquierda) */
  .nos-fade {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-fade.nos-active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* Animaciones de los halos de luz (Blobs) */
  @keyframes blobPulse {
    0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
    33% { transform: scale(1.1) translate(30px, -50px); opacity: 0.7; }
    66% { transform: scale(0.9) translate(-20px, 20px); opacity: 0.6; }
    100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
  }

  /* Efecto Cristal Base para la izquierda */
  .glass-pill {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  }

  /* Botón interactivo con la paleta nueva */
  .btn-dynamic {
    background: linear-gradient(135deg, ${COLORS.doradoEnvejecido}, #9A7B50);
    color: ${COLORS.negro};
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    box-shadow: 0 0 40px rgba(188, 153, 104, 0.25); /* Resplandor exterior dorado */
  }
  .btn-dynamic:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 50px rgba(188, 153, 104, 0.4);
    letter-spacing: 0.05em;
  }
`;

export default function HeroDinamico() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo anima los elementos que aún conservan la clase .nos-fade (lado izquierdo)
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
          position: "relative",
          minHeight: "100vh",
          backgroundColor: COLORS.bordoOscuro, // Fondo principal
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "80px 5%", 
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* --- FONDOS DINÁMICOS (Blobs) --- */}
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: "40vw", height: "40vw",
          background: `radial-gradient(circle, ${COLORS.granate} 0%, transparent 70%)`,
          filter: "blur(80px)", opacity: 0.5, borderRadius: "50%",
          animation: "blobPulse 15s ease-in-out infinite alternate", zIndex: 0, pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw",
          background: `radial-gradient(circle, ${COLORS.doradoEnvejecido} 0%, transparent 70%)`,
          filter: "blur(100px)", opacity: 0.2, borderRadius: "50%",
          animation: "blobPulse 20s ease-in-out infinite alternate-reverse", zIndex: 0, pointerEvents: "none"
        }} />

        {/* --- CONTENEDOR PRINCIPAL FLUIDO --- */}
        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: "1300px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "4rem"
        }}>
          
          {/* ── COLUMNA IZQUIERDA (Texto orgánico) ── */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative" }}>
            
            <span className="nos-fade" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "30px", border: `1px solid ${COLORS.doradoEnvejecido}40`,
              color: COLORS.doradoEnvejecido, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "2rem", backdropFilter: "blur(5px)"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: COLORS.doradoEnvejecido, display: "inline-block", boxShadow: `0 0 10px ${COLORS.doradoEnvejecido}` }}></span>
              Nuestra Esencia
            </span>

            <h1 className="nos-fade" style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(3.5rem, 6vw, 6.5rem)",
              lineHeight: 1.05, color: COLORS.beige, marginBottom: "1.5rem"
            }}>
              El arte de<br />
              <div style={{ position: "relative", display: "inline-block" }}>
                <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido, fontWeight: 400, paddingRight: "15px" }}>regalar</em>
                <svg style={{ position: "absolute", bottom: "5px", left: 0, width: "100%", height: "auto", stroke: COLORS.doradoEnvejecido, opacity: 0.6 }} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 195 15" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <br />con propósito
            </h1>

            <p className="nos-fade" style={{
              fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)", color: COLORS.gris,
              marginBottom: "3rem", lineHeight: 1.6, maxWidth: "480px", fontWeight: 300
            }}>
              Transformamos la indecisión en una conexión emocional profunda, combinando tecnología e intuición humana.
            </p>

            {/* Píldoras estáticas */}
            <div className="nos-fade" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {[
                { label: "IA Asistente", icon: "✧" },
                { label: "Logística 360°", icon: "∞" },
                { label: "Hiper-Personalizado", icon: "♥" }
              ].map((item, idx) => (
                <div key={idx} className="glass-pill" style={{
                  padding: "10px 20px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "10px"
                }}>
                  <span style={{ color: COLORS.doradoEnvejecido }}>{item.icon}</span>
                  <span style={{ color: COLORS.beige, fontSize: "0.9rem", fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUMNA DERECHA (Tarjetas estáticas sin animación y paleta aplicada) ── */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Tarjeta Principal (Estática, tonos de la paleta) */}
            <div style={{
              background: `rgba(92, 58, 46, 0.8)`, // Marrón chocolate con transparencia
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              padding: "clamp(2rem, 5vw, 3.5rem)", 
              borderRadius: "24px", 
              width: "100%", 
              maxWidth: "440px",
              position: "relative", 
              zIndex: 2,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
            }}>
              {/* Icono de Regalo con gradiente suave */}
              <div style={{ 
                width: "56px", height: "56px", borderRadius: "16px", 
                background: `linear-gradient(135deg, ${COLORS.carmesi}, ${COLORS.marronChocolate})`, 
                display: "flex", alignItems: "center", justifyContent: "center", 
                marginBottom: "2rem", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" 
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.blanco} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  <rect x="3" y="8" width="18" height="12" rx="1" fill="none"/>
                  <path d="M12 8v12"/>
                  <path d="M19 8c0-2-1.5-3.5-3.5-3.5S12 6.5 12 8"/>
                  <path d="M5 8c0-2 1.5-3.5 3.5-3.5S12 6.5 12 8"/>
                  <line x1="3" y1="8" x2="21" y2="8"/>
                </svg>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: COLORS.beige, marginBottom: "1.5rem", lineHeight: 1.2 }}>
                Plataforma Emotia
              </h3>
              
              <p style={{ color: COLORS.gris, lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "3rem", fontWeight: 400, maxWidth: "90%" }}>
                Un ecosistema digital donde la inteligencia artificial se encuentra con la sensibilidad humana. Resolviendo el dilema de qué regalar, creando historias inolvidables.
              </p>

              {/* Botón enlazado a la ruta de registro */}
              <a href="/registro" className="btn-dynamic" style={{
                display: "inline-block", padding: "16px 36px", borderRadius: "40px", textDecoration: "none",
                fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase"
              }}>
                Explorar Experiencia
              </a>
            </div>

            {/* Elemento Superpuesto (Cita Estática) */}
            <div style={{
              position: "absolute", top: "-12%", right: "-20%", /* Ajuste incrementado para separar AÚN MÁS las tarjetas */
              background: `rgba(92, 58, 46, 0.95)`, // Marrón chocolate menos transparente
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              padding: "2rem", borderRadius: "24px",
              width: "260px", zIndex: 3, 
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
              <div style={{ fontSize: "2.5rem", color: COLORS.doradoEnvejecido, lineHeight: 0.8, marginBottom: "1rem", fontFamily: "serif", fontWeight: "bold" }}>"</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLORS.blanco, lineHeight: 1.5 }}>
                Cada regalo cuenta una historia. Nosotros la escribimos.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}