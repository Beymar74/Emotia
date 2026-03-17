"use client";
import React, { useEffect, useRef } from "react";
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .cm-reveal { opacity:0; transform:translateY(26px); transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1); }
  .cm-reveal.cm-visible { opacity:1; transform:translateY(0); }
  .cm-fade { opacity:0; transform:translateY(18px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .cm-fade.cm-active { opacity:1; transform:translateY(0); }
`;
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".cm-fade");
    els?.forEach((el, i) => setTimeout(() => el.classList.add("cm-active"), 80 + i * 140));
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(3.5rem,6vw,6rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position:"absolute", top:"-15%", right:"-8%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,rgba(188,153,104,.1) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div ref={ref} style={{ position:"relative", zIndex:1, maxWidth:"1280px", margin:"0 auto" }}>
          <div className="cm-fade" style={{ display:"inline-flex", alignItems:"center", gap:".6rem", background:"rgba(188,153,104,.15)", border:"1px solid rgba(188,153,104,.3)", borderRadius:"100px", padding:".4rem 1.1rem", marginBottom:"1.8rem" }}>
            <span style={{ fontSize:".6rem", color:"#BC9968" }}>●</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".7rem", letterSpacing:".25em", textTransform:"uppercase", color:"#BC9968" }}>Emotia para Empresas</span>
          </div>
          <h1 className="cm-fade" style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.8rem,6vw,5.5rem)", lineHeight:1.05, color:"#FAF5EE", marginBottom:"1.4rem", maxWidth:"820px" }}>
            Todo lo que tu empresa<br />necesita para <em style={{ fontStyle:"italic", color:"#BC9968" }}>regalar bien</em>
          </h1>
          <p className="cm-fade" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:"clamp(1rem,1.8vw,1.15rem)", lineHeight:1.75, color:"rgba(245,230,208,.72)", maxWidth:"600px", marginBottom:"3rem" }}>
            Emotia simplifica la gestión de regalos corporativos de principio a fin: desde elegir el detalle perfecto con ayuda de IA hasta el seguimiento de cada entrega, todo en un solo lugar.
          </p>
          <div className="cm-fade" style={{ display:"flex", flexWrap:"wrap", gap:"clamp(1.5rem,4vw,4rem)" }}>
            {[{ num:"3 min", label:"Para configurar un pedido" },{ num:"48 h", label:"Tiempo de respuesta" },{ num:"100%", label:"Personalizable" }].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.8rem,3vw,2.8rem)", color:"#BC9968", lineHeight:1 }}>{num}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".62rem", letterSpacing:".15em", textTransform:"uppercase", color:"rgba(245,230,208,.42)", marginTop:".3rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
