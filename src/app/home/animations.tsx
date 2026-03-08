"use client";

import React, { useState, useEffect, useRef } from 'react';

export const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
};

export const FadeIn = ({ children, delay = 0, direction = "up", className = "" }: { children: React.ReactNode, delay?: number, direction?: "up"|"down"|"left"|"right"|"none", className?: string }) => {
  const [ref, inView] = useInView();
  const transforms = {
    up:    "translateY(40px)",
    down:  "translateY(-40px)",
    left:  "translateX(-40px)",
    right: "translateX(40px)",
    none:  "none",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : transforms[direction],
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

export const FloatingOrb = ({ size, top, left, color, delay }: { size: string, top: string, left: string, color: string, delay: number }) => (
  <div style={{
    position: "absolute", width: size, height: size, borderRadius: "50%",
    top, left,
    background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}08)`,
    filter: "blur(1px)",
    animation: `float ${3 + delay}s ease-in-out infinite alternate`,
    animationDelay: `${delay}s`,
    pointerEvents: "none",
  }} />
);