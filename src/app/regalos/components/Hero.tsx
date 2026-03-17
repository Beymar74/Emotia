"use client";
import React, { useEffect, useRef } from "react";
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .rg-reveal { opacity:0; transform:translateY(26px); transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1); }
  .rg-reveal.rg-visible { opacity:1; transform:translateY(0); }
  .rg-fade { opacity:0; transform:translateY(18px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .rg-fade.rg-active { opacity:1; transform:translateY(0); }
`;
const ocasiones = ["🎂 Cumpleaños","💍 Aniversario","🎓 Graduación","💝 San Valentín","🎄 Navidad","👶 Baby Shower"];
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".rg-fade");
    els?.forEach((el, i) => setTimeout(() => el.classList.add("rg-active"), 80 + i * 130));
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(4rem,7vw,7rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(188,153,104,.12) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div ref={ref} style={{ position:"relative", zIndex:1, maxWidth:"1280px", margin:"0 auto" }}>
          <div className="rg-fade" style={{ display:"inline-flex", alignItems:"center", gap:".6rem", background:"rgba(188,153,104,.15)", border:"1px solid rgba(188,153,104,.3)", borderRadius:"100px", padding:".4rem 1.1rem", marginBottom:"1.8rem" }}>
            <span style={{ fontSize:".6rem", color:"#BC9968" }}>●</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".7rem", letterSpacing:".25em", textTransform:"uppercase", color:"#BC9968" }}>Catálogo Emotia</span>
          </div>
          <h1 className="rg-fade" style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.8rem,6vw,5.5rem)", lineHeight:1.05, color:"#FAF5EE", marginBottom:"1.2rem", maxWidth:"820px" }}>
            El regalo <em style={{ fontStyle:"italic", color:"#BC9968" }}>perfecto</em><br />para cada momento
          </h1>
          <p className="rg-fade" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:"clamp(1rem,1.8vw,1.15rem)", lineHeight:1.75, color:"rgba(245,230,208,.72)", maxWidth:"560px", marginBottom:"2.5rem" }}>
            Explora cientos de opciones personalizadas. Filtra por ocasión, presupuesto o destinatario y deja que nuestra IA te guíe hacia el detalle ideal.
          </p>
          <div className="rg-fade" style={{ display:"flex", flexWrap:"wrap", gap:".6rem" }}>
            {ocasiones.map(o => (
              <a key={o} href="#catalogo" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"#FAF5EE", background:"rgba(245,230,208,.1)", border:"1px solid rgba(245,230,208,.2)", borderRadius:"100px", padding:".4rem 1rem", textDecoration:"none", transition:"background .2s,border-color .2s" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(188,153,104,.25)"; el.style.borderColor="rgba(188,153,104,.5)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(245,230,208,.1)"; el.style.borderColor="rgba(245,230,208,.2)"; }}
              >{o}</a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
