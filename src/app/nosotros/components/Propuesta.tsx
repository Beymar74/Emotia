"use client";

import { useEffect, useRef, useState } from "react";
// En tu código final: import { useReveal } from "../hooks/useReveal";

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
    transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nos-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Contenedor principal responsive (Espaciado más compacto) */
  .propuesta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2.5rem, 5vw, 5rem);
    align-items: start;
    max-width: 1250px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    .propuesta-grid {
      grid-template-columns: 1fr;
    }
    .sticky-gallery {
      position: relative !important;
      top: 0 !important;
      margin-bottom: 2rem;
    }
  }

  /* Animación de la Galería de Imágenes (Crossfade) */
  .gallery-img-container {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: scale(1.03);
    transition: opacity 0.6s ease, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    border-radius: 20px;
    overflow: hidden;
    pointer-events: none;
  }
  .gallery-img-container.active {
    opacity: 1;
    transform: scale(1);
    z-index: 2;
  }

  /* Acordeón Interactivo (Más compacto) */
  .accordion-item {
    padding: 1.2rem 0; /* Reducido para evitar exceso de scroll */
    border-bottom: 1px solid rgba(142, 27, 58, 0.1);
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .accordion-item::before {
    content: '';
    position: absolute;
    left: -16px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, ${COLORS.granate}, ${COLORS.doradoEnvejecido});
    transform: scaleY(0);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    border-radius: 4px;
  }
  .accordion-item.active::before {
    transform: scaleY(1);
  }

  .accordion-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(1.2rem, 2vw, 1.45rem); /* Letra ligeramente más pequeña */
    color: rgba(92, 58, 46, 0.45);
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .accordion-item.active .accordion-title {
    color: ${COLORS.granate};
  }
  
  /* El truco del Grid para animar el alto del contenido limpiamente */
  .accordion-content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .accordion-item.active .accordion-content-wrapper {
    grid-template-rows: 1fr;
  }
  
  .accordion-content {
    overflow: hidden;
  }
`;

const featuresData = [
  { 
    num: "01",
    imgUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800&h=800", 
    imgAlt: "",
    title: "Asesor IA Conversacional",   
    desc: "El asistente identifica el perfil del destinatario, la ocasión y el presupuesto, luego filtra el catálogo y genera recomendaciones precisas en tiempo real. Adiós a la indecisión." 
  },
  { 
    num: "02",
    imgUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800&h=800", 
    imgAlt: "",
    title: "Personalización Profunda",    
    desc: "Cartas, dedicatorias, estilos y empaques. Te permitimos intervenir cada detalle del regalo para que lleve tu esencia y se vuelva verdaderamente inolvidable." 
  },
  { 
    num: "03",
    imgUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800&h=800", 
    imgAlt: "",
    title: "Pago Seguro & Tracking",      
    desc: "Pasarelas de pago protegidas y notificaciones en tiempo real desde la confirmación hasta la entrega final del pedido. Transparencia total que te da tranquilidad." 
  },
  { 
    num: "04",
    imgUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800&h=800", 
    imgAlt: "",
    title: "Comunidad & Fidelización", 
    desc: "Tus compras acumulan puntos mientras apoyas directamente a la comunidad de artesanos creativos de La Paz. Un ecosistema donde todos ganan." 
  },
];

// Reemplazo temporal del hook useReveal
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

export default function Propuesta() {
  const sectionRef = useLocalReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ 
        background: COLORS.cremaHeader, 
        padding: "clamp(4rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem)" // Ligeramente menos padding global
      }}>
        <div ref={sectionRef} className="nos-reveal propuesta-grid">

          {/* ── IZQUIERDA: Galería Dinámica Sticky ── */}
          <div className="sticky-gallery" style={{ 
            position: "sticky", 
            top: "12vh", // Usa viewport height para que se adapte mejor a laptops vs monitores grandes
            height: "fit-content" 
          }}>
            
            {/* Títulos */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", 
                letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.doradoEnvejecido, 
                display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" 
              }}>
                <span style={{ width: "20px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
                Propuesta de Solución
              </span>
              
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", 
                lineHeight: 1.05, color: COLORS.bordoOscuro 
              }}>
                Cómo <em style={{ fontStyle: "italic", color: COLORS.granate }}>funciona</em> Emotia
              </h2>
            </div>

            {/* Contenedor de Imagen Compacto y Cuadrado */}
            <div style={{ 
              position: "relative", 
              width: "100%", 
              aspectRatio: "1/1", // Formato cuadrado para que no se corte hacia abajo
              maxHeight: "440px", // Límite máximo de altura para laptops
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(90, 15, 36, 0.08)",
              background: COLORS.beige
            }}>
              {/* Overlay sutil */}
              <div style={{ position: "absolute", inset: 0, background: "rgba(90, 15, 36, 0.03)", zIndex: 10, borderRadius: "20px", pointerEvents: "none" }} />
              
              {/* Imágenes */}
              {featuresData.map((feature, idx) => (
                <div 
                  key={feature.num} 
                  className={`gallery-img-container ${activeIndex === idx ? 'active' : ''}`}
                >
                  <img 
                    src={feature.imgUrl} 
                    alt={feature.imgAlt}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* ── DERECHA: Acordeón Interactivo (Más condensado) ── */}
          <div style={{ paddingTop: "clamp(0rem, 3vw, 2rem)" }}>
            <p style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", 
              lineHeight: 1.6, color: COLORS.marronChocolate, marginBottom: "2rem" 
            }}>
              Nuestro sistema guía al usuario a través de un flujo intuitivo que transforma la duda en el regalo perfecto. Pasa el cursor por cada paso para descubrirlo.
            </p>

            <div style={{ borderTop: `1px solid rgba(142, 27, 58, 0.1)` }}>
              {featuresData.map((feature, idx) => (
                <div 
                  key={feature.num}
                  className={`accordion-item ${activeIndex === idx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="accordion-title">
                    <span style={{ 
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, 
                      color: activeIndex === idx ? COLORS.doradoEnvejecido : "rgba(188, 153, 104, 0.4)",
                      transition: "color 0.3s ease"
                    }}>
                      {feature.num}
                    </span>
                    {feature.title}
                  </div>
                  
                  {/* Contenedor animado del texto */}
                  <div className="accordion-content-wrapper">
                    <div className="accordion-content">
                      <p style={{ 
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.95rem", 
                        lineHeight: 1.7, color: COLORS.marronChocolate, 
                        paddingTop: "0.8rem", paddingLeft: "2.2rem", paddingBottom: "0.5rem"
                      }}>
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