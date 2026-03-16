"use client";

import React, { useState, useEffect } from "react";
import { globalCSS }         from "./home/styles";
import { COLORS, SECTION_IDS, SECTION_LABELS } from "./home/constants";
import Navbar                from "./home/Navbar";
import HeroSection           from "./home/HeroSection";
import HowItWorksSection     from "./home/HowItWorksSection";
import FeaturesSection       from "./home/FeaturesSection";
import TestimonialsSection   from "./home/TestimonialsSection";
import CTASection            from "./home/CTASection";
import Footer                from "./home/Footer";

const FULL_TEXT = "¿Para quién es este regalo especial?";

export default function EmotiaLandingPage() {
  const [scrolled,          setScrolled]          = useState(false);
  const [currentSection,    setCurrentSection]    = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typedText,         setTypedText]         = useState("");
  const [chatStep,          setChatStep]          = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrentSection(idx); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(p => (p + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedText(FULL_TEXT.slice(0, i));
        i++;
        if (i > FULL_TEXT.length) clearInterval(interval);
      }, 48);
      return () => clearInterval(interval);
    }, 900);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (typedText !== FULL_TEXT) return;
    const t = setTimeout(() => setChatStep(1), 700);
    return () => clearTimeout(t);
  }, [typedText]);

  useEffect(() => {
    const delays: Record<number, number> = { 1: 1400, 2: 1800, 3: 1500 };
    if (!delays[chatStep]) return;
    const t = setTimeout(() => setChatStep(p => p + 1), delays[chatStep]);
    return () => clearTimeout(t);
  }, [chatStep]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <div style={{ background: COLORS.beige, position: "relative" }}>

        {/* Nav dots laterales — solo escritorio */}
        <div className="hidden-mobile" style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
          {SECTION_IDS.map((id, i) => (
            <button key={id} onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setCurrentSection(i); }} title={SECTION_LABELS[i]} aria-label={SECTION_LABELS[i]}
              style={{ width: currentSection === i ? "10px" : "6px", height: currentSection === i ? "10px" : "6px", borderRadius: "50%", background: currentSection === i ? COLORS.garnet : `${COLORS.garnet}35`, border: currentSection === i ? `2px solid ${COLORS.garnet}` : "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
            />
          ))}
        </div>

        <Navbar scrolled={scrolled} />
        <HeroSection typedText={typedText} chatStep={chatStep} fullText={FULL_TEXT} />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection active={activeTestimonial} setActive={setActiveTestimonial} />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}