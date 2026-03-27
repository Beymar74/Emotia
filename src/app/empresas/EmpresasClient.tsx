"use client";

import React from "react";
import Navbar        from "../home/Navbar";
import Footer        from "../home/Footer";
import Hero          from "./components/Hero";
import GridEmpresas  from "./components/GridEmpresas";
import BeneficiosCTA from "./components/BeneficiosCTA";

export default function EmpresasClient() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Hero />
        <GridEmpresas />
        <BeneficiosCTA />
      </main>
      <Footer />
    </>
  );
}
