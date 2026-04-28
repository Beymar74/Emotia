"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF"
};

export default function HeaderB2B() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar el scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Cómo funciona", href: "#pasos" },
    { label: "Tecnología", href: "#beneficios" },
    { label: "Historias", href: "#testimonios" },
    { label: "Comunidad", href: "#unirse" },
  ];

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Altura del header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
        ? "py-3 bg-white/80 backdrop-blur-lg shadow-lg" 
        : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO */}
        <div className="cursor-pointer z-50" onClick={() => router.push("/")}>
          <img 
            src="/logo/logo-business-expandido.png" 
            alt="Emotia Business" 
            className={`transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
          />
        </div>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-bold transition-all hover:text-[#BC9968]"
              style={{ color: P.bordoNegro }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* BOTONES ACCIÓN EN HeaderB2B.tsx */}
        <div className="hidden md:flex items-center gap-4">
        <button 
            onClick={() => router.push("/business/proveedores")} // <--- Esta ruta carga el login
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ 
            color: P.bordoNegro, 
            backgroundColor: scrolled ? `${P.beige}60` : "rgba(255,255,255,0.5)",
            border: `1px solid ${scrolled ? P.dorado + '40' : 'transparent'}`
            }}
        >
            Iniciar Sesión
        </button>
        
        <button 
            onClick={() => router.push("/business/proveedores/registro")}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{ background: P.bordoNegro }}
        >
            Unirse como Productor
        </button>
        </div>
        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden z-50 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} color={P.bordoNegro} /> : <Menu size={28} color={P.bordoNegro} />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <a 
                key={link.label} href={link.href} 
                className="text-2xl font-black"
                onClick={(e) => scrollToSection(e, link.href)}
                style={{ color: P.bordoNegro }}
              >
                {link.label}
              </a>
            ))}
            <hr className="w-20 border-t-2" style={{ borderColor: P.beige }} />
            <button className="text-xl font-bold" style={{ color: P.dorado }}>Iniciar Sesión</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}