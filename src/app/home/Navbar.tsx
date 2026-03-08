"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { COLORS, SECTION_IDS, SECTION_LABELS } from './constants';

const navbarCSS = `
  /* Clases responsivas independientes para el Navbar */
  .desktop-flex { display: none !important; }
  .desktop-block { display: none !important; }
  .mobile-flex { display: flex !important; }
  
  @media (min-width: 768px) {
    .desktop-flex { display: flex !important; }
    .desktop-block { display: block !important; }
    .mobile-flex { display: none !important; }
  }
`;

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const router = useRouter(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Evitar scroll del fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Manejar navegación con scroll suave
  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push('/#' + id); 
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navbarCSS }} />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.4s', padding: scrolled ? '12px 0' : '20px 0',
      }} className={scrolled ? 'nav-glass' : ''}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo Personalizado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', zIndex: 102 }} onClick={() => { setIsMobileMenuOpen(false); router.push('/'); }}>
            <img src="/logo/logo.png" alt="Emotia Logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: COLORS.bordeaux }}>Emotia</span>
          </div>

          {/* Links Desktop (Ocultos en móvil) */}
          <div className="desktop-flex" style={{ gap: '32px' }}>
            {SECTION_LABELS.slice(1, 4).map((label, i) => (
              <button 
                key={label} 
                onClick={() => handleNavClick(SECTION_IDS[i+1])} 
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Acciones y Botón Hamburguesa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="desktop-block" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: COLORS.chocolate, fontFamily: 'inherit' }}
              onClick={() => router.push('/login')}
            >
              Iniciar sesión
            </button>
            
            <button className="btn-primary desktop-flex" style={{ padding: '10px 24px', borderRadius: '100px', fontSize: '0.9rem', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => router.push('/login')}
            >
              Probar IA
            </button>

            {/* Botón Menú Móvil (Visible solo en pantallas pequeñas) */}
            <button 
              className="mobile-flex" 
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.bordeaux, zIndex: 102, padding: '4px', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          Menú Móvil Overlay (Desplegable)
      ───────────────────────────────────────────────────────────── */}
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(245, 230, 208, 0.98)', // Fondo Beige difuminado
          backdropFilter: 'blur(16px)',
          zIndex: 105, // Z-index más alto para estar sobre todo
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          padding: '24px'
        }}
      >
        {/* Botón explícito de CERRAR (X) */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ 
            position: 'absolute', top: '24px', right: '24px', 
            background: 'none', border: 'none', cursor: 'pointer', 
            color: COLORS.bordeaux, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px'
          }}
        >
          <X size={36} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '300px', textAlign: 'center' }}>
          
          {/* Links de Navegación Móvil */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {SECTION_LABELS.slice(1, 4).map((label, i) => (
                <button 
                  key={label} 
                  onClick={() => handleNavClick(SECTION_IDS[i+1])} 
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: COLORS.bordeaux,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {label}
                </button>
              ))}
          </div>

          {/* Divisor */}
          <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}50, transparent)` }} />

          {/* Botones de Acción Móvil */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: COLORS.chocolate, fontFamily: 'inherit', padding: '12px' }}
              onClick={() => { setIsMobileMenuOpen(false); router.push('/login'); }}
            >
              Iniciar sesión
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '16px', borderRadius: '100px', fontSize: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}
              onClick={() => { setIsMobileMenuOpen(false); router.push('/login'); }}
            >
              Probar Asesor IA
            </button>
          </div>

        </div>
      </div>
    </>
  );
}