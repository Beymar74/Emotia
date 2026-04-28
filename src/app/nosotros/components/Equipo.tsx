"use client";

import { useEffect, useRef } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0", negro: "#000000"
};

const CSS = `
  .nos-reveal { opacity: 0; transform: translateY(35px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .nos-reveal.nos-visible { opacity: 1; transform: translateY(0); }
  .equipo-card {
    background: ${P.blanco}; border: 1px solid ${P.beige};
    border-radius: 24px; padding: 40px 32px; transition: all 0.3s ease; display: flex; flex-direction: column;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  }
  .equipo-card:hover { border-color: ${P.dorado}80; transform: translateY(-6px); box-shadow: 0 24px 50px rgba(142, 27, 58, 0.08); }
`;

const miembros = [
  { initials: "BM", nombre: "Mamani Cruz\nBeymar Santiago",  rol: "Desarrollo & Arquitectura" },
  { initials: "BE", nombre: "Burgoa Aliaga\nEvelyn Cristina",  rol: "UX & Diseño de Sistema"   },
  { initials: "GE", nombre: "Gutierrez Huanca\nEinard Angel",  rol: "IA & Lógica de Negocio"   },
  { initials: "MM", nombre: "Menacho Triguero\nMauricio David", rol: "Backend & Integración"     },
];

function useLocalReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("nos-visible"); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function MiembroCard({ initials, nombre, rol, index }: any) {
  const ref = useLocalReveal();
  return (
    <div ref={ref} className="nos-reveal equipo-card" style={{ transitionDelay: `${index * 0.1}s` }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "1.2rem", color: P.blanco, marginBottom: "20px", boxShadow: `0 8px 20px ${P.granate}30` }}>
        {initials}
      </div>
      {/* 👇 TEXTOS ADAPTADOS A FONDO CLARO 👇 */}
      <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: P.bordo, marginBottom: "8px", lineHeight: 1.2, whiteSpace: "pre-line" }}>{nombre}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: P.granate, marginBottom: "24px" }}>{rol}</p>
      <span style={{ display: "inline-block", padding: "6px 14px", border: `1px solid ${P.dorado}80`, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", color: P.chocolate, borderRadius: "100px", background: `${P.dorado}10`, width: "fit-content" }}>
        Core Team
      </span>
    </div>
  );
}

export default function Equipo() {
  const ref = useLocalReveal();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* 👇 FONDO CLARO 👇 */}
      <section style={{ background: P.blanco, padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${P.dorado} 0%, transparent 60%)`, filter: "blur(100px)", opacity: 0.1, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="nos-reveal" ref={ref} style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <span style={{ width: "30px", height: "2px", background: P.granate }}></span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.granate }}>El Equipo</span>
            </div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: P.bordo, maxWidth: "600px", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Las mentes detrás de Emotia.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate, maxWidth: "600px" }}>
              Estudiantes de 8vo Semestre de la EMI, unidos por la pasión de resolver problemas reales con tecnología y creatividad.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {miembros.map((m, idx) => <MiembroCard key={m.initials} initials={m.initials} nombre={m.nombre} rol={m.rol} index={idx} />)}
          </div>
        </div>
      </section>
    </>
  );
}