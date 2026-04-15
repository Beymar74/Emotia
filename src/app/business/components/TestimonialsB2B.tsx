"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  dorado: "#BC9968",
  doradoOscuro: "#9A7A48",
  choco: "#5C3A2E",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A"
};

const HISTORIAS_CRECIMIENTO = [
  { id: 1, proveedor: "Artesanías La Paz", titulo: "Socio Premium", growth: "250% Ventas", img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=300&auto=format&fit=crop", quote: "Emotia transformó mi taller en un negocio digital de alto nivel. La gestión es increíblemente sencilla." },
  { id: 2, proveedor: "Joyas Tiahuanaco", titulo: "Diseño Ejecutivo", growth: "3x Pedidos", img: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=300&auto=format&fit=crop", quote: "La logística y el empaque premium de Emotia nos abrieron las puertas a clientes corporativos inalcanzables antes." },
  { id: 3, proveedor: "Florería Sopocachi", titulo: "Elegancia Natural", growth: "+1500 Entregas", img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=300&auto=format&fit=crop", quote: "Nuestro rating subió dramáticamente gracias a la facilidad que el Kanban nos da para gestionar los arreglos." },
  { id: 4, proveedor: "Chocolates Gourmet", titulo: "Delicia Boliviana", growth: "+500 Cajas/Mes", img: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=300&auto=format&fit=crop", quote: "El Dashboard nos ayudó a entender qué sabores son los más deseados y optimizar nuestro stock." },
];

const HISTORIAS_INFINITAS = [...HISTORIAS_CRECIMIENTO, ...HISTORIAS_CRECIMIENTO];

export default function TestimonialsB2B() {
  return (
    // ¡Aquí está la magia! Fondo beige en toda la sección
    <section className="py-24 relative overflow-hidden" style={{ background: `${P.beige}40` }}>
      
      <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${P.dorado}, transparent)` }} />

      <style>{`
        @keyframes scroll-infinite { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-380px * 4 - 24px * 4)); } }
        .carrusel-infinito { display: flex; gap: 24px; width: max-content; animation: scroll-infinite 40s linear infinite; }
        .carrusel-infinito:hover { animation-play-state: paused; }
      `}</style>

      <div className="w-full">
        <div className="text-center mb-16 max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[2px] w-12" style={{ backgroundColor: P.granate }}></div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: P.bordoOscuro }}>Crecemos Juntos</p>
              <div className="h-[2px] w-12" style={{ backgroundColor: P.granate }}></div>
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-black leading-[1.1] mb-6" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>
              Proveedores Premium que <br/>crecen con Emotia
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: P.choco }}>
              Conoce las historias reales de talleres, artesanos y tiendas locales que han escalado su impacto y ventas al unirse a nuestra red.
            </p>
          </motion.div>
        </div>

        <div className="relative py-8">
          {/* Sombras laterales usando el beige de fondo */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: `linear-gradient(90deg, rgba(245,230,208,0.7), transparent)` }} />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: `linear-gradient(-90deg, rgba(245,230,208,0.7), transparent)` }} />

          <div className="carrusel-infinito">
            {HISTORIAS_INFINITAS.map((historia, index) => (
              <div 
                key={`${historia.id}-${index}`}
                className="w-[380px] rounded-3xl p-8 flex flex-col justify-between group transition-all duration-500 relative overflow-hidden"
                style={{ 
                  background: P.blanco, // Tarjeta blanca que contrasta con el fondo beige
                  border: `2px solid transparent`, 
                  boxShadow: `0 15px 35px rgba(61,10,26,0.05)`, // Sombra suave del color Bordó
                  flexShrink: 0 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = P.dorado;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${P.bordoNegro}20`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `transparent`;
                  e.currentTarget.style.boxShadow = `0 15px 35px rgba(61,10,26,0.05)`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="absolute top-0 left-0 w-full h-2 transition-colors duration-500 group-hover:bg-[#8E1B3A]" style={{ background: P.dorado }}></div>

                <div>
                  <div className="flex gap-4 items-center mb-6">
                    <div className="h-14 w-14 rounded-[12px] overflow-hidden shadow-md" style={{ border: `2px solid ${P.beige}` }}>
                      <img src={historia.img} alt={historia.proveedor} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold transition-colors duration-300" style={{ color: P.negro }}>{historia.proveedor}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: P.doradoOscuro }}>{historia.titulo}</p>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <Quote size={28} className="absolute -top-2 -left-2 opacity-10" style={{ color: P.granate }} />
                    <p className="text-[13px] font-medium leading-relaxed relative z-10" style={{ color: P.choco }}>"{historia.quote}"</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center px-4 py-3 rounded-xl mt-auto" style={{ background: `${P.beige}20`, border: `1px solid ${P.dorado}40` }}>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: P.bordoOscuro }}>Impacto Emotia</p>
                  <p className="text-lg font-black" style={{ color: P.granate }}>{historia.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}