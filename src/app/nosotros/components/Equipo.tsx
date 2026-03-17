"use client";

import { useEffect, useRef } from "react";
// En tu código final usarás: import { useReveal } from "../hooks/useReveal";

// Paleta de colores estricta
const COLORS = {
  granate: "#8E1B3A",
  bordoOscuro: "#5A0F24",
  carmesi: "#AB3A50",
  marronChocolate: "#5C3A2E",
  doradoEnvejecido: "#BC9968",
  beige: "#F5E6D0",
  cremaHeader: "#FAF5EE",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#000000",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .nos-reveal {
    opacity: 0;
    transform: translateY(35px);
    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Efecto Glassmorphism para las tarjetas del equipo */
  .equipo-card {
    background: rgba(245, 230, 208, 0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(245, 230, 208, 0.08);
    border-radius: 16px;
    padding: clamp(1.8rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    cursor: default;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Hover de la tarjeta */
  .equipo-card:hover {
    background: rgba(245, 230, 208, 0.08);
    border-color: rgba(188, 153, 104, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  /* Animación sutil del avatar al hacer hover en la tarjeta */
  .equipo-card:hover .equipo-avatar {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(188, 153, 104, 0.3);
    border-color: ${COLORS.doradoEnvejecido};
  }

  .equipo-avatar {
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

const miembros = [
  { initials: "BM", nombre: "Mamani Cruz\nBeymar Santiago",   rol: "Desarrollo & Arquitectura" },
  { initials: "BE", nombre: "Burgoa Aliaga\nEvelyn Cristina",  rol: "UX & Diseño de Sistema"   },
  { initials: "GE", nombre: "Gutierrez Huanca\nEinard Angel",  rol: "IA & Lógica de Negocio"   },
  { initials: "MM", nombre: "Menacho Triguero\nMauricio David", rol: "Backend & Integración"     },
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

function MiembroCard({ initials, nombre, rol, index }: { initials: string; nombre: string; rol: string; index: number }) {
  const ref = useLocalReveal();
  
  return (
    <div
      ref={ref}
      className="nos-reveal equipo-card"
      style={{ transitionDelay: `${index * 0.15}s` }} // Efecto cascada escalonado
    >
      <div 
        className="equipo-avatar"
        style={{ 
          width: "56px", 
          height: "56px", 
          borderRadius: "50%", 
          background: `linear-gradient(135deg, ${COLORS.granate}, ${COLORS.carmesi})`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontFamily: "'Playfair Display', serif", 
          fontWeight: 700, 
          fontSize: "1.1rem", 
          color: COLORS.beige, 
          border: `2px solid rgba(188, 153, 104, 0.3)`, 
          marginBottom: "1.2rem" 
        }}
      >
        {initials}
      </div>
      
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", 
        color: COLORS.beige, marginBottom: "0.5rem", lineHeight: 1.3, whiteSpace: "pre-line" 
      }}>
        {nombre}
      </h3>
      
      <p style={{ 
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.7rem", 
        letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.doradoEnvejecido, marginBottom: "1.2rem" 
      }}>
        {rol}
      </p>
      
      {/* Badge / Etiqueta de contribución */}
      <span style={{ 
        display: "inline-block", padding: "0.3rem 0.8rem", border: `1px solid rgba(188, 153, 104, 0.3)`, 
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
        color: "rgba(245, 230, 208, 0.6)", borderRadius: "30px", background: "rgba(255, 255, 255, 0.02)"
      }}>
        Contribución 100%
      </span>
    </div>
  );
}

export default function Equipo() {
  const ref = useLocalReveal();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ 
        background: COLORS.bordoOscuro, 
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)",
        position: "relative",
        overflow: "hidden"
      }}>
        
        {/* Decoración de fondo (Brillo suave sutil) */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: "50vw", height: "50vw",
          background: `radial-gradient(circle, ${COLORS.granate} 0%, transparent 60%)`,
          filter: "blur(100px)", opacity: 0.3, borderRadius: "50%", pointerEvents: "none"
        }} />

        {/* Cabecera */}
        <div className="nos-reveal" ref={ref} style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <span style={{ width: "30px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
            <span style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", 
              letterSpacing: "0.4em", textTransform: "uppercase", color: COLORS.doradoEnvejecido
            }}>
              El Equipo
            </span>
          </div>

          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            lineHeight: 1.12, color: COLORS.beige, marginBottom: "1.2rem" 
          }}>
            Las mentes detrás de <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido }}>Emotia</em>
          </h2>
          
          <p style={{ 
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8, 
            color: "rgba(245, 230, 208, 0.7)", maxWidth: "600px", marginBottom: "clamp(3rem, 6vw, 4.5rem)" 
          }}>
            Somos estudiantes de 8vo Semestre de la Escuela Militar de Ingeniería &ldquo;Mcal. Antonio José de Sucre&rdquo;, unidos por la pasión de resolver problemas reales con tecnología y creatividad.
          </p>
        </div>

        {/* Grid del equipo */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", 
          gap: "1.5rem",
          position: "relative",
          zIndex: 1
        }}>
          {miembros.map((m, idx) => (
            <MiembroCard key={m.initials} initials={m.initials} nombre={m.nombre} rol={m.rol} index={idx} />
          ))}
        </div>
      </section>
    </>
  );
}