"use client";
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
    up: "translateY(40px)", down: "translateY(-40px)",
    left: "translateX(-40px)", right: "translateX(40px)",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translate(0)" : offsets[direction],
      transition: `opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}
