"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "./constants";
import { FadeIn } from "./animations";

export default function CTASection() {
  const router = useRouter();
  return (
    <section id="cta" style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto" }}>
      <FadeIn direction="up">
        <div style={{ background: `linear-gradient(135deg, ${COLORS.bordeaux} 0%, ${COLORS.garnet} 55%, ${COLORS.crimson} 100%)`, borderRadius: "40px", position: "relative", overflow: "hidden", textAlign: "center", padding: "100px 32px", boxShadow: "0 30px 60px rgba(90,15,36,0.25)" }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", border: "80px solid rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", border: "50px solid rgba(188,153,104,0.06)" }} />
          
          <div style={{ position: "relative", zIndex: 2, maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", marginBottom: "32px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: COLORS.beige, letterSpacing: "0.15em" }}>�� ÚNETE A LA EXPERIENCIA EMOTIA</span>
            </div>
            
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, color: "white", marginBottom: "24px", lineHeight: 1.1 }}>
              No vuelvas a olvidar<br />una fecha importante.
            </h2>
            
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 300 }}>
              Crea tu cuenta gratis hoy. Guarda los cumpleaños y aniversarios de tus seres queridos, usa nuestra <strong>IA sin límites</strong> para encontrar regalos y recibe recordatorios automáticos.
            </p>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => router.push("/registro")} style={{ padding: "18px 40px", borderRadius: "100px", fontSize: "1.05rem", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", background: "white", color: COLORS.garnet, border: "none", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                Crear mi cuenta gratis →
              </button>
            </div>
            
            <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
              {["✓ Calendario Inteligente", "✓ IA Ilimitada", "✓ Ofertas Exclusivas"].map(b => (
                <span key={b} style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
