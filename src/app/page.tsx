"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Gift, Heart, ArrowRight, ArrowUp, Star,
  Sparkles, PackageOpen, MapPin, MessageCircleHeart,
  Palette, Clock, ChevronDown
} from 'lucide-react';

/* ─── Google Fonts injected once ─────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

/* ─── Global CSS ─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --wine:   #6B1230;
    --rose:   #A63A50;
    --blush:  #F2D9CE;
    --cream:  #FBF5EF;
    --sand:   #C4A882;
    --dark:   #1A0810;
    --muted:  #7A5C58;
    --white:  #FFFFFF;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--cream);
    color: var(--dark);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  ::selection { background: var(--rose); color: var(--white); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }

  /* ── Noise texture overlay ── */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* ── Serif headings ── */
  .serif { font-family: 'Cormorant Garamond', serif; }

  /* ── Gradient text ── */
  .grad-text {
    background: linear-gradient(135deg, var(--wine), var(--rose));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Reveal animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-14px) rotate(1deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(166, 58, 80, 0.4); }
    70%  { box-shadow: 0 0 0 12px rgba(166, 58, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(166, 58, 80, 0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes bounceDot {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%            { transform: translateY(-6px); opacity: 1; }
  }

  .fade-up      { animation: fadeUp 0.8s ease both; }
  .scale-in     { animation: scaleIn 0.7s ease both; }
  .float        { animation: floatY 5s ease-in-out infinite; }
  .spin-slow    { animation: spin-slow 20s linear infinite; }
  .shimmer-btn  {
    background: linear-gradient(90deg, var(--wine) 0%, var(--rose) 40%, var(--wine) 60%, var(--wine) 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }
  .delay-1 { animation-delay: 0.15s; }
  .delay-2 { animation-delay: 0.30s; }
  .delay-3 { animation-delay: 0.45s; }
  .delay-4 { animation-delay: 0.60s; }

  /* ── Nav ── */
  .nav-glass {
    background: rgba(251, 245, 239, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(196, 168, 130, 0.25);
  }

  /* ── Pill badge ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(196,168,130,0.4);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--rose);
    text-transform: uppercase;
  }

  /* ── Primary button ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: var(--white);
    transition: transform 0.25s, box-shadow 0.25s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(107, 18, 48, 0.35);
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(107, 18, 48, 0.45);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 15px 32px;
    border-radius: 999px;
    border: 1.5px solid var(--sand);
    cursor: pointer;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: var(--muted);
    transition: all 0.25s;
  }
  .btn-outline:hover {
    background: var(--white);
    border-color: var(--rose);
    color: var(--wine);
    transform: translateY(-2px);
  }

  /* ── Chat bubble bounce dot ── */
  .dot { animation: bounceDot 1.2s infinite; }

  /* ── Cards ── */
  .benefit-card {
    background: var(--white);
    border: 1px solid rgba(196,168,130,0.2);
    border-radius: 28px;
    padding: 40px;
    transition: transform 0.35s, box-shadow 0.35s, border-color 0.35s;
    position: relative;
    overflow: hidden;
  }
  .benefit-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, rgba(166,58,80,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .benefit-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(107,18,48,0.1); border-color: rgba(166,58,80,0.3); }
  .benefit-card:hover::before { opacity: 1; }

  .step-circle {
    width: 88px; height: 88px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid rgba(242,217,206,0.3);
    transition: transform 0.3s, background 0.3s;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  }
  .step-circle:hover { transform: scale(1.1); }

  /* ── Marquee ── */
  .marquee-track { animation: marquee 20s linear infinite; }

  /* ── Floating shapes ── */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }

  /* ── Chat card ── */
  .chat-card {
    border-radius: 36px;
    overflow: hidden;
    background: var(--white);
    box-shadow: 0 40px 100px rgba(107,18,48,0.2), 0 0 0 1px rgba(196,168,130,0.15);
    height: 640px;
    display: flex;
    flex-direction: column;
    transition: transform 0.5s;
  }
  .chat-card:hover { transform: translateY(-6px); }

  /* ── Decorative ring behind chat ── */
  .chat-ring {
    position: absolute;
    inset: -24px;
    border-radius: 50px;
    border: 1px dashed rgba(196,168,130,0.4);
    pointer-events: none;
  }

  /* ── Scroll indicator ── */
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50%       { transform: translateY(8px); opacity: 1; }
  }
  .scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }

  /* ── Stats row ── */
  .stat-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--white);
    border: 1px solid rgba(196,168,130,0.25);
    border-radius: 20px;
    padding: 16px 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
`;

/* ─── Data ─────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    Icon: MessageCircleHeart,
    title: 'Asesoría con IA',
    desc: 'Nuestro asistente perfila a tu ser querido y genera sugerencias que conectan emocionalmente, no solo comercialmente.',
  },
  {
    Icon: Palette,
    title: 'Personalización Total',
    desc: 'Agrega cartas, empaques especiales y detalles únicos. Cada regalo lleva tu huella, gestionado todo desde un solo lugar.',
  },
  {
    Icon: MapPin,
    title: 'Tracking en Tiempo Real',
    desc: 'Coordina pagos seguros y monitorea tu pedido hasta que llega a manos de quien más quieres. Sin incertidumbre.',
  },
];

const STEPS = [
  { Icon: Sparkles,    num: '01', title: 'Cuenta la historia',   desc: 'Chatea con nuestra IA. Cuéntale sobre la persona, la ocasión y tu presupuesto.' },
  { Icon: PackageOpen, num: '02', title: 'Selecciona y edita',   desc: 'Elige entre opciones curadas y personaliza con dedicatorias o empaques especiales.' },
  { Icon: Heart,       num: '03', title: 'Genera emociones',     desc: 'Nos encargamos de todo. Rastrea la entrega en tiempo real y sorprende.' },
];

const MARQUEE_ITEMS = [
  'Aniversarios', '✦', 'Cumpleaños', '✦', 'San Valentín', '✦',
  'Amistad', '✦', 'Artesanías locales', '✦', 'Experiencias', '✦',
  'Flores', '✦', 'Regalos únicos', '✦',
];

/* ─── Component ─────────────────────────────────────────────────── */
export default function EmotiaLandingPage() {
  const [animStep, setAnimStep]       = useState(0);
  const [scrolled, setScrolled]       = useState(false);
  const [visibleSects, setVisible]    = useState<Set<string>>(new Set());
  const observerRef                   = useRef<IntersectionObserver | null>(null);

  /* Chat animation */
  useEffect(() => {
    const t = [
      setTimeout(() => setAnimStep(1), 900),
      setTimeout(() => setAnimStep(2), 2600),
      setTimeout(() => setAnimStep(3), 3600),
      setTimeout(() => setAnimStep(4), 5600),
      setTimeout(() => setAnimStep(5), 8200),
      setTimeout(() => setAnimStep(6), 9800),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  /* Navbar scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Intersection observer for sections */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisible(prev => new Set([...prev, e.target.id]));
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-observe]').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSects.has(id);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{ background: 'var(--cream)', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── NAVBAR ────────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.4s',
          padding: scrolled ? '14px 0' : '22px 0',
          ...(scrolled ? {} : { background: 'transparent' }),
        }}
          className={scrolled ? 'nav-glass' : ''}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--wine), var(--rose))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(107,18,48,0.35)',
              }}>
                <Gift size={18} color="white" />
              </div>
              <span className="serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--wine)', letterSpacing: '-0.02em' }}>
                Emotia
              </span>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 36, fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--muted)' }} className="hidden md:flex">
              {['CÓMO FUNCIONA', 'BENEFICIOS', 'CATÁLOGO'].map(l => (
                <a key={l} href={`#${l === 'CÓMO FUNCIONA' ? 'como-funciona' : l.toLowerCase()}`}
                  style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--wine)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >{l}</a>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="hidden md:block" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--muted)', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--wine)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >Iniciar sesión</button>
              <button className="btn-primary shimmer-btn" style={{ padding: '11px 24px', fontSize: 13 }}>
                <Sparkles size={14} /> Probar IA
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
          {/* Background blobs */}
          <div className="blob" style={{ width: 560, height: 560, background: 'var(--rose)', opacity: 0.13, top: '-80px', right: '-100px' }} />
          <div className="blob" style={{ width: 400, height: 400, background: 'var(--sand)', opacity: 0.15, bottom: '-60px', left: '-80px' }} />
          {/* Decorative circle */}
          <div className="spin-slow hidden lg:block" style={{
            position: 'absolute', right: '8%', top: '12%',
            width: 320, height: 320,
            border: '1px dashed rgba(196,168,130,0.35)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center', position: 'relative', zIndex: 2 }}>

            {/* Left — Copy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="badge fade-up">
                <Sparkles size={12} /> Tu asesor de regalos con IA · La Paz, Bolivia
              </div>

              <h1 className="serif fade-up delay-1" style={{ fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--dark)' }}>
                Regalos con<br />
                <em className="grad-text" style={{ fontStyle: 'italic', fontWeight: 300 }}>sentido</em>,<br />
                sin el estrés.
              </h1>

              <p className="fade-up delay-2" style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 460 }}>
                Emotia analiza emociones y perfiles con IA para ayudarte a encontrar el detalle perfecto. Personalízalo, págalo seguro y rastrea su entrega — todo en un solo lugar.
              </p>

              <div className="fade-up delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button className="btn-primary shimmer-btn">
                  Encontrar un regalo <ArrowRight size={18} />
                </button>
                <button className="btn-outline">
                  Ver catálogo
                </button>
              </div>

              {/* Social proof */}
              <div className="fade-up delay-4" style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 8 }}>
                <div style={{ display: 'flex' }}>
                  {[11, 12, 13, 14].map((i, idx) => (
                    <div key={i} style={{
                      width: 38, height: 38, borderRadius: '50%',
                      border: '2.5px solid var(--cream)',
                      backgroundImage: `url(https://i.pravatar.cc/80?img=${i})`,
                      backgroundSize: 'cover',
                      marginLeft: idx === 0 ? 0 : -10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }} />
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, color: '#C4A882' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>
                    +1,000 emociones entregadas en La Paz
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Chat */}
            <div className="scale-in delay-2 float" style={{ position: 'relative', maxWidth: 450, margin: '0 auto' }}>
              <div className="chat-ring hidden lg:block" />
              {/* Floating accent badges */}
              <div style={{
                position: 'absolute', top: -20, left: -20, zIndex: 10,
                background: 'var(--white)', borderRadius: 16,
                padding: '10px 16px', boxShadow: '0 8px 24px rgba(107,18,48,0.15)',
                border: '1px solid rgba(196,168,130,0.3)',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 700, color: 'var(--wine)',
              }}>
                <Heart size={14} fill="var(--rose)" color="var(--rose)" /> 2° Aniversario
              </div>
              <div style={{
                position: 'absolute', bottom: 30, right: -24, zIndex: 10,
                background: 'var(--wine)', borderRadius: 16,
                padding: '10px 18px', boxShadow: '0 8px 24px rgba(107,18,48,0.3)',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, fontWeight: 600, color: 'var(--white)',
              }}>
                <Sparkles size={13} /> 3 opciones generadas ✓
              </div>

              <div className="chat-card">
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--wine), #3D0718)',
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        border: '1.5px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: animStep >= 1 ? 'pulse-ring 2.5s infinite' : 'none',
                      }}>
                        <Sparkles size={18} color="var(--blush)" />
                      </div>
                      <span style={{
                        position: 'absolute', bottom: 1, right: 1,
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#4ade80',
                        border: '2px solid var(--wine)',
                      }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>Asesor Emotia</p>
                      <p style={{ fontSize: 11, color: 'rgba(242,217,206,0.8)', fontWeight: 500 }}>IA · En línea ahora</p>
                    </div>
                  </div>
                  {/* Dots */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.2)'].map((c, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  background: '#FAFAF9',
                }}>
                  {/* Date divider */}
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontWeight: 600, opacity: 0.7 }}>Hoy · Ahora mismo</div>

                  {/* IA msg 1 */}
                  <ChatMsg show={animStep >= 1} from="ai">
                    ¡Hola! Soy tu asistente Emotia. ¿Para quién buscamos un regalo hoy y cuál es la ocasión? 🎁
                  </ChatMsg>

                  {/* User msg 1 */}
                  <ChatMsg show={animStep >= 2} from="user">
                    Para el aniversario con mi novia. Llevamos 2 años. 💕
                  </ChatMsg>

                  {/* Typing */}
                  {animStep === 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--blush)', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', width: 'fit-content', border: '1px solid rgba(196,168,130,0.2)' }}>
                      {[0, 150, 300].map(d => (
                        <span key={d} className="dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--rose)', display: 'block', animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  )}

                  {/* IA msg 2 */}
                  <ChatMsg show={animStep >= 4} from="ai">
                    ¡Qué hermoso! 💖 Para personalizar mejor las opciones — ¿Cómo es su personalidad y cuál es tu presupuesto?
                  </ChatMsg>

                  {/* User msg 2 */}
                  <ChatMsg show={animStep >= 5} from="user">
                    Le encanta la naturaleza, el café y las manualidades. Presupuesto: 200 a 300 Bs.
                  </ChatMsg>

                  {/* Generating badge */}
                  {animStep >= 6 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'linear-gradient(135deg, var(--wine), var(--rose))',
                      color: 'white', borderRadius: 14, padding: '10px 16px',
                      fontSize: 12, fontWeight: 700, width: 'fit-content',
                      boxShadow: '0 4px 16px rgba(107,18,48,0.25)',
                      animation: 'fadeUp 0.5s ease',
                    }}>
                      <Sparkles size={13} style={{ animation: 'spin-slow 3s linear infinite' }} />
                      Generando 3 recomendaciones únicas…
                    </div>
                  )}
                </div>

                {/* Input */}
                <div style={{ padding: '14px 16px', background: 'var(--white)', borderTop: '1px solid rgba(196,168,130,0.15)', flexShrink: 0 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      disabled
                      placeholder={animStep >= 6 ? 'Analizando tu perfil…' : 'Escribe un mensaje…'}
                      style={{
                        width: '100%', background: 'var(--cream)', border: '1.5px solid rgba(196,168,130,0.3)',
                        borderRadius: 999, padding: '12px 52px 12px 18px',
                        fontSize: 13, color: 'var(--dark)', outline: 'none',
                        fontFamily: 'inherit', transition: 'border 0.2s',
                      }}
                    />
                    <button style={{
                      position: 'absolute', right: 4,
                      width: 36, height: 36, borderRadius: '50%', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: animStep >= 6 ? 'var(--sand)' : 'var(--wine)',
                      transition: 'background 0.3s',
                      boxShadow: animStep < 6 ? '0 4px 12px rgba(107,18,48,0.3)' : 'none',
                    }}>
                      <ArrowUp size={16} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-bounce" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--sand)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>
            <span>SCROLL</span>
            <ChevronDown size={16} />
          </div>
        </section>

        {/* ── MARQUEE BAND ─────────────────────────────────────── */}
        <div style={{ background: 'var(--wine)', padding: '14px 0', overflow: 'hidden', position: 'relative', zIndex: 3 }}>
          <div className="marquee-track" style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(242,217,206,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── BENEFITS ──────────────────────────────────────────── */}
        <section id="beneficios" data-observe style={{ padding: '120px 0', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

            <div id="ben-header" data-observe style={{ textAlign: 'center', marginBottom: 64, opacity: isVisible('beneficios') ? 1 : 0, transform: isVisible('beneficios') ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
              <div className="badge" style={{ margin: '0 auto 16px' }}>Por qué Emotia</div>
              <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Transformamos la indecisión<br />
                en <em className="grad-text">conexión</em>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {BENEFITS.map(({ Icon, title, desc }, idx) => (
                <div key={title} className="benefit-card" style={{
                  opacity: isVisible('beneficios') ? 1 : 0,
                  transform: isVisible('beneficios') ? 'none' : 'translateY(32px)',
                  transition: `all 0.7s ease ${idx * 0.12}s`,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, marginBottom: 24,
                    background: 'linear-gradient(135deg, rgba(107,18,48,0.08), rgba(166,58,80,0.12))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(166,58,80,0.15)',
                  }}>
                    <Icon size={24} color="var(--wine)" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--dark)' }}>{title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>

                  {/* Bottom accent */}
                  <div style={{ marginTop: 28, height: 2, background: 'linear-gradient(90deg, var(--rose), transparent)', borderRadius: 1, opacity: 0.3 }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAND ────────────────────────────────────────── */}
        <div style={{ background: 'var(--blush)', padding: '48px 0', borderTop: '1px solid rgba(196,168,130,0.2)', borderBottom: '1px solid rgba(196,168,130,0.2)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { num: '+1,000', label: 'Emociones entregadas', sub: 'en La Paz, Bolivia' },
              { num: '98%',    label: 'Clientes satisfechos', sub: 'según encuestas post-entrega' },
              { num: '< 2h',   label: 'Tiempo promedio', sub: 'desde pedido hasta despacho' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="stat-pill">
                <div>
                  <p className="serif" style={{ fontSize: 40, fontWeight: 700, color: 'var(--wine)', lineHeight: 1 }}>{num}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginTop: 4 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section id="como-funciona" data-observe style={{
          background: 'linear-gradient(160deg, #1A0810 0%, #3D0718 50%, #1A0810 100%)',
          padding: '120px 0',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'radial-gradient(var(--blush) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div className="blob" style={{ width: 400, height: 400, background: 'var(--rose)', opacity: 0.08, top: '-60px', right: '-80px' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 80, opacity: isVisible('como-funciona') ? 1 : 0, transform: isVisible('como-funciona') ? 'none' : 'translateY(24px)', transition: 'all 0.7s' }}>
              <div className="badge" style={{ margin: '0 auto 16px', background: 'rgba(242,217,206,0.1)', borderColor: 'rgba(196,168,130,0.3)', color: 'var(--sand)' }}>El proceso</div>
              <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.02em' }}>
                Tres pasos para sorprender
              </h2>
            </div>

            {/* Steps */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, position: 'relative' }}>
              {/* Connector line */}
              <div className="hidden lg:block" style={{
                position: 'absolute', top: 44, left: '20%', right: '20%', height: 1,
                background: 'linear-gradient(90deg, transparent, var(--rose), transparent)', opacity: 0.4,
              }} />

              {STEPS.map(({ Icon, num, title, desc }, idx) => (
                <div key={title} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  opacity: isVisible('como-funciona') ? 1 : 0,
                  transform: isVisible('como-funciona') ? 'none' : 'translateY(36px)',
                  transition: `all 0.7s ease ${idx * 0.15}s`,
                }}>
                  <div style={{ position: 'relative', marginBottom: 28 }}>
                    <div className="step-circle" style={{ background: 'rgba(166,58,80,0.15)', border: '1px solid rgba(166,58,80,0.4)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.background = 'rgba(166,58,80,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(166,58,80,0.15)'; }}
                    >
                      <Icon size={32} color="var(--blush)" />
                    </div>
                    <span className="serif" style={{
                      position: 'absolute', top: -12, right: -12,
                      fontSize: 13, fontWeight: 700, color: 'var(--rose)',
                      background: 'rgba(26,8,16,0.9)', border: '1px solid rgba(166,58,80,0.4)',
                      borderRadius: 8, padding: '2px 8px',
                    }}>{num}</span>
                  </div>
                  <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--blush)', marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(196,168,130,0.8)', lineHeight: 1.7, maxWidth: 240 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="blob" style={{ width: 500, height: 500, background: 'var(--rose)', opacity: 0.1, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

          <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div className="badge">Empieza hoy</div>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              ¿Listo para dejar<br />de <em className="grad-text">adivinar</em>?
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7 }}>
              Únete a la plataforma que centraliza proveedores locales, artesanías, experiencias y servicios florales en un solo lugar.
            </p>
            <button className="btn-primary shimmer-btn" style={{ marginTop: 8, fontSize: 16, padding: '18px 40px' }}>
              Comenzar gratis <ArrowRight size={20} />
            </button>
            <p style={{ fontSize: 13, color: 'var(--sand)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <Clock size={14} /> Disponible 24/7 · La Paz, Bolivia
            </p>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <footer style={{
          background: 'var(--dark)', color: 'rgba(196,168,130,0.7)',
          padding: '36px 32px', borderTop: '1px solid rgba(196,168,130,0.12)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(196,168,130,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={14} color="var(--sand)" />
              </div>
              <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--sand)' }}>Emotia</span>
            </div>
            <p style={{ fontSize: 13 }}>© 2026 Grupo Explosión Pressman · Todos los derechos reservados.</p>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              {['Términos', 'Privacidad', 'Contacto'].map(l => (
                <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--sand)'}
                  onMouseLeave={e => e.currentTarget.style.color = ''}
                >{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ─── ChatMsg sub-component ─────────────────────────────────────── */
function ChatMsg({ show, from, children }: { show: boolean, from: 'ai' | 'user', children: React.ReactNode }) {
  const isAI = from === 'ai';
  return (
    <div style={{
      display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.45s ease',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div style={{
        maxWidth: '85%', fontSize: 13.5, lineHeight: 1.6, fontWeight: 500,
        borderRadius: isAI ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
        padding: '12px 16px',
        background: isAI ? 'var(--blush)' : 'linear-gradient(135deg, var(--wine), var(--rose))',
        color: isAI ? 'var(--dark)' : 'white',
        border: isAI ? '1px solid rgba(196,168,130,0.25)' : 'none',
        boxShadow: isAI ? '0 2px 8px rgba(0,0,0,0.05)' : '0 4px 16px rgba(107,18,48,0.25)',
      }}>
        {children}
      </div>
    </div>
  );
}