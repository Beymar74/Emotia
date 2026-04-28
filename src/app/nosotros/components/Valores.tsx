"use client";

import { useEffect, useRef } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

const CSS = `
  .nos-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .nos-reveal.nos-visible { opacity: 1; transform: translateY(0); }
  .valor-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .valor-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(142, 27, 58, 0.1); border-color: ${P.dorado}; }
`;

const valoresData = [
  { name: "Conexión Emocional", desc: "Cada interacción evoca sentimientos genuinos. Un regalo bien elegido crea recuerdos para toda la vida." },
  { name: "Innovación con Propósito", desc: "Usamos la IA como herramienta para resolver un problema real: la indecisión y el tiempo perdido." },
  { name: "Comunidad Creativa", desc: "Somos el puente entre consumidores y artesanos bolivianos. Un ecosistema donde todos ganan." }
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

function ValorCard({ name, desc, index }: { name: string; desc: string; index: number }) {
  const ref = useLocalReveal();
  return (
    <div ref={ref} className="nos-reveal valor-card" style={{ background: P.blanco, padding: "40px", borderRadius: "24px", border: `1px solid ${P.beige}`, transitionDelay: `${index * 0.1}s`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", color: P.granate, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ width: "24px", height: "2px", background: P.dorado }}></span>{name}
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate }}>{desc}</p>
    </div>
  );
}

export default function Valores() {
  const headerRef = useLocalReveal();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ backgroundColor: `${P.beige}30`, padding: "80px 24px" }}>
        <div className="nos-reveal" ref={headerRef} style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ width: "30px", height: "2px", background: P.dorado }}></span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.dorado }}>Nuestros Valores</span>
            <span style={{ width: "30px", height: "2px", background: P.dorado }}></span>
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 2.6rem)", color: P.bordo, letterSpacing: "-0.02em" }}>Los principios que nos mueven</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
          {valoresData.map((v, idx) => <ValorCard key={v.name} name={v.name} desc={v.desc} index={idx} />)}
        </div>
      </section>
    </>
  );
}