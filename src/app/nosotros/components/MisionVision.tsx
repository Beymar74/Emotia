"use client";

import { useEffect, useRef } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const CSS = `
  .nos-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
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
        
        {/* 👇 MISIÓN (Fondo Blanco) 👇 */}
        <div className="nos-reveal mv-card" style={{ background: P.blanco, borderRight: `1px solid ${P.beige}`, padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "30px", height: "2px", background: P.dorado }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.dorado }}>Nuestra Misión</span>
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: P.bordo, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Conexión emocional <span style={{ color: P.granate }}>innovadora.</span>
          </h2>
          {/* TEXTO OFICIAL */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate, maxWidth: "500px" }}>
            Facilitar la conexión emocional entre personas mediante una plataforma digital innovadora que integra inteligencia artificial, personalización masiva y logística eficiente para la selección y entrega de regalos significativos en el municipio de La Paz, apoyando al mismo tiempo el crecimiento de los proveedores y artesanos locales.
          </p>
          <div className="mv-watermark" style={{ position: "absolute", bottom: "-5%", right: "-5%", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)", lineHeight: 1, color: P.granate, opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
            M
          </div>
        </div>

        {/* 👇 VISIÓN (Fondo Beige suave) 👇 */}
        <div className="nos-reveal mv-card" style={{ background: `${P.beige}30`, padding: "clamp(4rem, 8vw, 8rem) clamp(2.5rem, 6vw, 6rem)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "30px", height: "2px", background: P.granate }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.granate }}>Nuestra Visión</span>
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: P.bordo, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Ser el <span style={{ color: P.carmesi }}>referente</span><br /> en Bolivia.
          </h2>
          {/* TEXTO OFICIAL */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate, maxWidth: "500px" }}>
            Ser la plataforma de referencia en Bolivia para la compra de regalos personalizados, reconocida por la calidad de su asesor inteligente, por impulsar el emprendimiento de proveedores y artesanos locales, y por su capacidad de transformar cada transacción en un momento emocionalmente memorable.
          </p>
          <div className="mv-watermark" style={{ position: "absolute", bottom: "-5%", right: "0%", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(12rem, 25vw, 20rem)", lineHeight: 1, color: P.bordo, opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
            V
          </div>
        </div>
      </div>
    </>
  );
}