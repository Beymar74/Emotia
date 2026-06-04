"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { PasswordReset } from "@stackframe/stack";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Formulario que extrae los parámetros de la URL de forma segura en cliente
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  return <PasswordReset searchParams={params} />;
}

export default function ResetPasswordPage() {
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
              Restablecer contraseña
            </h1>
            <p className="text-sm text-[#5C3A2E] leading-relaxed max-w-[280px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Define tu nueva contraseña para volver a acceder a tu cuenta y seguir creando momentos inolvidables.
            </p>
          </div>

          <div className="w-full text-center text-xs text-[#B0B0B0] mt-4 md:mt-0 font-medium">
            Seguridad garantizada por Emotia.
          </div>
        </div>

        {/* Right Side: PasswordReset Component */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-[#FEFCF8] overflow-y-auto">
          {/* Mobile Back Link */}
          <div className="block md:hidden mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5A0F24] hover:text-[#8E1B3A] transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Volver
            </Link>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-xl font-bold text-[#5A0F24]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Nueva contraseña
              </h2>
              <p className="text-sm text-[#5C3A2E]">
                Ingresa una contraseña segura y confírmala para guardar los cambios.
              </p>
            </div>

            {/* Custom Styling scope for Stack pre-built UI */}
            <div className="stack-reset-container rounded-xl overflow-hidden [&_button]:!bg-[#C13550] [&_button]:hover:!bg-[#A32940] [&_button]:!rounded-full [&_button]:!py-3.5 [&_button]:!font-bold [&_button]:!transition-colors [&_input]:!rounded-xl [&_input]:!border-[#F5E6D0] [&_input]:!bg-[#FFFBF5] [&_input]:focus:!border-[#C13550] [&_label]:!text-[#5C3A2E] [&_label]:!font-bold [&_label]:!text-xs">
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <svg className="animate-spin h-8 w-8 text-[#C13550]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              }>
                <ResetPasswordForm />
              </Suspense>
            </div>

            <div className="text-center pt-4 border-t border-[#F5E6D0]/50">
              <Link 
                href="/?openAuth=login" 
                className="text-xs font-bold text-[#C13550] hover:underline uppercase tracking-wider transition-colors"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
