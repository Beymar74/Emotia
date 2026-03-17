"use client";

import { useEffect, useRef } from "react";
// En tu código final puedes usar: import { useReveal } from "../hooks/useReveal";
// Aquí he integrado la lógica para que la previsualización funcione perfectamente.

const COLORS = {
  granate: "#8E1B3A",
  bordoOscuro: "#5A0F24",
  carmesi: "#AB3A50",
  marronChocolate: "#5C3A2E",
  doradoEnvejecido: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .nos-reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Efecto hover suave en las tarjetas para mayor interactividad (opcional) */
  .mv-card {
    transition: background 0.5s ease;
  }
  .mv-card:hover .mv-watermark {
    transform: scale(1.05) rotate(-2deg);
  }
  .mv-watermark {
    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

export default function MisionVision() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Reemplazo temporal de useReveal para que funcione en esta vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nos-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = sectionRef.current?.querySelectorAll(".nos-reveal");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        ref={sectionRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          minHeight: "80vh", // Asegura una buena altura
        }}
      >
        {/* ── MISIÓN (Lado Oscuro) ── */}
        <div
          className="nos-reveal mv-card"
          style={{
            background: `linear-gradient(145deg, ${COLORS.bordoOscuro} 0%, #3D0918 100%)`, // Gradiente sutil
            padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Icono Misión */}
          <div style={{ marginBottom: "2rem", color: COLORS.doradoEnvejecido }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>

          {/* Ceja */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
            <span style={{ width: "30px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.doradoEnvejecido }}>
              Nuestra Misión
            </span>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.15, color: COLORS.beige, marginBottom: "1.5rem" }}>
            Asesorar con <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido, fontWeight: 400 }}>inteligencia,</em><br /> conectar con emoción
          </h2>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8, color: COLORS.gris, maxWidth: "500px" }}>
            Desarrollar una plataforma digital exclusiva para el municipio de La Paz, Bolivia, que, a través de un asistente basado en IA, simplifique y enriquezca el proceso de selección de regalos personalizados, reduciendo la frustración del usuario y potenciando momentos emocionalmente significativos en cada ocasión especial.
          </p>

          {/* Marca de agua M */}
          <div className="mv-watermark" style={{
            position: "absolute", bottom: "-5%", right: "-5%",
            fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)",
            lineHeight: 1, color: "rgba(188, 153, 104, 0.03)", // Dorado muy transparente
            pointerEvents: "none", userSelect: "none", zIndex: 0
          }}>
            M
          </div>
        </div>

        {/* ── VISIÓN (Lado Claro) ── */}
        <div
          className="nos-reveal mv-card"
          style={{
            background: `linear-gradient(135deg, ${COLORS.blanco} 0%, ${COLORS.beige} 100%)`, // Fondo claro con textura sutil hacia el beige
            padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Icono Visión */}
          <div style={{ marginBottom: "2rem", color: COLORS.granate }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 3v2"></path>
              <path d="M12 19v2"></path>
              <path d="M20 5l-1.5 1.5"></path>
              <path d="M5.5 18.5L4 20"></path>
            </svg>
          </div>

          {/* Ceja */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
            <span style={{ width: "30px", height: "1px", background: COLORS.granate }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.granate }}>
              Nuestra Visión
            </span>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.15, color: COLORS.bordoOscuro, marginBottom: "1.5rem" }}>
            Ser el ecosistema <em style={{ fontStyle: "italic", color: COLORS.carmesi, fontWeight: 400 }}>líder</em><br /> en regalos experienciales
          </h2>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1.05rem", lineHeight: 1.8, color: COLORS.marronChocolate, maxWidth: "500px" }}>
            Consolidarnos como la plataforma de referencia en el municipio de La Paz, Bolivia, para la compra de regalos personalizados, reconocida por su innovación tecnológica, su capacidad de crear conexiones emocionales auténticas y por profesionalizar el mercado artesanal y creativo.
          </p>

          {/* Marca de agua V */}
          <div className="mv-watermark" style={{
            position: "absolute", bottom: "-5%", right: "0%",
            fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)",
            lineHeight: 1, color: "rgba(142, 27, 58, 0.04)", // Granate muy transparente
            pointerEvents: "none", userSelect: "none", zIndex: 0
          }}>
            V
          </div>
        </div>
      </div>
    </>
  );
}