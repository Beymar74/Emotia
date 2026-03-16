"use client";
// Navbar.tsx — Barra de navegación con frosted glass + menú móvil

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "./constants";

interface NavbarProps { scrolled: boolean; }

const navbarCSS = `
  .nav-hidden-mobile { display: flex; }
  .nav-show-mobile   { display: none !important; }

  @media (max-width: 768px) {
    .nav-hidden-mobile { display: none !important; }
    .nav-show-mobile   { display: flex !important; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function Navbar({ scrolled }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Cómo funciona",   id: "como-funciona" },
    { label: "Características", id: "caracteristicas" },
    { label: "Testimonios",     id: "testimonios" },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navbarCSS }} />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "12px 24px" : "18px 24px",
        background: scrolled ? "rgba(245,230,208,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(188,153,104,0.25), 0 4px 20px rgba(90,15,36,0.06)"
          : "none",
        transition: "all 0.35s ease",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer" }}
          >
            <img src="/logo/logo.png" alt="Emotia Logo" style={{ width: "34px", height: "34px" }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.3rem", color: COLORS.bordeaux, letterSpacing: "-0.01em" }}>
              Emotia
            </span>
          </button>

          {/* Links — solo desktop */}
          <div className="nav-hidden-mobile" style={{ alignItems: "center", gap: "4px" }}>
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", padding: "8px 16px", borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: COLORS.chocolate, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = `${COLORS.garnet}10`; (e.target as HTMLElement).style.color = COLORS.garnet; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = COLORS.chocolate; }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Botón login — solo desktop */}
            <button
              className="nav-hidden-mobile btn-secondary"
              onClick={() => router.push("/login")}
              style={{ padding: "9px 22px", borderRadius: "100px", fontSize: "0.88rem" }}
            >
              Iniciar sesión
            </button>

            {/* CTA siempre visible */}
            <button
              className="btn-primary"
              onClick={() => router.push("/login")}
              style={{ padding: "9px 22px", borderRadius: "100px", fontSize: "0.88rem" }}
            >
              Comenzar gratis
            </button>

            {/* Hamburguesa — solo móvil */}
            <button
              className="nav-show-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: COLORS.bordeaux, alignItems: "center", justifyContent: "center" }}
              aria-label="Abrir menú"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0,
          background: "rgba(245,230,208,0.97)", backdropFilter: "blur(20px)",
          zIndex: 999, padding: "16px 24px 24px",
          borderBottom: `1px solid ${COLORS.gold}30`,
          boxShadow: "0 8px 32px rgba(90,15,36,0.1)",
          animation: "fadeUp 0.2s ease",
        }}>
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "14px 8px", borderBottom: `1px solid ${COLORS.gold}20`, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500, color: COLORS.chocolate, cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
          <button
            className="btn-primary"
            onClick={() => { router.push("/login"); setMenuOpen(false); }}
            style={{ width: "100%", marginTop: "16px", padding: "14px", borderRadius: "14px", fontSize: "1rem" }}
          >
            Comenzar gratis
          </button>
        </div>
      )}
    </>
  );
}