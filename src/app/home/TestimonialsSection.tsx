"use client";
// TestimonialsSection.tsx — Slider de testimonios

import React from "react";
import { COLORS, testimonials } from "./constants";
import { FadeIn } from "./animations";

interface Props { active: number; setActive: (i: number) => void; }

export default function TestimonialsSection({ active, setActive }: Props) {
  return (
    <section id="testimonios" style={{ padding: "80px 24px", background: COLORS.white }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", textAlign: "center" }}>
        <FadeIn direction="up">
          <span className="section-label">Testimonios</span>
          <div className="section-divider" style={{ margin: "12px auto 0" }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: COLORS.bordeaux, marginTop: "8px", marginBottom: "48px" }}>
            Momentos que <em>importan</em>
          </h2>
        </FadeIn>

        <div style={{ position: "relative", minHeight: "280px" }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0, opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(0.98)", transition: "opacity 0.5s ease, transform 0.5s ease", pointerEvents: active === i ? "auto" : "none" }}>
              <div style={{ background: `${COLORS.beige}60`, border: `1px solid ${COLORS.gold}28`, borderRadius: "28px", padding: "40px 36px" }}>
                <div style={{ fontSize: "3rem", color: COLORS.gold, marginBottom: "12px", fontFamily: "Georgia, serif", opacity: 0.5, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: COLORS.chocolate, fontStyle: "italic", marginBottom: "28px" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>{t.avatar}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, color: COLORS.bordeaux, fontSize: "0.95rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.8rem", color: COLORS.gray }}>{t.role}</div>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginLeft: "auto" }}>
                    {[...Array(5)].map((_, si) => <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill={COLORS.gold}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Testimonio ${i + 1}`} style={{ width: active === i ? "28px" : "8px", height: "8px", borderRadius: "100px", background: active === i ? COLORS.garnet : `${COLORS.garnet}28`, border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
