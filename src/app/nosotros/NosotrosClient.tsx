"use client";

import React from "react";
import Navbar    from "../home/Navbar";
import Footer    from "../home/Footer";
import Hero      from "./components/Hero";
import MisionVision from "./components/MisionVision";
import Valores   from "./components/Valores";
import Equipo    from "./components/Equipo";
import Propuesta from "./components/Propuesta";

export default function NosotrosClient() {
  return (
    <>
      <Navbar />
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