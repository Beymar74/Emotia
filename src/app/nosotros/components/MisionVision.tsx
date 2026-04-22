"use client";

import { useEffect, useRef } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const CSS = `
  .nos-reveal {
    opacity: 0; transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .nos-reveal.nos-visible { opacity: 1; transform: translateY(0); }
  .mv-card { transition: background 0.5s ease; }
  .mv-card:hover .mv-watermark { transform: scale(1.05) rotate(-2deg); }
  .mv-watermark { transition: transform 0.8s ease; }
`;

export default function MisionVision() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("nos-visible"); });
    }, { threshold: 0.15 });

    const els = sectionRef.current?.querySelectorAll(".nos-reveal");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={sectionRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", minHeight: "80vh" }}>
        
        {/* MISIÓN */}
        <div className="nos-reveal mv-card" style={{ background: P.bordo, padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "30px", height: "2px", background: P.dorado }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.dorado }}>Nuestra Misión</span>
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: P.blanco, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Asesorar con inteligencia,<br /><span style={{ color: P.dorado }}>conectar con emoción.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.beige, opacity: 0.8, maxWidth: "500px" }}>
            Proveer a la ciudad de La Paz una plataforma digital con inteligencia artificial que transforme la experiencia de elegir regalos personalizados. Reducimos el estrés y potenciamos el impacto emocional.
          </p>
          <div className="mv-watermark" style={{ position: "absolute", bottom: "-5%", right: "-5%", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)", lineHeight: 1, color: P.blanco, opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
            M
          </div>
        </div>

        {/* VISIÓN */}
        <div className="nos-reveal mv-card" style={{ background: P.blanco, borderLeft: `1px solid ${P.beige}`, padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "30px", height: "2px", background: P.granate }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.granate }}>Nuestra Visión</span>
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: P.bordo, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Ser el ecosistema <span style={{ color: P.carmesi }}>líder</span><br /> en regalos experienciales.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate, maxWidth: "500px" }}>
            Convertirnos en el referente tecnológico y comercial de La Paz para obsequios personalizados, elevando y profesionalizando el ecosistema de creadores locales.
          </p>
          <div className="mv-watermark" style={{ position: "absolute", bottom: "-5%", right: "0%", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)", lineHeight: 1, color: P.granate, opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
            V
          </div>
        </div>
      </div>
    </>
  );
}