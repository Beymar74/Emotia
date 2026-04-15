"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, PackagePlus, Banknote } from "lucide-react";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  carmesi: "#AB3A50", // <--- AGREGAR ESTA LÍNEA
  dorado: "#BC9968",
  doradoOscuro: "#9A7A48",
  choco: "#5C3A2E",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A"
};

export default function StepsB2B() {
  const pasos = [
    { 
      num: "1", 
      icon: <UserPlus size={32} color={P.bordoNegro} />,
      title: "Crea tu perfil corporativo", 
      desc: "Regístrate en minutos y configura la identidad sofisticada de tu taller o tienda." 
    },
    { 
      num: "2", 
      icon: <PackagePlus size={32} color={P.bordoNegro} />,
      title: "Sube tu catálogo premium", 
      desc: "Añade tus regalos, define tus precios y destaca tus opciones de personalización." 
    },
    { 
      num: "3", 
      icon: <Banknote size={32} color={P.bordoNegro} />,
      title: "Recibe y gestiona pedidos", 
      desc: "Atiende a clientes de alto valor y gestiona todo el flujo fácilmente con nuestro Kanban." 
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${P.bordoOscuro} 0%, ${P.bordoNegro} 100%)` }}>
      
      {/* Elemento de diseño de fondo sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: P.dorado }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: P.carmesi }} />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Encabezado de la Sección */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: P.dorado }}>
            Rápido y Sencillo
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white drop-shadow-md" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Inicia tu camino como Socio Premium en 3 Pasos
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-16" style={{ color: P.beige, opacity: 0.9 }}>
            Hemos simplificado el proceso para que puedas empezar a vender hoy mismo sin complicaciones técnicas.
          </p>
        </motion.div>

        {/* Grid de los Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Línea conectora de fondo (Solo visible en Desktop) */}
          <div 
            className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 z-0" 
            style={{ background: `linear-gradient(90deg, transparent, ${P.dorado}80, transparent)` }}
          />

          {pasos.map((paso, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center group"
            >
              {/* Círculo del Número / Ícono */}
              <div 
                className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  border: `4px solid ${P.dorado}`, 
                  boxShadow: `0 15px 35px rgba(0,0,0,0.4)` 
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-black transition-opacity duration-300 absolute group-hover:opacity-0" style={{ color: P.granate }}>
                    {paso.num}
                  </span>
                  <span className="opacity-0 transition-opacity duration-300 absolute group-hover:opacity-100 flex items-center justify-center">
                    {paso.icon}
                  </span>
                </div>
              </div>
              
              {/* Textos del paso */}
              <h3 className="text-xl font-bold mb-3 text-white">{paso.title}</h3>
              <p className="text-sm leading-relaxed px-4" style={{ color: P.beige, opacity: 0.8 }}>{paso.desc}</p>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}