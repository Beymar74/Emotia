"use client";
// Footer.tsx — Pie de página con columnas y redes sociales

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { COLORS } from "./constants";
import { HeartIcon } from "./icons";

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.67a8.16 8.16 0 0 0 4.77 1.52V7.74a4.85 4.85 0 0 1-1-.05z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Cuando regresamos a la página de inicio, scrollear a la sección si existe un hash
    if ((pathname === '/' || pathname === '') && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const id = hash.slice(1);
          const element = document.getElementById(id);
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [pathname]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Si estamos en la página de inicio, scrollear a la sección
    if (pathname === '/' || pathname === '') {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegar a esa sección directamente
      router.push('/' + href);
    }
  };

  const links = {
    Contacto: [
      { label: "Instagram", icon: <InstagramIcon />, href: "https://www.instagram.com/emotia.gifts1/"  },
      { label: "TikTok",    icon: <TikTokIcon />,    href: "https://www.tiktok.com/@emotia.gifts0" },
      { label: "WhatsApp",  icon: <WhatsAppIcon />,  href: "https://wa.me/59170000000?text=Hola%20Emotia%2C%20necesito%20ayuda%20con..."  },
    ],
    Navegación: [
      { label: "Inicio", href: "#hero" },
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Características", href: "#caracteristicas" },
      { label: "Testimonios", href: "#testimonios" },
      { label: "Sobre nosotros", href: "/nosotros" },
      { label: "Ayuda", href: "/ayuda" },
    ],
    Legal:    ["Privacidad", "Términos", "Cookies"],
  };

  return (
    <footer style={{ background: COLORS.bordeaux, color: "rgba(245,230,208,0.75)", padding: "56px 24px 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "7px" }}><HeartIcon /></div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.25rem", color: COLORS.beige }}>Emotia</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.65, maxWidth: "220px", color: "rgba(245,230,208,0.6)" }}>IA que convierte cada regalo en un momento que se recuerda para siempre. Hecho en La Paz, Bolivia.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {["IG", "FB", "TW"].map(s => (
                <a key={s} href="#" aria-label={s} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid rgba(188,153,104,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${COLORS.garnet}40`)} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>{s}</a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "16px" }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {(items as any[]).map(item => (
                  <li key={typeof item === "string" ? item : item.label}>
                    {typeof item === "string" ? (
                      <a href="#" style={{ color: "rgba(245,230,208,0.6)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.beige)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,230,208,0.6)")}>{item}</a>
                    ) : (
                      <a href={item.href.startsWith('#') ? '#' : item.href} {...(item.href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={item.href.startsWith('#') ? (e) => handleScroll(e, item.href) : undefined} style={{ color: "rgba(245,230,208,0.6)", textDecoration: "none", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.beige)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,230,208,0.6)")}>
                        <span style={{ color: COLORS.gold, display: "flex", alignItems: "center" }}>{item.icon}</span>
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${COLORS.gold}30, transparent)`, marginBottom: "24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "0.8rem", color: "rgba(245,230,208,0.45)" }}>© {year} Emotia. Todos los derechos reservados.</p>
          <p style={{ fontSize: "0.8rem", color: "rgba(245,230,208,0.35)", display: "flex", alignItems: "center", gap: "6px" }}>Hecho con <span style={{ color: COLORS.garnet, fontSize: "0.9rem" }}>♥</span> en La Paz, Bolivia</p>
        </div>
      </div>
    </footer>
  );
}