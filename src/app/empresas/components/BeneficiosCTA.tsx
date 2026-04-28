"use client";

import React, { useEffect, useRef } from "react";
// En tu proyecto de Next.js, asegúrate de importar Link:
// import Link from "next/link";

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
    transform: translateY(25px);
    transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .emp-reveal.nos-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Tarjetas de Beneficios (Modo Oscuro Premium - Optimizadas para 3 items) */
  .beneficio-card {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(245, 230, 208, 0.05);
    border-radius: 16px;
    padding: clamp(1.8rem, 3vw, 2.5rem); /* Padding ligeramente aumentado al ser solo 3 tarjetas */
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    cursor: default;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .beneficio-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${COLORS.carmesi}, ${COLORS.doradoEnvejecido});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .beneficio-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(188, 153, 104, 0.2);
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }

  .beneficio-card:hover::before {
    transform: scaleX(1);
  }

  .beneficio-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(188, 153, 104, 0.1);
    color: ${COLORS.doradoEnvejecido};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.2rem;
    transition: all 0.4s ease;
    border: 1px solid rgba(188, 153, 104, 0.2);
  }

  .beneficio-card:hover .beneficio-icon {
    background: ${COLORS.doradoEnvejecido};
    color: ${COLORS.bordoOscuro};
    transform: scale(1.05) rotate(5deg);
  }

  /* Botones del CTA */
  .btn-cta-primary {
    background: linear-gradient(135deg, ${COLORS.granate}, ${COLORS.carmesi});
    color: ${COLORS.blanco};
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 14px 30px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(142, 27, 58, 0.25);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(142, 27, 58, 0.35);
  }

  .btn-cta-secondary {
    background: transparent;
    color: ${COLORS.granate};
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 12px 28px;
    border-radius: 100px;
    border: 2px solid rgba(142, 27, 58, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  .btn-cta-secondary:hover {
    background: rgba(142, 27, 58, 0.05);
    border-color: ${COLORS.granate};
    transform: translateY(-2px);
  }
`;

// Textos: Seleccionados los 3 mejores y más impactantes para los creadores
const beneficiosArtesanos = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>, 
    title: "Ventas dirigidas por IA",      
    desc: "Nuestra Inteligencia Artificial empareja tu arte exactamente con los clientes que buscan lo que tú creas. Visibilidad garantizada sin pagar publicidad." 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>, 
    title: "Logística Transparente",        
    desc: "Tú concéntrate en crear magia con tus manos; Emotia integra el seguimiento de envíos para que el cliente siempre sepa dónde está su pedido." 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, 
    title: "Comunidad Exclusiva",           
    desc: "Forma parte de la red más selecta de artesanos paceños. Elevamos el valor de lo hecho a mano conectándote con clientes que aprecian tu arte." 
  },
];

// Hook local para animaciones de scroll
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

function BeneficioItem({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) {
  const ref = useLocalReveal();
  
  return (
    <div 
      ref={ref} 
      className="emp-reveal beneficio-card"
      style={{ transitionDelay: `${index * 0.15}s` }} // Efecto cascada más notorio para 3 elementos
    >
      <div className="beneficio-icon">
        {icon}
      </div>
      <h3 style={{ 
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", 
        color: COLORS.beige, marginBottom: "0.8rem", lineHeight: 1.3 
      }}>
        {title}
      </h3>
      <p style={{ 
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.9rem", 
        lineHeight: 1.7, color: "rgba(245, 230, 208, 0.75)" 
      }}>
        {desc}
      </p>
    </div>
  );
}

export default function BeneficiosCTA() {
  const headerRef = useLocalReveal();
  const ctaHeaderRef = useLocalReveal();
  const ctaBodyRef = useLocalReveal();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      {/* ── SECCIÓN 1: BENEFICIOS PARA AFILIADOS (Oscura y Elegante) ── */}
      <section id="beneficios" style={{ 
        background: COLORS.bordoOscuro, 
        padding: "clamp(4rem, 6vw, 6rem) clamp(1.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow de fondo decorativo */}
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${COLORS.granate} 0%, transparent 70%)`, filter: "blur(80px)", opacity: 0.3, pointerEvents: "none" }} />
        
        <div style={{ maxWidth: "1250px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          <div className="emp-reveal" ref={headerRef} style={{ marginBottom: "clamp(3rem, 5vw, 4.5rem)", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "1rem" }}>
              <span style={{ width: "30px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", 
                letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.doradoEnvejecido
              }}>
                ¿Por qué afiliarse?
              </span>
              <span style={{ width: "30px", height: "1px", background: COLORS.doradoEnvejecido }}></span>
            </div>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", 
              lineHeight: 1.1, color: COLORS.beige, maxWidth: "750px", margin: "0 auto" 
            }}>
              Impulsa tu arte, nosotros <em style={{ fontStyle: "italic", color: COLORS.doradoEnvejecido, fontWeight: 400 }}>encontramos</em> a quien lo busca.
            </h2>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", /* Adaptado perfectamente para 3 columnas */
            gap: "2rem" 
          }}>
            {beneficiosArtesanos.map((item, i) => (
              <BeneficioItem key={i} icon={item.icon} title={item.title} desc={item.desc} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 2: CALL TO ACTION FINAL (Clara y Convincente) ── */}
      <section style={{ 
        background: `linear-gradient(180deg, ${COLORS.cremaHeader} 0%, ${COLORS.beige} 100%)`, 
        padding: "clamp(4rem, 6vw, 6rem) clamp(1.5rem, 4vw, 4rem)",
        textAlign: "center",
        position: "relative"
      }}>
        {/* Textura sutil de ruido */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, zIndex: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          <div className="emp-reveal" ref={ctaHeaderRef}>
            {/* Icono de Estrellas o Magia */}
            <div style={{ 
              width: "56px", height: "56px", margin: "0 auto 1.5rem", 
              background: `linear-gradient(135deg, ${COLORS.doradoEnvejecido}, #9A7B50)`, 
              borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", 
              color: COLORS.blanco, boxShadow: "0 8px 20px rgba(188, 153, 104, 0.3)" 
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 4.5vw, 3.2rem)", 
              lineHeight: 1.1, color: COLORS.bordoOscuro, marginBottom: "1rem" 
            }}>
              ¿Eres un creador local? <br /><em style={{ fontStyle: "italic", color: COLORS.granate }}>Únete</em> a nuestra red.
            </h2>
          </div>

          <div className="emp-reveal" ref={ctaBodyRef} style={{ transitionDelay: "0.2s" }}>
            <p style={{ 
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1.05rem", 
              lineHeight: 1.6, color: COLORS.marronChocolate, marginBottom: "2rem" 
            }}>
              Forma parte de Emotia y lleva tus creaciones directamente a las personas correctas. 
              El proceso de afiliación está diseñado exclusivamente para potenciar el talento en La Paz, sin complicaciones.
            </p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <a href="/afiliacion" className="btn-cta-primary">
                Solicitar afiliación
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#como-funciona-proveedor" className="btn-cta-secondary">
                Conocer más
              </a>
            </div>
            
            <p style={{ 
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(92, 58, 46, 0.6)", 
              marginTop: "1.8rem", letterSpacing: "0.05em", fontWeight: 500
            }}>
              ✓ Sin costo de inscripción inicial &nbsp;·&nbsp; ✓ Autonomía creativa &nbsp;·&nbsp; ✓ Crecimiento local
            </p>
          </div>

        </div>
      </section>
    </>
  );
}