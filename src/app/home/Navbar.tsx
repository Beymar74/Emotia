"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useUser, useStackApp } from "@stackframe/stack";

// NUEVA PALETA DE COLORES
const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  darkBackground?: boolean;
}

export default function Navbar({ onOpenLogin, onOpenRegister, darkBackground = false }: NavbarProps) {
  const router = useRouter();
  const user = useUser();
  const stackApp = useStackApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const goTo = (id: string) => {
    setMobileOpen(false);
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
    }
  };

  const handleLogout = async () => {
    await stackApp.signOut();
    window.location.reload();
  };

  const NAV_LINKS = [
    { label: "Catálogo", action: () => { setMobileOpen(false); router.push("/producto"); } },
    { label: "Cómo funciona", action: () => goTo("como-funciona") },
    { label: "Nosotros", action: () => { setMobileOpen(false); router.push("/nosotros"); } },
  ];

  const textColor = darkBackground && !scrolled ? P.blanco : P.chocolate;
  const logoInvert = darkBackground && !scrolled ? "brightness(0) invert(1)" : "none";
  const btnBorder = darkBackground && !scrolled ? `1px solid rgba(255,255,255,0.4)` : `1px solid ${P.dorado}80`;
  const hoverBg = darkBackground && !scrolled ? "rgba(255,255,255,0.1)" : `${P.beige}30`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @media(max-width:960px){ .nav-desktop { display: none !important; } .nav-mob-btn { display: flex !important; } }
      `}</style>

      {/* 👇 EL CAMBIO ESTÁ AQUÍ: zIndex bajó de 999 a 100 */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, 
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? `${P.beige}80` : 'transparent'}`,
        boxShadow: scrolled ? `0 4px 24px ${P.granate}08` : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <motion.button onClick={() => router.push("/")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} aria-label="Ir al inicio" className="bg-transparent" style={{ border: "none", cursor: "pointer", padding: 0, flexShrink: 0, display: "flex", alignItems: "center" } as any}>
            <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: 38, width: "auto", objectFit: "contain", display: "block", filter: logoInvert, transition: "filter 0.3s ease" }} />
          </motion.button>

          <nav className="nav-desktop" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_LINKS.map((l) => (
              <motion.button key={l.label} onClick={l.action} whileHover={{ opacity: 0.7 }} className="bg-transparent" style={{ border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: textColor, transition: "color 0.3s ease, opacity 0.2s" } as any}>
                {l.label}
              </motion.button>
            ))}
          </nav>

          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <motion.button onClick={() => router.push("/business")} whileHover={{ scale: 1.03, backgroundColor: hoverBg }} whileTap={{ scale: 0.97 }} className="bg-transparent" style={{ border: "none", borderRadius: 100, padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: textColor, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.3s ease" } as any}>
              ¿Eres productor? →
            </motion.button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px", paddingLeft: "16px", borderLeft: `1px solid ${darkBackground && !scrolled ? 'rgba(255,255,255,0.2)' : P.beige}`, transition: "border-color 0.3s ease" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: textColor, transition: "color 0.3s ease" }}>
                  Hola, {user.primaryEmail?.split('@')[0] || 'Usuario'}
                </span>
                <motion.button onClick={() => router.push("/dashboard")} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} style={{ backgroundColor: P.blanco, border: `1px solid ${P.beige}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: P.granate, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" } as any}>
                  <UserIcon size={16} strokeWidth={2} />
                </motion.button>
                <motion.button onClick={handleLogout} whileHover={{ scale: 1.08, backgroundColor: "#fee2e2" }} whileTap={{ scale: 0.93 }} className="bg-transparent" style={{ border: `1px solid transparent`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" } as any}>
                  <LogOut size={16} strokeWidth={2} />
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button onClick={onOpenLogin} whileHover={{ scale: 1.03, backgroundColor: hoverBg }} whileTap={{ scale: 0.97 }} className="bg-transparent" style={{ border: btnBorder, color: darkBackground && !scrolled ? P.blanco : P.granate, borderRadius: 100, padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s ease" } as any}>
                  <LogIn size={15} strokeWidth={1.5} /> Entrar
                </motion.button>
                <motion.button onClick={onOpenRegister} whileHover={{ scale: 1.04, y: -1, boxShadow: `0 6px 16px ${P.granate}30` }} whileTap={{ scale: 0.97 }} style={{ backgroundImage: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", borderRadius: 100, padding: "10px 22px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", boxShadow: `0 4px 12px ${P.granate}20` } as any}>
                  Registrarse
                </motion.button>
              </>
            )}
          </div>

          <motion.button onClick={() => setMobileOpen(true)} whileTap={{ scale: 0.9 }} className="nav-mob-btn" aria-label="Abrir menú de navegación" style={{ display: "none", backgroundColor: "transparent", border: "none", cursor: "pointer", color: textColor, padding: 8, marginLeft: "auto", transition: "color 0.3s ease" }}>
            <Menu size={26} strokeWidth={1.5} />
          </motion.button>
        </div>
      </header>

      {/* MOBILE DRAWER (Mantiene zIndex por encima de 1000 para que tape todo si está abierto) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(20,10,12,0.6)", zIndex: 1100, backdropFilter: "blur(6px)" } as any} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }} role="dialog" aria-label="Menú móvil" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "85vw", maxWidth: 360, backgroundColor: P.blanco, zIndex: 1101, padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "-8px 0 24px rgba(0,0,0,0.1)" } as any}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: 32, objectFit: "contain" }} />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" style={{ backgroundColor: P.beige, border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: P.chocolate } as any}><X size={20} strokeWidth={1.5} /></motion.button>
              </div>

              <nav style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
                {NAV_LINKS.map((l, i) => (
                  <motion.button key={l.label} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }} onClick={l.action} className="bg-transparent" style={{ border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: P.chocolate, textAlign: "left", padding: "16px 0", borderBottom: `1px solid ${P.beige}` } as any}>{l.label}</motion.button>
                ))}
                <motion.button initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }} onClick={() => { setMobileOpen(false); router.push("/business"); }} className="bg-transparent" style={{ border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: P.gris, textAlign: "left", padding: "16px 0", borderBottom: `1px solid ${P.beige}` } as any}>¿Eres productor? →</motion.button>
              </nav>

              {user ? (
                <div style={{ marginTop: "auto" }}>
                  <div style={{ background: `${P.beige}50`, borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, display: "flex", alignItems: "center", justifyContent: "center", color: P.blanco }}><UserIcon size={20} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: P.gris }}>Bienvenido,</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, color: P.chocolate }}>{user.primaryEmail?.split('@')[0] || 'Usuario'}</div>
                    </div>
                    <motion.button onClick={handleLogout} whileTap={{ scale: 0.9 }} className="bg-transparent" style={{ border: "none", color: "#ef4444", cursor: "pointer", padding: 8 } as any}><LogOut size={20} /></motion.button>
                  </div>
                  <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} onClick={() => { setMobileOpen(false); router.push("/dashboard"); }} style={{ width: "100%", backgroundImage: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", borderRadius: 16, padding: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${P.granate}30` }}><UserIcon size={18} strokeWidth={1.5} /> Ir a mi Perfil</motion.button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} onClick={() => { setMobileOpen(false); if (onOpenLogin) onOpenLogin(); }} style={{ flex: 1, backgroundColor: P.blanco, color: P.granate, border: `1px solid ${P.dorado}80`, borderRadius: 100, padding: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" } as any}>Entrar</motion.button>
                    <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} onClick={() => { setMobileOpen(false); if (onOpenRegister) onOpenRegister(); }} style={{ flex: 1, backgroundImage: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", borderRadius: 100, padding: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" } as any}>Registrarse</motion.button>
                  </div>
                  <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} onClick={() => { setMobileOpen(false); if (onOpenRegister) onOpenRegister(); }} style={{ marginTop: "auto", backgroundImage: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", borderRadius: 16, padding: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${P.granate}30` } as any}><Sparkles size={18} strokeWidth={1.5} /> Usar IA gratis</motion.button>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}