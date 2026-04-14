import { LockKeyhole, X } from "lucide-react";
import styles from "./AuthModal.module.css";
import { useSession } from "./auth/useSession";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { loginWithGoogle } = useSession();

  if (!isOpen) return null;

  const handleGoogle = () => {
    loginWithGoogle();
    onLoginSuccess?.();
    onClose();
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

        <h2 className={styles.title}>Accede a tu cuenta Emotia</h2>
        <p className={styles.subtitle}>
          Inicia sesión o regístrate con Google para confirmar tu pago, guardar tus pedidos y mantener tu información sincronizada.
        </p>

        <div className={styles.tabRow}>
          <span className={styles.activeTab}>Iniciar sesión</span>
          <span className={styles.inactiveTab}>Registrarse</span>
        </div>

        <button className={styles.googleButton} onClick={handleGoogle}>
          <span className={styles.googleBadge}>G</span>
          Continuar con Google
        </button>

        <div className={styles.divider}>
          <span>Acceso seguro</span>
        </div>

        <p className={styles.footerText}>
          Al continuar, podrás ver tu perfil desde el icono de usuario y confirmar tu compra sin volver a ingresar tus datos.
        </p>
      </div>
    </div>
  );
}
