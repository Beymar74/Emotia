"use client";

import React, { useState, useEffect, useRef } from "react";
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

  .creador-reveal {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .creador-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Tarjetas Editoriales de Creadores (Más compactas) */
  .creador-card {
    background: ${COLORS.blanco};
    border: 1px solid rgba(188, 153, 104, 0.15);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 15px rgba(90, 15, 36, 0.03);
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .creador-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 35px rgba(90, 15, 36, 0.08);
    border-color: rgba(188, 153, 104, 0.35);
  }

  /* Contenedor y efecto de imagen */
  .creador-img-container {
    width: 100%;
    aspect-ratio: 16/10; 
    overflow: hidden;
    position: relative;
    background: ${COLORS.beige};
    border-bottom: 1px solid rgba(188, 153, 104, 0.15);
  }

  .creador-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .creador-card:hover .creador-img {
    transform: scale(1.08);
  }

  /* Badge Flotante (Glassmorphism) */
  .badge-categoria {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 4px 10px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${COLORS.bordoOscuro};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 2;
  }

  /* Botones de Filtro (Más compactos) */
  .filter-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 8px 18px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .filter-btn.active {
    background: ${COLORS.bordoOscuro};
    color: ${COLORS.cremaHeader};
    border: 1.5px solid ${COLORS.bordoOscuro};
    box-shadow: 0 4px 15px rgba(90, 15, 36, 0.15);
  }

  .filter-btn.inactive {
    background: transparent;
    color: ${COLORS.marronChocolate};
    border: 1.5px solid rgba(142, 27, 58, 0.15);
  }

  .filter-btn.inactive:hover {
    border-color: ${COLORS.doradoEnvejecido};
    color: ${COLORS.granate};
    background: rgba(188, 153, 104, 0.05);
    transform: translateY(-2px);
  }
`;

// Base de datos expandida con enlaces de imagen verificados y actualizados
const creadores = [
  { 
    nombre: "Taller Inti", 
    categoria: "Cerámica", 
    imgUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Piezas de cerámica utilitaria y decorativa modeladas a mano, inspiradas en la cosmovisión andina y paisajes de La Paz.", 
    ubicacion: "Sopocachi" 
  },
  { 
    nombre: "Joyería Illimani", 
    categoria: "Orfebrería", 
    imgUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Joyas exclusivas forjadas en plata 925 y oro con incrustaciones de piedras semipreciosas locales como la bolivianita.", 
    ubicacion: "Zona Sur" 
  },
  { 
    nombre: "Sabores de Altura", 
    categoria: "Gastronomía", 
    imgUrl: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Cajas gourmet curadas con chocolates artesanales amazónicos y trufas rellenas de licores autóctonos de edición limitada.", 
    ubicacion: "Miraflores" 
  },
  { 
    nombre: "Tejidos Awana", 
    categoria: "Textiles", 
    imgUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Prendas de alpaca y vicuña hiladas y tejidas en telar tradicional, combinando técnicas ancestrales con diseño contemporáneo.", 
    ubicacion: "El Alto" 
  },
  { 
    nombre: "Arte en Cuero", 
    categoria: "Marroquinería", 
    imgUrl: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Bolsos, billeteras y accesorios de cuero legítimo elaborados con técnicas de repujado y costura manual tradicional.", 
    ubicacion: "Centro Histórico" 
  },
  { 
    nombre: "Botánica Andina", 
    categoria: "Bienestar", 
    imgUrl: "https://images.unsplash.com/photo-1555820598-c6f937e289aa?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Jabones artesanales, sales de baño y esencias naturales creados con plantas medicinales rescatadas del altiplano boliviano.", 
    ubicacion: "Achumani" 
  },
  { 
    nombre: "Madera Nativa", 
    categoria: "Madera", 
    imgUrl: "https://images.unsplash.com/photo-1611078508493-27718e2b8cb8?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Tallados y artículos de decoración para el hogar elaborados con maderas nobles y sostenibles rescatadas de la selva.", 
    ubicacion: "Obrajes" 
  },
  { 
    nombre: "Café Yungueño", 
    categoria: "Gastronomía", 
    imgUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Café de especialidad cultivado en los Yungas, tostado artesanalmente para resaltar las notas frutales y achocolatadas.", 
    ubicacion: "San Miguel" 
  },
  { 
    nombre: "Piedra y Plata", 
    categoria: "Orfebrería", 
    imgUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Diseños minimalistas y modernos que fusionan la plata pura con piedras volcánicas extraídas del nevado Illimani.", 
    ubicacion: "Calacoto" 
  },
  { 
    nombre: "Hilos del Sol", 
    categoria: "Textiles", 
    imgUrl: "https://images.unsplash.com/photo-1528301721190-186c3bd85418?auto=format&fit=crop&q=80&w=800",
    imgAlt: "",
    desc: "Tapices decorativos y cojines tejidos a mano con lana de oveja teñida usando pigmentos 100% naturales y orgánicos.", 
    ubicacion: "Mallasa" 
  }
];

const categorias = ["Todos", ...Array.from(new Set(creadores.map(c => c.categoria)))];

// Hook local para animaciones
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

function CreadorCard({ nombre, categoria, imgUrl, imgAlt, desc, ubicacion, index }: (typeof creadores)[0] & { index: number }) {
  const ref = useLocalReveal();
  
  return (
    <div 
      ref={ref} 
      className="creador-reveal creador-card"
      style={{ transitionDelay: `${(index % 4) * 0.1}s` }} // Retraso calculado para que no tarde demasiado al cargar la grilla
    >
      {/* Sección Superior: Imagen con Zoom y Badge Flotante */}
      <div className="creador-img-container">
        <span className="badge-categoria">{categoria}</span>
        <img src={imgUrl} alt={imgAlt} className="creador-img" loading="lazy" />
      </div>
      
      {/* Sección Inferior: Contenido Textual */}
      <div style={{ padding: "1.2rem 1.2rem 1rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h3 style={{ 
          fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.15rem", 
          color: COLORS.bordoOscuro, lineHeight: 1.2, marginBottom: "0.5rem" 
        }}>
          {nombre}
        </h3>
        
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.85rem", 
          lineHeight: 1.5, color: COLORS.marronChocolate, flexGrow: 1, marginBottom: "1rem" 
        }}>
          {desc}
        </p>
        
        {/* Separador elegante */}
        <div style={{ height: "1px", width: "100%", background: `linear-gradient(90deg, rgba(188,153,104,0.3) 0%, transparent 100%)`, marginBottom: "0.8rem" }} />

        {/* Ubicación */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.doradoEnvejecido} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.05em", color: COLORS.granate }}>
            {ubicacion}, La Paz
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RedCreadores() {
  const [filtro, setFiltro] = useState("Todos");
  const ref = useLocalReveal();
  
  const creadoresFiltrados = filtro === "Todos" ? creadores : creadores.filter(c => c.categoria === filtro);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ 
        background: `linear-gradient(180deg, ${COLORS.cremaHeader} 0%, ${COLORS.beige} 100%)`, 
        padding: "clamp(3rem, 5vw, 5rem) clamp(1.2rem, 4vw, 4rem)" 
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          
          {/* Cabecera de Sección */}
          <div className="creador-reveal" ref={ref} style={{ marginBottom: "clamp(2rem, 4vw, 3rem)", textAlign: "center" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "0.8rem" }}>
              <span style={{ width: "25px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.7rem", 
                letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.doradoEnvejecido 
              }}>
                Red Emotia
              </span>
              <span style={{ width: "25px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
            </div>
            
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3rem)",
              lineHeight: 1.1, color: COLORS.bordoOscuro, marginBottom: "1rem" 
            }}>
              El talento detrás de <em style={{ fontStyle: "italic", color: COLORS.granate }}>cada regalo</em>
            </h2>
            
            <p style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.95rem", lineHeight: 1.6, 
              color: COLORS.marronChocolate, maxWidth: "600px", margin: "0 auto" 
            }}>
              Nuestra IA no recomienda productos de fábrica. Te conecta con creaciones exclusivas de los mejores artesanos, artistas y emprendedores de La Paz.
            </p>
          </div>

          {/* Barra de Filtros */}
          <div className="creador-reveal" style={{ 
            display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", 
            marginBottom: "clamp(2.5rem, 4vw, 3.5rem)", transitionDelay: "0.15s" 
          }}>
            {categorias.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFiltro(cat)}
                className={`filter-btn ${filtro === cat ? 'active' : 'inactive'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grilla de Creadores (Más opciones, responsive perfecto) */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", 
            gap: "1.5rem" 
          }}>
            {creadoresFiltrados.map((creador, idx) => (
              <CreadorCard key={creador.nombre} {...creador} index={idx} />
            ))}
          </div>

          {/* Estado sin Resultados */}
          {creadoresFiltrados.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0", color: COLORS.marronChocolate, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
              No se encontraron creadores en esta categoría.
            </div>
          )}

          {/* Contador Footer */}
          <p className="creador-reveal" style={{ 
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.85rem", 
            color: "rgba(92, 58, 46, 0.6)", marginTop: "3rem", textAlign: "center",
            transitionDelay: "0.3s"
          }}>
            Explorando <strong style={{ color: COLORS.granate, fontWeight: 700 }}>{creadoresFiltrados.length}</strong> de {creadores.length} talleres y creadores paceños.
          </p>

        </div>
      </section>
    </>
  );
}