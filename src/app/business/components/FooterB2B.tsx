"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone, Gift, Instagram, Facebook, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function FooterB2B() {
  const router = useRouter();
  
  // Estado para controlar qué modal está abierto
  const [modalAbierto, setModalAbierto] = useState<"terminos" | "privacidad" | "cookies" | null>(null);

  const enlacesPrincipales = [
    { label: "Regalos", path: "/" },
    { label: "Empresas", path: "/business", isActive: true }, 
    { label: "Artesanos", path: "/business/proveedores" },
    { label: "Nosotros", path: "/ayuda/nosotros" },
    { label: "Ayuda", path: "/ayuda" }
  ];

  const enlacesLegales = [
    { id: "terminos", label: "Términos de Servicio" },
    { id: "privacidad", label: "Política de Privacidad" },
    { id: "cookies", label: "Gestión de Cookies" }
  ];

  return (
    <>
      <footer className="relative font-sans mt-24">
        
        {/* ========================================== */}
        {/* TARJETA DE RECURSOS (Ubicada ARRIBA del footer oscuro, no sobrepuesta) */}
        {/* ========================================== */}
        <div className="px-6 md:px-12 pb-24 max-w-[1320px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
            style={{ 
              background: `linear-gradient(90deg, ${P.bordoNegro} 0%, ${P.bordoOscuro} 45%, ${P.dorado} 150%)`,
              border: `2px solid ${P.dorado}80`
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Recibe recursos para tu negocio
              </h3>
              <p className="text-base font-medium" style={{ color: P.beige }}>
                Suscríbete a nuestro boletín para productores y recibe tendencias de regalos corporativos, estrategias de ventas y novedades exclusivas de Emotia.
              </p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="px-6 py-4 rounded-full outline-none font-medium w-full sm:w-64"
                style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${P.dorado}50`, color: P.blanco }}
              />
              <button 
                className="px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
                style={{ background: P.beige, color: P.bordoNegro, boxShadow: `0 10px 20px rgba(0,0,0,0.2)` }}
              >
                Suscribirme <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* CUERPO DEL FOOTER */}
        {/* ========================================== */}
        <div className="pt-20 pb-12 px-6 md:px-12 relative overflow-hidden" style={{ background: P.bordoNegro }}>
          <div 
            className="absolute top-10 left-0 w-full text-center text-[15vw] font-black opacity-[0.03] pointer-events-none select-none"
            style={{ color: P.blanco, fontFamily: "'Montserrat', sans-serif" }}
          >
            EMOTIA
          </div>

          <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 border-b pb-16" style={{ borderColor: `${P.bordoOscuro}` }}>
            
            {/* LOGO E INFO */}
            <div className="md:col-span-4 space-y-6">
              <img 
                src="/logo/logo-business-expandido.png" 
                alt="Emotia Logo" 
                className="h-12 object-contain" 
                style={{ filter: "brightness(0) invert(1)" }} 
              />
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: P.beige, opacity: 0.8 }}>
                La primera plataforma inteligente de regalos en Bolivia. Sorprende a los que más quieres con detalles únicos, empaque premium y entrega garantizada en La Paz.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: P.bordoOscuro, color: P.beige }}><Instagram size={20} /></a>
                <a href="#" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: P.bordoOscuro, color: P.beige }}><Facebook size={20} /></a>
              </div>
            </div>

            {/* NAVEGACIÓN (Con animación hover) */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado }}>Navegación</h4>
              <ul className="space-y-4">
                {enlacesPrincipales.map((enlace) => (
                  <li key={enlace.label}>
                    <motion.button 
                      whileHover={{ x: 8 }} // Animación de desplazamiento a la derecha
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => router.push(enlace.path)}
                      className="text-sm font-medium transition-colors hover:text-white flex items-center gap-2"
                      style={{ color: enlace.isActive ? P.dorado : P.beige, opacity: enlace.isActive ? 1 : 0.7 }}
                    >
                      {enlace.isActive && <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.dorado }}></div>}
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGALES Y MODALES (Nueva Columna) */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado }}>Legal</h4>
              <ul className="space-y-4">
                {enlacesLegales.map((enlace) => (
                  <li key={enlace.id}>
                    <motion.button 
                      whileHover={{ x: 8 }} // Animación de desplazamiento a la derecha
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setModalAbierto(enlace.id as any)}
                      className="text-sm font-medium transition-colors hover:text-white flex items-center gap-2"
                      style={{ color: P.beige, opacity: 0.7 }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACTO */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado }}>Contacto Productores</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4" style={{ color: P.beige, opacity: 0.8 }}>
                  <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm">Av. Arce, Zona Sopocachi<br/>La Paz, Bolivia</p>
                </div>
                <div className="flex items-center gap-4" style={{ color: P.beige, opacity: 0.8 }}>
                  <Mail size={20} className="shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm">socios@emotia.com.bo</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => router.push("/")}
                  className="w-full px-6 py-4 rounded-xl flex justify-between items-center group transition-colors"
                  style={{ background: P.bordoOscuro, border: `1px solid ${P.dorado}40` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = P.dorado}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `${P.dorado}40`}
                >
                  <div className="flex items-center gap-3" style={{ color: P.beige }}>
                    <Gift size={20} style={{ color: P.dorado }} />
                    <span className="font-bold text-sm">Ir a la Tienda</span>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color: P.dorado }} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-[1320px] mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <p className="text-xs font-medium" style={{ color: P.beige, opacity: 0.5 }}>
              © 2026 Emotia Technologies Bolivia S.R.L. Todos los derechos reservados.
            </p>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245, 230, 208, 0.5)", display: "flex", alignItems: "center", gap: 6 }}>
              Diseñado con <Heart size={14} color={P.carmesi} fill={P.carmesi} /> en La Paz, Bolivia
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* MODALES DE INFORMACIÓN LEGAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Fondo oscuro desenfocado */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalAbierto(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Caja del Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Decoración superior */}
              <div className="absolute top-0 left-0 w-full h-2" style={{ background: P.dorado }}></div>
              
              <button 
                onClick={() => setModalAbierto(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} style={{ color: P.bordoNegro }} />
              </button>

              {/* Contenido Dinámico según el modal */}
              {modalAbierto === "terminos" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>Términos de Servicio</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                    <p>Al unirte como Socio Proveedor a Emotia Business, aceptas nuestros términos de colaboración corporativa.</p>
                    <p><strong>1. Calidad Garantizada:</strong> Te comprometes a mantener los más altos estándares artesanales y respetar los tiempos de preparación establecidos en tu Kanban.</p>
                    <p><strong>2. Pagos y Comisiones:</strong> Emotia retiene una tarifa de intermediación por cada venta exitosa. Los desembolsos se realizan semanalmente a tu cuenta bancaria registrada.</p>
                    <p><strong>3. Gestión de Pedidos:</strong> Todo pedido aceptado debe ser empaquetado bajo los lineamientos premium de Emotia para garantizar la mejor experiencia al cliente.</p>
                  </div>
                </>
              )}

              {modalAbierto === "privacidad" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>Política de Privacidad</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                    <p>En Emotia valoramos y protegemos la información de tu negocio como nuestro activo más importante.</p>
                    <p><strong>Datos Recopilados:</strong> Guardamos información de ventas, inventario y datos de contacto estrictamente para el funcionamiento de tu panel de control.</p>
                    <p><strong>Uso de la IA:</strong> Nuestro algoritmo analiza las tendencias de compra de forma anónima para recomendar tus productos a los clientes adecuados, sin comprometer tus datos sensibles.</p>
                  </div>
                </>
              )}

              {modalAbierto === "cookies" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>Gestión de Cookies</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                    <p>Utilizamos cookies esenciales y de rendimiento para que tu navegación en el Portal de Proveedores sea fluida y segura.</p>
                    <p><strong>Cookies de Sesión:</strong> Necesarias para mantener tu cuenta abierta mientras gestionas pedidos.</p>
                    <p><strong>Cookies Analíticas:</strong> Nos ayudan a entender cómo interactúas con el Dashboard para seguir mejorando las herramientas que te ofrecemos.</p>
                    <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      Puedes configurar tu navegador para bloquear estas cookies, pero algunas funciones de la plataforma dejarán de funcionar.
                    </p>
                  </div>
                </>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 text-right">
                <button 
                  onClick={() => setModalAbierto(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-white transition-transform hover:scale-105"
                  style={{ background: P.bordoNegro }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}