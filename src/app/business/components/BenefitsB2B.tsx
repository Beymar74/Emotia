"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Target, TrendingUp, CheckCircle2 } from "lucide-react";

// Paleta Oficial de Emotia Business
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

export default function BenefitsB2B() {
  const beneficios = [
    {
      icon: <Smartphone size={28} color={P.granate} />,
      titulo: "Gestión desde cualquier lugar",
      desc: "Recibe notificaciones en tiempo real, gestiona tu inventario y actualiza el estado de tus pedidos desde tu celular o computadora."
    },
    {
      icon: <Target size={28} color={P.granate} />,
      titulo: "Audiencia calificada y premium",
      desc: "Llega a clientes corporativos y personas en La Paz que buscan regalos sofisticados, dispuestos a pagar por verdadera calidad."
    },
    {
      icon: <TrendingUp size={28} color={P.granate} />,
      titulo: "Métricas que importan",
      desc: "Descarga reportes automáticos en Excel y visualiza tus ingresos diarios para escalar tu producción inteligentemente."
    }
  ];

  return (
    <section className="py-24 px-6 relative" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* ========================================== */}
          {/* COLUMNA IZQUIERDA: Imagen y Widget Realista */}
          {/* ========================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-[32px] overflow-hidden"
            style={{ 
              boxShadow: `0 30px 60px ${P.bordoNegro}20`,
              border: `8px solid ${P.blanco}`
            }}
          >
            <img 
              src="/images/Emotia.png" 
              alt="Plataforma Emotia Business" 
              className="w-full h-auto object-cover" 
            />
            
            {/* Overlay sutil para corporativo */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${P.bordoNegro}20 0%, transparent 60%)`, mixBlendMode: "multiply", pointerEvents: "none" }}></div>
            
            {/* NUEVO WIDGET: Realista y tecnológico (Estándar B2B) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-6 left-6 p-4 rounded-2xl flex items-center gap-4"
              style={{ 
                background: "rgba(255, 255, 255, 0.90)",
                backdropFilter: "blur(10px)",
                boxShadow: `0 15px 35px ${P.bordoNegro}25`,
                border: `1px solid ${P.blanco}`
              }}
            >
              <div className="p-2.5 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: P.bordoNegro }}>Sincronización Activa</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: P.choco }}>Tablero Kanban actualizado</p>
              </div>
            </motion.div>
            
          </motion.div>

          {/* ========================================== */}
          {/* COLUMNA DERECHA: Textos y Lista de Beneficios */}
          {/* ========================================== */}
          <div>
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: P.dorado }}>
                  Herramientas de Crecimiento
                </p>
                <h2 className="text-3xl md:text-[2.75rem] font-black leading-[1.1] mb-6" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>
                  Toma el control total <br/>de tu negocio premium.
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: P.choco }}>
                  Nuestra plataforma no solo te ayuda a vender más, te entrega la tecnología exacta para optimizar tu tiempo, entender a tus clientes y escalar tu producción sin estrés.
                </p>
              </motion.div>
            </div>

            <div className="space-y-6">
              {beneficios.map((beneficio, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-5 items-start p-6 rounded-2xl transition-all duration-300 group"
                  style={{ 
                    background: P.blanco, 
                    border: `1px solid ${P.beige}80`,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.02)` 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = P.dorado;
                    e.currentTarget.style.boxShadow = `0 10px 30px ${P.bordoNegro}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${P.beige}80`;
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.02)`;
                  }}
                >
                  <div 
                    className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${P.beige}50` }}
                  >
                    {beneficio.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: P.negro }}>{beneficio.titulo}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: P.gris }}>{beneficio.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}