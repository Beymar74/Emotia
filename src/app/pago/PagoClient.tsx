"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import Pago   from "./components/Pago";
export default function PagoClient() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <Navbar scrolled={scrolled} />
      <main style={{ fontFamily:"'DM Sans',sans-serif" }}>
        <Pago />
      </main>
      <Footer />
    </>
  );
}
