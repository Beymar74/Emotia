"use client";
import React from "react";
import Navbar     from "../home/Navbar";
import Footer     from "../home/Footer";
import Hero       from "./components/Hero";
import Categorias from "./components/Categorias";
import FAQ        from "./components/FAQ";
import Contacto   from "./components/Contacto";

export default function AyudaClient() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Hero />
        <Categorias />
        <FAQ />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
