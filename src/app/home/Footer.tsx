"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Gift, Heart, X } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa6";
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
  const pathname = usePathname();
  const [modalAbierto, setModalAbierto] = useState<"terminos" | "privacidad" | "cookies" | null>(null);

  // 👇 ENLACES EXCLUSIVOS PARA LA PÁGINA PRINCIPAL 👇
  const enlacesInicio = [
    { label: "Inicio", path: "/" },
    { label: "Catálogo Destacado", path: "/#productos" },
    { label: "La Experiencia", path: "/#como-funciona" },
    { label: "Únete a Emotia", path: "/#unete" }
  ];

  // 👇 ENLACES EXCLUSIVOS PARA "NOSOTROS" (Índice estricto de la página) 👇
  const enlacesNosotros = [
    { label: "Nuestra Esencia", path: "/nosotros#esencia" },
    { label: "Nuestra Misión", path: "/nosotros#mision" },
    { label: "El Equipo", path: "/nosotros#equipo" },
    { label: "Cómo Funciona", path: "/nosotros#propuesta" }
  ];

  // El footer decide qué lista usar dependiendo de dónde estamos
  const enlacesActivos = pathname === "/nosotros" ? enlacesNosotros : enlacesInicio;

  const enlacesLegales = [
    { id: "terminos", label: "Términos de Servicio" },
    { id: "privacidad", label: "Política de Privacidad" },
    { id: "cookies", label: "Gestión de Cookies" }
  ];

  // 👇 LÓGICA DE NAVEGACIÓN MEJORADA 👇
  const handleNavegacion = (path: string) => {
    if (path === "/") {
      if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
      else router.push("/");
      return;
    }

    if (path.includes("#")) {
      const [rutaDestino, sectionId] = path.split("#");
      const rutaLimpia = rutaDestino === "" ? "/" : rutaDestino;

      // Si ya estamos en la página correcta, hacemos scroll suave
      if (pathname === rutaLimpia) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(path); // Por si acaso no encuentra el ID
        }
      } else {
        router.push(path); // Navega a la otra página y salta a la sección
      }
    } else {
      router.push(path);
    }
  };

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
              <img 
                src="/logo/logoextendido.png" 
                alt="Emotia Logo" 
                className="h-10 object-contain cursor-pointer transition-transform hover:scale-105" 
                style={{ filter: "brightness(0) invert(1)" }} 
                onClick={() => handleNavegacion("/")}
              />
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: P.beige, opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>
                La primera plataforma inteligente de regalos en Bolivia. Sorprende con detalles únicos, empaque premium y entrega garantizada.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://www.instagram.com/emotia.gifts1/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer" }}><FaInstagram size={20} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer" }}><FaFacebook size={20} /></a>
                <a href="https://www.tiktok.com/@emotia.gifts0" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(0,0,0,0.25)", color: P.beige, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.13 4.41-2.91 5.67-1.78 1.25-4.14 1.58-6.19 1.15-2.05-.43-3.8-1.74-4.81-3.55-1.02-1.81-1.15-4.06-.55-5.99.6-1.92 2.1-3.48 3.96-4.22 1.86-.74 4.02-.75 5.89-.13v4.06c-1.07-.46-2.32-.41-3.32.14-.99.55-1.68 1.53-1.85 2.66-.17 1.13.16 2.3.89 3.16.73.86 1.85 1.3 2.97 1.28 1.12-.02 2.19-.52 2.87-1.4.67-.88 1.01-2.01.99-3.13.04-4.99.02-9.98.02-14.98z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: P.dorado, fontFamily: "'DM Sans', sans-serif" }}>Navegación</h4>
              <ul className="space-y-4">
                {enlacesActivos.map((enlace) => (
                  <li key={enlace.label}>
                    <motion.button 
                      whileHover={{ x: 8 }} 
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleNavegacion(enlace.path)}
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