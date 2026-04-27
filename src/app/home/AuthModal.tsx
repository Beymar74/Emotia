"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, LockKeyhole, User, X, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useStackApp } from "@stackframe/stack";

// Icono exacto de Google
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [showPassword, setShowPassword] = useState(false);
  
  const stackApp = useStackApp();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setErrorMsg(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowPassword(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const name = formData.get("name") as string; // Optional name

    try {
      if (view === "login") {
        const result = await stackApp.signInWithCredential({ email, password });
        if (result.status === "error") {
            throw new Error(result.error.message);
        }
      } else {
        const result = await stackApp.signUpWithCredential({ email, password });
        if (result.status === "error") {
            throw new Error(result.error.message);
        }
      }
      onClose();
      window.location.href = "/producto";
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const oauthCallbackUrl = new URL(stackApp.urls.oauthCallback, window.location.origin);
      oauthCallbackUrl.searchParams.set("after_auth_return_to", "/producto");
      await stackApp.signInWithOAuth("google", { returnTo: oauthCallbackUrl.toString() });
    } catch (err: any) {
      console.error("Error signing in with Google:", err);
      setErrorMsg("Ocurrió un error al iniciar sesión con Google.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Overlay Oscuro */}
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Contenedor Principal (Ahora Horizontal con max-w-[800px] y flex-row) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative w-full max-w-[800px] bg-[#FEFCF8] rounded-xl shadow-2xl z-10 font-sans flex flex-col md:flex-row overflow-hidden max-h-[95vh]"
          >
            {/* Botón Cerrar Absoluto */}
            <button 
              onClick={onClose} 
              type="button"
              aria-label="Cerrar ventana"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13550] z-20"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* --- LADO IZQUIERDO: Branding y Bienvenida --- */}
            <div className="w-full md:w-[45%] bg-[#FFF5E6] p-8 md:p-10 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#F5E6D0]">
              <img 
                src="/logo/logoextendido.png" 
                alt="Emotia Logo" 
                className="h-10 object-contain mb-6"
                style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(4000%) hue-rotate(330deg)" }} 
              />
              <h2 id="auth-modal-title" className="text-[1.6rem] font-black text-[#3D0A1A] mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Accede a Emotia
              </h2>
              <p className="text-[0.95rem] text-[#5C3A2E] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Inicia sesión o crea tu cuenta para empezar a sorprender a los que más quieres con regalos inolvidables.
              </p>
            </div>

            {/* --- LADO DERECHO: Formulario --- */}
            <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col overflow-y-auto">
              
              {/* Pestañas (Tabs) */}
              <div className="flex w-full border-b border-[#F5E6D0] mb-6 mt-2 md:mt-0">
                <button 
                  type="button"
                  onClick={() => setView("login")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors ${view === "login" ? "border-b-2 border-[#C13550] text-[#C13550]" : "text-[#B0B0B0] hover:text-[#5A0F24]"}`}
                >
                  Iniciar sesión
                </button>
                <button 
                  type="button"
                  onClick={() => setView("register")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors ${view === "register" ? "border-b-2 border-[#C13550] text-[#C13550]" : "text-[#B0B0B0] hover:text-[#5A0F24]"}`}
                >
                  Registrarse
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                
                {/* Campo Nombre (Solo en Registro) */}
                <AnimatePresence mode="popLayout">
                  {view === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest mb-1.5 ml-1">Nombre completo</label>
                      <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                        <User size={18} className="text-[#C13550]" />
                        <input required type="text" name="name" placeholder="Tu nombre" className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Campo Correo Electrónico */}
                <div>
                  <label className="block text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest mb-1.5 ml-1">Correo electrónico</label>
                  <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                    <Mail size={18} className="text-[#C13550]" />
                    <input required type="email" name="email" placeholder="tu@correo.com" className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1 pr-1">
                    <label className="text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest">Contraseña</label>
                    {view === "login" && (
                      <button type="button" className="text-[0.75rem] font-bold text-[#5A0F24] hover:underline focus:outline-none">
                        ¿La olvidaste?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                    <LockKeyhole size={18} className="text-[#C13550]" />
                    <input 
                      required
                      name="password"
                      minLength={8}
                      type={showPassword ? "text" : "password"} 
                      placeholder="Mínimo 8 caracteres" 
                      className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="text-[#B0B0B0] hover:text-[#5A0F24] focus:outline-none"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Botón Principal */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 rounded-full font-bold text-white text-[0.95rem] bg-[#C13550] hover:bg-[#A32940] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C13550] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Cargando..." : (view === "login" ? "Ingresar" : "Crear cuenta")}
                </button>
              </form>

              {/* Divisor */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[#F5E6D0]"></div>
                <span className="text-[0.7rem] font-bold text-[#B0B0B0] uppercase tracking-wider">O continúa con</span>
                <div className="flex-1 h-px bg-[#F5E6D0]"></div>
              </div>

              {/* Botón Google */}
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-full border border-[#F5E6D0] bg-white hover:bg-[#FFFBF5] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5E6D0]"
              >
                <GoogleIcon />
                <span className="text-sm font-bold text-[#5C3A2E]">Google</span>
              </button>

              {/* Texto Inferior Dinámico */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#5C3A2E]">
                  {view === "register" ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
                  <button 
                    type="button"
                    onClick={() => setView(view === "register" ? "login" : "register")} 
                    className="font-bold text-[#C13550] hover:underline focus:outline-none"
                  >
                    {view === "register" ? "Inicia sesión" : "Regístrate"}
                  </button>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}