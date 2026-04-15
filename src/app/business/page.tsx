"use client";
import HeroB2B from "./components/HeroB2B";
import StepsB2B from "./components/StepsB2B";
import BenefitsB2B from "./components/BenefitsB2B";
import TestimonialsB2B from "./components/TestimonialsB2B";
import JoinB2B from "./components/JoinB2B";
import FooterB2B from "./components/FooterB2B";


export default function BusinessLandingPage() {
  return (
    <main className="bg-white min-h-screen font-sans overflow-x-hidden">
      <HeroB2B />
      <StepsB2B />
      <BenefitsB2B />
      <TestimonialsB2B />
      <JoinB2B />
      <FooterB2B />
    </main>
  );
}