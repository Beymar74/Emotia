"use client";
import React from "react";
import { useReveal } from "../hooks/useReveal";
import { useRouter } from "next/navigation";
export default function CTA() {
  const ref = useReveal();
  const router = useRouter();
  return (
    <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,6rem)" }}>
      <div ref={ref} style={{ maxWidth:"720px", margin:"0 auto", textAlign:"center" }}>
        <div className="cm-reveal" style={{ fontSize:"3.5rem", marginBottom:"2rem" }}>🎁</div>
        <h2 className="cm-reveal" style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.2rem,5vw,4rem)", lineHeight:1.08, color:"#5A0F24", marginBottom:"1.2rem" }}>
          Listo para empezar a<br /><em style={{ fontStyle:"italic", color:"#9B2335" }}>regalar con propósito</em>
        </h2>
        <p className="cm-reveal" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".98rem", lineHeight:1.82, color:"#5C3A1E", maxWidth:"560px", margin:"0 auto 3rem" }}>
          La afiliación es gratuita, el proceso toma menos de 5 minutos y nuestro equipo estará contigo desde el primer pedido.
        </p>
        <div className="cm-reveal" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"1rem", marginBottom:"3rem" }}>
          {["✓ Sin costo de afiliación","✓ Respuesta en 48h","✓ Soporte dedicado","✓ Facturación corporativa"].map(item => (
            <span key={item} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".8rem", color:"#5A0F24", background:"rgba(155,35,53,.07)", border:"1px solid rgba(155,35,53,.12)", borderRadius:"100px", padding:".35rem 1rem" }}>{item}</span>
          ))}
        </div>
        <div className="cm-reveal">
          <button onClick={() => router.push("/afiliacion")} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"1rem", background:"#9B2335", color:"#FAF5EE", border:"none", borderRadius:"100px", padding:"16px 42px", cursor:"pointer", boxShadow:"0 6px 28px rgba(155,35,53,.32)", transition:"background .2s,transform .15s,box-shadow .2s" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="#7d1a29"; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 10px 32px rgba(155,35,53,.42)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="#9B2335"; el.style.transform="translateY(0)"; el.style.boxShadow="0 6px 28px rgba(155,35,53,.32)"; }}
          >Solicitar afiliación →</button>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".75rem", color:"rgba(92,58,30,.45)", marginTop:"1.2rem" }}>🔒 Proceso seguro · Sin compromisos</p>
        </div>
      </div>
    </section>
  );
}
