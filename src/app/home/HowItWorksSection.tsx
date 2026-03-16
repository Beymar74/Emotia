"use client";
// HowItWorksSection.tsx — 3 pasos del proceso

import React from "react";
import { COLORS } from "./constants";
import { steps } from "./steps";
import { FadeIn } from "./animations";

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" style={{ padding: "80px 24px", background: COLORS.white }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <FadeIn direction="up">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="section-label">El proceso</span>
            <div className="section-divider" style={{ margin: "12px auto 0" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: COLORS.bordeaux, marginTop: "8px", marginBottom: "16px" }}>
              Tres pasos hacia el <em>regalo perfecto</em>
            </h2>
            <p style={{ fontSize: "1rem", color: COLORS.chocolate, opacity: 0.75, maxWidth: "500px", margin: "0 auto", lineHeight: 1.65 }}>
              Un proceso diseñado para que dar un regalo sea tan especial como recibirlo.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "28px", position: "relative" }}>
          {steps.map((step, i) => (
            <FadeIn key={step.num} direction="up" delay={i * 120}>
              <div className="card-hover gradient-border" style={{ background: "white", borderRadius: "24px", padding: "36px 28px", position: "relative", height: "100%" }}>
                <div style={{ position: "absolute", top: "16px", right: "20px", fontFamily: "'Playfair Display', serif", fontSize: "4rem", fontWeight: 900, color: `${COLORS.garnet}07`, lineHeight: 1, userSelect: "none" }}>{step.num}</div>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `linear-gradient(135deg, ${COLORS.garnet}12, ${COLORS.crimson}08)`, border: `1px solid ${COLORS.garnet}18`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.garnet, marginBottom: "20px", padding: "12px" }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 800, color: COLORS.bordeaux, marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ fontSize: "0.9rem", color: COLORS.chocolate, opacity: 0.75, lineHeight: 1.65 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden-mobile" style={{ position: "absolute", top: "52px", right: "-14px", width: "28px", height: "28px", borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.garnet})`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: `0 4px 12px ${COLORS.gold}40` }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
