"use client";
import React from "react";
import Navbar  from "../home/Navbar";
import Footer  from "../home/Footer";
import Carrito from "./components/Carrito";

export default function CarritoClient() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily:"'DM Sans',sans-serif" }}>
        <Carrito />
      </main>
      <Footer />
    </>
  );
}
