"use client";
// Footer.tsx — Pie de página con columnas y redes sociales

import React, { useState } from "react";
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

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean; onClose: () => void; title: string; content: string }) => {
  if (!isOpen) return null;

  const renderContent = (text: string) => {
    return text.split('\n\n').map((section, idx) => {
      const lines = section.split('\n');
      return (
        <div key={idx} style={{ marginBottom: "16px" }}>
          {lines.map((line, lineIdx) => {
            if (line.match(/^\d\./)) {
              // Números de secciones
              return (
                <div key={lineIdx} style={{ fontSize: "1.1rem", fontWeight: 600, color: COLORS.garnet, marginTop: "12px", marginBottom: "8px" }}>
                  {line}
                </div>
              );
            } else if (line.startsWith('- ')) {
              // Viñetas
              return (
                <div key={lineIdx} style={{ marginLeft: "16px", marginBottom: "6px", fontSize: "0.95rem" }}>
                  <span style={{ color: COLORS.garnet, fontWeight: 600 }}>•</span> {line.substring(2)}
                </div>
              );
            } else if (line.trim() === '') {
              return null;
            } else {
              return (
                <p key={lineIdx} style={{ margin: "0 0 8px 0", fontSize: "0.95rem", lineHeight: 1.6, color: COLORS.chocolate }}>
                  {line}
                </p>
              );
            }
          })}
        </div>
      );
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }} onClick={onClose}>
      <div style={{ background: COLORS.beige, borderRadius: "16px", maxWidth: "600px", maxHeight: "80vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: COLORS.beige, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: COLORS.beige, padding: "0", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>✕</button>
        </div>
        <div style={{ padding: "32px", overflow: "auto", flex: 1 }}>
          {renderContent(content)}
        </div>
      </div>
    </div>
  );
};

const privacidadContent = `Política de Privacidad

En Emotia, tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.

1. Información que recopilamos
- Información de registro: nombre, correo electrónico, teléfono
- Información de navegación: cookies, páginas visitadas
- Información de transacciones: compras y regalos realizados

2. Uso de la información
Utilizamos tu información para:
- Proporcionar y mejorar nuestros servicios
- Procesar transacciones
- Enviar comunicaciones relevantes
- Personalizar tu experiencia

3. Protección de datos
Implementamos medidas de seguridad para proteger tu información contra acceso no autorizado.

4. Terceros
No compartimos tu información personal con terceros sin tu consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios.

5. Tus derechos
Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento.`;

const terminosContent = `Términos y Condiciones

Al usar Emotia, aceptas estos términos y condiciones.

1. Uso del servicio
- Debes tener al menos 18 años para usar nuestro servicio
- Eres responsable de mantener la confidencialidad de tu cuenta
- Aceptas usar Emotia de manera legal y ética

2. Propiedad intelectual
Todo el contenido en Emotia, incluyendo textos, imágenes y software, está protegido por derechos de autor.

3. Limitación de responsabilidad
Emotia se proporciona "tal como está". No garantizamos que el servicio sea ininterrumpido o libre de errores.

4. Cambios en los términos
Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos cuando se publiquen.

5. Resolución de disputas
Las disputas serán resueltas según las leyes aplicables.

6. Contacto
Para preguntas sobre estos términos, contáctanos en info@emotia.com`;

const cookiesContent = `Política de Cookies

Emotia utiliza cookies para mejorar tu experiencia de navegación.

1. ¿Qué son las cookies?
Las cookies son archivos pequeños almacenados en tu dispositivo que contienen información sobre tu navegación.

2. Tipos de cookies que utilizamos
- Cookies de sesión: se eliminan cuando cierras el navegador
- Cookies persistentes: permanecen en tu dispositivo
- Cookies de análisis: nos ayudan a entender cómo usas nuestro servicio

3. Control de cookies
Puedes controlar las cookies a través de la configuración de tu navegador. Sin embargo, desactivarlas puede afectar la funcionalidad del sitio.

4. Cookies de terceros
Algunos servicios de terceros pueden establecer sus propias cookies para análisis y publicidad.

5. Actualizaciones
Podemos actualizar esta política de cookies en cualquier momento.`;

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState<"privacidad" | "terminos" | "cookies" | null>(null);

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
    <>
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
              {[].map(s => (
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
                      <button onClick={() => {
                        if (item === "Privacidad") setOpenModal("privacidad");
                        else if (item === "Términos") setOpenModal("terminos");
                        else if (item === "Cookies") setOpenModal("cookies");
                      }} style={{ background: "none", border: "none", color: "rgba(245,230,208,0.6)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s", cursor: "pointer", padding: 0, fontFamily: "inherit" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.beige)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,230,208,0.6)")}>{item}</button>
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

    <LegalModal isOpen={openModal === "privacidad"} onClose={() => setOpenModal(null)} title="Política de Privacidad" content={privacidadContent} />
    <LegalModal isOpen={openModal === "terminos"} onClose={() => setOpenModal(null)} title="Términos y Condiciones" content={terminosContent} />
    <LegalModal isOpen={openModal === "cookies"} onClose={() => setOpenModal(null)} title="Política de Cookies" content={cookiesContent} />
  </>
  );
}
