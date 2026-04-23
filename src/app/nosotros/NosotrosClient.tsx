"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import Hero from "./components/Hero";
import MisionVision from "./components/MisionVision";
import Valores from "./components/Valores";
import Equipo from "./components/Equipo";
import Propuesta from "./components/Propuesta";
import AuthModal from "../home/AuthModal";

const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

export default function NosotrosClient() {
  const router = useRouter();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');

  const openLogin = () => { setAuthView('login'); setIsAuthOpen(true); };
  const openRegister = () => { setAuthView('register'); setIsAuthOpen(true); };

  return (
    <div style={{ background: P.blanco, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: 'Montserrat', sans-serif !important; }
        p, span, li, a { font-family: 'DM Sans', sans-serif !important; }
      `}</style>

      <Navbar
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
        darkBackground={false}
      />

      {/* 👇 ELIMINAMOS EL PADDING Y EL BACKGROUND AQUÍ 👇 */}
      <main>
        <Hero />
        <MisionVision />
        <Valores />
        <Equipo />
        <Propuesta />
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </div>
  );
}