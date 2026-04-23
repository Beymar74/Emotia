"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, MapPin, Gift, Instagram, Facebook, Heart, X, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  carmesi: "#AB3A50",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
};

export default function Footer() {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState<"terminos" | "privacidad" | "cookies" | null>(null);

  const enlacesPrincipales = [
    { label: "Catálogo", path: "/producto" },
    { label: "Para Empresas", path: "/business" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Ayuda", path: "/ayuda" }
  ];

  const enlacesLegales = [
    { id: "terminos", label: "Términos de Servicio" },
    { id: "privacidad", label: "Política de Privacidad" },
    { id: "cookies", label: "Gestión de Cookies" }
  ];

  return (
    <>
      <footer className="relative font-sans mt-0">
        <div className="pt-20 pb-12 px-6 md:px-12 relative overflow-hidden" style={{ background: P.bordo }}>
          <div 
            className="absolute top-10 left-0 w-full text-center text-[15vw] font-black opacity-[0.03] pointer-events-none select-none"
            style={{ color: P.blanco, fontFamily: "'Montserrat', sans-serif" }}
          >
            EMOTIA
          </div>

          <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 border-b pb-16" style={{ borderColor: `rgba(255,255,255,0.08)` }}>
            
            <div className="md:col-span-4 space-y-6">
              {/* 👇 LOGO CORREGIDO: Usando el extendido oficial 👇 */}
              <img 
                src="/logo/logoextendido.png" 
                alt="Emotia Logo" 
                className="h-10 object-contain cursor-pointer transition-transform hover:scale-105" 
                style={{ filter: "brightness(0) invert(1)" }} 
                onClick={() => router.push("/")}
              />
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: P.beige, opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>
                La primera plataforma inteligente de regalos en Bolivia. Sorprende con detalles únicos, empaque premium y entrega garantizada.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://www.instagram.com/emotia.gifts1/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer" }}><Instagram size={20} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer" }}><Facebook size={20} /></a>
                {/* 👇 TIKTOK DE VUELTA 👇 */}
                <a href="https://www.tiktok.com/@emotia.gifts0" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer" }}><Music size={20} /></a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}>Navegación</h4>
              <ul className="space-y-4">
                {enlacesPrincipales.map((enlace) => (
                  <li key={enlace.label}>
                    <motion.button 
                      whileHover={{ x: 8 }} 
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => router.push(enlace.path)}
                      className="text-sm font-medium transition-colors hover:text-white flex items-center gap-2"
                      style={{ color: P.beige, opacity: 0.7, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}>Legal</h4>
              <ul className="space-y-4">
                {enlacesLegales.map((enlace) => (
                  <li key={enlace.id}>
                    <motion.button 
                      whileHover={{ x: 8 }} 
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setModalAbierto(enlace.id as any)}
                      className="text-sm font-medium transition-colors hover:text-white flex items-center gap-2"
                      style={{ color: P.beige, opacity: 0.7, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                    >
                      {enlace.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}>Atención al cliente</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4" style={{ color: P.beige, opacity: 0.8 }}>
                  <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Av. Arce, Sopocachi. La Paz</p>
                </div>
                <div className="flex items-center gap-4" style={{ color: P.beige, opacity: 0.8 }}>
                  <Mail size={20} className="shrink-0" style={{ color: P.dorado }} />
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>hola@emotia.com.bo</p>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  onClick={() => router.push("/producto")}
                  className="w-full px-6 py-4 rounded-xl flex justify-between items-center group transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.15)`, cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = P.dorado}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                >
                  <div className="flex items-center gap-3" style={{ color: P.blanco }}>
                    <Gift size={20} style={{ color: P.dorado }} />
                    <span className="font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ir al Catálogo</span>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color: P.dorado }} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-[1320px] mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <p className="text-xs font-medium" style={{ color: P.beige, opacity: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
              © {new Date().getFullYear()} Emotia Technologies Bolivia S.R.L.
            </p>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245, 230, 208, 0.5)", display: "flex", alignItems: "center", gap: 6 }}>
              Diseñado con <Heart size={14} color={P.carmesi} fill={P.carmesi} /> en La Paz
            </span>
          </div>
        </div>
      </footer>

      {/* MODALES LEGALES */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAbierto(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ background: P.dorado }}></div>
              <button onClick={() => setModalAbierto(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ cursor: "pointer" }}><X size={24} style={{ color: P.bordo }} /></button>
              
              {modalAbierto === "terminos" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordo, fontFamily: "'Montserrat', sans-serif" }}>Términos de Servicio</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.chocolate, fontFamily: "'DM Sans', sans-serif" }}>
                    <p>Al utilizar Emotia, aceptas nuestros términos para garantizar la mejor experiencia de regalo.</p>
                    <p><strong>1. Pedidos:</strong> Entregas programadas en el área de cobertura (La Paz).</p>
                    <p><strong>2. IA:</strong> Las recomendaciones son sugerencias personalizadas.</p>
                  </div>
                </>
              )}

              {modalAbierto === "privacidad" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordo, fontFamily: "'Montserrat', sans-serif" }}>Política de Privacidad</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.chocolate, fontFamily: "'DM Sans', sans-serif" }}>
                    <p>Protegemos tu información y la de tus seres queridos.</p>
                    <p><strong>Datos:</strong> Solo almacenamos lo necesario para procesar tu pedido y pago seguro.</p>
                  </div>
                </>
              )}

              {modalAbierto === "cookies" && (
                <>
                  <h3 className="text-2xl font-black mb-4" style={{ color: P.bordo, fontFamily: "'Montserrat', sans-serif" }}>Gestión de Cookies</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.chocolate, fontFamily: "'DM Sans', sans-serif" }}>
                    <p>Usamos cookies para que tu búsqueda sea más rápida y personalizada.</p>
                    <p><strong>Personalización:</strong> Recordamos tus preferencias para agilizar futuras recomendaciones de la IA.</p>
                  </div>
                </>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 text-right">
                <button onClick={() => setModalAbierto(null)} className="px-6 py-2.5 rounded-xl font-bold text-white transition-transform hover:scale-105" style={{ background: P.bordo, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}