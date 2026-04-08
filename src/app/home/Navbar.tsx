"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, LogIn, Menu, X, Search, Sparkles } from "lucide-react";
import { C } from "./constants";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState("");

  // Detectar scroll para cambiar el fondo
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // UX: Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const goTo = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false); // Cerrar menú móvil si se busca desde ahí
  };

  const setCat = (category: string) => {
    // TODO: Implement category filtering logic
    console.log(`Category selection not yet implemented: ${category}`);
  };

  const NAV_LINKS = [
    { label: "Regalos Físicos", action: () => { setCat("todos"); goTo("productos"); } },
    { label: "Experiencias",    action: () => { setCat("experiencias"); goTo("productos"); } },
    { label: "Cómo funciona",   action: () => goTo("como-funciona") },
    { label: "Nosotros",      action: () => router.push("/nosotros") },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        .nav-search-container {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-search-container:focus-within {
          border-color: ${C.garnet} !important;
          box-shadow: 0 0 0 3px rgba(198,40,79,0.1);
        }
        .nav-search-input:focus { outline: none; }
        
        @media(max-width:960px){ 
          .nav-desktop { display: none !important; } 
          .nav-mob-btn { display: flex !important; } 
        }
      `}</style>

      {/* Uso de la etiqueta semántica <header> */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(255,243,230,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid rgba(255,209,179,${scrolled ? 0.6 : 0})`,
        boxShadow: scrolled ? "0 4px 24px rgba(198,40,79,0.06)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s, box-shadow 0.3s",
      }}>

        {/* ── TOP ROW ── */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", gap: 24 }}>

          {/* Logo */}
          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            aria-label="Ir al inicio de Emotia"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, display: "flex", alignItems: "center" }}
          >
            <img src="/logo/logoextendido.png" alt="Emotia"
              style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }} />
          </motion.button>

          {/* Buscador central (Desktop) */}
          <form onSubmit={handleSearch} className="nav-desktop nav-search-container" 
            style={{ flex: 1, display: "flex", alignItems: "center", background: "white", border: `1.5px solid rgba(255,209,179,0.8)`, borderRadius: 100, padding: "4px 6px 4px 18px", height: 46, gap: 10, maxWidth: 520, margin: "0 auto" }}>
            <Search size={16} color={C.garnet} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <input
              className="nav-search-input"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Busca el regalo perfecto..."
              aria-label="Buscar regalos"
              style={{ flex: 1, border: "none", background: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: C.choco, width: "100%" }}
            />
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ background: `linear-gradient(135deg, ${C.garnet}, ${C.crimson})`, color: "white", border: "none", borderRadius: 100, padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", flexShrink: 0 }}
            >
              Buscar
            </motion.button>
          </form>

          {/* Acciones desktop */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
            {/* Badge negocio */}
            <motion.button
              onClick={() => router.push("/business")}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(92,58,46,0.1)" }} whileTap={{ scale: 0.97 }}
              style={{ background: "rgba(92,58,46,0.05)", border: "none", borderRadius: 100, padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: C.choco, cursor: "pointer", whiteSpace: "nowrap", transition: "background-color 0.2s" }}
            >
              ¿Eres productor? →
            </motion.button>

            <motion.button
              onClick={() => router.push("/carrito")}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              aria-label="Ver carrito"
              style={{ position: "relative", background: "white", border: `1px solid rgba(198,40,79,0.15)`, borderRadius: 12, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.garnet, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {/* Notification Dot (UX premium) */}
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid white" }} />
            </motion.button>

            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(198,40,79,0.04)" }} whileTap={{ scale: 0.97 }}
              style={{ background: "transparent", border: `1px solid rgba(198,40,79,0.3)`, color: C.garnet, borderRadius: 100, padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "background-color 0.2s" }}
            >
              <LogIn size={15} strokeWidth={1.5} /> Entrar
            </motion.button>

            <motion.button
              onClick={() => router.push("/registro")}
              whileHover={{ scale: 1.04, y: -1, boxShadow: "0 6px 16px rgba(198,40,79,0.25)" }} whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg, ${C.garnet}, ${C.crimson})`, color: "white", border: "none", borderRadius: 100, padding: "10px 22px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(198,40,79,0.2)" }}
            >
              Registrarse
            </motion.button>
          </div>

          {/* Hamburger mobile */}
          <motion.button
            onClick={() => setMobileOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="nav-mob-btn"
            aria-label="Abrir menú de navegación"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.garnet, padding: 8, marginLeft: "auto" }}
          >
            <Menu size={26} strokeWidth={1.5} />
          </motion.button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              style={{ position: "fixed", inset: 0, background: "rgba(20,10,12,0.6)", zIndex: 1100, backdropFilter: "blur(6px)" }}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              role="dialog"
              aria-label="Menú móvil"
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "85vw", maxWidth: 360, background: C.cream, zIndex: 1101, padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "-8px 0 24px rgba(0,0,0,0.1)" }}
            >
              {/* Header Drawer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: 32, objectFit: "contain" }} />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" style={{ background: "rgba(255,209,179,0.4)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.choco }}>
                  <X size={20} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Búsqueda mobile */}
              <form onSubmit={handleSearch} className="nav-search-container" style={{ display: "flex", alignItems: "center", background: "white", border: `1px solid rgba(255,209,179,0.8)`, borderRadius: 12, padding: "10px 14px", gap: 10 }}>
                <Search size={18} color={C.garnet} strokeWidth={1.5} />
                <input 
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Buscar regalos..." 
                  style={{ flex: 1, border: "none", background: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: C.choco, outline: "none" }} 
                />
              </form>

              {/* Links de Navegación */}
              <nav style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
                {NAV_LINKS.map((l, i) => (
                  <motion.button key={l.label}
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
                    onClick={l.action}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: C.choco, textAlign: "left", padding: "16px 0", borderBottom: "1px solid rgba(255,209,179,0.4)" }}
                  >
                    {l.label}
                  </motion.button>
                ))}

                <motion.button
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}
                  onClick={() => { setMobileOpen(false); router.push("/business"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: C.gray, textAlign: "left", padding: "16px 0", borderBottom: "1px solid rgba(255,209,179,0.4)" }}
                >
                  ¿Eres productor? →
                </motion.button>
              </nav>

              {/* Botones de Acción */}
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <motion.button
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  onClick={() => { setMobileOpen(false); router.push("/login"); }}
                  style={{ flex: 1, background: "white", color: C.garnet, border: `1px solid rgba(198,40,79,0.3)`, borderRadius: 100, padding: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}
                >
                  Entrar
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                  onClick={() => { setMobileOpen(false); router.push("/registro"); }}
                  style={{ flex: 1, background: `linear-gradient(135deg, ${C.garnet}, ${C.crimson})`, color: "white", border: "none", borderRadius: 100, padding: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                >
                  Registrarse
                </motion.button>
              </div>

              {/* Call to action Inferior */}
              <motion.button
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={() => { setMobileOpen(false); router.push("/registro"); }}
                style={{ marginTop: "auto", background: `linear-gradient(135deg, ${C.garnet}, ${C.crimson})`, color: "white", border: "none", borderRadius: 16, padding: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px rgba(198,40,79,0.25)" }}
              >
                <Sparkles size={18} strokeWidth={1.5} /> Usar IA gratis
              </motion.button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}