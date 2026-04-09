"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, Sparkles } from 'lucide-react';
import { useStackApp } from "@stackframe/stack";
import { C as COLORS } from './constants'; // Ajusta la ruta si es necesario

// Ícono de Google
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
  
  // Estados
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Sincronizar la vista y resetear errores cada vez que se abre el modal
  useEffect(() => {
    setError('');
    setSuccess('');
    setView(initialView); 
  }, [initialView, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'register') {
        const result = await stackApp.signUpWithCredential({ email, password });
        if (result.status === 'ok') {
          setSuccess('¡Cuenta creada! Ingresando...');
          // 👇 CAMBIADO A /regalos 👇
          setTimeout(() => { onClose(); window.location.href = '/regalos'; }, 1500);
        } else {
          setError('No se pudo crear la cuenta. Verifica tus datos.');
        }
      } else {
        const result = await stackApp.signInWithCredential({ email, password });
        if (result.status === 'ok') {
          setSuccess('¡Bienvenido de nuevo!');
          // 👇 CAMBIADO A /regalos 👇
          setTimeout(() => { onClose(); window.location.href = '/regalos'; }, 1500);
        } else {
          setError('Credenciales incorrectas. Intenta nuevamente.');
        }
      }
    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      // 👇 CAMBIADO A /regalos 👇
      await stackApp.signInWithOAuth('google', { returnTo: '/regalos' });
    } catch {
      setError('Error al continuar con Google.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .input-field {
              width: 100%; background: transparent; border: none; outline: none;
              padding: 12px 16px 12px 40px; font-size: 0.9rem; color: ${COLORS.choco};
              font-family: 'DM Sans', sans-serif;
            }
            .input-field::placeholder { color: ${COLORS.gray}; opacity: 0.7; }
            .input-group {
              position: relative; background: rgba(245, 230, 208, 0.4);
              border: 1px solid rgba(188, 153, 104, 0.3); border-radius: 12px;
              transition: all 0.3s ease;
            }
            .input-group:focus-within {
              background: white; border-color: ${COLORS.garnet};
              box-shadow: 0 0 0 3px rgba(142, 27, 58, 0.1);
            }
            .input-icon {
              position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
              color: ${COLORS.garnet}; opacity: 0.8; pointer-events: none;
            }
          `}</style>

          {/* BACKDROP OCULTO */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,12,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999 }}
          />

          {/* MODAL */}
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ width: '100%', maxWidth: '440px', pointerEvents: 'auto', margin: '20px' }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '36px', boxShadow: '0 24px 60px rgba(90, 15, 36, 0.2)', position: 'relative', overflow: 'hidden' }}>
                
                {/* Elementos decorativos del fondo del modal */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: `${COLORS.roseLight}`, borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6, pointerEvents: 'none' }} />
                
                {/* Botón de cerrar */}
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(188, 153, 104, 0.1)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: COLORS.choco, transition: 'background 0.2s' }}>
                  <X size={18} strokeWidth={2} />
                </button>

                {/* Cabecera */}
                <div style={{ textAlign: "center", marginBottom: "24px", position: 'relative', zIndex: 2 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.garnet}15, ${COLORS.crimson}10)`, color: COLORS.garnet, marginBottom: 16 }}>
                    <Sparkles size={24} strokeWidth={1.5} />
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: COLORS.choco, marginBottom: "4px" }}>
                    {view === 'register' ? 'Únete a Emotia' : 'Bienvenido de nuevo'}
                  </h2>
                  <p style={{ color: COLORS.gray, fontSize: "0.85rem" }}>
                    {view === 'register' ? 'Ingresa tus datos para empezar a sorprender.' : 'Ingresa a tu espacio emocional.'}
                  </p>
                </div>

                {/* Mensajes de Alerta */}
                {error && <div style={{ background: "rgba(171, 58, 80, 0.1)", border: "1px solid rgba(171, 58, 80, 0.3)", borderRadius: "10px", padding: "10px", color: "#AB3A50", fontSize: "0.82rem", textAlign: "center", marginBottom: "16px" }}>{error}</div>}
                {success && <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "10px", color: "#16a34a", fontSize: "0.82rem", textAlign: "center", marginBottom: "16px" }}>{success}</div>}

                {/* Formulario */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", position: 'relative', zIndex: 2 }}>
                  
                  {view === 'register' && (
                    <div className="input-group">
                      <User className="input-icon" size={18} strokeWidth={1.5} />
                      <input type="text" placeholder="Nombre completo" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  )}

                  <div className="input-group">
                    <Mail className="input-icon" size={18} strokeWidth={1.5} />
                    <input type="email" placeholder="Correo electrónico" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <Lock className="input-icon" size={18} strokeWidth={1.5} />
                    <input type="password" placeholder="Contraseña" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </div>

                  {view === 'register' && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: "4px 0" }}>
                      <input type="checkbox" id="terms" required style={{ accentColor: COLORS.garnet, width: "16px", height: "16px", cursor: "pointer", marginTop: "2px" }} />
                      <label htmlFor="terms" style={{ fontSize: "0.8rem", color: COLORS.choco, cursor: "pointer", lineHeight: 1.4 }}>
                        Acepto los <a href="#" style={{ color: COLORS.garnet, fontWeight: 700, textDecoration: "none" }}>Términos</a> y <a href="#" style={{ color: COLORS.garnet, fontWeight: 700, textDecoration: "none" }}>Privacidad</a>.
                      </label>
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`, color: "white", border: "none", borderRadius: "100px", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 8px 20px rgba(142, 27, 58, 0.2)" }}>
                    {loading ? 'Procesando...' : (view === 'register' ? 'Crear mi cuenta' : 'Ingresar')}
                  </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", color: COLORS.gray, fontSize: "0.8rem", margin: "20px 0" }}>
                  <div style={{ flex: 1, borderBottom: `1px solid ${COLORS.gold}40` }} />
                  <span style={{ padding: "0 12px" }}>o continúa con</span>
                  <div style={{ flex: 1, borderBottom: `1px solid ${COLORS.gold}40` }} />
                </div>

                <button type="button" onClick={handleGoogleAuth} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "12px", background: "white", border: `1px solid ${COLORS.gold}50`, borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: COLORS.choco, cursor: "pointer", transition: "background 0.2s" }}>
                  <GoogleIcon /> Google
                </button>

                <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.85rem", color: COLORS.choco }}>
                  {view === 'register' ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}
                  <button type="button" onClick={() => setView(view === 'register' ? 'login' : 'register')} style={{ background: "none", border: "none", color: COLORS.garnet, fontWeight: 700, cursor: "pointer", textDecoration: "underline", marginLeft: "6px" }}>
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