"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
const cats = [
  { icon:"🌸", name:"Flores & Plantas",    count:24 },
  { icon:"✨", name:"Experiencias",         count:18 },
  { icon:"🏺", name:"Artesanías",           count:32 },
  { icon:"🍫", name:"Gourmet & Dulces",     count:21 },
  { icon:"��", name:"Bienestar & Spa",      count:15 },
  { icon:"📚", name:"Libros & Arte",        count:19 },
  { icon:"👗", name:"Moda & Accesorios",    count:28 },
  { icon:"🎮", name:"Tecnología & Gadgets", count:12 },
];
export default function Categorias() {
  const ref = useReveal();
  return (
    <section style={{ background:"#FAF5EE", padding:"clamp(3rem,6vw,6rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="rg-reveal" ref={ref} style={{ marginBottom:"clamp(2rem,4vw,3.5rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Categorías</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3rem)", lineHeight:1.1, color:"#5A0F24" }}>
          Explora por <em style={{ fontStyle:"italic" }}>tipo de regalo</em>
        </h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,140px),1fr))", gap:"1rem" }}>
        {cats.map((c, i) => {
          const ref2 = useReveal(i * 50);
          return (
            <div key={c.name} ref={ref2} className="rg-reveal" style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"16px", padding:"1.5rem 1rem", textAlign:"center", cursor:"pointer", transition:"transform .3s,box-shadow .3s,border-color .3s" }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 12px 32px rgba(90,15,36,.1)"; el.style.borderColor="rgba(155,35,53,.25)"; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="none"; el.style.borderColor="rgba(155,35,53,.1)"; }}
            >
              <div style={{ fontSize:"2rem", marginBottom:".6rem" }}>{c.icon}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".8rem", color:"#5A0F24", lineHeight:1.3, marginBottom:".3rem" }}>{c.name}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".7rem", color:"#BC9968" }}>{c.count} regalos</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
