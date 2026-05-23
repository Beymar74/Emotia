"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  userName?: string | null;
}

const DURATION = 10;

export default function AdminLoadingScreen({ userName }: Props) {
  const [seconds, setSeconds] = useState(DURATION);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const hasUser = Boolean(userName);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#FAF3EC] via-[#f5e8d8] to-[#FAF3EC] overflow-hidden px-8 md:px-16">

      {/* Anillos de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[900px] h-[900px] rounded-full border border-[#BC9968]/15 animate-loading-ring-1" />
        <div className="absolute w-[650px] h-[650px] rounded-full border border-[#BC9968]/25 animate-loading-ring-2" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#BC9968]/30 animate-loading-ring-3" />
        <div className="absolute w-96 h-96 rounded-full bg-[#BC9968]/10 blur-3xl animate-pulse" />
      </div>

      {/* Contenedor Principal Adaptativo */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl w-full">

        {/* COLUMNA IZQUIERDA: Logo Gigante + spinner */}
        <div className="relative flex items-center justify-center animate-logo-fade w-[260px] h-[260px] md:w-[380px] md:h-[380px] flex-shrink-0">
          <svg
            className="absolute animate-spin-slow w-full h-full"
            viewBox="0 0 380 380"
            fill="none"
          >
            <circle
              cx="190" 
              cy="190" 
              r="182"
              stroke="url(#spinner-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="850"
              strokeDashoffset="600"
            />
            <defs>
              <linearGradient id="spinner-grad" x1="0" y1="0" x2="380" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#BC9968" stopOpacity="0" />
                <stop offset="60%" stopColor="#BC9968" stopOpacity="1" />
                <stop offset="100%" stopColor="#d4b483" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="p-6 md:p-10 w-full h-full flex items-center justify-center">
            <Image
              src="/logo/prepe.png"
              alt="PREPE"
              width={290}
              height={290}
              className="object-contain relative z-10 w-full h-full"
              priority
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Información y Carga */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 max-w-md w-full">
          
          {/* Identificador del Panel */}
          <div className="flex flex-col gap-2 animate-logo-fade" style={{ animationDelay: "200ms" }}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#BC9968] font-bold">
              Panel Administrativo
            </p>
          </div>

          {/* Mensaje de bienvenida */}
          <div
            className="flex flex-col gap-1.5 transition-all duration-700"
            style={{ opacity: hasUser ? 1 : 0, transform: hasUser ? "translateY(0)" : "translateY(8px)" }}
          >
            <p className="text-xl font-bold text-[#5A0F24]">
              ¡Bienvenido, <span className="text-[#BC9968]">{userName}</span>!
            </p>
            <p className="text-[12px] text-[#5A0F24]/60 tracking-wide">
              Estamos preparando tu panel de administración
            </p>
          </div>

          {/* Barra de progreso de 10 s */}
          <div className="flex flex-col gap-3 animate-logo-fade w-full" style={{ animationDelay: "400ms" }}>
            <div className="w-full h-[3px] bg-[#BC9968]/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#BC9968] to-[#8E1B3A] rounded-full"
                style={{
                  width: `${((DURATION - seconds) / DURATION) * 100}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>

            {/* Estado + contador */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {hasUser ? (
                  <span className="text-[11px] tracking-widest text-[#5A0F24]/60 uppercase font-medium">
                    Cargando sistema
                  </span>
                ) : (
                  <span className="text-[11px] tracking-widest text-[#BC9968] uppercase font-medium">
                    Verificando acceso
                  </span>
                )}
                <span className="flex gap-[5px]">
                  <span className="w-[4px] h-[4px] rounded-full bg-[#BC9968] animate-dot-1" />
                  <span className="w-[4px] h-[4px] rounded-full bg-[#BC9968] animate-dot-2" />
                  <span className="w-[4px] h-[4px] rounded-full bg-[#BC9968] animate-dot-3" />
                </span>
              </div>
              <span className="text-[11px] font-bold tabular-nums text-[#BC9968]/70">
                {seconds}s
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Líneas decorativas en esquinas */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#BC9968]/30 rounded-tl-sm" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#BC9968]/30 rounded-tr-sm" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#BC9968]/30 rounded-bl-sm" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#BC9968]/30 rounded-tr-sm" />

      <p className="absolute bottom-6 text-[10px] tracking-[0.3em] uppercase text-[#5A0F24]/25">
        Sistema de Gestión Administrativa
      </p>
    </div>
  );
}