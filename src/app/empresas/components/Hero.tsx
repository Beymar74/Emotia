"use client";

import React, { useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .emp-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
  .emp-reveal.emp-visible { opacity: 1; transform: translateY(0); }
  .emp-fade { opacity: 0; transform: translateY(18px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
  .emp-fade.emp-active { opacity: 1; transform: translateY(0); }

  @keyframes empScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .emp-ticker-inner { animation: empScroll 28s linear infinite; }
  .emp-ticker-inner:hover { animation-play-state: paused; }

  .emp-card-hover { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .35s; }
  .emp-card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(90,15,36,.12) !important; border-color: rgba(155,35,53,.25) !important; }
`;

const empresas = [
  { nombre: "Inversiones del Sur S.A.", rubro: "Finanzas",      emoji: "🏦" },
  { nombre: "TechBolivia",              rubro: "Tecnología",    emoji: "💻" },
  { nombre: "Grupo Cóndor",             rubro: "Retail",        emoji: "🛍️" },
  { nombre: "AgroAndes Ltda.",          rubro: "Agroindustria", emoji: "🌾" },
  { nombre: "Clinika Salud",            rubro: "Salud",         emoji: "🏥" },
  { nombre: "Constructora Illimani",    rubro: "Construcción",  emoji: "🏗️" },
  { nombre: "Media Altiplano",          rubro: "Medios",        emoji: "📺" },
  { nombre: "LogiPaz",                  rubro: "Logística",     emoji: "🚚" },
  { nombre: "EduFuturo",               rubro: "Educación",     emoji: "🎓" },
  { nombre: "Restaurantes Tiwanaku",    rubro: "Gastronomía",   emoji: "🍽️" },
  { nombre: "Seguros Chukiyawu",        rubro: "Seguros",       emoji: "🛡️" },
  { nombre: "Moda Kallawaya",           rubro: "Moda",          emoji: "👗" },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".emp-fade");
    els?.forEach((el, i) => setTimeout(() => el.classList.add("emp-active"), 80 + i * 130));
  }, []);

  const tickerItems = [...empresas, ...empresas];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background: "linear-gradient(150deg,#5A0F24 0%,#8E1B3A 50%,#9B2335 100%)", padding: "clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(3rem,6vw,5rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(188,153,104,.12) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div ref={ref} style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>
          <div className="emp-fade" style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", background: "rgba(188,153,104,.15)", border: "1px solid rgba(188,153,104,.3)", borderRadius: "100px", padding: ".4rem 1.1rem", marginBottom: "1.8rem" }}>
            <span style={{ fontSize: ".6rem", color: "#BC9968" }}>●</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".7rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#BC9968" }}>Red de Empresas Afiliadas</span>
          </div>
          <h1 className="emp-fade" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(2.8rem,6vw,5.5rem)", lineHeight: 1.05, color: "#FAF5EE", marginBottom: "1.2rem", maxWidth: "780px" }}>
            Las empresas que <em style={{ fontStyle: "italic", color: "#BC9968" }}>confían</em> en Emotia
          </h1>
          <p className="emp-fade" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: "clamp(1rem,1.8vw,1.15rem)", lineHeight: 1.75, color: "rgba(245,230,208,.7)", maxWidth: "580px", marginBottom: "3rem" }}>
            Organizaciones de todos los rubros que integran nuestra plataforma para hacer de cada celebración, reconocimiento y detalle corporativo una experiencia memorable.
          </p>
          <div className="emp-fade" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.5rem,4vw,4rem)" }}>
            {[{ num: `${empresas.length}+`, label: "Empresas afiliadas" }, { num: "8", label: "Rubros distintos" }, { num: "100%", label: "Satisfacción" }].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(2rem,3.5vw,3rem)", color: "#BC9968", lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(245,230,208,.45)", marginTop: ".3rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{ background: "#FAF5EE", borderTop: "1px solid rgba(155,35,53,.1)", borderBottom: "1px solid rgba(155,35,53,.1)", padding: "1.2rem 0", overflow: "hidden" }}>
        <div className="emp-ticker-inner" style={{ display: "flex", width: "max-content" }}>
          {tickerItems.map(({ nombre, rubro, emoji }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: ".7rem", padding: "0 2.5rem", borderRight: "1px solid rgba(155,35,53,.1)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".82rem", color: "#5A0F24" }}>{nombre}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".72rem", color: "#BC9968" }}>{rubro}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
