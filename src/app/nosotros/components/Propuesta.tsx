"use client";

import { useEffect, useRef, useState } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

const CSS = `
  .nos-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .nos-reveal.nos-visible { opacity: 1; transform: translateY(0); }
  .propuesta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2.5rem, 5vw, 5rem); align-items: start; max-width: 1320px; margin: 0 auto; }
  @media (max-width: 900px) { .propuesta-grid { grid-template-columns: 1fr; } .sticky-gallery { position: relative !important; top: 0 !important; margin-bottom: 2rem; } }
  .gallery-img-container { position: absolute; inset: 0; opacity: 0; transform: scale(1.03); transition: opacity 0.6s ease, transform 1s ease; border-radius: 24px; overflow: hidden; pointer-events: none; }
  .gallery-img-container.active { opacity: 1; transform: scale(1); z-index: 2; }
  .accordion-item { padding: 1.5rem 0; border-bottom: 1px solid ${P.beige}; cursor: pointer; position: relative; transition: all 0.3s ease; }
  .accordion-title { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.2rem; color: ${P.gris}; transition: color 0.3s ease; display: flex; alignItems: center; gap: 1rem; }
  .accordion-item.active .accordion-title { color: ${P.bordo}; }
  .accordion-content-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s ease; }
  .accordion-item.active .accordion-content-wrapper { grid-template-rows: 1fr; }
  .accordion-content { overflow: hidden; }
`;

const featuresData = [
  { num: "01", imgUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800&h=800", title: "Asesor IA Conversacional", desc: "El asistente identifica el perfil, ocasión y presupuesto para generar recomendaciones precisas en tiempo real." },
  { num: "02", imgUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800&h=800", title: "Personalización Profunda", desc: "Cartas, dedicatorias y empaques. Te permitimos intervenir cada detalle para que lleve tu esencia." },
  { num: "03", imgUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800&h=800", title: "Pago Seguro & Tracking", desc: "Pasarelas protegidas y notificaciones en tiempo real desde la confirmación hasta la entrega." },
  { num: "04", imgUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800&h=800", title: "Comunidad & Fidelización", desc: "Acumula puntos mientras apoyas directamente a la comunidad de artesanos creativos de La Paz." },
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

export default function Propuesta() {
  const sectionRef = useLocalReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background: P.blanco, padding: "80px 24px" }}>
        <div ref={sectionRef} className="nos-reveal propuesta-grid">

          <div className="sticky-gallery" style={{ position: "sticky", top: "120px", height: "fit-content" }}>
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.dorado, display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <span style={{ width: "24px", height: "2px", background: P.dorado }}></span> Propuesta de Solución
              </span>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3rem)", lineHeight: 1.1, color: P.bordo, letterSpacing: "-0.02em" }}>
                Cómo funciona <span style={{ color: P.granate }}>Emotia.</span>
              </h2>
            </div>

            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", maxHeight: "480px", borderRadius: "24px", boxShadow: `0 24px 50px ${P.granate}15`, background: P.beige }}>
              {featuresData.map((feature, idx) => (
                <div key={feature.num} className={`gallery-img-container ${activeIndex === idx ? 'active' : ''}`}>
                  <img src={feature.imgUrl} alt={feature.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bordo}60 0%, transparent 40%)` }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: "2rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: P.chocolate, marginBottom: "3rem" }}>
              Nuestro sistema guía al usuario a través de un flujo intuitivo que transforma la duda en el regalo perfecto.
            </p>
            <div style={{ borderTop: `1px solid ${P.beige}` }}>
              {featuresData.map((feature, idx) => (
                <div key={feature.num} className={`accordion-item ${activeIndex === idx ? 'active' : ''}`} onMouseEnter={() => setActiveIndex(idx)} onClick={() => setActiveIndex(idx)}>
                  <div className="accordion-title">
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: activeIndex === idx ? P.granate : P.gris, transition: "color 0.3s ease" }}>{feature.num}</span>
                    {feature.title}
                  </div>
                  <div className="accordion-content-wrapper">
                    <div className="accordion-content">
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.6, color: P.chocolate, paddingTop: "1rem", paddingLeft: "2.2rem" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}