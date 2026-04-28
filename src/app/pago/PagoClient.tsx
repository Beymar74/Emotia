"use client";
import React from "react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import Pago from "./components/Pago";

export default function PagoClient() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "'DM Sans',sans-serif" }}>
        <Pago />
      </main>
      <Footer />
    </>
  );
}