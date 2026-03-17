"use client";

import React, { useState, useEffect } from "react";
import Navbar    from "../home/Navbar";
import Footer    from "../home/Footer";
import Hero      from "./components/Hero";
import MisionVision from "./components/MisionVision";
import Valores   from "./components/Valores";
import Equipo    from "./components/Equipo";
import Propuesta from "./components/Propuesta";

export default function NosotrosClient() {
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
        <MisionVision />
        <Valores />
        <Equipo />
        <Propuesta />
      </main>
      <Footer />
    </>
  );
}