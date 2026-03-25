"use client";
// Navbar.tsx — Logo centrado + Drawer lateral estilo YourSurprise para Emotia

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "./constants";

interface NavbarProps { scrolled: boolean; }

// ─── CSS ────────────────────────────────────────────────────────────────────

const navbarCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

  .nav-desktop { display: flex; }
  .nav-mobile  { display: none !important; }

  @media (max-width: 900px) {
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
  }

  .nav-link {
    position: relative; background: none; border: none;
    padding: 8px 0; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #5C3A1E; cursor: pointer; transition: color 0.2s;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 4px; left: 0; right: 0; height: 1px;
    background: #9B2335; transform: scaleX(0);
    transition: transform 0.25s ease; transform-origin: center;
  }
  .nav-link:hover { color: #9B2335; }
  .nav-link:hover::after { transform: scaleX(1); }

  .nav-icon-btn {
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500; letter-spacing: 0.04em;
    color: #5C3A1E; padding: 8px 10px; border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .nav-icon-btn:hover { background: rgba(155,35,53,0.07); color: #9B2335; }

  .nav-divider { width: 1px; height: 20px; background: rgba(188,153,104,0.35); flex-shrink: 0; }

  .btn-cta {
    background: #9B2335; color: #FAF5EE; border: none;
    padding: 9px 20px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 600; letter-spacing: 0.03em;
    cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 12px rgba(155,35,53,0.22);
  }
  .btn-cta:hover { background: #7d1a29; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(155,35,53,0.3); }
  .btn-cta:active { transform: translateY(0); }

  @keyframes drawerIn  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  .drawer-panel   { animation: drawerIn  0.28s cubic-bezier(0.22,1,0.36,1); }
  .drawer-overlay { animation: overlayIn 0.22s ease; }

  .drawer-row {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; background: none; border: none;
    border-bottom: 1px solid rgba(188,153,104,0.16);
    padding: 17px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem; font-weight: 500;
    color: #3D1A0E; cursor: pointer; text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .drawer-row:hover { background: rgba(155,35,53,0.04); color: #9B2335; }
  .drawer-row.accent { color: #9B2335; }
  .drawer-row.accent:hover { background: rgba(155,35,53,0.06); }
`;

// ─── Iconos ──────────────────────────────────────────────────────────────────

const IconSearch   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconUser     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconCart     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IconMenu     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>;
const IconClose    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconChevronR = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconChevronD = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;

// ─── Datos del Drawer ────────────────────────────────────────────────────────

const drawerSections = [
  {
    items: [
      { label: "Regalos",             href: "/regalos",        accent: false },
    ],
  },
  {
    items: [
      { label: "Sobre Emotia",        href: "/nosotros",       accent: false },
      { label: "Empresas",            href: "/empresas",       accent: false },
      { label: "Servicio al cliente", href: "/ayuda",          accent: false },
    ],
  },
];

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Navbar({ scrolled }: NavbarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount]                 = useState(0);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const go = (href: string) => { router.push(href); setDrawerOpen(false); };

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    transition: "all 0.35s ease",
    background: scrolled ? "rgba(250,245,238,0.93)" : "rgba(250,245,238,0.76)",
    backdropFilter: "blur(22px) saturate(1.5)",
    borderBottom: scrolled ? "1px solid rgba(188,153,104,0.22)" : "1px solid rgba(188,153,104,0.1)",
    boxShadow: scrolled ? "0 2px 28px rgba(90,15,36,0.07)" : "none",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navbarCSS }} />

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav style={navStyle}>
        <div style={{
          maxWidth: "1320px", margin: "0 auto", padding: "0 28px",
          height: scrolled ? "60px" : "68px",
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center", transition: "height 0.35s ease",
        }}>

          {/* Izquierda */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

            {/* Hamburguesa + "Menú" */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 6px", color: "#5A0F24", display: "flex", alignItems: "center", gap: "7px" }}
              aria-label="Abrir menú"
            >
              <IconMenu />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#5C3A1E", letterSpacing: "0.04em" }}>
                Menú
              </span>
            </button>
          </div>

          {/* Centro: Logo */}
          <button
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 20px", transition: "opacity 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            <img
              src="/logo/logoextendido.png"
              alt="Emotia"
              style={{ height: scrolled ? "30px" : "36px", width: "auto", transition: "height 0.35s ease", objectFit: "contain" }}
            />
          </button>

          {/* Derecha */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>

            {/* Iniciar sesión — desktop */}
            <button className="nav-icon-btn nav-desktop" onClick={() => router.push("/login")}>
              <IconUser />
              <span>Iniciar sesión</span>
              <IconChevronD />
            </button>

            <span className="nav-divider nav-desktop" />

            {/* Carrito */}
            <button className="nav-icon-btn" onClick={() => router.push("/carrito")} aria-label="Carrito" style={{ position: "relative" }}>
              <IconCart />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "4px", right: "4px",
                  width: "16px", height: "16px",
                  background: "#9B2335", color: "#fff", borderRadius: "50%",
                  fontSize: "0.6rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid #FAF5EE",
                }}>{cartCount}</span>
              )}
            </button>

            {/* CTA — desktop */}
            <button className="btn-cta nav-desktop" onClick={() => router.push("/registro")} style={{ marginLeft: "8px" }}>
              Comenzar gratis
            </button>

            {/* User icono — mobile */}
            <button className="nav-mobile nav-icon-btn" onClick={() => router.push("/login")} aria-label="Cuenta">
              <IconUser />
            </button>
          </div>
        </div>

        {/* Buscador expandible desktop */}
        {searchOpen && (
          <div style={{ padding: "0 28px 14px", maxWidth: "1320px", margin: "0 auto", animation: "slideDown 0.2s ease" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.72)",
              border: "1.5px solid rgba(188,153,104,0.35)",
              borderRadius: "100px", padding: "10px 20px", maxWidth: "520px",
            }}>
              <span style={{ color: "#9B7A5A", display: "flex" }}><IconSearch /></span>
              <input
                autoFocus
                placeholder="Busca tu regalo perfecto en Emotia…"
                style={{ flex: 1, border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#5C3A1E", outline: "none" }}
                onKeyDown={e => { if (e.key === "Escape") setSearchOpen(false); }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9B7A5A", lineHeight: 1, padding: 0, display: "flex" }}>
                <IconClose />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ DRAWER ══════════════════════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="drawer-overlay"
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(40,10,15,0.38)", backdropFilter: "blur(3px)" }}
          />

          {/* Panel */}
          <aside
            className="drawer-panel"
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: "min(360px, 88vw)",
              zIndex: 1101,
              background: "#FAF5EE",
              overflowY: "auto",
              display: "flex", flexDirection: "column",
              boxShadow: "6px 0 40px rgba(90,15,36,0.18)",
            }}
          >
            {/* Cabecera */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px 16px",
              borderBottom: "1px solid rgba(188,153,104,0.2)",
            }}>
              <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: "28px", width: "auto", objectFit: "contain" }} />
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#5C3A1E", padding: "6px", borderRadius: "8px", display: "flex", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(155,35,53,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                aria-label="Cerrar menú"
              >
                <IconClose />
              </button>
            </div>

            {/* Buscador en drawer */}
            <div style={{ padding: "14px 24px 6px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "rgba(255,255,255,0.7)",
                border: "1.5px solid rgba(188,153,104,0.3)",
                borderRadius: "100px", padding: "10px 16px",
              }}>
                <span style={{ color: "#9B7A5A", display: "flex" }}><IconSearch /></span>
                <input
                  placeholder="Buscar…"
                  style={{ flex: 1, border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", color: "#5C3A1E", outline: "none" }}
                />
              </div>
            </div>

            {/* Links */}
            <nav style={{ flex: 1, paddingTop: "8px" }}>
              {drawerSections.map((section, si) => (
                <div key={si}>
                  {si > 0 && (
                    <div style={{ height: "1px", background: "rgba(188,153,104,0.22)", margin: "10px 0 6px" }} />
                  )}
                  {section.items.map(({ label, href, accent }) => (
                    <button
                      key={href}
                      className={`drawer-row${accent ? " accent" : ""}`}
                      onClick={() => go(href)}
                    >
                      <span>{label}</span>
                      <span style={{ color: accent ? "#9B2335" : "rgba(92,58,30,0.35)", display: "flex" }}>
                        <IconChevronR />
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(188,153,104,0.18)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => go("/login")}
                style={{
                  width: "100%", padding: "13px",
                  background: "none",
                  border: "1.5px solid rgba(155,35,53,0.3)",
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", fontWeight: 500, color: "#9B2335",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(155,35,53,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <IconUser /> Iniciar sesión
              </button>
              <button
                className="btn-cta"
                onClick={() => go("/registro")}
                style={{ width: "100%", padding: "13px", borderRadius: "12px", fontSize: "0.92rem" }}
              >
                Comenzar gratis
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}