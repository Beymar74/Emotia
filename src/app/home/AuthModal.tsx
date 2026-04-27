"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, LockKeyhole, User, X, Eye, EyeOff } from "lucide-react";

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

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* 👇 AQUÍ ESTÁ LA MAGIA: z-[9999] PARA QUE TAPE AL NAVBAR 👇 */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        
        {/* Overlay Oscuro Desenfocado */}
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        />

        {/* Contenedor Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-[420px] bg-[#FEFCF8] rounded-3xl p-8 shadow-2xl z-10 font-sans"
        >
          {/* Botón Cerrar (X) */}
          <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* Logo Limpio (Sin círculo) */}
          <div className="flex justify-center mb-6 mt-2">
            <img 
              src="/logo/logoextendido.png" 
              alt="Emotia Logo" 
              className="h-9 object-contain" // Lo hice un poquitito más grande (h-9) para que destaque mejor
              style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(4000%) hue-rotate(330deg)" }}
            />
          </div>

          {/* Textos del Encabezado */}
          <div className="text-center mb-6">
            <h2 className="text-[1.6rem] font-black text-[#3D0A1A] mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Accede a Emotia
            </h2>
            <p className="text-[0.9rem] text-[#5C3A2E] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Inicia sesión o crea tu cuenta para empezar a sorprender a los que más quieres.
            </p>
          </div>

          {/* Pestañas (Tabs) Iniciar sesión / Registrarse */}
          <div className="flex w-full border-b border-[#F5E6D0] mb-6">
            <button 
              onClick={() => setView("login")}
              className={`flex-1 pb-3 text-sm font-bold transition-colors ${view === "login" ? "border-b-2 border-[#C13550] text-[#C13550]" : "text-[#B0B0B0] hover:text-[#5A0F24]"}`}
            >
              Iniciar sesión
            </button>
            <button 
              onClick={() => setView("register")}
              className={`flex-1 pb-3 text-sm font-bold transition-colors ${view === "register" ? "border-b-2 border-[#C13550] text-[#C13550]" : "text-[#B0B0B0] hover:text-[#5A0F24]"}`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            
            {/* Campo Nombre (Solo en Registro) */}
            {view === "register" && (
              <div>
                <label className="block text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest mb-1.5 ml-1">Nombre completo</label>
                <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                  <User size={18} className="text-[#C13550]" />
                  <input type="text" placeholder="Tu nombre" className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" />
                </div>
              </div>
            )}

            {/* Campo Correo Electrónico */}
            <div>
              <label className="block text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest mb-1.5 ml-1">Correo electrónico</label>
              <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                <Mail size={18} className="text-[#C13550]" />
                <input type="email" placeholder="tu@correo.com" className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1 pr-1">
                <label className="text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest">Contraseña</label>
                {view === "login" && <span className="text-[0.75rem] font-bold text-[#5A0F24] cursor-pointer hover:underline">¿La olvidaste?</span>}
              </div>
              <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors">
                <LockKeyhole size={18} className="text-[#C13550]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mínimo 8 caracteres" 
                  className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#B0B0B0] hover:text-[#5A0F24]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botón Principal */}
            <button className="w-full py-3.5 mt-2 rounded-full font-bold text-white text-[0.95rem] bg-[#C13550] hover:bg-[#A32940] transition-colors shadow-md">
              {view === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#F5E6D0]"></div>
            <span className="text-[0.7rem] font-bold text-[#B0B0B0] uppercase tracking-wider">O continúa con</span>
            <div className="flex-1 h-px bg-[#F5E6D0]"></div>
          </div>

          {/* Botón Google */}
          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-full border border-[#F5E6D0] bg-white hover:bg-[#FFFBF5] transition-colors">
            <GoogleIcon />
            <span className="text-sm font-bold text-[#5C3A2E]">Google</span>
          </button>

          {/* Texto Inferior Dinámico */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#5C3A2E]">
              {view === "register" ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
              <button onClick={() => setView(view === "register" ? "login" : "register")} className="font-bold text-[#C13550] hover:underline">
                {view === "register" ? "Inicia sesión" : "Regístrate"}
              </button>
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}