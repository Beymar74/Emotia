"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Cake, Eye, EyeOff, LockKeyhole, Mail, User, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "./auth/useSession";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialView?: "login" | "register";
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialView = "login",
}: AuthModalProps) {
  const { loginWithGoogle, loginWithCredential, registerWithCredential } = useSession();
  const getReturnTo = () => {
    if (typeof window === "undefined") return "/producto";
    return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/producto";
  };
  const latestAllowedBirthDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().slice(0, 10);
  }, []);
  const [view, setView] = useState<"login" | "register">(initialView);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildShortDisplayName = (valueNombres: string, valueApellidos: string) => {
    const primerNombre = valueNombres.trim().split(/\s+/).filter(Boolean)[0] || "Usuario";
    const primerApellido = valueApellidos.trim().split(/\s+/).filter(Boolean)[0] || "";
    return [primerNombre, primerApellido].filter(Boolean).join(" ");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView(initialView);
      setError("");
      setShowPassword(false);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [initialView, isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (view === "register") {
        const shortDisplayName = buildShortDisplayName(nombres, apellidos);
        const selectedBirthDate = new Date(`${birthDate}T12:00:00.000Z`);
        const adultLimit = new Date(`${latestAllowedBirthDate}T12:00:00.000Z`);

        if (!nombres.trim() || !apellidos.trim() || !birthDate) {
          setError("Completa nombres, apellidos y fecha de nacimiento.");
          return;
        }

        if (Number.isNaN(selectedBirthDate.getTime()) || selectedBirthDate.getTime() > adultLimit.getTime()) {
          setError("Debes tener al menos 18 anos para crear una cuenta.");
          return;
        }

        const result = await registerWithCredential(shortDisplayName, email, password);

        if (result.status !== "ok") {
          setError("No pudimos crear tu cuenta. Revisa tus datos e intenta otra vez.");
          return;
        }

        const profileResponse = await fetch("/api/auth/catalog/register-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nombres,
            apellidos,
            fechaNacimiento: birthDate,
          }),
        });

        const profileData = (await profileResponse.json()) as {
          needsVerification?: boolean;
          error?: string;
        };

        if (!profileResponse.ok) {
          setError(profileData.error || "No pudimos completar tu registro.");
          return;
        }

        onLoginSuccess?.();
        onClose();
        return;
      }

      const result = await loginWithCredential(email, password);

      if (result.status !== "ok") {
        setError("No pudimos iniciar sesión. Verifica tu correo y contraseña.");
        return;
      }

      onLoginSuccess?.();
      onClose();
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle(getReturnTo());
    } catch {
      setError("No pudimos continuar con Google en este momento.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[1200] flex items-start justify-center p-3 pt-6 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-auth-modal-title"
            className="relative z-10 flex max-h-[95vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[28px] bg-[#FEFCF8] font-sans shadow-2xl md:flex-row"
          >
            <button
              onClick={onClose}
              type="button"
              aria-label="Cerrar ventana"
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-gray-500 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#C13550]"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex w-full flex-col items-center justify-center border-b border-[#F5E6D0] bg-[#FFF5E6] px-5 py-7 text-center md:w-[45%] md:border-r md:border-b-0 md:p-10">
              <Image
                src="/logo/logo-store.png"
                alt="Emotia Store"
                className="mb-5 h-14 w-14 object-contain sm:h-16 sm:w-16"
                width={64}
                height={64}
              />
              <h2
                id="store-auth-modal-title"
                className="mb-3 text-[1.35rem] font-black text-[#3D0A1A] sm:text-[1.6rem]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Accede a Emotia Store
              </h2>
              <p
                className="text-[0.9rem] leading-relaxed text-[#5C3A2E] sm:text-[0.95rem]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Inicia sesión o crea tu cuenta para guardar productos, revisar tu carrito y continuar con tu compra.
              </p>
            </div>

            <div className="flex w-full flex-col overflow-y-auto px-4 py-6 sm:px-6 md:w-[55%] md:p-10">
              <div className="mt-2 mb-5 flex w-full border-b border-[#F5E6D0] md:mt-0 md:mb-6">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors ${
                    view === "login"
                      ? "border-b-2 border-[#C13550] text-[#C13550]"
                      : "text-[#B0B0B0] hover:text-[#5A0F24]"
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors ${
                    view === "register"
                      ? "border-b-2 border-[#C13550] text-[#C13550]"
                      : "text-[#B0B0B0] hover:text-[#5A0F24]"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error ? (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <AnimatePresence mode="popLayout">
                  {view === "register" ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1.5 ml-1 block text-[0.7rem] font-bold tracking-widest text-[#5C3A2E] uppercase">
                            Nombres
                          </span>
                          <span className="flex w-full items-center gap-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] px-4 py-3 transition-colors focus-within:border-[#C13550]">
                            <User size={18} className="text-[#C13550]" />
                            <input
                              value={nombres}
                              onChange={(event) => setNombres(event.target.value)}
                              placeholder="Tus nombres"
                              className="w-full bg-transparent text-sm text-[#5C3A2E] outline-none placeholder:text-[#B0B0B0]"
                              required
                            />
                          </span>
                        </label>

                        <label className="block">
                          <span className="mb-1.5 ml-1 block text-[0.7rem] font-bold tracking-widest text-[#5C3A2E] uppercase">
                            Apellidos
                          </span>
                          <span className="flex w-full items-center gap-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] px-4 py-3 transition-colors focus-within:border-[#C13550]">
                            <User size={18} className="text-[#C13550]" />
                            <input
                              value={apellidos}
                              onChange={(event) => setApellidos(event.target.value)}
                              placeholder="Tus apellidos"
                              className="w-full bg-transparent text-sm text-[#5C3A2E] outline-none placeholder:text-[#B0B0B0]"
                              required
                            />
                          </span>
                        </label>
                      </div>

                      <label className="block">
                        <span className="mb-1.5 ml-1 block text-[0.7rem] font-bold tracking-widest text-[#5C3A2E] uppercase">
                          Fecha de nacimiento
                        </span>
                        <span className="flex w-full items-center gap-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] px-4 py-3 transition-colors focus-within:border-[#C13550]">
                          <Cake size={18} className="text-[#C13550]" />
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(event) => setBirthDate(event.target.value)}
                            max={latestAllowedBirthDate}
                            className="w-full bg-transparent text-sm text-[#5C3A2E] outline-none"
                            required
                          />
                        </span>
                        <span className="mt-1.5 ml-1 block text-[0.76rem] leading-relaxed text-[#9A8A82]">
                          Solo pueden registrarse personas que ya hayan cumplido 18 anos.
                        </span>
                      </label>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <label className="block">
                  <span className="mb-1.5 ml-1 block text-[0.7rem] font-bold tracking-widest text-[#5C3A2E] uppercase">
                    Correo electrónico
                  </span>
                  <span className="flex w-full items-center gap-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] px-4 py-3 transition-colors focus-within:border-[#C13550]">
                    <Mail size={18} className="text-[#C13550]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="tu@gmail.com"
                      className="w-full bg-transparent text-sm text-[#5C3A2E] outline-none placeholder:text-[#B0B0B0]"
                      required
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 ml-1 flex items-center justify-between gap-3 pr-1">
                    <span className="text-[0.7rem] font-bold tracking-widest text-[#5C3A2E] uppercase">
                      Contraseña
                    </span>
                    {view === "login" ? (
                      <button
                        type="button"
                        className="text-[0.75rem] font-bold text-[#5A0F24] hover:underline focus:outline-none"
                      >
                        ¿La olvidaste?
                      </button>
                    ) : null}
                  </span>
                  <span className="flex w-full items-center gap-3 rounded-xl border border-[#F5E6D0] bg-[#FFFBF5] px-4 py-3 transition-colors focus-within:border-[#C13550]">
                    <LockKeyhole size={18} className="text-[#C13550]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-transparent text-sm text-[#5C3A2E] outline-none placeholder:text-[#B0B0B0]"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-[#B0B0B0] hover:text-[#5A0F24] focus:outline-none"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-[#C13550] py-3.5 text-[0.95rem] font-bold text-white shadow-md transition-colors hover:bg-[#A32940] focus:outline-none focus:ring-2 focus:ring-[#C13550] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Procesando..." : view === "register" ? "Crear cuenta" : "Ingresar"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#F5E6D0]" />
                <span className="text-[0.7rem] font-bold tracking-wider text-[#B0B0B0] uppercase">
                  O continúa con
                </span>
                <div className="h-px flex-1 bg-[#F5E6D0]" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#F5E6D0] bg-white py-3 text-sm font-bold text-[#5C3A2E] transition-colors hover:bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#F5E6D0] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#5C3A2E]">
                  {view === "register" ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
                  <button
                    type="button"
                    onClick={() => setView((prev) => (prev === "register" ? "login" : "register"))}
                    className="font-bold text-[#C13550] hover:underline focus:outline-none"
                  >
                    {view === "register" ? "Inicia sesión" : "Regístrate"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
