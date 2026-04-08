"use client";
import React from "react";
import Navbar from "./home/Navbar";
import HeroSection from "./home/HeroSection";
import ProductsSection from "./home/ProductsSection";
import JoinSection from "./home/JoinSection";
import Footer from "./home/Footer";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFF3E6", overflowX: "hidden" }}>
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <JoinSection />
      <Footer />
    </main>
  );
}