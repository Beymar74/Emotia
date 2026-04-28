"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
const destacados = [
  { emoji:"🌹", nombre:"Ramo de Rosas Premium",      precio:85,  tag:"Más vendido",  ocasion:"Aniversario",  dest:"Pareja"  },
  { emoji:"🍫", nombre:"Caja Gourmet Personalizada",  precio:120, tag:"⭐ Top rated", ocasion:"Cumpleaños",   dest:"Ella"    },
  { emoji:"🧴", nombre:"Kit Spa & Bienestar",         precio:150, tag:"Nuevo",        ocasion:"Cualquier",    dest:"Ella"    },
  { emoji:"🏺", nombre:"Artesanía Tiwanaku",          precio:95,  tag:"Local",        ocasion:"Graduación",   dest:"Ambos"   },
  { emoji:"📖", nombre:"Libro Personalizado",         precio:75,  tag:"Único",        ocasion:"Cumpleaños",   dest:"Ambos"   },
  { emoji:"✨", nombre:"Experiencia Cena Romántica",  precio:200, tag:"Premium",      ocasion:"Aniversario",  dest:"Pareja"  },
];
export default function Destacados() {
  const ref = useReveal();
  return (
    <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="rg-reveal" ref={ref} style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Populares</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#5A0F24" }}>
          Regalos <em style={{ fontStyle:"italic" }}>más elegidos</em>
        </h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,260px),1fr))", gap:"1.2rem" }}>
        {destacados.map((r, i) => <RegaloCard key={r.nombre} {...r} index={i} />)}
      </div>
    </section>
  );
}
function RegaloCard({ emoji, nombre, precio, tag, ocasion, dest, index }: (typeof destacados)[0] & { index:number }) {
  const ref = useReveal(index * 70);
  return (
    <div ref={ref} className="rg-reveal" style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"20px", overflow:"hidden", boxShadow:"0 2px 12px rgba(90,15,36,.04)", transition:"transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s", cursor:"pointer" }}
      onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(-5px)"; el.style.boxShadow="0 20px 48px rgba(90,15,36,.12)"; }}
      onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 2px 12px rgba(90,15,36,.04)"; }}
    >
      <div style={{ background:"linear-gradient(135deg,rgba(155,35,53,.06),rgba(188,153,104,.1))", height:"160px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem", position:"relative" }}>
        {emoji}
        <span style={{ position:"absolute", top:"12px", left:"12px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".62rem", letterSpacing:".1em", textTransform:"uppercase", color:"#9B2335", background:"rgba(155,35,53,.1)", border:"1px solid rgba(155,35,53,.2)", borderRadius:"100px", padding:".2rem .7rem" }}>{tag}</span>
      </div>
      <div style={{ padding:"1.4rem" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1rem", color:"#5A0F24", marginBottom:".5rem", lineHeight:1.25 }}>{nombre}</div>
        <div style={{ display:"flex", gap:".5rem", marginBottom:"1rem", flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".68rem", fontWeight:500, color:"#BC9968", background:"rgba(188,153,104,.1)", borderRadius:"100px", padding:".18rem .6rem" }}>{ocasion}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".68rem", fontWeight:500, color:"#9B2335", background:"rgba(155,35,53,.07)", borderRadius:"100px", padding:".18rem .6rem" }}>Para {dest}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.2rem", color:"#9B2335" }}>Bs. {precio}</div>
          <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".78rem", background:"#9B2335", color:"#FAF5EE", border:"none", borderRadius:"100px", padding:".5rem 1.1rem", cursor:"pointer", transition:"background .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#7d1a29"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#9B2335"; }}
          >Ver regalo</button>
        </div>
      </div>
    </div>
  );
}
