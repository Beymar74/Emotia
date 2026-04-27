"use client";

import { useEffect, useRef, useState } from "react";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

const CSS = `
  .nos-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .nos-reveal.nos-visible { opacity: 1; transform: translateY(0); }
  
  /* Grid más compacto y centrado verticalmente */
  .propuesta-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: clamp(2rem, 4vw, 4rem); 
    align-items: center; 
    max-width: 1200px; 
    margin: 0 auto; 
  }
  
  @media (max-width: 900px) { .propuesta-grid { grid-template-columns: 1fr; } }
  
  .gallery-img-container { 
    position: absolute; inset: 0; opacity: 0; transform: scale(1.03); 
    transition: opacity 0.8s ease, transform 1.5s ease; 
    border-radius: 20px; overflow: hidden; pointer-events: none; 
  }
  .gallery-img-container.active { opacity: 1; transform: scale(1); z-index: 2; }
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

  // 👇 MAGIA: Auto-Play de imágenes cada 4 segundos 👇
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuresData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Se redujo el padding vertical para que encaje mejor en pantallas pequeñas */}
      <section style={{ background: P.blanco, padding: "60px 24px" }}>
        <div ref={sectionRef} className="nos-reveal propuesta-grid">

          {/* DERECHA: Ahora es la columna izquierda en el código, pero visualmente está balanceada */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", maxHeight: "380px", borderRadius: "20px", boxShadow: `0 20px 40px ${P.granate}15`, background: P.beige }}>
            {featuresData.map((feature, idx) => (
              <div key={feature.num} className={`gallery-img-container ${activeIndex === idx ? 'active' : ''}`}>
                <img src={feature.imgUrl} alt={feature.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bordo}60 0%, transparent 40%)` }} />
              </div>
            ))}
          </div>

          {/* IZQUIERDA: Textos y Lista Limpia */}
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.dorado, display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
                <span style={{ width: "24px", height: "2px", background: P.dorado }}></span> Propuesta de Solución
              </span>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.6rem)", lineHeight: 1.1, color: P.bordo, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                Cómo funciona <span style={{ color: P.granate }}>Emotia.</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: P.chocolate }}>
                Nuestro sistema guía al usuario a través de un flujo intuitivo que transforma la duda en el regalo perfecto.
              </p>
            </div>

            {/* 👇 LISTA LIMPIA Y COMPACTA (Sin líneas, sin efectos de botón) 👇 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {featuresData.map((feature, idx) => (
                <div 
                  key={feature.num} 
                  style={{ 
                    opacity: activeIndex === idx ? 1 : 0.4, // Se ilumina el que está activo en la imagen
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: P.bordo, margin: "0 0 0.3rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: P.granate, fontSize: "0.85rem" }}>{feature.num}</span> {feature.title}
                  </h4>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.5, color: P.chocolate, margin: 0, paddingLeft: "1.8rem" }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}