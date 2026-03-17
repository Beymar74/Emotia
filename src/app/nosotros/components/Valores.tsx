"use client";

import { useEffect, useRef } from "react";
// En tu código final: import { useReveal } from "../hooks/useReveal";

// Paleta de colores estricta + el color crema del Header para evitar el corte
const COLORS = {
  granate: "#8E1B3A",
  bordoOscuro: "#5A0F24",
  carmesi: "#AB3A50",
  marronChocolate: "#5C3A2E",
  doradoEnvejecido: "#BC9968",
  beige: "#F5E6D0",
  cremaHeader: "#FAF5EE", // Color exacto del navbar
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .nos-reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Animación Hover para la tarjeta de valor */
  .valor-card {
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .valor-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px rgba(90, 15, 36, 0.08);
  }
  
  /* Animación de la línea indicadora */
  .val-line {
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s;
    transform: scaleY(0);
    transform-origin: center;
    opacity: 0;
  }
  .valor-card:hover .val-line {
    transform: scaleY(1);
    opacity: 1;
  }
`;

// Seleccionados los 3 mejores y reenumerados
const valoresData = [
  {  
    name: "Conexión Emocional",      
    desc: "Cada interacción está diseñada para evocar sentimientos genuinos. Un regalo bien elegido fortalece vínculos y crea recuerdos para toda la vida." 
  },
  { 
    name: "Innovación con Propósito",  
    desc: "Empleamos IA como herramienta concreta para resolver un problema real: la indecisión y el tiempo perdido buscando el regalo perfecto." 
  },
  { 
    name: "Comunidad Creativa",         
    desc: "Somos el puente entre consumidores y artesanos bolivianos. Visibilizamos el talento local y construimos un ecosistema donde todos ganan." 
  }
];

// Reemplazo temporal del hook useReveal para la previsualización
function useLocalReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nos-visible");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ValorCard({ name, desc, index }: { name: string; desc: string; index: number }) {
  const ref = useLocalReveal();
  
  return (
    <div
      ref={ref}
      className="nos-reveal valor-card"
      style={{
        background: COLORS.blanco,
        padding: "clamp(2.5rem, 4vw, 3.5rem) clamp(2rem, 3vw, 2.5rem)", // Aumenté un poco el padding al ser solo 3 tarjetas
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        cursor: "default",
        border: `1px solid rgba(142, 27, 58, 0.04)`, 
        transitionDelay: `${index * 0.15}s`, // Un poco más de retraso entre cada una para una entrada más dramática
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      {/* Línea indicadora animada al hover */}
      <div 
        className="val-line" 
        style={{ 
          position: "absolute", left: 0, top: "15%", bottom: "15%", width: "4px", 
          borderRadius: "0 4px 4px 0",
          background: `linear-gradient(180deg, ${COLORS.granate}, ${COLORS.doradoEnvejecido})`
        }} 
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ 
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", 
          letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.granate, marginBottom: "1.2rem",
          display: "flex", alignItems: "center", gap: "12px"
        }}>
          <span style={{ width: "24px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
          {name}
        </div>
        
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1.05rem", 
          lineHeight: 1.8, color: COLORS.marronChocolate 
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function Valores() {
  const headerRef = useLocalReveal();
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ 
        /* Usamos fondo sólido exactamente igual al header para evitar el corte visual */
        backgroundColor: COLORS.cremaHeader, 
        padding: "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 6rem)", 
        position: "relative"
      }}>
        
        {/* Cabecera de la sección */}
        <div className="nos-reveal" ref={headerRef} style={{ marginBottom: "clamp(3rem, 6vw, 5rem)", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "1.2rem" }}>
            <span style={{ width: "40px", height: "1px", background: `rgba(142, 27, 58, 0.3)` }}></span>
            <span style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", 
              letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.granate
            }}>
              Nuestros Valores
            </span>
            <span style={{ width: "40px", height: "1px", background: `rgba(142, 27, 58, 0.3)` }}></span>
          </div>
          
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            lineHeight: 1.12, color: COLORS.bordoOscuro 
          }}>
            Los principios que <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido }}>nos mueven</em>
          </h2>
          
        </div>

        {/* Grid de Tarjetas: Ahora ideal para 3 elementos */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", 
          gap: "2rem", // Aumenté un poco la separación al ser menos tarjetas
          maxWidth: "1200px", // Reduje un poco el ancho máximo para que 3 tarjetas no se vean excesivamente estiradas
          margin: "0 auto"
        }}>
          {valoresData.map((v, idx) => (
            <ValorCard key={v.name} name={v.name} desc={v.desc} index={idx} />
          ))}
        </div>
        
      </section>
    </>
  );
}