"use client";
import React from "react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import FormAfiliacion from "./components/FormAfiliacion";

export default function AfiliacionClient() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <FormAfiliacion />
      </main>
      <Footer />
    </>
  );
}
