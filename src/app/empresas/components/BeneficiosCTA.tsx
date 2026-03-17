"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "../hooks/useReveal";

const beneficios = [
  { icon: "🤖", title: "IA que conoce tu empresa",     desc: "Nuestro asistente aprende las preferencias de tu equipo y sugiere regalos alineados a la cultura organizacional." },
  { icon: "📦", title: "Pedidos masivos sin fricción",  desc: "Gestiona decenas de regalos desde un solo panel: fechas, presupuestos, destinatarios y seguimiento centralizado." },
  { icon: "🎨", title: "Personalización con tu marca",  desc: "Empaques, tarjetas y mensajes con la identidad visual de tu empresa. Cada detalle refleja quiénes son." },
  { icon: "📊", title: "Reportes y métricas",           desc: "Panel de control con historial de pedidos, gasto por área, fechas clave y análisis de impacto en tu equipo." },
  { icon: "🔒", title: "Facturación corporativa",       desc: "Proceso de pago adaptado a empresas con facturación, órdenes de compra y múltiples métodos de pago." },
  { icon: "⚡", title: "Prioridad en entregas",         desc: "Las empresas afiliadas acceden a tiempos de entrega preferenciales y soporte dedicado 24/7." },
];

function BeneficioItem({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const ref = useReveal(index * 70);
  return (
    <div ref={ref} className="emp-reveal" style={{ background: "#5A0F24", padding: "2.2rem 2rem", transition: "background .3s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245,230,208,.07)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#5A0F24"; }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#BC9968", marginBottom: ".65rem" }}>{title}</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".88rem", lineHeight: 1.78, color: "rgba(245,230,208,.65)" }}>{desc}</p>
    </div>
  );
}

export default function BeneficiosCTA() {
  const ref    = useReveal();
  const ctaRef = useReveal();
  return (
    <>
      <section id="beneficios" style={{ background: "#5A0F24", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
        <div className="emp-reveal" ref={ref} style={{ marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".68rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#BC9968", display: "block", marginBottom: ".9rem" }}>¿Por qué afiliarse?</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,3.2rem)", lineHeight: 1.12, color: "#FAF5EE", maxWidth: "600px" }}>
            Todo lo que tu empresa <em style={{ fontStyle: "italic" }}>necesita</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "1px", background: "rgba(245,230,208,.06)" }}>
          {beneficios.map(({ icon, title, desc }, i) => <BeneficioItem key={title} icon={icon} title={title} desc={desc} index={i} />)}
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg,#FAF5EE 0%,#f0e6d2 100%)", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", textAlign: "center" }}>
        <div ref={ctaRef} style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div className="emp-reveal" style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🤝</div>
          <h2 className="emp-reveal" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.1, color: "#5A0F24", marginBottom: "1.2rem" }}>
            ¿Tu empresa quiere <em style={{ fontStyle: "italic" }}>unirse</em>?
          </h2>
          <p className="emp-reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: ".95rem", lineHeight: 1.8, color: "#5C3A1E", marginBottom: "2.5rem" }}>
            Forma parte de la red Emotia y ofrece a tu equipo una experiencia de regalos personalizada, eficiente y con el respaldo de inteligencia artificial. El proceso de afiliación es rápido y sin costo inicial.
          </p>
          <div className="emp-reveal" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <Link href="/afiliacion">
            <button style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".9rem", background: "#9B2335", color: "#FAF5EE", border: "none", borderRadius: "100px", padding: "14px 32px", cursor: "pointer", boxShadow: "0 4px 20px rgba(155,35,53,.3)", transition: "background .2s,transform .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#7d1a29"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#9B2335"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >Solicitar afiliación</button>
            </Link>
            <button style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: ".9rem", background: "transparent", color: "#9B2335", border: "1.5px solid rgba(155,35,53,.35)", borderRadius: "100px", padding: "14px 32px", cursor: "pointer", transition: "border-color .2s,background .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#9B2335"; (e.currentTarget as HTMLElement).style.background = "rgba(155,35,53,.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,35,53,.35)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >Conocer más</button>
          </div>
          <p className="emp-reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem", color: "rgba(92,58,30,.5)", marginTop: "1.5rem" }}>
            Sin costo de afiliación · Soporte dedicado · Facturación corporativa incluida
          </p>
        </div>
      </section>
    </>
  );
}
