'use client';

import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        :root {
          --granate: #8E1B3A;
          --bordo: #5A0F24;
          --carmesi: #AB3A50;
          --chocolate: #5C3A2E;
          --dorado: #BC9968;
          --beige: #F5E6D0;
          --blanco: #FFFFFF;
          --gris: #B0B0B0;
          --negro: #000000;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Montserrat', sans-serif;
          background: var(--beige);
          color: var(--negro);
          overflow-x: hidden;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.2rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s ease;
          background: ${scrollY > 50 ? 'rgba(90,15,36,0.97)' : 'transparent'};
          backdrop-filter: ${scrollY > 50 ? 'blur(12px)' : 'none'};
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--beige);
          letter-spacing: 0.1em;
        }

        .nav-logo span {
          color: var(--dorado);
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--beige);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.85;
          transition: opacity 0.2s;
        }

        .nav-links a:hover { opacity: 1; color: var(--dorado); }

        .nav-cta {
          background: var(--dorado);
          color: var(--bordo);
          padding: 0.6rem 1.6rem;
          border: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }

        .nav-cta:hover {
          background: var(--beige);
          transform: translateY(-2px);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bordo) 0%, var(--granate) 50%, var(--carmesi) 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(188,153,104,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -10%;
          left: 20%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,230,208,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          z-index: 2;
          animation: fadeInLeft 1s ease forwards;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .hero-tag {
          display: inline-block;
          color: var(--dorado);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          border-left: 2px solid var(--dorado);
          padding-left: 1rem;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          color: var(--beige);
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-title em {
          font-style: italic;
          color: var(--dorado);
        }

        .hero-subtitle {
          color: rgba(245,230,208,0.7);
          font-size: 0.95rem;
          line-height: 1.8;
          max-width: 480px;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-primary {
          background: var(--dorado);
          color: var(--bordo);
          padding: 1rem 2.5rem;
          border: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          background: var(--beige);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .btn-secondary {
          color: var(--beige);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          cursor: pointer;
          border: none;
          background: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: gap 0.3s;
        }

        .btn-secondary:hover { gap: 0.8rem; color: var(--dorado); }

        /* HERO VISUAL */
        .hero-visual {
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeInRight 1s ease 0.3s forwards;
          opacity: 0;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .gift-card {
          background: rgba(245,230,208,0.08);
          border: 1px solid rgba(188,153,104,0.3);
          backdrop-filter: blur(20px);
          padding: 3rem;
          width: 380px;
          position: relative;
        }

        .gift-card::before {
          content: '';
          position: absolute;
          top: -1px; left: 40px; right: 40px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--dorado), transparent);
        }

        .gift-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .gift-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          color: var(--beige);
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .gift-card p {
          color: rgba(245,230,208,0.6);
          font-size: 0.82rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .gift-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .gift-tag {
          background: rgba(188,153,104,0.2);
          border: 1px solid rgba(188,153,104,0.4);
          color: var(--dorado);
          font-size: 0.7rem;
          padding: 0.3rem 0.8rem;
          letter-spacing: 0.1em;
        }

        /* STATS */
        .stats {
          background: var(--bordo);
          padding: 3rem 4rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat {
          text-align: center;
          border-right: 1px solid rgba(188,153,104,0.2);
        }

        .stat:last-child { border-right: none; }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          color: var(--dorado);
          font-weight: 300;
          display: block;
        }

        .stat-label {
          color: rgba(245,230,208,0.6);
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* HOW IT WORKS */
        .how {
          padding: 8rem 4rem;
          background: var(--beige);
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-tag {
          color: var(--granate);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: var(--bordo);
          font-weight: 300;
          line-height: 1.2;
        }

        .section-title em {
          font-style: italic;
          color: var(--granate);
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .step {
          position: relative;
          padding: 2.5rem;
          background: white;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .step:hover {
          border-bottom-color: var(--granate);
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(142,27,58,0.1);
        }

        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          color: rgba(142,27,58,0.1);
          font-weight: 600;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .step-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }

        .step h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: var(--bordo);
          margin-bottom: 0.8rem;
          font-weight: 600;
        }

        .step p {
          color: var(--gris);
          font-size: 0.85rem;
          line-height: 1.7;
        }

        /* CATEGORIES */
        .categories {
          padding: 8rem 4rem;
          background: white;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 300px 300px;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cat-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: flex-end;
          padding: 2rem;
        }

        .cat-card:first-child {
          grid-row: 1 / 3;
          background: linear-gradient(135deg, var(--bordo), var(--granate));
        }

        .cat-card:nth-child(2) { background: linear-gradient(135deg, var(--chocolate), #7a4d3e); }
        .cat-card:nth-child(3) { background: linear-gradient(135deg, var(--granate), var(--carmesi)); }
        .cat-card:nth-child(4) { background: linear-gradient(135deg, #3d2820, var(--chocolate)); }
        .cat-card:nth-child(5) { background: linear-gradient(135deg, var(--carmesi), #c4566a); }

        .cat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
        }

        .cat-emoji {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          font-size: 4rem;
          opacity: 0.3;
          transition: all 0.3s;
        }

        .cat-card:hover .cat-emoji {
          opacity: 0.6;
          transform: translate(-50%, -65%) scale(1.1);
        }

        .cat-info {
          position: relative;
          z-index: 1;
        }

        .cat-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: white;
          font-weight: 400;
          margin-bottom: 0.3rem;
        }

        .cat-info span {
          color: var(--dorado);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
        }

        /* AI SECTION */
        .ai-section {
          padding: 8rem 4rem;
          background: linear-gradient(135deg, var(--bordo) 0%, var(--granate) 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .ai-content .section-tag { color: var(--dorado); }

        .ai-content .section-title {
          color: var(--beige);
          text-align: left;
          margin-bottom: 1.5rem;
        }

        .ai-content p {
          color: rgba(245,230,208,0.7);
          font-size: 0.9rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .ai-features {
          list-style: none;
          margin-bottom: 2.5rem;
        }

        .ai-features li {
          color: rgba(245,230,208,0.8);
          font-size: 0.85rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(188,153,104,0.15);
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .ai-features li::before {
          content: '◆';
          color: var(--dorado);
          font-size: 0.5rem;
        }

        /* CHAT MOCKUP */
        .chat-mockup {
          background: rgba(245,230,208,0.06);
          border: 1px solid rgba(188,153,104,0.2);
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid rgba(188,153,104,0.2);
          margin-bottom: 1.5rem;
        }

        .chat-avatar {
          width: 36px;
          height: 36px;
          background: var(--dorado);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .chat-name {
          color: var(--beige);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .chat-status {
          color: #4ade80;
          font-size: 0.7rem;
        }

        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .msg {
          max-width: 80%;
          padding: 0.8rem 1.1rem;
          font-size: 0.82rem;
          line-height: 1.5;
          border-radius: 2px;
        }

        .msg-bot {
          background: rgba(188,153,104,0.15);
          color: var(--beige);
          align-self: flex-start;
          border-left: 2px solid var(--dorado);
        }

        .msg-user {
          background: rgba(245,230,208,0.1);
          color: rgba(245,230,208,0.8);
          align-self: flex-end;
          border-right: 2px solid rgba(245,230,208,0.3);
        }

        /* TESTIMONIALS */
        .testimonials {
          padding: 8rem 4rem;
          background: var(--beige);
        }

        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .testi-card {
          background: white;
          padding: 2.5rem;
          position: relative;
        }

        .testi-card::before {
          content: '"';
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem;
          color: var(--granate);
          opacity: 0.15;
          position: absolute;
          top: -1rem;
          left: 1.5rem;
          line-height: 1;
        }

        .testi-text {
          color: #555;
          font-size: 0.88rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .testi-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--granate), var(--carmesi));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .testi-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--bordo);
        }

        .testi-role {
          font-size: 0.75rem;
          color: var(--gris);
        }

        /* CTA FINAL */
        .cta-final {
          padding: 8rem 4rem;
          background: var(--negro);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-final::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(142,27,58,0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-final h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: var(--beige);
          font-weight: 300;
          margin-bottom: 1rem;
          position: relative;
        }

        .cta-final h2 em {
          color: var(--dorado);
          font-style: italic;
        }

        .cta-final p {
          color: rgba(245,230,208,0.5);
          font-size: 0.9rem;
          margin-bottom: 3rem;
          position: relative;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          position: relative;
        }

        /* FOOTER */
        footer {
          background: var(--bordo);
          padding: 3rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: var(--beige);
          font-weight: 600;
        }

        .footer-logo span { color: var(--dorado); }

        .footer-text {
          color: rgba(245,230,208,0.4);
          font-size: 0.75rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .footer-links a {
          color: rgba(245,230,208,0.5);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--dorado); }

        @media (max-width: 768px) {
          nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; padding: 6rem 1.5rem 3rem; }
          .hero-visual { display: none; }
          .stats { grid-template-columns: repeat(2, 1fr); padding: 2rem 1.5rem; }
          .how, .categories, .ai-section, .testimonials, .cta-final { padding: 4rem 1.5rem; }
          .steps, .testi-grid { grid-template-columns: 1fr; }
          .cat-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .cat-card:first-child { grid-row: auto; }
          .ai-section { grid-template-columns: 1fr; }
          footer { flex-direction: column; gap: 1.5rem; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{background: scrollY > 50 ? 'rgba(90,15,36,0.97)' : 'rgba(90,15,36,0.3)', backdropFilter: scrollY > 50 ? 'blur(12px)' : 'blur(4px)'}}>
        <div className="nav-logo">Emot<span>ia</span></div>
        <ul className="nav-links">
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#categorias">Categorías</a></li>
          <li><a href="#asistente">Asistente IA</a></li>
          <li><a href="#testimonios">Testimonios</a></li>
        </ul>
        <button className="nav-cta">Comenzar ahora</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">✦ Plataforma de Regalos Personalizados</span>
          <h1 className="hero-title">
            Regala <em>momentos</em><br />
            que perduran<br />
            para siempre
          </h1>
          <p className="hero-subtitle">
            Emotia utiliza inteligencia artificial para ayudarte a encontrar el regalo perfecto según la personalidad, ocasión y presupuesto. Porque cada detalle importa.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Descubrir regalos</button>
            <button className="btn-secondary">Ver cómo funciona →</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="gift-card">
            <span className="gift-icon">🎁</span>
            <h3>Asistente de Regalos</h3>
            <p>Cuéntanos sobre la persona especial y nosotros hacemos el resto.</p>
            <div className="gift-tags">
              <span className="gift-tag">Cumpleaños</span>
              <span className="gift-tag">Aniversario</span>
              <span className="gift-tag">Navidad</span>
              <span className="gift-tag">San Valentín</span>
              <span className="gift-tag">Graduación</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Productos únicos</span>
        </div>
        <div className="stat">
          <span className="stat-number">98%</span>
          <span className="stat-label">Clientes satisfechos</span>
        </div>
        <div className="stat">
          <span className="stat-number">50+</span>
          <span className="stat-label">Proveedores locales</span>
        </div>
        <div className="stat">
          <span className="stat-number">24h</span>
          <span className="stat-label">Entrega express</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how" id="como-funciona">
        <div className="section-header">
          <span className="section-tag">✦ Proceso simple</span>
          <h2 className="section-title">¿Cómo <em>funciona</em> Emotia?</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <span className="step-icon">💬</span>
            <h3>Cuéntanos sobre la persona</h3>
            <p>Nuestro asistente IA te hace preguntas clave sobre la personalidad, intereses y la ocasión especial del destinatario.</p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <span className="step-icon">✨</span>
            <h3>Recibe recomendaciones</h3>
            <p>En segundos, obtienes una selección personalizada de regalos que encajan perfectamente con el perfil y tu presupuesto.</p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <span className="step-icon">📦</span>
            <h3>Personaliza y envía</h3>
            <p>Añade dedicatorias, elige el empaque y realiza el seguimiento en tiempo real hasta la entrega.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories" id="categorias">
        <div className="section-header">
          <span className="section-tag">✦ Explora</span>
          <h2 className="section-title">Categorías <em>especiales</em></h2>
        </div>
        <div className="cat-grid">
          <div className="cat-card">
            <span className="cat-emoji">🎨</span>
            <div className="cat-info">
              <h3>Artesanías & Arte</h3>
              <span>Piezas únicas hechas a mano</span>
            </div>
          </div>
          <div className="cat-card">
            <span className="cat-emoji">💐</span>
            <div className="cat-info">
              <h3>Flores</h3>
              <span>Arreglos naturales</span>
            </div>
          </div>
          <div className="cat-card">
            <span className="cat-emoji">👗</span>
            <div className="cat-info">
              <h3>Moda</h3>
              <span>Estilo personalizado</span>
            </div>
          </div>
          <div className="cat-card">
            <span className="cat-emoji">🍫</span>
            <div className="cat-info">
              <h3>Gourmet</h3>
              <span>Experiencias de sabor</span>
            </div>
          </div>
          <div className="cat-card">
            <span className="cat-emoji">🌟</span>
            <div className="cat-info">
              <h3>Experiencias</h3>
              <span>Momentos memorables</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section className="ai-section" id="asistente">
        <div className="ai-content">
          <span className="section-tag">✦ Tecnología</span>
          <h2 className="section-title">Tu asesor personal <em>inteligente</em></h2>
          <p>
            Nuestro asistente IA simula la experiencia de un vendedor experto. Analiza el perfil del destinatario y encuentra el regalo ideal en segundos.
          </p>
          <ul className="ai-features">
            <li>Recomendaciones basadas en personalidad y ocasión</li>
            <li>Filtrado inteligente por presupuesto disponible</li>
            <li>Personalización de mensajes y dedicatorias</li>
            <li>Seguimiento en tiempo real del pedido</li>
            <li>Sistema de puntos y recompensas</li>
          </ul>
          <button className="btn-primary">Probar el asistente</button>
        </div>
        <div className="chat-mockup">
          <div className="chat-header">
            <div className="chat-avatar">✨</div>
            <div>
              <div className="chat-name">Emotia Assistant</div>
              <div className="chat-status">● En línea</div>
            </div>
          </div>
          <div className="chat-messages">
            <div className="msg msg-bot">¡Hola! Estoy aquí para ayudarte a encontrar el regalo perfecto. ¿Para quién es el regalo?</div>
            <div className="msg msg-user">Es para mi mamá, cumple 50 años</div>
            <div className="msg msg-bot">¡Qué ocasión tan especial! ¿Cuál es su personalidad? ¿Es más hogareña, aventurera o elegante?</div>
            <div className="msg msg-user">Es muy elegante y le encanta el arte</div>
            <div className="msg msg-bot">Perfecto. Tengo 3 recomendaciones especiales para ella basadas en su perfil ✨</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonios">
        <div className="section-header">
          <span className="section-tag">✦ Opiniones</span>
          <h2 className="section-title">Lo que dicen <em>nuestros clientes</em></h2>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <p className="testi-text">El asistente me ayudó a encontrar el regalo perfecto para mi esposa en menos de 5 minutos. Quedó encantada con el detalle tan personalizado.</p>
            <div className="testi-author">
              <div className="testi-avatar">MR</div>
              <div>
                <div className="testi-name">Marco Rodríguez</div>
                <div className="testi-role">Cliente frecuente</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-text">Nunca había encontrado una plataforma tan completa. Desde la recomendación hasta el seguimiento del envío, todo perfecto.</p>
            <div className="testi-author">
              <div className="testi-avatar">AL</div>
              <div>
                <div className="testi-name">Ana López</div>
                <div className="testi-role">Compradora verificada</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-text">La personalización es increíble. Pude añadir una carta y elegir el empaque. Mi hermana lloró de la emoción al recibirlo.</p>
            <div className="testi-author">
              <div className="testi-avatar">CV</div>
              <div>
                <div className="testi-name">Carlos Vega</div>
                <div className="testi-role">Cliente satisfecho</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2>Empieza a regalar con <em>intención</em></h2>
        <p>Únete a miles de personas que ya crean momentos inolvidables con Emotia</p>
        <div className="cta-buttons">
          <button className="btn-primary">Crear mi cuenta gratis</button>
          <button className="btn-secondary" style={{color: 'rgba(245,230,208,0.6)'}}>Ver catálogo →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Emot<span>ia</span></div>
        <span className="footer-text">© 2026 Emotia · La Paz, Bolivia</span>
        <ul className="footer-links">
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Términos</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </footer>
    </>
  );
}