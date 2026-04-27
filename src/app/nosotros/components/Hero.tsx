"use client";

import { useEffect, useRef } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const CSS = `
  .nos-fade { opacity: 0; transform: translateY(30px) scale(0.95); transition: opacity 1s ease, transform 1s ease; }
  .nos-fade.nos-active { opacity: 1; transform: translateY(0) scale(1); }
  @keyframes blobPulse { 0% { transform: scale(1) translate(0, 0); opacity: 0.1; } 50% { transform: scale(1.1) translate(20px, -20px); opacity: 0.15; } 100% { transform: scale(1) translate(0, 0); opacity: 0.1; } }
`;

export default function HeroDinamico() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".nos-fade");
    els?.forEach((el, i) => { setTimeout(() => el.classList.add("nos-active"), 150 + i * 150); });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section ref={ref} style={{ position: "relative", minHeight: "90vh", background: `linear-gradient(135deg, ${P.blanco} 0%, ${P.beige} 100%)`, overflow: "hidden", display: "flex", alignItems: "center", padding: "120px 5% 80px", fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "40vw", height: "40vw", background: `radial-gradient(circle, ${P.granate} 0%, transparent 70%)`, filter: "blur(80px)", opacity: 0.08, borderRadius: "50%", animation: "blobPulse 15s ease-in-out infinite alternate", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${P.dorado} 0%, transparent 70%)`, filter: "blur(100px)", opacity: 0.08, borderRadius: "50%", animation: "blobPulse 20s ease-in-out infinite alternate-reverse", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1320px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "4rem" }}>
          
          {/* COLUMNA IZQUIERDA: HISTORIA */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative" }}>
            <span className="nos-fade" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", border: `1px solid ${P.dorado}50`, background: P.blanco, color: P.bordo, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2rem", fontWeight: 800 }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: P.dorado, display: "inline-block" }}></span>
              Nuestra Esencia
            </span>

            <h1 className="nos-fade" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 5.5vw, 5rem)", lineHeight: 1.1, color: P.bordo, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Regala emociones,<br />
              personaliza <div style={{ position: "relative", display: "inline-block", color: P.granate }}>
                momentos.
                <svg style={{ position: "absolute", bottom: "-5px", left: 0, width: "100%", height: "auto", stroke: P.dorado, opacity: 0.6 }} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 195 15" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </h1>

            <p className="nos-fade" style={{ fontSize: "1.1rem", color: P.chocolate, marginBottom: "1rem", lineHeight: 1.6, maxWidth: "480px" }}>
              Nacimos con un propósito claro: revolucionar la manera en que las personas expresan sus sentimientos, fusionando el talento de nuestros artesanos locales con el poder de la inteligencia artificial.
            </p>
          </div>

          {/* COLUMNA DERECHA: PROMESA */}
          <div style={{ flex: "1 1 min(100%, 500px)", position: "relative", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: P.blanco, borderRadius: "24px", padding: "clamp(2.5rem, 5vw, 3.5rem)", width: "100%", maxWidth: "440px", position: "relative", zIndex: 2, boxShadow: `0 24px 60px rgba(0,0,0,0.08)` }}>
              
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${P.beige}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", border: `1px solid ${P.dorado}50` }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={P.granate} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "2rem", fontWeight: 900, color: P.bordo, marginBottom: "1.5rem", lineHeight: 1.1 }}>
                Nuestra Promesa
              </h3>
              
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: P.chocolate, lineHeight: 1.7, fontSize: "1.05rem", margin: 0 }}>
                Garantizar que cada detalle no solo llegue a tiempo y con la máxima calidad, sino que logre transmitir exactamente el mensaje que tu corazón quiere expresar.
              </p>
            </div>

            <div style={{ position: "absolute", top: "-5%", right: "-10%", background: P.dorado, padding: "2rem", borderRadius: "24px", width: "280px", zIndex: 3, boxShadow: `0 20px 40px rgba(0,0,0,0.15)` }}>
              <div style={{ fontSize: "3rem", color: P.blanco, lineHeight: 0.8, marginBottom: "1rem", fontFamily: "serif", fontWeight: 900 }}>"</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: P.bordo, lineHeight: 1.4 }}>
                La tecnología no reemplaza la emoción; la potencia.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}