"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, LogIn, Gift, Menu, X } from "lucide-react";
import { C } from "./constants";

interface NavbarProps { scrolled?: boolean }

export default function Navbar({ scrolled }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  const goTo = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const navLinks = [
    { label: "Regalos",       action: () => goTo("productos") },
    { label: "Cómo funciona", action: () => goTo("como-funciona") },
    { label: "Nosotros",      action: () => router.push("/nosotros") },
    { label: "Empresas",      action: () => router.push("/empresas") },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
          background: scrolled ? "rgba(250,245,238,0.97)" : "rgba(250,245,238,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid rgba(188,153,104,${scrolled ? 0.28 : 0.14})`,
          boxShadow: scrolled ? "0 4px 28px rgba(90,15,36,0.1)" : "none",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <div style={{
          maxWidth: 1320, margin: "0 auto", padding: "0 28px",
          height: scrolled ? 62 : 74,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "height 0.3s",
        }}>

          {/* ── LOGO REAL ── */}
          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
          >
            <img
              src="/logo/logoextendido.png"
              alt="Emotia"
              style={{
                height: scrolled ? 36 : 44,
                width: "auto",
                objectFit: "contain",
                transition: "height 0.3s",
                display: "block",
              }}
            />
          </motion.button>

          {/* ── LINKS DESKTOP ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(l => (
              <motion.button
                key={l.label}
                onClick={l.action}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                  fontSize: "0.88rem", color: C.choco,
                  padding: "8px 14px", borderRadius: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(90,15,36,0.07)"; e.currentTarget.style.color = C.bordeaux; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.choco; }}
              >
                {l.label}
              </motion.button>
            ))}
          </div>

          {/* ── ACCIONES ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.button
              onClick={() => router.push("/carrito")}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              style={{ background: "rgba(142,27,58,0.08)", border: "none", borderRadius: 11, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.garnet }}
            >
              <ShoppingBag size={20} strokeWidth={2} />
            </motion.button>

            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: "transparent", border: `1.5px solid rgba(90,15,36,0.25)`, color: C.bordeaux, borderRadius: 100, padding: "8px 18px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(90,15,36,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <LogIn size={15} strokeWidth={2.5} /> Entrar
            </motion.button>

            <motion.button
              onClick={() => goTo("productos")}
              whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg,${C.garnet},${C.bordeaux})`, color: "white", border: "none", borderRadius: 100, padding: "9px 22px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(90,15,36,0.3)", display: "flex", alignItems: "center", gap: 7 }}
            >
              <Gift size={15} strokeWidth={2.5} /> Ver regalos
            </motion.button>

            <motion.button
              onClick={() => setMobileOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="nav-mobile-btn"
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.bordeaux, padding: 6 }}
            >
              <Menu size={22} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(40,10,15,0.4)", zIndex: 1100, backdropFilter: "blur(4px)" }}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 300, background: C.beige, zIndex: 1101, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: 36, objectFit: "contain", display: "block" }} />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.choco }}>
                  <X size={22} />
                </motion.button>
              </div>
              {navLinks.map((l, i) => (
                <motion.button key={l.label}
                  initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                  onClick={l.action}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: C.choco, textAlign: "left", padding: "12px 0", borderBottom: "1px solid rgba(188,153,104,0.2)" }}
                >
                  {l.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                onClick={() => { setMobileOpen(false); router.push("/registro"); }}
                style={{ marginTop: "auto", background: `linear-gradient(135deg,${C.garnet},${C.bordeaux})`, color: "white", border: "none", borderRadius: 100, padding: "14px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}
              >
                🎁 Comenzar gratis
              </motion.button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:768px){.nav-mobile-btn{display:flex!important}}`}</style>
    </>
  );
}
