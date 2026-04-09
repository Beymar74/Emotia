"use client";
import React, { useState } from "react";
import Navbar from "./home/Navbar";
import HeroSection from "./home/HeroSection";
import ProductsSection from "./home/ProductsSection";
import JoinSection from "./home/JoinSection";
import Footer from "./home/Footer";
import AuthModal from "./home/AuthModal"; // <-- Asegúrate de que la ruta coincida con donde guardaste AuthModal.tsx

export default function HomePage() {
  // Estados para controlar el modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');

  // Funciones para abrir el modal en la vista correcta
  const openLogin = () => {
    setAuthView('login');
    setIsAuthOpen(true);
  };

  const openRegister = () => {
    setAuthView('register');
    setIsAuthOpen(true);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FFF3E6", overflowX: "hidden" }}>
      {/* Pasamos las funciones a los componentes que tienen botones de Login/Registro */}
      <Navbar onOpenLogin={openLogin} onOpenRegister={openRegister} />
      
      <HeroSection onOpenRegister={openRegister} />
      
      <ProductsSection />
      
      <JoinSection onOpenRegister={openRegister} />
      
      <Footer />

      {/* Renderizamos el modal flotante */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialView={authView} 
      />
    </main>
  );
}