"use client";
// Footer.tsx — Pie de página con columnas y redes sociales

import React from "react";
import { COLORS } from "./constants";
import { HeartIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = {
    Producto: ["Cómo funciona", "Características", "Precios", "Artesanos"],
    Empresa:  ["Sobre nosotros", "Blog", "Prensa", "Contacto"],
    Legal:    ["Privacidad", "Términos", "Cookies"],
  };

  return (
    <footer style={{ background: COLORS.bordeaux, color: "rgba(245,230,208,0.75)", padding: "56px 24px 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "7px" }}><HeartIcon /></div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.25rem", color: COLORS.beige }}>Emotia</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.65, maxWidth: "220px", color: "rgba(245,230,208,0.6)" }}>IA que convierte cada regalo en un momento que se recuerda para siempre. Hecho en La Paz, Bolivia.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {["IG", "FB", "TW"].map(s => (
                <a key={s} href="#" aria-label={s} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid rgba(188,153,104,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${COLORS.garnet}40`)} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>{s}</a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "16px" }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ color: "rgba(245,230,208,0.6)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.beige)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,230,208,0.6)")}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}30, transparent)`, marginBottom: "24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "0.8rem", color: "rgba(245,230,208,0.45)" }}>© {year} Emotia. Todos los derechos reservados.</p>
          <p style={{ fontSize: "0.8rem", color: "rgba(245,230,208,0.35)", display: "flex", alignItems: "center", gap: "6px" }}>Hecho con <span style={{ color: COLORS.garnet, fontSize: "0.9rem" }}>♥</span> en La Paz, Bolivia</p>
        </div>
      </div>
    </footer>
  );
}
