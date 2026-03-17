"use client";
import React, { useEffect, useRef, useState } from "react";
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ay-reveal { opacity:0; transform:translateY(26px); transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1); }
  .ay-reveal.ay-visible { opacity:1; transform:translateY(0); }
  .ay-fade { opacity:0; transform:translateY(18px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .ay-fade.ay-active { opacity:1; transform:translateY(0); }
  .ay-search { width:100%; font-family:'DM Sans',sans-serif; font-size:1rem; color:#3D1A0E; background:rgba(255,255,255,.92); border:2px solid rgba(155,35,53,.2); border-radius:100px; padding:16px 60px 16px 24px; outline:none; transition:border-color .2s,box-shadow .2s; }
  .ay-search::placeholder { color:rgba(92,58,30,.4); }
  .ay-search:focus { border-color:#9B2335; box-shadow:0 0 0 4px rgba(155,35,53,.1); }
`;
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".ay-fade");
    els?.forEach((el, i) => setTimeout(() => el.classList.add("ay-active"), 80 + i * 130));
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(4rem,7vw,7rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div ref={ref} style={{ position:"relative", zIndex:1, maxWidth:"760px", margin:"0 auto", textAlign:"center" }}>
          <div className="ay-fade" style={{ display:"inline-flex", alignItems:"center", gap:".6rem", background:"rgba(188,153,104,.15)", border:"1px solid rgba(188,153,104,.3)", borderRadius:"100px", padding:".4rem 1.1rem", marginBottom:"1.8rem" }}>
            <span style={{ fontSize:".6rem", color:"#BC9968" }}>●</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".7rem", letterSpacing:".25em", textTransform:"uppercase", color:"#BC9968" }}>Centro de Ayuda</span>
          </div>
          <h1 className="ay-fade" style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.6rem,6vw,5rem)", lineHeight:1.06, color:"#FAF5EE", marginBottom:"1.2rem" }}>
            ¿En qué podemos<br /><em style={{ fontStyle:"italic", color:"#BC9968" }}>ayudarte?</em>
          </h1>
          <p className="ay-fade" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:"clamp(.95rem,1.8vw,1.1rem)", lineHeight:1.75, color:"rgba(245,230,208,.7)", marginBottom:"2.5rem" }}>
            Encuentra respuestas rápidas, contáctanos por WhatsApp o escríbenos. Estamos aquí para ti.
          </p>
          <div className="ay-fade" style={{ position:"relative", maxWidth:"560px", margin:"0 auto" }}>
            <input className="ay-search" placeholder="Busca tu pregunta… ej. ¿Cómo rastro mi pedido?" value={query} onChange={e => setQuery(e.target.value)} />
            <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", color:"#9B2335", pointerEvents:"none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>
          <div className="ay-fade" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"clamp(1.5rem,4vw,3.5rem)", marginTop:"3rem" }}>
            {[{ num:"< 2h", label:"Tiempo de respuesta" },{ num:"24/7", label:"WhatsApp disponible" },{ num:"98%", label:"Casos resueltos" }].map(({ num, label }) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.6rem,3vw,2.4rem)", color:"#BC9968", lineHeight:1 }}>{num}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".62rem", letterSpacing:".15em", textTransform:"uppercase", color:"rgba(245,230,208,.42)", marginTop:".3rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
