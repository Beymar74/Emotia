"use client";

import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const empresas = [
  { nombre: "Inversiones del Sur S.A.", rubro: "Finanzas",      emoji: "🏦", desc: "Grupo financiero líder en el altiplano con más de 20 años en el mercado.",     afiliada: "2024" },
  { nombre: "TechBolivia",              rubro: "Tecnología",    emoji: "💻", desc: "Startup tecnológica especializada en transformación digital empresarial.",       afiliada: "2025" },
  { nombre: "Grupo Cóndor",             rubro: "Retail",        emoji: "🛍️", desc: "Cadena de tiendas con presencia en las principales ciudades del país.",          afiliada: "2024" },
  { nombre: "AgroAndes Ltda.",          rubro: "Agroindustria", emoji: "🌾", desc: "Empresa agropecuaria exportadora de productos orgánicos bolivianos.",            afiliada: "2025" },
  { nombre: "Clinika Salud",            rubro: "Salud",         emoji: "🏥", desc: "Red de clínicas privadas comprometida con el bienestar de sus pacientes.",       afiliada: "2024" },
  { nombre: "Constructora Illimani",    rubro: "Construcción",  emoji: "🏗️", desc: "Empresa constructora con proyectos residenciales y comerciales en La Paz.",      afiliada: "2025" },
  { nombre: "Media Altiplano",          rubro: "Medios",        emoji: "📺", desc: "Grupo de medios digitales y televisión regional con amplio alcance.",            afiliada: "2025" },
  { nombre: "LogiPaz",                  rubro: "Logística",     emoji: "🚚", desc: "Operador logístico con cobertura nacional y servicio de última milla.",          afiliada: "2024" },
  { nombre: "EduFuturo",               rubro: "Educación",     emoji: "🎓", desc: "Instituto de educación superior con programas técnicos y universitarios.",       afiliada: "2025" },
  { nombre: "Restaurantes Tiwanaku",    rubro: "Gastronomía",   emoji: "🍽️", desc: "Cadena gastronómica que fusiona la cocina andina con la alta gastronomía.",      afiliada: "2024" },
  { nombre: "Seguros Chukiyawu",        rubro: "Seguros",       emoji: "🛡️", desc: "Aseguradora boliviana con cobertura en vida, salud y bienes patrimoniales.",    afiliada: "2025" },
  { nombre: "Moda Kallawaya",           rubro: "Moda",          emoji: "👗", desc: "Marca de moda contemporánea inspirada en la identidad cultural boliviana.",      afiliada: "2025" },
];

const rubros = ["Todos", ...Array.from(new Set(empresas.map(e => e.rubro)))];

function EmpresaCard({ nombre, rubro, emoji, desc, afiliada }: (typeof empresas)[0]) {
  const ref = useReveal();
  return (
    <div ref={ref} className="emp-reveal emp-card-hover" style={{ background: "#FFFFFF", border: "1px solid rgba(155,35,53,.1)", borderRadius: "16px", padding: "clamp(1.5rem,3vw,2.2rem)", display: "flex", flexDirection: "column", gap: ".9rem", boxShadow: "0 2px 12px rgba(90,15,36,.04)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(155,35,53,.1),rgba(188,153,104,.15))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>{emoji}</div>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#BC9968", background: "rgba(188,153,104,.1)", border: "1px solid rgba(188,153,104,.25)", borderRadius: "100px", padding: ".25rem .75rem", whiteSpace: "nowrap" }}>{rubro}</span>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.05rem", color: "#5A0F24", lineHeight: 1.2 }}>{nombre}</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".85rem", lineHeight: 1.75, color: "#5C3A1E", flexGrow: 1 }}>{desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", paddingTop: ".8rem", borderTop: "1px solid rgba(155,35,53,.08)" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#BC9968", flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: ".72rem", color: "#9B7A5A" }}>Afiliada desde {afiliada}</span>
      </div>
    </div>
  );
}

export default function GridEmpresas() {
  const [filtro, setFiltro] = useState("Todos");
  const ref = useReveal();
  const filtradas = filtro === "Todos" ? empresas : empresas.filter(e => e.rubro === filtro);

  return (
    <section style={{ background: "linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="emp-reveal" ref={ref} style={{ marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".68rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#BC9968", display: "block", marginBottom: ".9rem" }}>Red Emotia</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,3.2rem)", lineHeight: 1.12, color: "#5A0F24", marginBottom: "1rem" }}>Empresas <em style={{ fontStyle: "italic" }}>afiliadas</em></h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".92rem", lineHeight: 1.85, color: "#5C3A1E", maxWidth: "560px" }}>Organizaciones que ya integran Emotia para gestionar sus regalos corporativos, reconocimientos y experiencias con el respaldo de nuestra IA.</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "clamp(2rem,4vw,3.5rem)" }}>
        {rubros.map(r => (
          <button key={r} onClick={() => setFiltro(r)}
            style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: filtro === r ? 600 : 400, fontSize: ".78rem", letterSpacing: ".06em", padding: ".45rem 1.1rem", borderRadius: "100px", border: filtro === r ? "1.5px solid #9B2335" : "1.5px solid rgba(155,35,53,.2)", background: filtro === r ? "#9B2335" : "transparent", color: filtro === r ? "#FAF5EE" : "#5C3A1E", cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { if (filtro !== r) { (e.currentTarget).style.borderColor = "#9B2335"; (e.currentTarget).style.color = "#9B2335"; } }}
            onMouseLeave={e => { if (filtro !== r) { (e.currentTarget).style.borderColor = "rgba(155,35,53,.2)"; (e.currentTarget).style.color = "#5C3A1E"; } }}
          >{r}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: "1.2rem" }}>
        {filtradas.map(e => <EmpresaCard key={e.nombre} {...e} />)}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".8rem", color: "rgba(92,58,30,.5)", marginTop: "2rem", textAlign: "center" }}>
        Mostrando <strong style={{ color: "#9B2335" }}>{filtradas.length}</strong> de {empresas.length} empresas afiliadas
      </p>
    </section>
  );
}
