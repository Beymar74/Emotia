"use client";

import React, { useEffect, useRef } from "react";

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

  .emp-reveal { 
    opacity: 0; 
    transform: translateY(20px); 
    transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); 
  }
  .emp-reveal.emp-visible { 
    opacity: 1; 
    transform: translateY(0); 
  }
  
  .emp-fade { 
    opacity: 0; 
    transform: translateY(15px); 
    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); 
  }
  .emp-fade.emp-active { 
    opacity: 1; 
    transform: translateY(0); 
  }

  /* Animación del Ticker (Cinta infinita) */
  @keyframes empScroll { 
    0% { transform: translateX(0); } 
    100% { transform: translateX(-50%); } 
  }
  .emp-ticker-inner { 
    animation: empScroll 35s linear infinite; /* Un poco más lento y elegante */
    display: flex;
    width: max-content;
  }
  .emp-ticker-inner:hover { 
    animation-play-state: paused; 
  }
`;

// Base de datos enfocada en los Artesanos y Creadores reales de La Paz
const creadores = [
  { nombre: "Taller Inti",          categoria: "Cerámica" },
  { nombre: "Joyería Illimani",     categoria: "Orfebrería" },
  { nombre: "Sabores de Altura",    categoria: "Gastronomía" },
  { nombre: "Tejidos Awana",        categoria: "Textiles" },
  { nombre: "Arte en Cuero",        categoria: "Marroquinería" },
  { nombre: "Botánica Andina",      categoria: "Bienestar" },
  { nombre: "Madera Nativa",        categoria: "Tallado en Madera" },
  { nombre: "Café Yungueño",        categoria: "Café de Especialidad" },
  { nombre: "Piedra y Plata",       categoria: "Joyería Fina" },
  { nombre: "Hilos del Sol",        categoria: "Arte Textil" },
];

export default function HeroComunidad() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".emp-fade");
    els?.forEach((el, i) => setTimeout(() => el.classList.add("emp-active"), 100 + i * 120)); // Cascada más rápida
  }, []);

  // Duplicamos el array para que el scroll infinito funcione sin saltos
  const tickerItems = [...creadores, ...creadores];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      {/* ── SECCIÓN HERO (Fondo oscuro y compacto) ── */}
      <section style={{ 
        background: `linear-gradient(150deg, ${COLORS.bordoOscuro} 0%, ${COLORS.granate} 100%)`, 
        padding: "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 5rem) clamp(3rem, 6vw, 4rem)", /* Paddings ajustados para evitar cortes */
        position: "relative", 
        overflow: "hidden" 
      }}>
        {/* Texturas y brillos de fondo */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.03)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.doradoEnvejecido}20 0%, transparent 65%)`, pointerEvents: "none" }} />
        
        <div ref={ref} style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Badge */}
          <div className="emp-fade" style={{ 
            display: "inline-flex", alignItems: "center", gap: "8px", 
            background: "rgba(188, 153, 104, 0.15)", border: `1px solid rgba(188, 153, 104, 0.3)`, 
            borderRadius: "100px", padding: "6px 16px", marginBottom: "1.5rem" 
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: COLORS.doradoEnvejecido, display: "inline-block" }}></span>
            <span style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.7rem", 
              letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.doradoEnvejecido 
            }}>
              Comunidad Emotia
            </span>
          </div>
          
          {/* Título */}
          <h1 className="emp-fade" style={{ 
            fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.2rem)", /* Más compacto para pantallas medianas */
            lineHeight: 1.08, color: COLORS.cremaHeader, marginBottom: "1rem", maxWidth: "800px" 
          }}>
            El talento local que da <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido, fontWeight: 400 }}>vida</em> a cada regalo
          </h1>
          
          {/* Descripción */}
          <p className="emp-fade" style={{ 
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1rem, 1.5vw, 1.1rem)", 
            lineHeight: 1.7, color: "rgba(245, 230, 208, 0.8)", maxWidth: "600px", marginBottom: "2.5rem" 
          }}>
            Una red curada de los mejores artesanos, artistas y diseñadores de La Paz. Cada pieza cuenta una historia, cada regalo impulsa el trabajo de nuestra comunidad creativa.
          </p>
          
          {/* Estadísticas */}
          <div className="emp-fade" style={{ 
            display: "flex", flexWrap: "wrap", gap: "clamp(1.5rem, 4vw, 3rem)", 
            paddingTop: "1.5rem", borderTop: "1px solid rgba(188, 153, 104, 0.2)" 
          }}>
            {[
              { num: "50+", label: "Creadores Locales" }, 
              { num: "12", label: "Categorías Artesanales" }, 
              { num: "100%", label: "Hecho en La Paz" }
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: COLORS.doradoEnvejecido, lineHeight: 1, marginBottom: "0.4rem" }}>
                  {num}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245, 230, 208, 0.6)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CINTA ANIMADA (Ticker Claro y Premium) ── */}
      <div style={{ 
        background: COLORS.cremaHeader, 
        borderBottom: `1px solid rgba(142, 27, 58, 0.1)`, 
        padding: "1.2rem 0", 
        overflow: "hidden" 
      }}>
        <div className="emp-ticker-inner">
          {tickerItems.map(({ nombre, categoria }, i) => (
            <div key={i} style={{ 
              display: "flex", alignItems: "center", gap: "0.8rem", 
              padding: "0 2rem", whiteSpace: "nowrap" 
            }}>
              <span style={{ color: COLORS.doradoEnvejecido, fontSize: "0.9rem" }}>✦</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: COLORS.bordoOscuro }}>
                {nombre}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.8rem", color: COLORS.marronChocolate, letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.7 }}>
                {categoria}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}