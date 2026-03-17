"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
const beneficios = [
  { icon:"🤖", title:"IA que entiende el momento",    tag:"Inteligencia Artificial", desc:"Nuestro asistente no solo filtra por precio. Comprende la relación, la ocasión y la personalidad del destinatario para recomendar regalos que realmente impactan.", highlight:"Recomendaciones en segundos" },
  { icon:"📦", title:"Gestión masiva sin caos",        tag:"Operaciones",             desc:"¿Fin de año con 80 empleados? Desde un solo panel puedes gestionar múltiples pedidos, asignarlos por área, establecer presupuestos y hacer seguimiento de cada uno.", highlight:"Un panel, todos los pedidos" },
  { icon:"🎨", title:"Tu marca en cada detalle",       tag:"Personalización",         desc:"Empaques con los colores de tu empresa, tarjetas con el logo, mensajes firmados por la dirección. Cada regalo refuerza la cultura organizacional.", highlight:"Identidad corporativa integrada" },
  { icon:"🔒", title:"Facturación corporativa",        tag:"Finanzas",                desc:"Facturas a nombre de la empresa, órdenes de compra, pagos por transferencia bancaria o tarjeta corporativa. Sin complicaciones contables.", highlight:"Sin fricciones contables" },
  { icon:"📊", title:"Métricas que importan",          tag:"Reportes",                desc:"¿Cuánto gastó cada área? ¿Qué regalos generaron más impacto? Datos accionables para mejorar tu estrategia de bienestar laboral.", highlight:"Decisiones basadas en datos" },
  { icon:"⚡", title:"Soporte dedicado 24/7",          tag:"Servicio",                desc:"Las empresas afiliadas tienen acceso a un ejecutivo de cuenta asignado, tiempos de entrega preferenciales y soporte prioritario.", highlight:"Atención prioritaria siempre" },
];
function BeneficioCard({ icon, title, tag, desc, highlight, index }: (typeof beneficios)[0] & { index:number }) {
  const ref = useReveal(index * 70);
  return (
    <div ref={ref} className="cm-reveal" style={{ background:"rgba(245,230,208,.05)", border:"1px solid rgba(245,230,208,.1)", borderRadius:"16px", padding:"clamp(1.8rem,3vw,2.5rem)", display:"flex", flexDirection:"column", gap:"1rem", transition:"background .3s,border-color .3s,transform .3s", cursor:"default" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(245,230,208,.09)"; el.style.borderColor="rgba(188,153,104,.35)"; el.style.transform="translateY(-4px)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(245,230,208,.05)"; el.style.borderColor="rgba(245,230,208,.1)"; el.style.transform="translateY(0)"; }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem" }}>
        <div style={{ fontSize:"2rem" }}>{icon}</div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase", color:"#BC9968", background:"rgba(188,153,104,.12)", border:"1px solid rgba(188,153,104,.22)", borderRadius:"100px", padding:".22rem .7rem", whiteSpace:"nowrap" }}>{tag}</span>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#FAF5EE", lineHeight:1.2 }}>{title}</div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".88rem", lineHeight:1.8, color:"rgba(245,230,208,.65)", flexGrow:1 }}>{desc}</p>
      <div style={{ display:"flex", alignItems:"center", gap:".5rem", paddingTop:".9rem", borderTop:"1px solid rgba(245,230,208,.08)" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#BC9968", flexShrink:0 }} />
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".75rem", color:"#BC9968" }}>{highlight}</span>
      </div>
    </div>
  );
}
export default function BeneficiosDetallados() {
  const ref = useReveal();
  return (
    <section style={{ background:"linear-gradient(160deg,#5A0F24 0%,#6B1228 100%)", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="cm-reveal" ref={ref} style={{ marginBottom:"clamp(3rem,6vw,5rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Beneficios</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#FAF5EE", marginBottom:"1rem", maxWidth:"600px" }}>
          Por qué las empresas<br /><em style={{ fontStyle:"italic" }}>eligen Emotia</em>
        </h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".95rem", lineHeight:1.85, color:"rgba(245,230,208,.65)", maxWidth:"560px" }}>
          Más que una tienda de regalos. Una herramienta que profesionaliza la gestión del bienestar corporativo.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,340px),1fr))", gap:"1.5rem" }}>
        {beneficios.map((b, i) => <BeneficioCard key={b.title} {...b} index={i} />)}
      </div>
    </section>
  );
}
