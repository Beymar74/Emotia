"use client";
import React, { useState, useEffect } from "react";
import Navbar      from "../home/Navbar";
import Footer      from "../home/Footer";
import Hero        from "./components/Hero";
import Categorias  from "./components/Categorias";
import Destacados  from "./components/Destacados";
import Catalogo    from "./components/Catalogo";
export default function RegalosClient() {
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
        <Categorias />
        <Destacados />
        <Catalogo />
      </main>
      <Footer />
    </>
  );
}
