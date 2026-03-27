"use client";
import React from "react";
import { COLORS } from "./constants";
import { steps } from "./steps";
import { FadeIn } from "./animations";

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" style={{ padding: "100px 24px", background: COLORS.white }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <FadeIn direction="up">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: COLORS.beige, padding: "6px 16px", borderRadius: "100px", border: `1px solid rgba(188, 153, 104, 0.3)`, marginBottom: "20px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: COLORS.bordeaux, letterSpacing: "0.15em", textTransform: "uppercase" }}>EL PROCESO</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: "16px" }}>
              ¿Cómo funciona la IA de Emotia?
            </h2>
            <p style={{ fontSize: "1.1rem", color: COLORS.chocolate, opacity: 0.8, maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>Un sistema diseñado para que dar un regalo sea tan especial y emocionante como recibirlo.</p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", position: "relative" }}>
          {steps.map((step, i) => (
            <FadeIn key={step.num} direction="up" delay={i * 150}>
              <div style={{ background: "#FAF5EE", borderRadius: "28px", padding: "40px 32px", position: "relative", height: "100%", border: "1px solid rgba(188,153,104,0.2)", transition: "transform 0.3s", cursor: "default" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ position: "absolute", top: "20px", right: "24px", fontFamily: "'Playfair Display', serif", fontSize: "4.5rem", fontWeight: 900, color: `${COLORS.garnet}10`, lineHeight: 1, userSelect: "none" }}>{step.num}</div>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", marginBottom: "24px", padding: "16px", boxShadow: "0 10px 20px rgba(142,27,58,0.2)" }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: COLORS.bordeaux, marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "1rem", color: COLORS.chocolate, opacity: 0.8, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
