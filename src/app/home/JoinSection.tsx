"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, Store } from "lucide-react";
import { C } from "./constants";

export default function JoinSection() {
  const router = useRouter();

  const CARDS = [
    {
      id:      "cliente",
      icon:    <User size={16} strokeWidth={1.5} />,
      imgSrc:  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      title:   "Soy cliente",
      desc:    "Descubre cientos de regalos artesanales bolivianos y usa nuestra IA para encontrar el match perfecto. Entrega hoy en La Paz.",
      btn:     "Crear cuenta gratis",
      action:  () => router.push("/registro"),
      tag:     "Para regalar",
    },
    {
      id:      "productor",
      icon:    <Store size={16} strokeWidth={1.5} />,
      imgSrc:  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      title:   "Soy productor",
      desc:    "¿Eres artesano, empresa o tienda? Vende tus productos, gestiona regalos corporativos y automatiza tu operación con Emotia Business.",
      btn:     "Conocer Business",
      action:  () => router.push("/business"),
      tag:     "Para vender",
    },
  ];

  return (
    <section style={{ background: C.white, padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      {/* Fondo sutil decorativo */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, rgba(198,40,79,0.1), transparent)` }} />
      
      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 500, color: C.choco, lineHeight: 1.1, marginBottom: 12 }}>
            Únete a <strong style={{ color: C.garnet, fontWeight: 900 }}>Emotia</strong>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: C.gray, maxWidth: 500, margin: "0 auto" }}>
            La primera plataforma inteligente de regalos en Bolivia.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover="hover"
              style={{ 
                borderRadius: 20, 
                border: "1px solid rgba(255,209,179,0.5)", 
                background: "white",
                overflow: "hidden", 
                cursor: "pointer", 
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 6px 16px rgba(0,0,0,0.04)"
              }}
              variants={{
                hover: { y: -6, boxShadow: "0 24px 48px rgba(198,40,79,0.12)" }
              }}
              onClick={card.action}
              role="button"
              tabIndex={0}
              aria-label={`Seleccionar opción: ${card.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.action(); } }}
            >
              {/* Contenedor de Imagen */}
              <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
                
                {/* Overlay oscuro superior */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

                {/* Etiqueta / Tag */}
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 3, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <span style={{ color: C.garnet, display: "flex", alignItems: "center" }}>{card.icon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: C.garnet, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {card.tag}
                  </span>
                </div>
                
                {/* Imagen Real */}
                <motion.img 
                  src={card.imgSrc}
                  alt={`Representación de ${card.title}`}
                  variants={{ hover: { scale: 1.06 } }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Contenido */}
              <div style={{ padding: "32px 28px 28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: C.choco, marginBottom: 14, textAlign: "center" }}>
                  {card.title}
                </h3>
                
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: C.gray, lineHeight: 1.6, textAlign: "center", marginBottom: 28 }}>
                    {card.desc}
                  </p>
                </div>

                {/* Botón interactivo */}
                <motion.button
                  variants={{
                    hover: { backgroundColor: C.garnet, color: "#ffffff", boxShadow: "0 8px 24px rgba(198,40,79,0.25)" }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={e => { e.stopPropagation(); card.action(); }}
                  style={{ 
                    width: "100%", 
                    backgroundColor: C.roseLight, 
                    color: C.garnet, 
                    border: "none", 
                    borderRadius: 12, 
                    padding: "15px", 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontWeight: 700, 
                    fontSize: "0.95rem", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: 8, 
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