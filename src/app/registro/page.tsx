"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Gift, Sparkles, Heart } from 'lucide-react';
import { useStackApp } from "@stackframe/stack";

// Importamos los componentes compartidos desde la carpeta home
import Navbar from '../home/Navbar';
import Footer from '../home/Footer';
import { COLORS } from '../home/constants';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const registerCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  :root {
    --garnet: #8E1B3A; --bordeaux: #5A0F24; --crimson: #AB3A50;
    --chocolate: #5C3A2E; --gold: #BC9968; --beige: #F5E6D0;
    --white: #FFFFFF; --gray: #8A7A75;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--beige); overflow-x: hidden; }

  @keyframes float { 
    from { transform: translateY(0px) rotate(0deg); }  
    to { transform: translateY(-20px) rotate(5deg); } 
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .split-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  @media (min-width: 1024px) {
    .split-layout {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
    }
    .visual-column { flex: 1.1; padding-right: 20px; }
    .form-column { flex: 1; max-width: 440px; width: 100%; }
  }

  .visual-content { animation: fadeRight 0.7s ease-out forwards; }
  
  .features-list { display: none; }
  @media (min-width: 1024px) {
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(188, 153, 104, 0.3);
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(90, 15, 36, 0.1);
    animation: fadeUp 0.7s ease-out forwards;
    padding: 32px 36px;
  }

  .input-field {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 16px 12px 40px;
    font-size: 0.9rem;
    color: var(--chocolate);
    font-family: 'DM Sans', sans-serif;
  }
  .input-field::placeholder { color: var(--gray); opacity: 0.7; }

  .input-group {
    position: relative;
    background: rgba(245, 230, 208, 0.4);
    border: 1px solid rgba(188, 153, 104, 0.3);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  .input-group:focus-within {
    background: white;
    border-color: var(--garnet);
    box-shadow: 0 0 0 3px rgba(142, 27, 58, 0.1);
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--garnet);
    opacity: 0.8;
    pointer-events: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--garnet), var(--bordeaux));
    color: white; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: 0.03em;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 100px;
    padding: 12px;
    width: 100%;
    font-size: 0.95rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(142, 27, 58, 0.25);
  }
  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    background: white;
    border: 1px solid rgba(188, 153, 104, 0.4);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--chocolate);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-social:hover {
    background: rgba(245, 230, 208, 0.5);
    border-color: var(--garnet);
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--gray);
    font-size: 0.8rem;
    margin: 16px 0;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(188, 153, 104, 0.3);
  }
  .divider::before { margin-right: 12px; }
  .divider::after { margin-left: 12px; }

  .error-msg {
    background: rgba(171, 58, 80, 0.1);
    border: 1px solid rgba(171, 58, 80, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    color: #AB3A50;
    font-size: 0.82rem;
    margin-bottom: 16px;
    text-align: center;
  }

  .success-msg {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    color: #16a34a;
    font-size: 0.82rem;
    margin-bottom: 16px;
    text-align: center;
  }
`;

export default function RegisterPage() {
  const stackApp = useStackApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await stackApp.signUpWithCredential({
        email,
        password,
      });
      if (result.status === 'ok') {
        setSuccess('¡Cuenta creada! Redirigiendo...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setError('No se pudo crear la cuenta. Intenta con otro correo.');
      }
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      await stackApp.signInWithOAuth('google', {
        returnTo: '/dashboard'
      });
    } catch {
      setError('Error al continuar con Google.');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: registerCSS }} />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}>
        
        <Navbar scrolled={scrolled} />

        <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", padding: "100px 24px 40px", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", top: "-5%", right: "-5%", background: `radial-gradient(circle at 30% 30%, ${COLORS.garnet}15, transparent 70%)`, filter: "blur(60px)", animation: "float 8s ease-in-out infinite alternate", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", bottom: "0%", left: "-10%", background: `radial-gradient(circle at 30% 30%, ${COLORS.gold}20, transparent 70%)`, filter: "blur(60px)", animation: "float 6s ease-in-out infinite alternate-reverse", pointerEvents: "none" }} />

          <div className="split-layout">
            
            <div className="visual-column visual-content">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${COLORS.white}60`, backdropFilter: 'blur(10px)', border: `1px solid ${COLORS.garnet}30`, borderRadius: "100px", padding: "6px 16px", marginBottom: "16px" }}>
                <Sparkles size={14} color={COLORS.garnet} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.garnet, letterSpacing: "0.05em", textTransform: "uppercase" }}>El futuro de los regalos</span>
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: "16px" }}>
                No más regalos<br /><em>genéricos.</em>
              </h1>
              
              <p style={{ color: COLORS.chocolate, fontSize: "0.95rem", maxWidth: "420px", lineHeight: 1.5, opacity: 0.9 }}>
                Únete a Emotia y deja que nuestra IA analice la personalidad y ocasión para recomendarte detalles con verdadero impacto emocional.
              </p>

              <div className="features-list">
                {[
                  { icon: <Gift size={16} />, title: "Asesoría IA 24/7", desc: "Encuentra el regalo ideal en minutos." },
                  { icon: <Heart size={16} />, title: "Personalización", desc: "Añade notas y empaques únicos." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.4)", padding: "10px 16px", borderRadius: "16px", border: `1px solid ${COLORS.gold}30`, maxWidth: "340px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: `linear-gradient(135deg, ${COLORS.garnet}15, ${COLORS.bordeaux}10)`, color: COLORS.garnet, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: COLORS.bordeaux, fontSize: "0.95rem", marginBottom: "2px" }}>{f.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: COLORS.chocolate, opacity: 0.8 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-column">
              <div className="glass-card">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 900, color: COLORS.bordeaux, marginBottom: "4px" }}>
                    Crea tu cuenta
                  </h2>
                  <p style={{ color: COLORS.gray, fontSize: "0.85rem" }}>
                    Ingresa tus datos para empezar a sorprender.
                  </p>
                </div>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <button className="btn-social" onClick={handleGoogleRegister} type="button">
                  <GoogleIcon />
                  Continuar con Google
                </button>

                <div className="divider">o regístrate con tu correo</div>

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="input-group">
                    <User className="input-icon" size={18} />
                    <input type="text" placeholder="Nombre completo" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <Mail className="input-icon" size={18} />
                    <input type="email" placeholder="Correo electrónico" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <Lock className="input-icon" size={18} />
                    <input type="password" placeholder="Contraseña" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "4px", marginBottom: "8px" }}>
                    <input type="checkbox" id="terms" required style={{ accentColor: COLORS.garnet, width: "16px", height: "16px", cursor: "pointer", marginTop: "2px" }} />
                    <label htmlFor="terms" style={{ fontSize: "0.8rem", color: COLORS.chocolate, cursor: "pointer", lineHeight: 1.4 }}>
                      Acepto los <a href="#" style={{ color: COLORS.garnet, fontWeight: 700, textDecoration: "none" }}>Términos</a> y la <a href="#" style={{ color: COLORS.garnet, fontWeight: 700, textDecoration: "none" }}>Política de Privacidad</a>.
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                  </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.85rem", color: COLORS.chocolate }}>
                  ¿Ya tienes una cuenta?{' '}
                  <button onClick={() => router.push('/login')} style={{ background: "none", border: "none", color: COLORS.garnet, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Inicia sesión
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <Footer />
        
      </div>
    </>
  );
}