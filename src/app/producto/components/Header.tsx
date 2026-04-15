"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogIn, Minus, Search, ShoppingCart, Trash2, User2, X, Plus, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from './cart/useCart';
import AuthModal from './AuthModal';
import { useSession } from './auth/useSession';

type HeaderProps = {
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
};

export default function Header({
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Buscar regalos, flores, detalles...",
  onSearchChange,
}: HeaderProps) {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const { items, count, subtotal, removeItem, updateQuantity } = useCart();
  const { user, isLoggedIn, isLoggingOut, logout } = useSession();

  useEffect(() => {
    if (!isCartOpen && !isAccountOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCartOpen(false);
      if (event.key === "Escape") setIsAccountOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isCartOpen, isAccountOpen]);

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setIsAccountOpen(true);
    router.refresh();
  };

  const handleLogout = async () => {
    setIsAccountOpen(false);
    await logout();
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.headerInner} ${!showSearch ? styles.headerInnerCompact : ''}`}>
          <Link href="/producto" className={styles.brand} aria-label="Ir al inicio de Emotia">
            <img
              src="/logo/logo-store-expandido.png"
              alt="Emotia Store"
              className={styles.brandLogo}
            />
          </Link>

          {showSearch ? (
            <label className={styles.searchShell} aria-label="Buscar regalos">
              <Search size={18} strokeWidth={2} className={styles.searchIcon} />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
              />
            </label>
          ) : null}

          <div className={styles.actions}>
            <div className={styles.accountWrap}>
              <button
                className={`${styles.actionButton} ${styles.accountButton}`}
                aria-label="Mi cuenta"
                onClick={() => setIsAccountOpen((prev) => !prev)}
              >
                <User2 size={18} strokeWidth={2} />
                {isLoggedIn && user ? (
                  <span className={styles.accountName}>{user.name}</span>
                ) : null}
                <ChevronDown size={14} strokeWidth={2.2} className={styles.accountChevron} />
              </button>

              {isAccountOpen ? (
                <div className={styles.accountMenu}>
                  {isLoggedIn && user ? (
                    <>
                      <div className={styles.accountInfo}>
                        <span className={styles.accountInfoLabel}>Sesión activa</span>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <button className={styles.accountMenuButton} onClick={handleLogout} disabled={isLoggingOut}>
                        <LogOut size={16} strokeWidth={2} />
                        {isLoggingOut ? "Cerrando..." : "Log out"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.accountInfo}>
                        <span className={styles.accountInfoLabel}>Cuenta Emotia</span>
                        <strong>Invitado</strong>
                        <span>Inicia sesión o regístrate con Google</span>
                      </div>
                      <button className={styles.accountMenuButton} onClick={() => { setAuthView("login"); setIsAuthOpen(true); setIsAccountOpen(false); }}>
                        <LogIn size={16} strokeWidth={2} />
                        Iniciar sesión
                      </button>
                      <button className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`} onClick={() => { setAuthView("register"); setIsAuthOpen(true); setIsAccountOpen(false); }}>
                        Registrarse
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            <button
              className={`${styles.actionButton} ${styles.cartButton}`}
              aria-label="Carrito"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={18} strokeWidth={2} />
              <span className={styles.badge}>{count}</span>
            </button>
          </div>
        </div>
      </header>

      {isCartOpen ? <button className={styles.cartOverlay} aria-label="Cerrar carrito" onClick={() => setIsCartOpen(false)} /> : null}

      <aside className={`${styles.cartDrawer} ${isCartOpen ? styles.cartDrawerOpen : ''}`} aria-hidden={!isCartOpen}>
        <div className={styles.cartDrawerHeader}>
          <div>
            <p className={styles.cartEyebrow}>Emotia Store</p>
            <h2 className={styles.cartTitle}>Tu carrito</h2>
            <p className={styles.cartSubtitle}>
              {count === 0 ? "Aún no agregaste productos." : `${count} producto${count > 1 ? "s" : ""} listo${count > 1 ? "s" : ""} para pagar`}
            </p>
          </div>
          <button className={styles.cartCloseButton} aria-label="Cerrar carrito" onClick={() => setIsCartOpen(false)}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.cartEmpty}>
            <ShoppingCart size={26} strokeWidth={2} />
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos desde el catálogo y aparecerán aquí.</p>
            <Link href="/producto" className={styles.cartEmptyButton} onClick={() => setIsCartOpen(false)}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartTopSummary}>
              <div className={styles.cartMetric}>
                <span className={styles.cartMetricLabel}>Productos</span>
                <strong>{count}</strong>
              </div>
              <div className={styles.cartMetric}>
                <span className={styles.cartMetricLabel}>Estado</span>
                <strong>Listo para pagar</strong>
              </div>
            </div>

            <div className={styles.cartItems}>
              {items.map((item) => (
                <article key={item.id} className={styles.cartItem}>
                  <Link href={`/producto/${item.id}`} className={styles.cartThumb} onClick={() => setIsCartOpen(false)}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={styles.cartThumbImage} />
                    ) : (
                      <div className={styles.cartThumbPlaceholder}>Sin imagen</div>
                    )}
                  </Link>

                  <div className={styles.cartItemContent}>
                    <div className={styles.cartItemTop}>
                      <div>
                        <h3 className={styles.cartItemName}>{item.name}</h3>
                        <p className={styles.cartItemMeta}>{item.subtitle || item.brand}</p>
                      </div>
                      <button
                        className={styles.cartRemoveButton}
                        aria-label={`Eliminar ${item.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>

                    <div className={styles.cartItemBottom}>
                      <div className={styles.quantityWrap}>
                        <span className={styles.quantityLabel}>Cantidad</span>
                        <div className={styles.quantityControl}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Restar ${item.name}`}>
                            <Minus size={14} strokeWidth={2} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Sumar ${item.name}`}>
                            <Plus size={14} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.cartPriceBlock}>
                        <span className={styles.cartPriceLabel}>Total</span>
                        <p className={styles.cartItemPrice}>Bs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.cartSummaryRow}>
                <span>Subtotal</span>
                <strong>Bs. {subtotal.toFixed(2)}</strong>
              </div>
              <p className={styles.cartFooterNote}>Los detalles de la tarjeta personalizada se conservan al pagar.</p>
              <button type="button" className={styles.cartCheckoutButton} onClick={handleCheckout}>
                Ir a pagar
              </button>
            </div>
          </>
        )}
      </aside>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        initialView={authView}
      />
    </>
  );
}
