"use client";

import { useReveal } from "../hooks/useReveal";

const valores = [
  { num: "01", name: "Conexión Emocional",       desc: "Cada interacción está diseñada para evocar sentimientos genuinos. Un regalo bien elegido fortalece vínculos y crea recuerdos para toda la vida." },
  { num: "02", name: "Personalización Auténtica", desc: "No existen dos personas iguales, por eso no existe un regalo universal. Adaptamos cada recomendación al perfil único del destinatario y la ocasión." },
  { num: "03", name: "Innovación con Propósito",  desc: "Empleamos IA como herramienta concreta para resolver un problema real: la indecisión y el tiempo perdido buscando el regalo perfecto." },
  { num: "04", name: "Confianza Total",            desc: "Pasarelas de pago seguras y tracking en tiempo real mantienen al usuario informado en cada etapa, eliminando la incertidumbre de la compra." },
  { num: "05", name: "Comunidad Creativa",         desc: "Somos el puente entre consumidores y artesanos bolivianos. Visibilizamos el talento local y construimos un ecosistema donde todos ganan." },
  { num: "06", name: "Experiencia Sin Fricciones", desc: "Desde la primera consulta hasta el seguimiento del envío, cada paso fue diseñado para ser fluido e intuitivo, transformando la compra en un placer." },
];

function ValorCard({ num, name, desc }: { num: string; name: string; desc: string }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="nos-reveal"
      style={{
        background: "#FFFFFF",
        padding: "clamp(1.8rem,3vw,2.8rem) clamp(1.4rem,2.5vw,2.2rem)",
        position: "relative", overflow: "hidden",
        transition: "transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(90,15,36,.1)";
        const line = e.currentTarget.querySelector(".val-line") as HTMLElement;
        if (line) line.style.opacity = "1";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        const line = e.currentTarget.querySelector(".val-line") as HTMLElement;
        if (line) line.style.opacity = "0";
      }}
    >
      <div className="val-line" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "linear-gradient(180deg,#9B2335,#BC9968)", opacity: 0, transition: "opacity .35s" }} />
      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "2.8rem", color: "rgba(155,35,53,.08)", lineHeight: 1, marginBottom: ".7rem" }}>{num}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9B2335", marginBottom: ".75rem" }}>{name}</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".88rem", lineHeight: 1.8, color: "#5C3A1E" }}>{desc}</p>
    </div>
  );
}

export default function Valores() {
  const ref = useReveal();
  return (
    <section style={{ background: "linear-gradient(155deg,#FAF5EE 0%,#f0e6d2 100%)", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="nos-reveal" ref={ref} style={{ marginBottom: "clamp(2.5rem,5vw,5rem)" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".68rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#BC9968", display: "block", marginBottom: ".9rem" }}>Nuestros Valores</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,3.2rem)", lineHeight: 1.12, color: "#5A0F24" }}>
          Los principios que <em style={{ fontStyle: "italic" }}>nos mueven</em>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "2px" }}>
        {valores.map(v => <ValorCard key={v.num} {...v} />)}
      </div>
    </section>
  );
}