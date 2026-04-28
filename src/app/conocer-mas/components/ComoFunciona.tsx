"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
const pasos = [
  { num:"01", icon:"🏢", title:"Tu empresa se afilia",        desc:"Completas el formulario en menos de 3 minutos. Nuestro equipo revisa tu solicitud y te confirma en 48 horas. Sin costos de entrada." },
  { num:"02", icon:"🤖", title:"La IA aprende tu contexto",   desc:"Le cuentas al asistente para qué necesitas el regalo: cumpleaños, reconocimiento, fin de año, bienvenida. La IA entiende el momento." },
  { num:"03", icon:"🎁", title:"Recibes recomendaciones",     desc:"En segundos obtienes opciones personalizadas según el perfil del destinatario, la ocasión y tu presupuesto. Sin buscar, sin comparar." },
  { num:"04", icon:"✏️", title:"Personalizas cada detalle",   desc:"Añades nombre, dedicatoria y empaque con la identidad de tu empresa. Cada regalo refleja que fue pensado especialmente." },
  { num:"05", icon:"🚚", title:"Seguimiento en tiempo real",  desc:"Desde que confirmas el pedido hasta la entrega recibes notificaciones del estado. Tu equipo sabe cuándo llegará su regalo." },
  { num:"06", icon:"📊", title:"Panel de control corporativo",desc:"Historial de pedidos, gasto por área, métricas de impacto. Todo centralizado para gestionar múltiples entregas sin esfuerzo." },
];
function PasoCard({ num, icon, title, desc, index }: (typeof pasos)[0] & { index:number }) {
  const ref = useReveal(index * 80);
  return (
    <div ref={ref} className="cm-reveal" style={{ background:"#FFFFFF", padding:"clamp(2rem,3.5vw,2.8rem)", position:"relative", overflow:"hidden", transition:"box-shadow .35s", cursor:"default" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(90,15,36,.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ position:"absolute", top:"-1rem", right:".5rem", fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"6rem", lineHeight:1, color:"rgba(155,35,53,.04)", pointerEvents:"none", userSelect:"none" }}>{num}</div>
      <div style={{ display:"inline-flex", alignItems:"center", marginBottom:"1.2rem" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".65rem", letterSpacing:".18em", color:"#9B2335", background:"rgba(155,35,53,.08)", border:"1px solid rgba(155,35,53,.15)", borderRadius:"100px", padding:".2rem .7rem" }}>{num}</span>
      </div>
      <div style={{ fontSize:"1.8rem", marginBottom:"1rem" }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24", marginBottom:".75rem", lineHeight:1.2 }}>{title}</div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".88rem", lineHeight:1.8, color:"#5C3A1E" }}>{desc}</p>
    </div>
  );
}
export default function ComoFunciona() {
  const ref = useReveal();
  return (
    <section style={{ background:"#FAF5EE", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="cm-reveal" ref={ref} style={{ marginBottom:"clamp(3rem,6vw,5rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Paso a paso</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem", maxWidth:"600px" }}>
          Cómo funciona Emotia<br /><em style={{ fontStyle:"italic" }}>para tu empresa</em>
        </h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".95rem", lineHeight:1.85, color:"#5C3A1E", maxWidth:"560px" }}>
          Un flujo diseñado para que cualquier persona del equipo pueda gestionar regalos corporativos sin complicaciones.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,320px),1fr))", gap:"2px" }}>
        {pasos.map((p, i) => <PasoCard key={p.num} {...p} index={i} />)}
      </div>
    </section>
  );
}
