"use client";
// animations.tsx — Componentes de animación reutilizables

import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "./constants";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  style?: React.CSSProperties;
}

export function FadeIn({ children, direction = "up", delay = 0, style }: FadeInProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  const offsets: Record<string, string> = {
    up: "translateY(28px)", down: "translateY(-28px)",
    left: "translateX(-28px)", right: "translateX(28px)",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translate(0)" : offsets[direction],
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

interface OrbProps {
  size: string; top?: string; left?: string; right?: string; bottom?: string;
  color: string; delay?: number; opacity?: number;
}

export function FloatingOrb({ size, top, left, right, bottom, color, delay = 0, opacity = 0.12 }: OrbProps) {
  return (
    <div className="orb" style={{
      width: size, height: size, top, left, right, bottom,
      background: color, opacity, animationDelay: `${delay}s`,
    }} />
  );
}

export function PulsingDot({ color = COLORS.garnet }: { color?: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%", background: color,
        display: "inline-block", animation: "pulse-ring 1.6s ease infinite",
        position: "absolute", inset: 0, opacity: 0.5,
      }} />
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%", background: color,
        display: "inline-block", position: "relative",
      }} />
    </span>
  );
}
