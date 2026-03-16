"use client";
// HeroSection.tsx — Sección principal con chat animado

import React from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "./constants";
import { HeartIcon, StarIcon } from "./icons";
import { FloatingOrb, PulsingDot } from "./animations";

interface HeroProps { typedText: string; chatStep: number; fullText: string; }

export default function HeroSection({ typedText, chatStep, fullText }: HeroProps) {
  const router = useRouter();
  const avatars = ["V", "C", "S", "M"];

  return (
    <section id="hero" className="hero-bg" style={{ padding: "120px 24px 72px", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", minHeight: "100svh" }}>
      <FloatingOrb size="380px" top="-100px" left="-100px" color={COLORS.garnet} delay={0} opacity={0.1} />
      <FloatingOrb size="260px" top="60%"    left="72%"   color={COLORS.gold}   delay={1} opacity={0.13} />
      <FloatingOrb size="180px" top="18%"    left="82%"   color={COLORS.crimson} delay={2} opacity={0.1} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "56px", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: `1px solid ${COLORS.garnet}20`, borderRadius: "100px", padding: "7px 16px", marginBottom: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <PulsingDot color={COLORS.garnet} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: COLORS.garnet, letterSpacing: "0.08em" }}>IA DISPONIBLE 24/7 EN LA PAZ</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 5.5vw, 4.4rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "22px", color: COLORS.bordeaux }}>
            El regalo perfecto,{" "}<br /><em><span className="text-shimmer">siempre.</span></em>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: COLORS.chocolate, opacity: 0.85, marginBottom: "36px", maxWidth: "460px" }}>
            Nuestra IA analiza emociones, personalidades y ocasiones para encontrar el regalo artesanal ideal. Deja de adivinar. Empieza a sorprender.
          </p>

          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "15px 30px", borderRadius: "100px", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={() => router.push("/login")}>
              Comenzar gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="btn-secondary" style={{ padding: "15px 24px", borderRadius: "100px", fontSize: "0.95rem" }} onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Ver cómo funciona
            </button>
          </div>

          <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex" }}>
              {avatars.map((l, i) => (
                <div key={l} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `2px solid ${COLORS.beige}`, background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700, marginLeft: i > 0 ? "-9px" : "0", zIndex: 4 - i, position: "relative" }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: "1px", marginBottom: "3px" }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: COLORS.gold }}><StarIcon /></span>)}
              </div>
              <span style={{ fontSize: "0.78rem", color: COLORS.chocolate, opacity: 0.75, fontWeight: 500 }}>+2,400 regalos entregados</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(28px)", borderRadius: "28px", padding: "22px", width: "100%", maxWidth: "390px", boxShadow: `0 28px 60px rgba(90,15,36,0.13), 0 0 0 1px ${COLORS.gold}30`, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "16px", borderBottom: `1px solid ${COLORS.gold}25`, marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "9px", flexShrink: 0 }}><HeartIcon /></div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1rem", color: COLORS.bordeaux }}>Emotia IA</div>
                <div style={{ fontSize: "0.72rem", color: "#16a34a", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600 }}>
                  <span style={{ width: "7px", height: "7px", background: "#16a34a", borderRadius: "50%" }} /> En línea ahora
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "250px" }}>
              <div className="chat-bubble-ai">
                {typedText}
                {typedText !== fullText && <span style={{ animation: "blink 0.7s infinite", marginLeft: "1px" }}>|</span>}
              </div>
              {chatStep >= 1 && <div className="chat-bubble-user">Para mi pareja 💕 cumple 30 años</div>}
              {chatStep >= 2 && <div className="chat-bubble-ai">¡Qué ocasión tan especial! ¿Qué le apasiona más: la aventura o la naturaleza?</div>}
              {chatStep >= 3 && <div className="chat-bubble-user">Le encanta la naturaleza 🌿</div>}
              {chatStep >= 4 && (
                <div className="chat-bubble-ai" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="typing-dots"><span /><span /><span /></div>
                  <span style={{ fontSize: "0.82rem", color: COLORS.gray }}>Analizando perfil...</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: "14px", display: "flex", gap: "8px", background: `${COLORS.beige}70`, borderRadius: "100px", padding: "8px 8px 8px 18px", border: `1px solid ${COLORS.gold}35` }}>
              <span style={{ flex: 1, fontSize: "0.82rem", color: `${COLORS.chocolate}60`, display: "flex", alignItems: "center" }}>Escribe tu respuesta...</span>
              <button style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${COLORS.garnet}30` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
