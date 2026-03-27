"use client";
import React from "react";
import Navbar               from "../home/Navbar";
import Footer               from "../home/Footer";
import Hero                 from "./components/Hero";
import ComoFunciona         from "./components/ComoFunciona";
import BeneficiosDetallados from "./components/BeneficiosDetallados";
import CTA                  from "./components/CTA";

export default function ConocerMasClient() {
  return (
    <>
      <Navbar />
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
