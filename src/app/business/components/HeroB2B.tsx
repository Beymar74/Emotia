"use client"; 

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store, ArrowRight, Package, Star } from "lucide-react";

// Paleta Oficial de Emotia Business
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
  negro: "#1A1A1A"
};

// ==========================================
// COMPONENTE 1: NAVBAR B2B
// ==========================================
const NavbarB2B = () => {
  const router = useRouter();
  
  return (
    <header className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
      {/* LOGO */}
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <img 
          src="/logo/logo-business-expandido.png" 
          alt="Emotia Business" 
          className="h-8 md:h-10 object-contain"
        />
      </div>
      
      {/* BOTÓN SECUNDARIO (Iniciar Sesión) */}
      <button 
        onClick={() => router.push("/business/proveedores")}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 backdrop-blur-md"
        style={{ 
          color: P.bordoNegro, 
          backgroundColor: "rgba(245, 230, 208, 0.7)", // Beige con transparencia
          border: `1px solid rgba(188, 153, 104, 0.3)` // Borde dorado sutil
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = P.dorado}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(188, 153, 104, 0.3)'}
      >
        Iniciar Sesión <ArrowRight size={16} />
      </button>
    </header>
  );
};

// ==========================================
// COMPONENTE 2: HERO PRINCIPAL B2B
// ==========================================
export default function HeroB2B() {
  const router = useRouter();

  return (
    // Quitamos P.blanco y ponemos un color base ultra-cálido muy clarito
    <div className="relative min-h-[90vh] flex items-center overflow-hidden font-sans" style={{ backgroundColor: "#FCFAF8" }}>
      
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(12px); } }

        /* Animación del texto dorado */
        @keyframes shimmer-palette { 
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }

        .texto-degradado-animado {
          background: linear-gradient(
            90deg, 
            ${P.granate} 0%, 
            ${P.dorado} 15%, 
            ${P.bordoOscuro} 30%, 
            ${P.doradoOscuro} 50%, 
            ${P.bordoNegro} 65%, 
            ${P.beige} 85%, 
            ${P.granate} 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-palette 6s linear infinite;
        }
      `}</style>

      {/* ========================================== */}
      {/* FONDOS MESH GRADIENT (Adiós al blanco aburrido) */}
      {/* ========================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Orbe Dorado arriba a la derecha */}
        <div 
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-[0.15] blur-[120px]" 
          style={{ background: P.dorado }}
        ></div>
        {/* Orbe Granate a la izquierda */}
        <div 
          className="absolute top-[30%] -left-[10%] w-[40vw] h-[40vw] rounded-full opacity-[0.08] blur-[100px]" 
          style={{ background: P.granate }}
        ></div>
        {/* Orbe Bordó abajo al centro */}
        <div 
          className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-[0.06] blur-[120px]" 
          style={{ background: P.bordoOscuro }}
        ></div>
      </div>

      {/* Navbar */}
      <NavbarB2B />

      {/* Contenido Central */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-20 w-full">
        
        {/* COLUMNA IZQUIERDA: Textos */}
        <div className="flex-1 w-full max-w-xl">
          {/* Badge Superior */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md"
            style={{ 
              background: "rgba(255,255,255,0.7)", 
              border: `1px solid ${P.dorado}40`, 
              boxShadow: `0 4px 15px rgba(0,0,0,0.05)` 
            }}
          >
            <Store size={14} color={P.doradoOscuro} />
            <span className="text-[11px] font-black tracking-[0.15em] uppercase" style={{ color: P.bordoNegro }}>
              Exclusivo para Tiendas y Artesanos
            </span>
          </motion.div>

          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[3rem] lg:text-[4.2rem] font-black leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span style={{ color: P.bordoNegro }}>Lleva tus ventas <br />al nivel </span>
            <span className="texto-degradado-animado">corporativo.</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg leading-relaxed mb-10"
            style={{ color: P.choco, fontWeight: 500 }}
          >
            Únete a la red premium de regalos más prestigiosa de Bolivia. Conecta con clientes que valoran la calidad, gestiona tu taller con herramientas ejecutivas y deja la logística en nuestras manos.
          </motion.p>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/business/proveedores")}
              className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white shadow-xl w-full sm:w-auto"
              style={{ 
                background: P.bordoNegro,
                boxShadow: `0 10px 30px ${P.bordoNegro}40` 
              }}
            >
              Unirse como Productor <ArrowRight size={20} />
            </motion.button>
            <p className="mt-5 text-sm font-medium" style={{ color: P.gris }}>
              Registro gratuito. Empezarás a vender en 24 horas.
            </p>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA: Imagen y Badges */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 w-full relative hidden lg:block"
          style={{ height: "550px" }}
        >
          <div 
            className="absolute inset-y-6 right-0 left-12 rounded-[32px] overflow-hidden"
            style={{ 
              boxShadow: `0 25px 50px -12px ${P.bordoNegro}40`, 
              border: `10px solid rgba(255,255,255,0.8)` 
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" 
              alt="Artesana gestionando ventas" 
              className="w-full h-full object-cover" 
            />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bordoNegro}CC 0%, transparent 40%)` }} />
            
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-lg font-bold text-white leading-snug" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                "Emotia Business nos dio la tecnología para alcanzar clientes corporativos de alto valor."
              </p>
            </div>
          </div>

          <div 
            className="absolute top-16 left-0 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.9)", boxShadow: `0 20px 40px rgba(0,0,0,0.1)`, border: `1px solid ${P.blanco}`, animation: "float 6s ease-in-out infinite" }}
          >
            <div className="p-3 rounded-xl" style={{ background: P.beige }}><Package size={22} color={P.bordoOscuro} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: P.gris }}>Nuevo Pedido Corporativo</div>
              <div className="text-sm font-bold" style={{ color: P.bordoNegro }}>Caja Sorpresa Ejecutiva</div>
              <div className="text-xs font-bold" style={{ color: P.doradoOscuro }}>Bs. 450.00</div>
            </div>
          </div>

          <div 
            className="absolute bottom-32 -right-6 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.9)", boxShadow: `0 20px 40px rgba(0,0,0,0.1)`, border: `1px solid ${P.blanco}`, animation: "float-delayed 7s ease-in-out infinite alternate" }}
          >
            <div className="p-3 rounded-xl" style={{ background: `${P.beige}80` }}><Star size={24} color={P.doradoOscuro} fill={P.doradoOscuro} /></div>
            <div>
              <div className="text-lg font-black" style={{ color: P.bordoNegro }}>4.9/5 Rating</div>
              <div className="text-[10px] font-black uppercase tracking-wider mt-0.5" style={{ color: P.gris }}>Socio Verificado</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}