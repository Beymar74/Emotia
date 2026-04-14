"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, Store } from "lucide-react";

// NUEVA PALETA DE COLORES
const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0"
};

interface JoinSectionProps {
  onOpenRegister?: () => void;
}

export default function JoinSection({ onOpenRegister }: JoinSectionProps) {
  const router = useRouter();

  const CARDS = [
    {
      id:      "cliente",
      icon:    <User size={16} strokeWidth={2} />,
      imgSrc:  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      title:   "Soy cliente",
      desc:    "Descubre cientos de regalos artesanales bolivianos y usa nuestra IA para encontrar el match perfecto. Entrega hoy en La Paz.",
      btn:     "Crear cuenta gratis",
      action:  () => { if (onOpenRegister) onOpenRegister(); else router.push("/registro"); },
      tag:     "Para regalar",
    },
    {
      id:      "productor",
      icon:    <Store size={16} strokeWidth={2} />,
      imgSrc:  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      title:   "Soy productor",
      desc:    "¿Eres artesano, empresa o tienda? Vende tus productos, gestiona regalos corporativos y automatiza tu operación con Emotia Business.",
      btn:     "Conocer Business",
      action:  () => router.push("/business"),
      tag:     "Para vender",
    },
  ];

  return (
    <section style={{ background: P.blanco, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Fondo sutil decorativo */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${P.dorado}50, transparent)` }} />
      <div style={{ position: "absolute", bottom: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: P.beige, opacity: 0.2, filter: "blur(80px)" }} />
      
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <span style={{ width:40, height:1.5, background:P.dorado, display:"inline-block" }} />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", fontWeight:800, color:P.dorado, letterSpacing:"0.15em", textTransform:"uppercase" }}>Sé parte de la comunidad</span>
            <span style={{ width:40, height:1.5, background:P.dorado, display:"inline-block" }} />
          </div>
          <h2 style={{ fontFamily: "'Montserrat', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: P.bordo, lineHeight: 1.1, marginBottom: 16 }}>
            Únete a <span style={{ color: P.granate }}>Emotia</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", color: P.chocolate, maxWidth: 500, margin: "0 auto" }}>
            La primera plataforma inteligente de regalos en Bolivia.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover="hover"
              style={{ 
                borderRadius: 24, 
                border: `1px solid ${P.beige}`, 
                background: P.blanco,
                overflow: "hidden", 
                cursor: "pointer", 
                display: "flex",
                flexDirection: "column",
                boxShadow: `0 10px 30px rgba(0,0,0,0.03)`
              }}
              variants={{
                hover: { y: -8, boxShadow: `0 24px 50px ${P.granate}15`, borderColor: P.dorado }
              }}
              onClick={card.action}
              role="button"
              tabIndex={0}
              aria-label={`Seleccionar opción: ${card.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.action(); } }}
            >
              {/* Contenedor de Imagen */}
              <div style={{ height: 280, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

                <div style={{ position: "absolute", top: 20, left: 20, zIndex: 3, display: "flex", alignItems: "center", gap: 8, background: `${P.blanco}E6`, backdropFilter: "blur(10px)", padding: "8px 16px", borderRadius: 100, boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
                  <span style={{ color: P.granate, display: "flex", alignItems: "center" }}>{card.icon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: P.granate, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {card.tag}
                  </span>
                </div>
                
                <motion.img 
                  src={card.imgSrc}
                  alt={`Representación de ${card.title}`}
                  variants={{ hover: { scale: 1.08 } }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Contenido */}
              <div style={{ padding: "40px 32px 32px", display: "flex", flexDirection: "column", flexGrow: 1, position: "relative" }}>
                <h3 style={{ fontFamily: "'Montserrat', serif", fontSize: "1.8rem", fontWeight: 900, color: P.bordo, marginBottom: 16, textAlign: "center" }}>
                  {card.title}
                </h3>
                
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: P.chocolate, lineHeight: 1.6, textAlign: "center", marginBottom: 32 }}>
                    {card.desc}
                  </p>
                </div>

                {/* Botón interactivo */}
                <motion.button
                  variants={{
                    hover: { backgroundColor: P.granate, color: P.blanco, boxShadow: `0 8px 25px ${P.granate}30` }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={e => { e.stopPropagation(); card.action(); }}
                  style={{ 
                    width: "100%", 
                    backgroundColor: P.beige, 
                    color: P.bordo, 
                    border: "none", 
                    borderRadius: 14, 
                    padding: "16px", 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontWeight: 800, 
                    fontSize: "1rem", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: 10, 
                    transition: "background-color 0.4s ease, color 0.4s ease" 
                  }}
                  aria-hidden="true"
                >
                  {card.btn} <ArrowRight size={18} strokeWidth={2} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}