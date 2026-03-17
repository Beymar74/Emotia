"use client";
import React, { useState, useEffect } from "react";
import Navbar               from "../home/Navbar";
import Footer               from "../home/Footer";
import Hero                 from "./components/Hero";
import ComoFunciona         from "./components/ComoFunciona";
import BeneficiosDetallados from "./components/BeneficiosDetallados";
import CTA                  from "./components/CTA";
export default function ConocerMasClient() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <Navbar scrolled={scrolled} />
      <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Hero />
        <ComoFunciona />
        <BeneficiosDetallados />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
