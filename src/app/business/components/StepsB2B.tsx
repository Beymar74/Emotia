"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, PackagePlus, Banknote } from "lucide-react";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  carmesi: "#AB3A50",
  dorado: "#BC9968",
  doradoOscuro: "#9A7A48",
  choco: "#5C3A2E",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A",
};

export default function StepsB2B() {
  const pasos = [
    {
      num: "1",
      icon: <UserPlus size={32} color={P.bordoNegro} />,
      title: "Crea tu perfil corporativo",
      desc: "Regístrate en minutos y configura la identidad sofisticada de tu taller o tienda.",
    },
    {
      num: "2",
      icon: <PackagePlus size={32} color={P.bordoNegro} />,
      title: "Sube tu catálogo premium",
      desc: "Añade tus regalos, define tus precios y destaca tus opciones de personalización.",
    },
    {
      num: "3",
      icon: <Banknote size={32} color={P.bordoNegro} />,
      title: "Recibe y gestiona pedidos",
      desc: "Atiende a clientes de alto valor y gestiona todo el flujo fácilmente con nuestro Kanban.",
    },
  ];

  return (
    <section
      className="relative isolate overflow-hidden min-h-[100svh] flex items-center px-6 py-16 md:py-24"
      style={{
        background: `linear-gradient(135deg, ${P.bordoOscuro} 0%, ${P.bordoNegro} 100%)`,
      }}
    >
      {/* Fondos decorativos */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: P.dorado }}
      />

      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: P.carmesi }}
      />

      {/* Glow central */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[900px] h-[500px] rounded-full blur-[140px] opacity-10"
          style={{ background: P.dorado }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 md:mb-28"
        >
          <p
            className="text-[11px] font-black uppercase tracking-[0.25em] mb-4"
            style={{ color: P.dorado }}
          >
            Rápido y Sencillo
          </p>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Inicia tu camino como
            <br />
            Socio Premium
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: P.beige, opacity: 0.9 }}
          >
            Hemos simplificado el proceso para que puedas empezar a vender
            hoy mismo sin complicaciones técnicas.
          </p>
        </motion.div>

        {/* PASOS */}
        <div className="relative">
          
          {/* Línea conectora desktop */}
          <div
            className="hidden md:block absolute top-12 left-[18%] right-[18%] h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${P.dorado}, transparent)`,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10">
            {pasos.map((paso, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                {/* Círculo */}
                <div
                  className="relative w-28 h-28 rounded-full bg-white flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110"
                  style={{
                    border: `4px solid ${P.dorado}`,
                    boxShadow: `0 20px 40px rgba(0,0,0,0.45)`,
                  }}
                >
                  <span
                    className="text-5xl font-black absolute transition-opacity duration-300 group-hover:opacity-0"
                    style={{ color: P.granate }}
                  >
                    {paso.num}
                  </span>

                  <span className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {paso.icon}
                  </span>
                </div>

                {/* Contenido */}
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {paso.title}
                </h3>

                <p
                  className="text-base leading-relaxed max-w-sm"
                  style={{ color: P.beige, opacity: 0.85 }}
                >
                  {paso.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}