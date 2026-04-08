"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, MessageCircle, Music, Loader2, CheckCircle2, Heart } from "lucide-react";
import { C } from "./constants";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulación de UX: Estado de carga antes del éxito
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  const LINKS = [
    { label: "Regalos",    path: "/regalos" },
    { label: "Empresas",   path: "/business" },
    { label: "Artesanos",  path: "/business" },
    { label: "Nosotros",   path: "/nosotros" },
    { label: "Ayuda",      path: "/ayuda" },
    { label: "Privacidad", path: "/privacidad" },
  ];

  const SOCIAL = [
    { icon: <Instagram size={18} strokeWidth={2} />, href: "https://www.instagram.com/emotia.gifts1/", label: "Síguenos en Instagram" },
    { icon: <MessageCircle size={18} strokeWidth={2} />, href: "https://wa.me/59170000000", label: "Contáctanos por WhatsApp" },
    { icon: <Music size={18} strokeWidth={2} />, href: "https://www.tiktok.com/@emotia.gifts0", label: "Síguenos en TikTok" },
  ];

  const isValidEmail = email.includes("@") && email.includes(".");

  return (
    <>
      {/* ── NEWSLETTER ── */}
      <section style={{ background: C.roseLight, padding: "56px 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: C.garnet, marginBottom: 8 }}>
            Recibe ofertas antes que nadie
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: C.gray, marginBottom: 28, maxWidth: "500px", marginInline: "auto" }}>
            Suscríbete y recibe un <strong style={{ color: C.garnet, fontWeight: 700 }}>10% de descuento</strong> en tu primer pedido.
          </p>

          <div style={{ height: "54px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#f0fdf4", border: `1.5px solid #22c55e`, borderRadius: 100, padding: "12px 28px", color: "#166534", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem" }}
                >
                  <CheckCircle2 size={20} color="#22c55e" />
                  ¡Suscrito! Revisa tu correo
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe} 
                  style={{ display: "flex", gap: 10, justifyContent: "center", width: "100%", maxWidth: 480, margin: "0 auto" }}
                >
                  <input
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    aria-label="Correo electrónico para newsletter"
                    disabled={status === "loading"}
                    style={{ 
                      flex: 1, 
                      border: `1px solid rgba(0,0,0,0.1)`, 
                      borderRadius: 100, 
                      padding: "0 20px", 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.95rem", 
                      color: C.choco, 
                      background: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      minHeight: "48px"
                    }}
                  />
                  <motion.button 
                    type="submit" 
                    disabled={!isValidEmail || status === "loading"}
                    whileHover={isValidEmail ? { scale: 1.02 } : {}} 
                    whileTap={isValidEmail ? { scale: 0.98 } : {}}
                    style={{ 
                      background: `linear-gradient(135deg, ${C.garnet}, ${C.crimson})`, 
                      color: "white", 
                      border: "none", 
                      borderRadius: 100, 
                      padding: "0 28px", 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontWeight: 700, 
                      fontSize: "0.95rem", 
                      cursor: isValidEmail ? "pointer" : "not-allowed", 
                      whiteSpace: "nowrap", 
                      boxShadow: isValidEmail ? `0 6px 20px ${C.crimson}40` : "none",
                      opacity: isValidEmail ? 1 : 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minHeight: "48px",
                      transition: "opacity 0.3s, box-shadow 0.3s"
                    }}
                  >
                    {status === "loading" ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 size={18} />
                      </motion.div>
                    ) : "Suscribirme"}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.garnet, padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ cursor: "pointer" }} onClick={() => router.push("/")} aria-label="Ir al inicio">
              <img src="/logo/logoextendido.png" alt="Emotia"
                style={{ height: 38, width: "auto", objectFit: "contain", display: "block", filter: "brightness(0) invert(1)", opacity: 0.95 }} />
            </motion.div>

            {/* Links */}
            <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {LINKS.map(({ label, path }) => (
                <button key={`${label}-${path}`} onClick={() => router.push(path)}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "0.9rem", 
                    fontWeight: 500, 
                    cursor: "pointer", 
                    padding: "8px 12px",
                    borderRadius: 8, 
                    transition: "all 0.2s ease" 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Social */}
            <div style={{ display: "flex", gap: 12 }}>
              {SOCIAL.map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -3, backgroundColor: "rgba(255,255,255,0.2)" }} 
                  whileTap={{ scale: 0.95 }}
                  style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none", transition: "background-color 0.3s" }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))", marginBottom: 24 }} />

          {/* Bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              © {new Date().getFullYear()} Emotia · Todos los derechos reservados
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>
              Hecho con <Heart size={12} fill="currentColor" opacity={0.8} /> en La Paz, Bolivia
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}