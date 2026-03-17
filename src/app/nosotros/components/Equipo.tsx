"use client";

import { useReveal } from "../hooks/useReveal";

const miembros = [
  { initials: "BM", nombre: "Mamani Cruz\nBeymar Santiago",    rol: "Desarrollo & Arquitectura" },
  { initials: "BE", nombre: "Burgoa Aliaga\nEvelyn Cristina",   rol: "UX & Diseño de Sistema"   },
  { initials: "GE", nombre: "Gutierrez Huanca\nEinard Angel",   rol: "IA & Lógica de Negocio"   },
  { initials: "MM", nombre: "Menacho Triguero\nMauricio David", rol: "Backend & Integración"     },
];

function MiembroCard({ initials, nombre, rol }: { initials: string; nombre: string; rol: string }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="nos-reveal"
      style={{
        background: "rgba(245,230,208,.06)",
        border: "1px solid rgba(245,230,208,.12)",
        padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.2rem,2.5vw,2rem)",
        borderRadius: "12px",
        transition: "background .3s, border-color .3s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(245,230,208,.12)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(188,153,104,.4)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(245,230,208,.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,230,208,.12)";
      }}
    >
      <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#9B2335,#AB3A50)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem", color: "#FAF5EE", border: "2px solid rgba(188,153,104,.3)", marginBottom: "1.1rem" }}>
        {initials}
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1rem", color: "#FAF5EE", marginBottom: ".3rem", lineHeight: 1.25, whiteSpace: "pre-line" }}>{nombre}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: ".65rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#BC9968", marginBottom: ".85rem" }}>{rol}</div>
      <span style={{ display: "inline-block", padding: ".2rem .65rem", border: "1px solid rgba(188,153,104,.28)", fontFamily: "'DM Sans',sans-serif", fontSize: ".62rem", letterSpacing: ".1em", color: "rgba(245,230,208,.4)", borderRadius: "4px" }}>
        Contribución 100%
      </span>
    </div>
  );
}

export default function Equipo() {
  const ref = useReveal();
  return (
    <section style={{ background: "#5A0F24", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="nos-reveal" ref={ref}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".68rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#BC9968", display: "block", marginBottom: ".9rem" }}>El Equipo</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,3.2rem)", lineHeight: 1.12, color: "#FAF5EE", marginBottom: "1rem" }}>
          Las mentes detrás de <em style={{ fontStyle: "italic" }}>Emotia</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".92rem", lineHeight: 1.85, color: "rgba(245,230,208,.65)", maxWidth: "560px", marginBottom: "clamp(2rem,4vw,3.5rem)" }}>
          Somos estudiantes de 8vo Semestre de la Escuela Militar de Ingeniería &ldquo;Mcal. Antonio José de Sucre&rdquo;, unidos por la pasión de resolver problemas reales con tecnología y creatividad.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "1.2rem" }}>
        {miembros.map(m => <MiembroCard key={m.initials} {...m} />)}
      </div>

      <p
        className="nos-reveal"
        style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: ".95rem", color: "rgba(245,230,208,.38)", marginTop: "clamp(2.5rem,5vw,4rem)", paddingTop: "2rem", borderTop: "1px solid rgba(245,230,208,.1)" }}
      >
        Proyecto académico bajo la tutoría de la{" "}
        <strong style={{ color: "#BC9968", fontStyle: "normal", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
          Lic. Cynthia Rodriguez Caniviri
        </strong>{" "}
        — La Paz, Bolivia · 2026
      </p>
    </section>
  );
}