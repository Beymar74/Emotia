"use client";
import React from "react";
import Navbar from "./home/Navbar";
import HeroSection from "./home/HeroSection";
import ProductsSection from "./home/ProductsSection";
import Footer from "./home/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EE" }}>
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <Footer />
    </main>
  );
}
