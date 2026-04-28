"use client";
import React from "react";
import Navbar      from "../home/Navbar";
import Footer      from "../home/Footer";
import Hero        from "./components/Hero";
import Categorias  from "./components/Categorias";
import Destacados  from "./components/Destacados";
import Catalogo    from "./components/Catalogo";

export default function RegalosClient() {
  return (
    <>
      <Navbar />
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