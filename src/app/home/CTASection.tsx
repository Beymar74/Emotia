"use client";
// CTASection.tsx — Llamada a la acción final

import React from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "./constants";
import { FadeIn } from "./animations";

export default function CTASection() {
  const router = useRouter();
  return (
    <section id="cta" style={{ padding: "64px 24px", maxWidth: "1280px", margin: "0 auto" }}>
      <FadeIn direction="up">
        <div style={{ background: `linear-gradient(135deg, ${COLORS.bordeaux} 0%, ${COLORS.garnet} 55%, ${COLORS.crimson} 100%)`, borderRadius: "36px", position: "relative", overflow: "hidden", textAlign: "center", padding: "64px 32px", boxShadow: "0 24px 56px rgba(90,15,36,0.22)" }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", border: "60px solid rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "180px", height: "180px", borderRadius: "50%", border: "45px solid rgba(188,153,104,0.08)" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "7px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em" }}>🎁 SIN TARJETA DE CRÉDITO</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "white", marginBottom: "16px", lineHeight: 1.1 }}>El regalo perfecto<br />está a un clic</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", maxWidth: "420px", margin: "0 auto 32px", lineHeight: 1.65 }}>Únete a más de 2,400 paceños que ya encontraron la manera de sorprender de verdad.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => router.push("/login")} style={{ padding: "15px 32px", borderRadius: "100px", fontSize: "0.95rem", background: "white", color: COLORS.garnet, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>Comenzar gratis →</button>
              <button onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "15px 28px", borderRadius: "100px", fontSize: "0.95rem", cursor: "pointer", background: "transparent", border: "1.5px solid rgba(255,255,255,0.5)", color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>Ver cómo funciona</button>
            </div>
            <div style={{ marginTop: "36px", display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              {["✓ Gratis para empezar", "✓ Sin compromisos", "✓ Entrega el mismo día"].map(b => (
                <span key={b} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
