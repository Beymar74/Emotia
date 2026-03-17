"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
const categorias = [
  { icon:"📦", title:"Pedidos",          desc:"Estado, modificaciones, cancelaciones y confirmaciones de compra.",          links:["¿Cómo hago un pedido?","¿Puedo cancelar un pedido?","¿Cómo modifico mi pedido?"],          para:"todos"    },
  { icon:"💳", title:"Pagos",            desc:"Métodos de pago, facturas, reembolsos y cobros incorrectos.",                links:["¿Qué métodos de pago aceptan?","¿Cómo solicito una factura?","¿Cómo pido un reembolso?"],    para:"todos"    },
  { icon:"🚚", title:"Envíos",           desc:"Seguimiento, tiempos estimados y problemas con la entrega.",                 links:["¿Cómo rastro mi pedido?","¿Cuánto tarda la entrega?","Mi pedido no llegó, ¿qué hago?"],        para:"todos"    },
  { icon:"🎁", title:"Personalización",  desc:"Mensajes, empaques, dedicatorias y opciones de diseño.",                    links:["¿Cómo añado una dedicatoria?","¿Puedo elegir el empaque?","¿Hay límite de caracteres?"],        para:"clientes" },
  { icon:"🏢", title:"Empresas",         desc:"Proceso de afiliación, panel corporativo y pedidos masivos.",                links:["¿Cómo me afilio?","¿Cómo gestiono pedidos masivos?","¿Tienen facturación corporativa?"],      para:"empresas" },
  { icon:"🤖", title:"Asesor IA",        desc:"Cómo funciona el asistente, recomendaciones y preferencias.",               links:["¿Cómo funciona el asesor?","¿Por qué recibo esas recomendaciones?","¿Puedo guardar preferencias?"], para:"todos" },
];
const tagColors: Record<string,{bg:string;border:string;color:string}> = {
  todos:    { bg:"rgba(188,153,104,.1)",  border:"rgba(188,153,104,.25)", color:"#BC9968" },
  clientes: { bg:"rgba(155,35,53,.08)",   border:"rgba(155,35,53,.2)",    color:"#9B2335" },
  empresas: { bg:"rgba(90,15,36,.08)",    border:"rgba(90,15,36,.18)",    color:"#5A0F24" },
};
const tagLabel: Record<string,string> = { todos:"Todos", clientes:"Clientes", empresas:"Empresas" };
function CategoriaCard({ icon, title, desc, links, para, index }: (typeof categorias)[0] & { index:number }) {
  const ref = useReveal(index * 70);
  const tag = tagColors[para];
  return (
    <div ref={ref} className="ay-reveal" style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"16px", padding:"clamp(1.8rem,3vw,2.5rem)", display:"flex", flexDirection:"column", gap:"1rem", boxShadow:"0 2px 12px rgba(90,15,36,.04)", transition:"transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s", cursor:"default" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 16px 40px rgba(90,15,36,.1)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 2px 12px rgba(90,15,36,.04)"; }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem" }}>
        <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"linear-gradient(135deg,rgba(155,35,53,.1),rgba(188,153,104,.15))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>{icon}</div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase", color:tag.color, background:tag.bg, border:`1px solid ${tag.border}`, borderRadius:"100px", padding:".22rem .7rem", whiteSpace:"nowrap" }}>{tagLabel[para]}</span>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24", lineHeight:1.2 }}>{title}</div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".85rem", lineHeight:1.75, color:"#5C3A1E" }}>{desc}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:".5rem", paddingTop:".8rem", borderTop:"1px solid rgba(155,35,53,.08)" }}>
        {links.map(link => (
          <button key={link} style={{ display:"flex", alignItems:"center", gap:".5rem", background:"none", border:"none", padding:".3rem 0", cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"#9B2335", transition:"gap .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap=".8rem"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap=".5rem"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}
export default function Categorias() {
  const ref = useReveal();
  return (
    <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="ay-reveal" ref={ref} style={{ marginBottom:"clamp(2.5rem,5vw,4.5rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Categorías</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem" }}>
          ¿Sobre qué necesitas <em style={{ fontStyle:"italic" }}>ayuda?</em>
        </h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".92rem", lineHeight:1.85, color:"#5C3A1E", maxWidth:"520px" }}>
          Selecciona una categoría para encontrar respuestas rápidas o explora las preguntas frecuentes más abajo.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))", gap:"1.2rem" }}>
        {categorias.map((c, i) => <CategoriaCard key={c.title} {...c} index={i} />)}
      </div>
    </section>
  );
}
