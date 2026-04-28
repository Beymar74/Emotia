"use client";
import HeaderB2B from "./components/HeaderB2B";
import HeroB2B from "./components/HeroB2B";
import StepsB2B from "./components/StepsB2B";
import BenefitsB2B from "./components/BenefitsB2B";
import TestimonialsB2B from "./components/TestimonialsB2B";
import JoinB2B from "./components/JoinB2B";
import FooterB2B from "./components/FooterB2B";

export default function BusinessLandingPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      <HeaderB2B />
      
      {/* Contenedores con ID para que el scroll funcione */}
      <div id="inicio"><HeroB2B /></div>
      <div id="pasos"><StepsB2B /></div>
      <div id="beneficios"><BenefitsB2B /></div>
      <div id="testimonios"><TestimonialsB2B /></div>
      <div id="unirse"><JoinB2B /></div>
      
      <FooterB2B />
    </main>
  );
}