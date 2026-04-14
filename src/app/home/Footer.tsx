"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, MessageCircle, Music, Loader2, CheckCircle2, Heart } from "lucide-react";

// NUEVA PALETA DE COLORES
const P = {
  granate: "#8E1B3A",
  bordo: "#5A0F24",
  carmesi: "#AB3A50",
  chocolate: "#5C3A2E",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0"
};

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
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
      <section style={{ background: P.beige, padding: "80px 24px", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "'Montserrat', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: P.bordo, marginBottom: 12 }}>
            Recibe privilegios exclusivos
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: P.chocolate, marginBottom: 36, maxWidth: "500px", marginInline: "auto" }}>
            Suscríbete y recibe un <strong style={{ color: P.granate, fontWeight: 800 }}>10% de descuento</strong> en tu primer detalle inolvidable.
          </p>

          <div style={{ height: "54px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: P.blanco, border: `2px solid ${P.dorado}`, borderRadius: 100, padding: "12px 32px", color: P.bordo, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", boxShadow: `0 8px 20px ${P.dorado}30` }}
                >
                  <CheckCircle2 size={20} color={P.dorado} />
                  ¡Suscrito! Revisa tu correo
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe} 
                  style={{ display: "flex", gap: 8, justifyContent: "center", width: "100%", maxWidth: 500, margin: "0 auto", background: P.blanco, padding: 6, borderRadius: 100, boxShadow: `0 8px 25px rgba(0,0,0,0.05)` }}
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
                      border: "none", 
                      background: "transparent",
                      padding: "0 24px", 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "1rem", 
                      color: P.bordo, 
                      outline: "none",
                      minHeight: "48px"
                    }}
                  />
                  <motion.button 
                    type="submit" 
                    disabled={!isValidEmail || status === "loading"}
                    whileHover={isValidEmail ? { scale: 1.03 } : {}} 
                    whileTap={isValidEmail ? { scale: 0.97 } : {}}
                    style={{ 
                      background: P.granate, 
                      color: P.blanco, 
                      border: "none", 
                      borderRadius: 100, 
                      padding: "0 32px", 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontWeight: 800, 
                      fontSize: "0.95rem", 
                      cursor: isValidEmail ? "pointer" : "not-allowed", 
                      whiteSpace: "nowrap", 
                      opacity: isValidEmail ? 1 : 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minHeight: "48px",
                      transition: "opacity 0.3s"
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
      <footer style={{ background: P.bordo, padding: "64px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ cursor: "pointer" }} onClick={() => router.push("/")} aria-label="Ir al inicio">
              <img src="/logo/logoextendido.png" alt="Emotia"
                style={{ height: 44, width: "auto", objectFit: "contain", display: "block", filter: "brightness(0) invert(1)", opacity: 0.9 }} />
            </motion.div>

            {/* Links */}
            <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {LINKS.map(({ label, path }) => (
                <button key={`${label}-${path}`} onClick={() => router.push(path)}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "0.95rem", 
                    fontWeight: 600, 
                    cursor: "pointer", 
                    padding: "8px 16px",
                    borderRadius: 100, 
                    transition: "all 0.3s ease" 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = P.blanco;
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
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
                  whileHover={{ scale: 1.1, y: -4, backgroundColor: P.carmesi }} 
                  whileTap={{ scale: 0.95 }}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: P.blanco, textDecoration: "none", transition: "background-color 0.3s" }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.beige}30, transparent)`, marginBottom: 32 }} />

          {/* Bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              © {new Date().getFullYear()} Emotia · Todos los derechos reservados
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
              Diseñado con <Heart size={14} color={P.carmesi} fill={P.carmesi} /> en La Paz, Bolivia
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}