"use client";
// FeaturesSection.tsx — Características + métricas

import React from "react";
import { COLORS, features } from "./constants";
import { FadeIn } from "./animations";

export default function FeaturesSection() {
  return (
    <section id="caracteristicas" style={{ padding: "80px 24px", background: COLORS.beige }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <FadeIn direction="up">
          <div style={{ marginBottom: "48px" }}>
            <span className="section-label">Por qué Emotia</span>
            <div className="section-divider" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: COLORS.bordeaux, maxWidth: "560px", lineHeight: 1.1 }}>
              No solo recomendamos,{" "}<span style={{ color: COLORS.garnet, fontStyle: "italic" }}>conectamos.</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "22px" }}>
          <FadeIn direction="left">
            <div className="card-hover" style={{ background: `linear-gradient(145deg, ${COLORS.bordeaux}, ${COLORS.garnet} 70%)`, borderRadius: "28px", padding: "40px 32px", color: "white", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "320px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", border: "40px solid rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", top: "20px", right: "20px", width: "80px", height: "80px", borderRadius: "50%", border: "20px solid rgba(188,153,104,0.12)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "20px" }}>{features[0].icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>{features[0].title}</h3>
                <p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontSize: "0.93rem" }}>{features[0].desc} Analiza contexto, personalidad e impacto sentimental para ir más allá de un catálogo.</p>
              </div>
            </div>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {features.slice(1).map((f, i) => (
              <FadeIn key={f.title} direction="right" delay={i * 90}>
                <div className="card-hover" style={{ background: "white", borderRadius: "20px", padding: "22px 24px", display: "flex", gap: "18px", alignItems: "center", borderLeft: `3px solid ${COLORS.garnet}35`, boxShadow: "0 2px 8px rgba(90,15,36,0.06)" }}>
                  <div style={{ fontSize: "1.4rem", width: "50px", height: "50px", flexShrink: 0, background: `${COLORS.garnet}0C`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 800, color: COLORS.bordeaux, marginBottom: "4px" }}>{f.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: COLORS.chocolate, opacity: 0.75, lineHeight: 1.55 }}>{f.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn direction="up" delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginTop: "40px" }}>
            {[
              { num: "2,400+", label: "Regalos entregados" },
              { num: "98%",    label: "Satisfacción" },
              { num: "120+",   label: "Artesanos locales" },
              { num: "< 2min", label: "Tiempo de respuesta" },
            ].map(m => (
              <div key={m.label} style={{ background: "white", borderRadius: "16px", padding: "20px 16px", textAlign: "center", boxShadow: "0 2px 8px rgba(90,15,36,0.05)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 900, color: COLORS.garnet, lineHeight: 1, marginBottom: "6px" }}>{m.num}</div>
                <div style={{ fontSize: "0.78rem", color: COLORS.chocolate, opacity: 0.65, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
