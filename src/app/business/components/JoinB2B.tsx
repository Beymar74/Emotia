"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Star, Gift, Sparkles, TrendingUp } from "lucide-react";

// Paleta Oficial de Emotia Business
const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  carmesi: "#AB3A50", // Añadimos Carmesí para el degradado vibrante
  dorado: "#BC9968",
  doradoOscuro: "#9A7A48",
  choco: "#5C3A2E",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A"
};

export default function JoinB2B() {
  const router = useRouter();

  return (
    <div className="relative font-sans">
      
      {/* ========================================== */}
      {/* PARTE 1: TARJETA DE VALOR (Fondo Blanco Limpio) */}
      {/* ========================================== */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: P.blanco }}>
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[2px] w-8 md:w-12" style={{ backgroundColor: P.dorado }}></div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: P.granate }}>
                  Emotia Business
                </p>
                <div className="h-[2px] w-8 md:w-12" style={{ backgroundColor: P.dorado }}></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>
                Impulsa tus ventas con <br/>nuestra red inteligente.
              </h2>
              <p className="text-lg" style={{ color: P.choco }}>
                ¿Eres artesano, tienes una tienda o creas experiencias únicas? Únete a nuestra plataforma y deja que nuestra IA conecte tus productos con los clientes ideales.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 md:p-12 rounded-[32px] relative overflow-hidden"
            style={{ 
              background: `${P.beige}20`, // La tarjeta tiene un sutil tono beige para destacar del fondo blanco
              border: `2px solid ${P.dorado}40`, 
              boxShadow: `0 30px 60px rgba(61,10,26,0.08)` 
            }}
          >
            {/* Estrella dorada gigante en el fondo */}
            <div className="absolute -top-20 -right-20 opacity-10 pointer-events-none rotate-12">
              <Star size={350} fill={P.dorado} color={P.dorado} />
            </div>

            {/* Imagen Izquierda */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4" style={{ borderColor: P.blanco }}>
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" 
                alt="Tienda y Productor Emotia" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full flex gap-2 items-center shadow-lg" style={{ background: P.blanco }}>
                <Gift size={16} style={{ color: P.granate }} /> 
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: P.bordoNegro }}>Para Vender</span>
              </div>
            </div>

            {/* Contenido Derecha */}
            <div className="text-left space-y-6 relative z-10">
              <div 
                className="inline-flex gap-4 items-center p-4 rounded-2xl"
                style={{ background: P.blanco, border: `1px solid ${P.beige}` }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${P.beige}50` }}>
                  <TrendingUp size={24} style={{ color: P.granate }} />
                </div>
                <div>
                  <h4 className="text-base font-bold" style={{ color: P.bordoNegro }}>Mayor alcance, gestión simplificada</h4>
                  <p className="text-sm mt-0.5 font-medium" style={{ color: P.choco }}>Llega a más personas en La Paz y automatiza tu operación.</p>
                </div>
              </div>
              
              <p className="leading-relaxed text-[15px] font-medium" style={{ color: P.choco }}>
                Vende tus productos, gestiona regalos corporativos y automatiza tu operación con Emotia Business. Nosotros nos encargamos de que tu trabajo sea descubierto por quienes buscan regalos excepcionales.
              </p>
              
              <button
                onClick={() => router.push("/business/proveedores")}
                className="text-sm font-bold flex items-center gap-3 group w-full justify-center p-4 rounded-xl transition-all duration-300 shadow-lg"
                style={{ 
                  background: P.granate, 
                  color: P.blanco,
                  border: `2px solid ${P.granate}` 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = P.bordoOscuro;
                  e.currentTarget.style.borderColor = P.bordoOscuro;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = P.granate;
                  e.currentTarget.style.borderColor = P.granate;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Crea una cuenta de Productor 
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* PARTE 2: BANNER OSCURO CTA (Full Paleta) */}
      {/* ========================================== */}
      <section className="py-24 px-6 relative overflow-hidden">
        
        {/* FONDO VIBRANTE: Usamos el degradado completo de oscuros a rojos */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${P.bordoNegro} 0%, ${P.bordoOscuro} 50%, ${P.granate} 100%)` 
        }}></div>
        
        {/* Decoración abstracta SVG */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill={P.dorado} d="M45.7,-76.1C58.9,-69.3,69.1,-55.3,77.1,-40.5C85.1,-25.7,90.8,-10.1,88.7,4.6C86.5,19.3,76.5,33.1,65.2,44.3C53.9,55.5,41.2,64.2,26.9,70.5C12.5,76.8,-3.4,80.8,-18.4,78.3C-33.3,75.8,-47.4,66.8,-59.5,55.3C-71.6,43.8,-81.8,29.8,-86.1,13.8C-90.4,-2.2,-88.9,-20.1,-81.1,-35.1C-73.3,-50.1,-59.3,-62.1,-44.6,-68.5C-29.8,-74.9,-14.9,-75.7,0.7,-76.8C16.3,-77.8,32.6,-82.9,45.7,-76.1Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Foco de luz dorada en el centro para resaltar el texto */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: P.dorado }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={48} className="mx-auto mb-6 opacity-90" style={{ color: P.dorado }} />
            
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-white drop-shadow-md" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Sé parte de la comunidad
            </h2>
            <p className="text-xl mb-12 font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: P.beige }}>
              Únete a la primera plataforma inteligente de regalos en Bolivia.
            </p>
            
            {/* BOTÓN FINAL DE ALTO IMPACTO: Degradado Dorado */}
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/business/proveedores")}
              className="px-12 py-5 rounded-full font-black text-lg shadow-2xl flex items-center justify-center gap-3 mx-auto group transition-all duration-300"
              style={{ 
                background: `linear-gradient(90deg, ${P.dorado}, ${P.doradoOscuro})`, 
                color: P.bordoNegro,
                boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${P.dorado}60`
              }}
            >
              Únete como Productor 
              <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: P.bordoNegro }} />
            </motion.button>
            
            <p className="mt-6 text-sm font-bold opacity-80" style={{ color: P.beige }}>
              Empieza a vender y automatizar tu operación hoy.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}