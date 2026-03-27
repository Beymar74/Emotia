"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Instagram, MessageCircle, Music } from "lucide-react";
import { C } from "./constants";

export default function Footer() {
  const router = useRouter();

  return (
    <footer style={{ background: C.bordeaux, padding: "36px 32px 22px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>

        {/* TOP ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 22 }}>

          {/* Marca */}
          <motion.div whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.garnet},${C.crimson})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Gift size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem", color: C.beige, letterSpacing: "-0.02em" }}>Emotia</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "rgba(245,230,208,0.45)", marginLeft: 8 }}>Regalos artesanales bolivianos</span>
            </div>
          </motion.div>

          {/* Links */}
          <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[{l:"Regalos",h:"/regalos"},{l:"Nosotros",h:"/nosotros"},{l:"Ayuda",h:"/ayuda"},{l:"Privacidad",h:"/privacidad"}].map(({l,h}) => (
              <button key={h} onClick={() => router.push(h)}
                style={{ background: "none", border: "none", color: "rgba(245,230,208,0.58)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", padding: "6px 12px", borderRadius: 6, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(245,230,208,1)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(245,230,208,0.58)"}>
                {l}
              </button>
            ))}
          </nav>

          {/* Social */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { icon: <Instagram size={16} strokeWidth={2} />, href: "https://www.instagram.com/emotia.gifts1/" },
              { icon: <MessageCircle size={16} strokeWidth={2} />, href: "https://wa.me/59170000000" },
              { icon: <Music size={16} strokeWidth={2} />, href: "https://www.tiktok.com/@emotia.gifts0" },
            ].map((s, i) => (
              <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.9 }}
                style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(188,153,104,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,230,208,0.75)", textDecoration: "none" }}>
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(188,153,104,0.3),transparent)", marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "rgba(245,230,208,0.38)" }}>© {new Date().getFullYear()} Emotia · Todos los derechos reservados</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "rgba(245,230,208,0.32)" }}>Hecho con ♥ en La Paz, Bolivia 🇧🇴</span>
        </div>
      </div>
    </footer>
  );
}
