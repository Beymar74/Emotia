"use client";

import { useReveal } from "../hooks/useReveal";

const features = [
  { icon: "💬", title: "Asesor IA Conversacional",   desc: "El asistente identifica el perfil del destinatario, la ocasión y el presupuesto, luego filtra el catálogo y genera recomendaciones precisas en tiempo real." },
  { icon: "✏️", title: "Personalización Profunda",    desc: "Cartas, dedicatorias, estilos y empaques. El usuario interviene cada detalle del regalo para hacerlo verdaderamente único y significativo." },
  { icon: "🔒", title: "Pago Seguro & Tracking",      desc: "Pasarelas de pago protegidas y notificaciones en tiempo real desde la confirmación hasta la entrega final del pedido." },
  { icon: "🏆", title: "Gamificación & Fidelización", desc: "Los usuarios acumulan puntos e insignias. Los proveedores gestionan inventarios y métricas desde un panel profesional." },
];

function FeatureItem({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const ref = useReveal(index * 90);
  return (
    <div
      ref={ref}
      className="nos-reveal"
      style={{
        display: "flex", gap: "1.2rem", alignItems: "flex-start",
        padding: "1.6rem 0",
        borderBottom: "1px solid rgba(155,35,53,.1)",
        borderTop: index === 0 ? "1px solid rgba(155,35,53,.1)" : undefined,
        transition: "padding-left .3s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = ".5rem"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
    >
      <div style={{ flexShrink: 0, width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg,#9B2335,#AB3A50)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#9B2335", marginBottom: ".35rem" }}>{title}</h4>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".88rem", lineHeight: 1.78, color: "#5C3A1E" }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Propuesta() {
  const leftRef = useReveal();
  return (
    <section style={{ background: "#FAF5EE", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(2.5rem,5vw,6rem)", alignItems: "start" }}>

        {/* izquierda */}
        <div ref={leftRef}>
          <span className="nos-reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".68rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#BC9968", display: "block", marginBottom: ".9rem" }}>
            Propuesta de Solución
          </span>
          <h2 className="nos-reveal" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,3.2rem)", lineHeight: 1.12, color: "#5A0F24", marginBottom: "1.2rem" }}>
            Cómo <em style={{ fontStyle: "italic" }}>funciona</em> Emotia
          </h2>
          <p className="nos-reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".92rem", lineHeight: 1.85, color: "#5C3A1E" }}>
            Nuestro sistema guía al usuario a través de un flujo conversacional inteligente que transforma sus necesidades en el regalo perfecto, sin estrés y sin pérdida de tiempo.
          </p>
        </div>

        {/* derecha */}
        <div>
          {features.map((f, i) => <FeatureItem key={f.title} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
}