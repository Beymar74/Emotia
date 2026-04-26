"use client";
import React, { useState } from "react";
import Navbar from "./home/Navbar";
import HeroSection from "./home/HeroSection";
import ProductsSection from "./home/ProductsSection";
import JoinSection from "./home/JoinSection";
import Footer from "./home/Footer";
import AuthModal from "./home/AuthModal";

export default function HomeClientWrapper({ initialProducts }: { initialProducts: any[] }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');

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
      <Navbar onOpenLogin={openLogin} onOpenRegister={openRegister} />
      <HeroSection onOpenRegister={openRegister} />
      <ProductsSection initialProducts={initialProducts} />
      <JoinSection onOpenRegister={openRegister} />
      <Footer />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialView={authView} 
      />
    </main>
  );
}
