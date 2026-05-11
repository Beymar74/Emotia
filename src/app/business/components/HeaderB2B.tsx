"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { obtenerSesionBusinessHeader } from "../actions";

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
  const [proveedorSesion, setProveedorSesion] = useState<null | {
  id: number;
  nombre: string;
  iniciales: string;
  estado: string;
  logo: string | null;
}>(null);

  // Detectar el scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
  obtenerSesionBusinessHeader().then((datos) => {
    setProveedorSesion(datos);
  });
}, []);

  const navLinks = [
    { label: "Cómo funciona", href: "#pasos" },
    { label: "Tecnología", href: "#beneficios" },
    { label: "Historias", href: "#testimonios" },
    { label: "Comunidad", href: "#unirse" },
  ];

const scrollToSection = (
  e: React.MouseEvent,
  href: string
) => {
  e.preventDefault();

  const element = document.querySelector(href);

  if (element) {
    // Altura FINAL del header cuando está compactado
    const HEADER_OFFSET = 88
    const elementTop =
      element.getBoundingClientRect().top + window.scrollY;

    const offsetPosition =
      elementTop - HEADER_OFFSET;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  setMobileMenuOpen(false);
};

  return (
    <header
  className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
    scrolled
      ? "py-4 bg-white/80 backdrop-blur-lg shadow-lg"
      : "py-4 bg-transparent"
  }`}
>
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO */}
        <div
          className="cursor-pointer z-50"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });

            setMobileMenuOpen(false);
          }}
        >
          <img
            src="/logo/logo-business-expandido.png"
            alt="Emotia Business"
            className={`
              h-12
              w-auto
              object-contain
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              will-change-transform
              hover:scale-[1.03]
              ${
                scrolled
                  ? "scale-[0.90] opacity-95 translate-y-[1px]"
                  : "scale-100 opacity-100 translate-y-0"
              }
            `}
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
  {proveedorSesion ? (
    <>
      <button
        onClick={() => router.push("/business/proveedores/home")}
        className="flex items-center gap-3 px-4 py-2 rounded-full transition-all hover:scale-105"
        style={{
          backgroundColor: scrolled ? `${P.beige}70` : "rgba(255,255,255,0.6)",
          border: `1px solid ${P.dorado}40`,
        }}
      >
        <div className="text-right leading-tight">
          <p className="text-xs font-black max-w-[130px] truncate" style={{ color: P.bordoNegro }}>
            {proveedorSesion.nombre}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: P.dorado }}>
            Emotia Business
          </p>
        </div>

        <div className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center text-xs font-black text-white"
          style={{ background: P.bordoOscuro, borderColor: `${P.dorado}80` }}
        >
          {proveedorSesion.logo ? (
            <img src={proveedorSesion.logo} alt={proveedorSesion.nombre} className="w-full h-full object-cover" />
          ) : (
            proveedorSesion.iniciales
          )}
        </div>
      </button>

      <button
        onClick={() => router.push("/business/proveedores/home")}
        className="px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
        style={{ background: P.bordoNegro }}
      >
        Ir al Panel
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => router.push("/business/proveedores")}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
        style={{
          color: P.bordoNegro,
          backgroundColor: scrolled ? `${P.beige}60` : "rgba(255,255,255,0.5)",
          border: `1px solid ${scrolled ? P.dorado + "40" : "transparent"}`,
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
    </>
  )}
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