"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const stackApp = useStackApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await stackApp.sendForgotPasswordEmail(email);
      if (result.status === "error") {
        throw new Error(result.error.message);
      }
      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Ocurrió un error al enviar el correo. Por favor intenta de nuevo.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFF5E6] via-transparent to-transparent pointer-events-none opacity-80" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8E1B3A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#BC9968]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-[850px] bg-[#FEFCF8]/90 backdrop-blur-md rounded-2xl shadow-2xl z-10 border border-[#F5E6D0] flex flex-col md:flex-row overflow-hidden min-h-[500px]"
      >
        {/* Left Side: Brand Banner */}
        <div className="w-full md:w-[45%] bg-[#FFF5E6] p-8 md:p-12 flex flex-col justify-between items-center text-center border-b md:border-b-0 md:border-r border-[#F5E6D0] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent pointer-events-none" />
          
          {/* Back link at the top (desktop) or inside (mobile) */}
          <div className="w-full text-left hidden md:block">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5A0F24] hover:text-[#8E1B3A] transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Volver al Inicio
            </Link>
          </div>

          <div className="my-auto flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo/logoextendido.png" 
              alt="Emotia Logo" 
              className="h-10 object-contain mb-8 max-w-full"
              style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(4000%) hue-rotate(330deg)" }} 
            />
            <h1 className="text-2xl font-black text-[#3D0A1A] mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-sm text-[#5C3A2E] leading-relaxed max-w-[280px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Regala emociones, personaliza momentos. Te ayudamos a restablecer tu cuenta para que sigas sorprendiendo.
            </p>
          </div>

          <div className="w-full text-center text-xs text-[#B0B0B0] mt-4 md:mt-0 font-medium">
            Seguridad garantizada por Emotia.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-[#FEFCF8]">
          {/* Mobile Back Link */}
          <div className="block md:hidden mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5A0F24] hover:text-[#8E1B3A] transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Volver
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-[#5A0F24]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Recupera tu acceso
                  </h2>
                  <p className="text-sm text-[#5C3A2E]">
                    Introduce la dirección de correo electrónico asociada a tu cuenta de Emotia y te enviaremos un enlace de recuperación.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-bold text-[#5C3A2E] uppercase tracking-widest ml-1">
                      Correo electrónico
                    </label>
                    <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] focus-within:border-[#C13550] transition-colors shadow-sm">
                      <Mail size={18} className="text-[#C13550]" />
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com" 
                        className="w-full outline-none text-sm text-[#5C3A2E] bg-transparent placeholder-[#B0B0B0]" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 rounded-full font-bold text-white text-[0.95rem] bg-[#C13550] hover:bg-[#A32940] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C13550] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99] duration-150"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando enlace...
                      </span>
                    ) : (
                      "Enviar enlace de recuperación"
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm text-[#5C3A2E]">
                    ¿Recordaste tu contraseña?{" "}
                    <Link 
                      href="/?openAuth=login" 
                      className="font-bold text-[#C13550] hover:underline transition-colors"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                    <CheckCircle2 size={36} className="text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#3D0A1A]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    ¡Enlace enviado!
                  </h3>
                  <p className="text-sm text-[#5C3A2E] leading-relaxed max-w-[340px] mx-auto">
                    Hemos enviado un correo de recuperación a <span className="font-bold text-[#5A0F24]">{email}</span>. 
                    Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                  </p>
                </div>

                <div className="bg-[#FFFBF5] border border-[#F5E6D0] p-4 rounded-xl text-xs text-[#5C3A2E] max-w-[340px] mx-auto text-left space-y-1">
                  <p className="font-bold text-[#5A0F24]">¿No recibiste el correo?</p>
                  <p>1. Revisa tu carpeta de spam o correo no deseado.</p>
                  <p>2. Asegúrate de haber escrito correctamente tu dirección.</p>
                  <p>3. Puedes volver a intentarlo en unos minutos.</p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 rounded-full text-sm font-bold text-[#5C3A2E] border border-[#F5E6D0] bg-white hover:bg-[#FFFBF5] transition-colors"
                  >
                    Intentar con otro correo
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#C13550] hover:bg-[#A32940] transition-colors shadow-sm text-center"
                  >
                    Volver al Inicio
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
