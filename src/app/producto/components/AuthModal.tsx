"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, User, X } from "lucide-react";
import styles from "./AuthModal.module.css";
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
  const [view, setView] = useState<"login" | "register">(initialView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView(initialView);
      setError("");
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result =
        view === "register"
          ? await registerWithCredential(name, email, password)
          : await loginWithCredential(email, password);

      if (result.status === "ok") {
        onLoginSuccess?.();
        onClose();
        return;
      }

      setError(
        view === "register"
          ? "No pudimos crear tu cuenta. Revisa tus datos e intenta otra vez."
          : "No pudimos iniciar sesión. Verifica tu correo y contraseña."
      );
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
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Acceso a tu cuenta">
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar">
          <X size={22} strokeWidth={2.2} />
        </button>

        <div className={styles.iconWrap}>
          <LockKeyhole size={30} strokeWidth={2.1} />
        </div>

        <h2 className={styles.title}>Accede a Emotia Store</h2>
        <p className={styles.subtitle}>
          Inicia sesión o crea tu cuenta para guardar productos, revisar tu carrito y continuar con tu compra.
        </p>

        <div className={styles.tabRow}>
          <button type="button" className={`${styles.tabButton} ${view === "login" ? styles.activeTab : ""}`} onClick={() => setView("login")}>
            Iniciar sesión
          </button>
          <button type="button" className={`${styles.tabButton} ${view === "register" ? styles.activeTab : ""}`} onClick={() => setView("register")}>
            Registrarse
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {view === "register" ? (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nombre completo</span>
              <span className={styles.inputWrap}>
                <User size={18} strokeWidth={1.8} className={styles.inputIcon} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  className={styles.input}
                  required
                />
              </span>
            </label>
          ) : null}

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Correo electrónico</span>
            <span className={styles.inputWrap}>
              <Mail size={18} strokeWidth={1.8} className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                className={styles.input}
                required
              />
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldMeta}>
              <span className={styles.fieldLabel}>Contraseña</span>
              {view === "login" ? <span className={styles.helperLink}>¿La olvidaste?</span> : null}
            </span>
            <span className={styles.inputWrap}>
              <LockKeyhole size={18} strokeWidth={1.8} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={styles.input}
                required
                minLength={8}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
              </button>
            </span>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? "Procesando..." : view === "register" ? "Crear cuenta" : "Ingresar"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>o continúa con</span>
        </div>

        <button className={styles.googleButton} onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Google
        </button>

        <p className={styles.footerText}>
          {view === "register" ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}
          <button
            type="button"
            className={styles.footerSwitch}
            onClick={() => setView((prev) => (prev === "register" ? "login" : "register"))}
          >
            {view === "register" ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}
