"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, Sparkles } from 'lucide-react';
import { useStackApp } from "@stackframe/stack";

// NUEVA PALETA DE COLORES DE BEYMAR
const P = {
  granate: "#8E1B3A", bordo: "#5A0F24", carmesi: "#AB3A50", chocolate: "#5C3A2E",
  dorado: "#BC9968", beige: "#F5E6D0", blanco: "#FFFFFF", gris: "#B0B0B0"
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialView = 'register' }: AuthModalProps) {
  const stackApp = useStackApp();
  
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    setError(''); setSuccess(''); setView(initialView); 
  }, [initialView, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);

    try {
      if (view === 'register') {
        const result = await stackApp.signUpWithCredential({ email, password });
        if (result.status === 'ok') {
          setSuccess('¡Cuenta creada! Ingresando...');
          setTimeout(() => { onClose(); window.location.href = '/producto'; }, 1500);
        } else setError('No se pudo crear la cuenta. Verifica tus datos.');
      } else {
        const result = await stackApp.signInWithCredential({ email, password });
        if (result.status === 'ok') {
          setSuccess('¡Bienvenido de nuevo!');
          setTimeout(() => { onClose(); window.location.href = '/producto'; }, 1500);
        } else setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try { await stackApp.signInWithOAuth('google', { returnTo: '/producto' }); } 
    catch { setError('Error al continuar con Google.'); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .auth-input-field {
              width: 100%; background: transparent; border: none; outline: none;
              padding: 14px 16px 14px 44px; font-size: 0.95rem; color: ${P.chocolate};
              font-family: 'DM Sans', sans-serif;
            }
            .auth-input-field::placeholder { color: ${P.gris}; opacity: 0.8; }
            .auth-input-group {
              position: relative; background: ${P.beige}30;
              border: 1.5px solid ${P.beige}; border-radius: 16px;
              transition: all 0.3s ease;
            }
            .auth-input-group:focus-within {
              background: ${P.blanco}; border-color: ${P.granate};
              box-shadow: 0 0 0 4px ${P.granate}15;
            }
            .auth-input-icon {
              position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
              color: ${P.dorado}; pointer-events: none;
            }
          `}</style>

          {/* BACKDROP */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,12,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999 }}
          />

          {/* MODAL */}
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, pointerEvents: 'none' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ width: '100%', maxWidth: '440px', pointerEvents: 'auto', margin: '20px' }}
            >
              <div style={{ background: P.blanco, borderRadius: '32px', padding: '40px 36px', boxShadow: `0 24px 60px ${P.bordo}40`, position: 'relative', overflow: 'hidden' }}>
                
                <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: P.beige, borderRadius: '50%', filter: 'blur(50px)', opacity: 0.5, pointerEvents: 'none' }} />
                
                <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: `${P.beige}60`, border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: P.chocolate, transition: 'background 0.2s' }}>
                  <X size={20} strokeWidth={2} />
                </button>

                <div style={{ textAlign: "center", marginBottom: "32px", position: 'relative', zIndex: 2 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: `${P.beige}40`, color: P.granate, marginBottom: 16 }}>
                    <Sparkles size={28} strokeWidth={1.5} />
                  </div>
                  <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.8rem", fontWeight: 900, color: P.bordo, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                    {view === 'register' ? 'Únete a Emotia' : 'Bienvenido de nuevo'}
                  </h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: P.chocolate, fontSize: "0.95rem" }}>
                    {view === 'register' ? 'Ingresa tus datos para empezar a sorprender.' : 'Ingresa a tu espacio emocional.'}
                  </p>
                </div>

                {error && <div style={{ background: `${P.granate}10`, border: `1px solid ${P.granate}30`, borderRadius: "12px", padding: "12px", color: P.granate, fontSize: "0.85rem", textAlign: "center", marginBottom: "20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{error}</div>}
                {success && <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "12px", padding: "12px", color: "#16a34a", fontSize: "0.85rem", textAlign: "center", marginBottom: "20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", position: 'relative', zIndex: 2 }}>
                  {view === 'register' && (
                    <div className="auth-input-group">
                      <User className="auth-input-icon" size={18} strokeWidth={2} />
                      <input type="text" placeholder="Nombre completo" className="auth-input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  )}

                  <div className="auth-input-group">
                    <Mail className="auth-input-icon" size={18} strokeWidth={2} />
                    <input type="email" placeholder="Correo electrónico" className="auth-input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={18} strokeWidth={2} />
                    <input type="password" placeholder="Contraseña" className="auth-input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </div>

                  {view === 'register' && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", margin: "4px 0" }}>
                      <input type="checkbox" id="terms" required style={{ accentColor: P.granate, width: "18px", height: "18px", cursor: "pointer", marginTop: "2px" }} />
                      <label htmlFor="terms" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: P.chocolate, cursor: "pointer", lineHeight: 1.5 }}>
                        Acepto los <span style={{ color: P.granate, fontWeight: 700 }}>Términos</span> y <span style={{ color: P.granate, fontWeight: 700 }}>Privacidad</span>.
                      </label>
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg, ${P.granate}, ${P.carmesi})`, color: P.blanco, border: "none", borderRadius: "100px", padding: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.3s ease", boxShadow: `0 8px 25px ${P.granate}40`, marginTop: "8px" }}>
                    {loading ? 'Procesando...' : (view === 'register' ? 'Crear mi cuenta' : 'Ingresar')}
                  </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", color: P.gris, fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", margin: "24px 0" }}>
                  <div style={{ flex: 1, borderBottom: `1px solid ${P.beige}` }} />
                  <span style={{ padding: "0 16px" }}>o continúa con</span>
                  <div style={{ flex: 1, borderBottom: `1px solid ${P.beige}` }} />
                </div>

                <button type="button" onClick={handleGoogleAuth} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "14px", background: P.blanco, border: `1.5px solid ${P.beige}`, borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: P.chocolate, cursor: "pointer", transition: "all 0.3s ease" }} onMouseEnter={e => e.currentTarget.style.borderColor = P.dorado} onMouseLeave={e => e.currentTarget.style.borderColor = P.beige}>
                  <GoogleIcon /> Google
                </button>

                <div style={{ marginTop: "28px", textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: P.chocolate }}>
                  {view === 'register' ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}
                  <button type="button" onClick={() => setView(view === 'register' ? 'login' : 'register')} style={{ background: "none", border: "none", color: P.granate, fontWeight: 800, cursor: "pointer", textDecoration: "underline", marginLeft: "8px", fontSize: "0.9rem" }}>
                    {view === 'register' ? 'Inicia sesión' : 'Regístrate aquí'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}