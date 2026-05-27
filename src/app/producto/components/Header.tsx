"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  Clock3,
  Gift,
  LogIn,
  LogOut,
  Minus,
  PackageSearch,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Truck,
  User2,
  X,
} from "lucide-react";
import styles from "./Header.module.css";
import { useCart } from "./cart/useCart";
import AuthModal from "./AuthModal";
import { useSession } from "./auth/useSession";
import { useUser } from "@stackframe/stack";
import {
  formatLongDate,
  formatOrderCode,
  formatShortDate,
  getOrderStatusMeta,
  type CatalogOrder,
} from "@/lib/catalog-order-status";

type OverviewNotification = {
  id: number;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  leida: boolean;
  createdAt: string;
  referenciaId?: number;
};

type AccountOverview = {
  authenticated: boolean;
  profile?: {
    shortName: string | null;
    email: string;
  };
  summary?: {
    activeOrders: number;
    unreadNotifications: number;
  };
  orders: CatalogOrder[];
  notifications: OverviewNotification[];
  unreadNotifications: number;
};

type HeaderProps = {
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
};

function getNotificationIcon(tipo: string) {
  switch (tipo) {
    case "pedido":
    case "nuevo_pedido":
    case "pedido_aprobado":
    case "actualizacion_pedido":
      return PackageSearch;
    case "pedido_enviado":
      return Truck;
    case "pedido_entregado":
      return CheckCircle2;
    case "pedido_cancelado":
      return CircleSlash;
    case "promo":
      return Gift;
    default:
      return BellRing;
  }
}

// 👇 NUEVA FUNCIÓN: La paleta de colores de "la inge" 👇
function getNotificationColor(tipoOEstadoOTitulo: string) {
  const t = tipoOEstadoOTitulo.toLowerCase();

  if (t.includes("entregado") || t.includes("completado"))
    return { bg: "bg-[#EEF8F0]", border: "border-[#2D7A47]/40", text: "text-[#2D7A47]", badge: "Entregado" };

  if (t.includes("cancelado") || t.includes("fallido") || t.includes("rechazado"))
    return { bg: "bg-[#FBF0F0]", border: "border-[#A32D2D]/40", text: "text-[#A32D2D]", badge: "Cancelado" };

  if (t.includes("enviado") || t.includes("listo") || t.includes("camino"))
    return { bg: "bg-[#E6F3F8]", border: "border-[#1B6A8E]/40", text: "text-[#1B6A8E]", badge: "En camino" };

  if (t.includes("preparacion") || t.includes("actualizacion") || t.includes("confirmacion"))
    return { bg: "bg-[#FFF7E8]", border: "border-[#BC9968]/40", text: "text-[#BC9968]", badge: "En preparación" };

  // Por defecto (Pendiente / Registrado)
  return { bg: "bg-[#FDFBF9]", border: "border-[#8E1B3A]/20", text: "text-[#7A5260]", badge: "Registrado" };
}

export default function Header({
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Buscar regalos, flores, detalles...",
  onSearchChange,
}: HeaderProps) {
  const [isCartHighlighted, setIsCartHighlighted] = useState(false);
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [accountOverview, setAccountOverview] = useState<AccountOverview | null>(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CatalogOrder | null>(null);
  const accountWrapRef = useRef<HTMLDivElement | null>(null);
  const notificationsWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountPanelRef = useRef<HTMLDivElement | null>(null);
  const mobileNotificationsPanelRef = useRef<HTMLDivElement | null>(null);
  const { items, count, subtotal, removeItem, updateQuantity } = useCart();
  const { user, isLoggedIn, isLoggingOut, logout } = useSession();
  const stackUser = useUser();

  const loadAccountOverview = useCallback(async () => {
    if (!isLoggedIn) {
      setAccountOverview(null);
      return;
    }

    setIsOverviewLoading(true);

    try {
      const response = await fetch("/api/auth/catalog/account-overview", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setAccountOverview(null);
        return;
      }

      if (!response.ok) {
        throw new Error("No se pudo cargar la actividad del usuario.");
      }

      const data = (await response.json()) as AccountOverview;
      setAccountOverview(data);
    } catch (error) {
      console.error("Error cargando actividad del catalogo:", error);
    } finally {
      setIsOverviewLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isCartOpen && !isAccountOpen && !isNotificationsOpen && !selectedOrder) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsCartOpen(false);
      setIsAccountOpen(false);
      setIsNotificationsOpen(false);
      setSelectedOrder(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isAccountOpen, isCartOpen, isNotificationsOpen, selectedOrder]);

  useEffect(() => {
    if (!isAccountOpen && !isNotificationsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideAccountMobilePanel = mobileAccountPanelRef.current?.contains(target) ?? false;
      const clickedInsideNotificationsMobilePanel = mobileNotificationsPanelRef.current?.contains(target) ?? false;

      if (
        isAccountOpen &&
        accountWrapRef.current &&
        !accountWrapRef.current.contains(target) &&
        !clickedInsideAccountMobilePanel
      ) {
        setIsAccountOpen(false);
      }

      if (
        isNotificationsOpen &&
        notificationsWrapRef.current &&
        !notificationsWrapRef.current.contains(target) &&
        !clickedInsideNotificationsMobilePanel
      ) {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [isAccountOpen, isNotificationsOpen]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAccountOverview(null);
      setIsNotificationsOpen(false);
      setSelectedOrder(null);
      return;
    }

    void loadAccountOverview();
  }, [isLoggedIn, loadAccountOverview]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const refreshOverview = () => {
      void loadAccountOverview();
    };

    window.addEventListener("focus", refreshOverview);
    return () => window.removeEventListener("focus", refreshOverview);
  }, [isLoggedIn, loadAccountOverview]);

  useEffect(() => {
    let timeoutId: number | undefined;

    const handleCartHighlight = () => {
      setIsCartHighlighted(true);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setIsCartHighlighted(false);
      }, 700);
    };

    const handleCartOpen = () => {
      setIsAccountOpen(false);
      setIsNotificationsOpen(false);
      setIsCartOpen(true);
      handleCartHighlight();
    };

    window.addEventListener("emotia-cart-highlight", handleCartHighlight);
    window.addEventListener("emotia-cart-open", handleCartOpen);

    return () => {
      window.removeEventListener("emotia-cart-highlight", handleCartHighlight);
      window.removeEventListener("emotia-cart-open", handleCartOpen);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const highlightedOrder = useMemo(() => {
    if (!accountOverview?.orders.length) return null;

    return (
      accountOverview.orders.find((order) => {
        const status = order.estado;
        return status === "pendiente" || status === "confirmado" || status === "en_preparacion";
      }) ?? accountOverview.orders[0]
    );
  }, [accountOverview]);

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setIsAccountOpen(true);
    void loadAccountOverview();
    router.refresh();
  };

  const handleLogout = async () => {
    setIsAccountOpen(false);
    setIsNotificationsOpen(false);
    setSelectedOrder(null);
    await logout();
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const openLoginModal = (view: "login" | "register" = "login") => {
    setAuthView(view);
    setIsAuthOpen(true);
    setIsAccountOpen(false);
    setIsNotificationsOpen(false);
  };

  const openOrderDetail = (order: CatalogOrder) => {
    setSelectedOrder(order);
    setIsAccountOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleNotificationClick = async (notification: OverviewNotification) => {
    console.log("🚨 1. Clic detectado en la notificación ID:", notification.id);

    // TRUCO MAGICO: Extraemos el ID del pedido desde el título o mensaje si no hay referenciaId
    let targetOrderId = notification.referenciaId;
    if (!targetOrderId) {
      const match = `${notification.titulo} ${notification.mensaje || ""}`.match(/EM-0*(\d+)/);
      if (match) targetOrderId = parseInt(match[1], 10);
    }

    if (
      notification.tipo.startsWith("pedido") ||
      notification.tipo === "actualizacion_pedido" ||
      notification.tipo === "nuevo_pedido"
    ) {
      const matchingOrder = accountOverview?.orders.find(
        (order) => order.id === targetOrderId
      );

      if (matchingOrder) {
        openOrderDetail(matchingOrder);
      } else if (highlightedOrder) {
        openOrderDetail(highlightedOrder);
      }
    }

    if (notification.leida) return;

    if (
      notification.tipo === "pedido" ||
      notification.tipo === "nuevo_pedido" ||
      notification.tipo === "pedido_aprobado" ||
      notification.tipo === "pedido_enviado" ||
      notification.tipo === "pedido_entregado" ||
      notification.tipo === "pedido_cancelado" ||
      notification.tipo === "actualizacion_pedido"
    ) {
      const matchingOrder = accountOverview?.orders.find(
        (order) => order.id === targetOrderId
      );

      if (matchingOrder) {
        openOrderDetail(matchingOrder);
      } else if (highlightedOrder) {
        openOrderDetail(highlightedOrder);
      }
    }

    if (notification.leida) {
      console.log("🚨 2. La notificación ya estaba leída. Abortando fetch.");
      return;
    }

    console.log("🚨 3. Ejecutando actualización visual (optimista)...");
    setAccountOverview((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        unreadNotifications: Math.max(0, prev.unreadNotifications - 1),
        notifications: prev.notifications.map((n) =>
          n.id === notification.id ? { ...n, leida: true } : n
        ),
      };
    });

    console.log(`🚨 4. Disparando FETCH a: /api/notificaciones/${notification.id}/leer`);
    try {
      const response = await fetch(`/api/notificaciones/${notification.id}/leer`, {
        method: "PATCH",
      });
      console.log("🚨 5. Respuesta recibida del backend. Status HTTP:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🚨 Detalle del error del backend:", errorData);
      }

      await loadAccountOverview();

      setAccountOverview((prev) =>
        prev
          ? {
            ...prev,
            unreadNotifications: Math.max(0, prev.unreadNotifications - 1),
          }
          : prev
      );
    } catch (error) {
      console.error("🚨 6. ERROR FATAL al intentar hacer el fetch:", error);
    }
  };

  const unreadCount = accountOverview?.unreadNotifications ?? 0;
  const activeCount = accountOverview?.summary?.activeOrders ?? 0;

  const accountMenuContent = isLoggedIn && user ? (
    <>
      <div className={styles.accountInfo}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className={styles.accountInfoLabel}>Sesión activa</span>
            <strong style={{ display: "block" }}>{accountOverview?.profile?.shortName || user.name}</strong>
            <span style={{ fontSize: "0.8rem", color: "#8a6f62" }}>{accountOverview?.profile?.email || user.email}</span>
          </div>
          {(() => {
            const role = (stackUser?.clientMetadata as any)?.role;
            const isAdmin = role === 'admin' || stackUser?.primaryEmail?.includes('admin@');
            if (isAdmin) {
              return (
                <span style={{ fontSize: "0.6rem", fontWeight: 900, backgroundColor: "#BC9968", color: "#fff", padding: "2px 6px", borderRadius: 6, letterSpacing: "0.05em" }}>ADMIN</span>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {(() => {
        const role = (stackUser?.clientMetadata as any)?.role;
        const isAdmin = role === 'admin' || stackUser?.primaryEmail?.includes('admin@');

        if (isAdmin) {
          return (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(230, 136, 92, 0.12)" }}>
              <div style={{ fontSize: "0.7rem", color: "#9a8a82", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem" }}>Administración</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`}
                  style={{ justifyContent: "flex-start", padding: "0 1rem", minHeight: "2.5rem", fontSize: "0.85rem" }}
                  onClick={() => {
                    setIsAccountOpen(false);
                    router.push("/admin");
                  }}
                >
                  <Settings size={14} />
                  Panel de Control
                </button>
                <button
                  className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`}
                  style={{ justifyContent: "flex-start", padding: "0 1rem", minHeight: "2.5rem", fontSize: "0.85rem" }}
                  onClick={() => {
                    setIsAccountOpen(false);
                    router.push("/admin/usuarios");
                  }}
                >
                  <User2 size={14} />
                  Gestión de Usuarios
                </button>
              </div>
            </div>
          );
        }
        return null;
      })()}

      <div className={styles.accountMenuActions} style={{ marginTop: "1rem", borderTop: "1px solid rgba(230, 136, 92, 0.12)", paddingTop: "1rem" }}>
        <button
          className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`}
          onClick={() => {
            setIsAccountOpen(false);
            router.push("/mis-pedidos");
          }}
        >
          <PackageSearch size={16} strokeWidth={2} />
          Ver mis pedidos {activeCount > 0 ? `(${activeCount} activos)` : ""}
        </button>
        <button className={styles.accountMenuButton} onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={16} strokeWidth={2} />
          {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
        </button>
      </div>
    </>
  ) : (
    <>
      <div className={styles.accountInfo}>
        <span className={styles.accountInfoLabel}>Cuenta Emotia</span>
        <strong>Invitado</strong>
        <span>Inicia sesion o registrate para seguir tus pedidos y recibir avisos.</span>
      </div>
      <button className={styles.accountMenuButton} onClick={() => openLoginModal("login")}>
        <LogIn size={16} strokeWidth={2} />
        Iniciar sesion
      </button>
      <button
        className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`}
        onClick={() => openLoginModal("register")}
      >
        Registrarse
      </button>
    </>
  );

  // 👇 AQUÍ SE APLICA EL CÓDIGO DE COLORES Y EL DISEÑO RESCATADO 👇
  const notificationMenuContent = (
    <>
      <div className={styles.notificationHeader}>
        <div>
          <p className={styles.notificationEyebrow}>Emotia Store</p>
          <h3>Notificaciones</h3>
        </div>
        <span className={styles.notificationCounter}>
          {unreadCount} sin leer{unreadCount === 1 ? "" : "s"}
        </span>
      </div>

      {isOverviewLoading && !accountOverview ? (
        <p className={styles.notificationEmptyState}>Cargando tus alertas...</p>
      ) : null}

      {accountOverview?.notifications.length ? (
        <div className="flex flex-col gap-3 p-4">
          {accountOverview.notifications.map((notification) => {
            // Buscamos EM-XXXX para saber qué pedido es
            let targetOrderId = notification.referenciaId;
            if (!targetOrderId) {
              const match = `${notification.titulo} ${notification.mensaje || ""}`.match(/EM-0*(\d+)/);
              if (match) targetOrderId = parseInt(match[1], 10);
            }

            const matchingOrder = targetOrderId ? accountOverview.orders.find(o => o.id === targetOrderId) : null;
            const cleanTitle = notification.titulo.split(':')[0].trim();

            // Leemos el color basado en el pedido, o si no hay pedido, basado en el título de la notificación vieja
            const colorStyle = getNotificationColor(matchingOrder ? matchingOrder.estado : `${notification.tipo} ${notification.titulo}`);

            return (
              <article
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${!notification.leida
                  ? `${colorStyle.bg} ${colorStyle.border} shadow-sm`
                  : `bg-white ${colorStyle.border} opacity-80 hover:opacity-100 hover:${colorStyle.bg}`
                  }`}
              >
                {/* Puntito de no leído */}
                {!notification.leida && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#8E1B3A]" />
                )}

                {matchingOrder ? (
                  /* --- DISEÑO DE TARJETA CON PRODUCTO --- */
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start pr-4">
                      <span className="text-[10px] font-bold text-[#8E1B3A] tracking-widest uppercase">
                        PEDIDO EM-{matchingOrder.id.toString().padStart(4, "0")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white border ${colorStyle.border} ${colorStyle.text}`}>
                        {colorStyle.badge}
                      </span>
                    </div>

                    <div className="mt-1">
                      <h4 className="text-sm font-bold text-[#2A0E18] leading-tight">{matchingOrder.primaryProductName}</h4>
                      <p className="text-[11px] text-[#7A5260] mt-0.5">{matchingOrder.brandName}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#7A5260] mt-2 pt-2 border-t border-black/5">
                      <div className="flex items-center gap-3">
                        <span>{formatShortDate(notification.createdAt)}</span>
                        <span>{matchingOrder.itemCount} item{matchingOrder.itemCount > 1 ? "s" : ""}</span>
                      </div>
                      <strong className="text-[#2A0E18]">Bs. {matchingOrder.total.toFixed(2)}</strong>
                    </div>
                  </div>
                ) : (
                  /* --- DISEÑO DE RESPALDO (Avisos antiguos o del sistema) --- */
                  <div className="flex flex-col gap-1.5 pr-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#8E1B3A] tracking-widest uppercase">
                        Emotia Store
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white border ${colorStyle.border} ${colorStyle.text}`}>
                        {colorStyle.badge}
                      </span>
                    </div>
                    <div className="mt-1">
                      <h4 className="text-sm font-bold text-[#2A0E18] leading-tight">{cleanTitle}</h4>
                      <p className="text-xs text-[#7A5260] mt-1 leading-relaxed">{notification.mensaje}</p>
                    </div>
                    <span className="text-[10px] text-[#7A5260] mt-2 pt-2 border-t border-black/5 block">
                      {formatLongDate(notification.createdAt)}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : !isOverviewLoading ? (
        <p className={styles.notificationEmptyState}>
          Cuando un pedido sea aceptado, entregado o cancelado, te avisaremos aqui.
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.headerInner} ${!showSearch ? styles.headerInnerCompact : ""}`}>
          <Link href="/producto" className={styles.brand} aria-label="Ir al inicio de Emotia">
            <img src="/logo/logo-store-expandido.png" alt="Emotia Store" className={styles.brandLogo} />
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
            <div className={styles.accountWrap} ref={accountWrapRef}>
              <button
                className={`${styles.actionButton} ${styles.accountButton}`}
                aria-label="Mi cuenta"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsNotificationsOpen(false);
                  setIsAccountOpen((prev) => !prev);
                }}
              >
                <User2 size={18} strokeWidth={2} />
                {isLoggedIn && user ? <span className={styles.accountName}>{user.name}</span> : null}
                <ChevronDown size={14} strokeWidth={2.2} className={styles.accountChevron} />
              </button>

              {isAccountOpen ? (
                <div className={`${styles.accountMenu} ${styles.desktopPopover}`}>
                  {accountMenuContent}
                </div>
              ) : null}
            </div>

            <div className={styles.notificationsWrap} ref={notificationsWrapRef}>
              <button
                className={`${styles.actionButton} ${styles.notificationButton}`}
                aria-label="Notificaciones"
                onClick={() => {
                  if (!isLoggedIn) {
                    openLoginModal("login");
                    return;
                  }

                  setIsCartOpen(false);
                  setIsAccountOpen(false);
                  setIsNotificationsOpen((prev) => !prev);

                  if (!accountOverview) {
                    void loadAccountOverview();
                  }
                }}
              >
                <Bell size={18} strokeWidth={2} />
                {unreadCount > 0 ? <span className={styles.badge}>{unreadCount}</span> : null}
              </button>

              {isNotificationsOpen ? (
                <div className={`${styles.notificationMenu} ${styles.desktopPopover}`}>
                  {notificationMenuContent}
                </div>
              ) : null}
            </div>

            <button
              className={`${styles.actionButton} ${styles.cartButton} ${isCartHighlighted ? styles.cartButtonHighlight : ""}`}
              aria-label="Carrito"
              data-cart-target="catalog-cart-button"
              onClick={() => {
                setIsAccountOpen(false);
                setIsNotificationsOpen(false);
                setIsCartOpen(true);
              }}
            >
              <ShoppingCart size={18} strokeWidth={2} />
              {count > 0 ? <span className={styles.badge}>{count}</span> : null}
            </button>
          </div>
        </div>
      </header>

      {/* MODALES MÓVILES Y CARRITO SE MANTIENEN IGUAL... */}
      {isAccountOpen ? <button className={styles.mobilePanelOverlay} aria-label="Cerrar panel de cuenta" onClick={() => setIsAccountOpen(false)} /> : null}
      <aside
        ref={mobileAccountPanelRef}
        className={`${styles.mobilePanelDrawer} ${isAccountOpen ? styles.mobilePanelDrawerOpen : ""}`}
        aria-hidden={!isAccountOpen}
      >
        <div className={styles.mobilePanelHeader}>
          <div>
            <p className={styles.cartEyebrow}>Emotia Store</p>
            <h2 className={styles.cartTitle}>Mi cuenta</h2>
          </div>
          <button className={styles.cartCloseButton} aria-label="Cerrar cuenta" onClick={() => setIsAccountOpen(false)}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className={styles.mobilePanelBody}>{accountMenuContent}</div>
      </aside>

      {isNotificationsOpen ? <button className={styles.mobilePanelOverlay} aria-label="Cerrar notificaciones" onClick={() => setIsNotificationsOpen(false)} /> : null}
      <aside
        ref={mobileNotificationsPanelRef}
        className={`${styles.mobilePanelDrawer} ${isNotificationsOpen ? styles.mobilePanelDrawerOpen : ""}`}
        aria-hidden={!isNotificationsOpen}
      >
        <div className={styles.mobilePanelHeader}>
          <div>
            <p className={styles.cartEyebrow}>Emotia Store</p>
            <h2 className={styles.cartTitle}>Notificaciones</h2>
          </div>
          <button className={styles.cartCloseButton} aria-label="Cerrar notificaciones" onClick={() => setIsNotificationsOpen(false)}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className={styles.mobilePanelBody}>{notificationMenuContent}</div>
      </aside>

      {isCartOpen ? <button className={styles.cartOverlay} aria-label="Cerrar carrito" onClick={() => setIsCartOpen(false)} /> : null}

      <aside className={`${styles.cartDrawer} ${isCartOpen ? styles.cartDrawerOpen : ""}`} aria-hidden={!isCartOpen}>
        <div className={styles.cartDrawerHeader}>
          <div>
            <p className={styles.cartEyebrow}>Emotia Store</p>
            <h2 className={styles.cartTitle}>Tu carrito</h2>
            <p className={styles.cartSubtitle}>
              {count === 0
                ? "Aun no agregaste productos."
                : `${count} producto${count > 1 ? "s" : ""} listo${count > 1 ? "s" : ""} para pagar`}
            </p>
          </div>
          <button className={styles.cartCloseButton} aria-label="Cerrar carrito" onClick={() => setIsCartOpen(false)}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.cartEmpty}>
            <ShoppingCart size={26} strokeWidth={2} />
            <h3>Tu carrito esta vacio</h3>
            <p>Agrega productos desde el catalogo y apareceran aqui.</p>
            <Link href="/producto" className={styles.cartEmptyButton} onClick={() => setIsCartOpen(false)}>
              Ver catalogo
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

      {selectedOrder ? (
        <div className={styles.trackingLayer}>
          <button className={styles.trackingOverlay} aria-label="Cerrar seguimiento" onClick={() => setSelectedOrder(null)} />
          <div className={styles.trackingModal}>
            <div className={styles.trackingHeader}>
              <div>
                <p className={styles.trackingEyebrow}>Seguimiento del pedido</p>
                <h3>{formatOrderCode(selectedOrder.id)}</h3>
              </div>
              <button
                type="button"
                className={styles.trackingCloseButton}
                aria-label="Cerrar seguimiento"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className={styles.trackingHero}>
              <div className={styles.trackingThumb}>
                {selectedOrder.productImageUrl ? (
                  <img src={selectedOrder.productImageUrl} alt={selectedOrder.primaryProductName} className={styles.trackingThumbImage} />
                ) : (
                  <div className={styles.trackingThumbFallback}>{selectedOrder.primaryProductName.slice(0, 1)}</div>
                )}
              </div>

              <div className={styles.trackingHeroText}>
                <span className={`${styles.orderStatusBadge} ${styles[`orderStatus${getOrderStatusMeta(selectedOrder.estado).tone}`]}`}>
                  {getOrderStatusMeta(selectedOrder.estado).label}
                </span>
                <strong>{selectedOrder.primaryProductName}</strong>
                <span>{selectedOrder.brandName}</span>
                <p>{getOrderStatusMeta(selectedOrder.estado).helper}</p>
              </div>
            </div>

            <div className={styles.trackingMetaGrid}>
              <div className={styles.trackingMetaCard}>
                <span>Fecha</span>
                <strong>{formatLongDate(selectedOrder.createdAt)}</strong>
              </div>
              <div className={styles.trackingMetaCard}>
                <span>Total</span>
                <strong>Bs. {selectedOrder.total.toFixed(2)}</strong>
              </div>
            </div>


            {/* 👇 MURO DE EVIDENCIAS (NUEVO) 👇 */}
            {selectedOrder.bitacora && selectedOrder.bitacora.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 900, color: '#8E1B3A', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  📸 Actualizaciones del Proveedor
                </p>
                {selectedOrder.bitacora.map((evidencia: any) => (
                  <div key={evidencia.id} style={{ padding: '1rem', backgroundColor: '#FDFBF9', border: '1px solid rgba(230, 136, 92, 0.2)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <strong style={{ color: '#2A0E18', fontSize: '0.95rem' }}>{evidencia.titulo}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#9a8a82' }}>{new Date(evidencia.fecha).toLocaleDateString()}</span>
                    </div>
                    {evidencia.mensaje && <p style={{ fontSize: '0.85rem', color: '#7A5260', margin: '0 0 0.8rem 0', lineHeight: 1.5 }}>{evidencia.mensaje}</p>}
                    {evidencia.imagenUrl && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <img src={evidencia.imagenUrl} alt="Evidencia" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', backgroundColor: '#fff' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 👆 FIN MURO DE EVIDENCIAS 👆 */}


            {selectedOrder.estado === "cancelado" ? (
              <div className={styles.trackingCancelled} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <CircleSlash size={18} strokeWidth={2} />
                  <strong style={{ fontSize: '0.9rem' }}>Este pedido fue cancelado.</strong>
                </div>

                {/* 👇 AQUÍ MOSTRAMOS EL MOTIVO 👇 */}
                {(selectedOrder as any).rejectionReason ? (
                  <p style={{ marginTop: '0.5rem', backgroundColor: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(176, 69, 63, 0.2)' }}>
                    <span style={{ fontWeight: 'bold' }}>Motivo:</span> {(selectedOrder as any).rejectionReason}
                  </p>
                ) : (
                  <p style={{ marginTop: '0.2rem' }}>Si necesitas ayuda, contacta a la marca para más detalles.</p>
                )}
              </div>
            ) : (
              <div className={styles.trackingSteps}>
                <div className={styles.trackingStep}>
                  <div
                    className={`${styles.trackingStepIcon} ${getOrderStatusMeta(selectedOrder.estado).step >= 1 ? styles.trackingStepDone : ""
                      }`}
                  >
                    <Clock3 size={16} strokeWidth={2} />
                  </div>
                  <div className={styles.trackingStepText}>
                    <strong>Pedido recibido</strong>
                    <span>Emotia registro tu compra correctamente.</span>
                  </div>
                </div>

                <div className={styles.trackingStep}>
                  <div
                    className={`${styles.trackingStepIcon} ${getOrderStatusMeta(selectedOrder.estado).step >= 2 ? styles.trackingStepDone : ""
                      }`}
                  >
                    <Truck size={16} strokeWidth={2} />
                  </div>
                  <div className={styles.trackingStepText}>
                    <strong>Preparacion y confirmacion</strong>
                    <span>La empresa acepta tu pedido y lo deja listo para avanzar.</span>
                  </div>
                </div>

                <div className={styles.trackingStep}>
                  <div
                    className={`${styles.trackingStepIcon} ${getOrderStatusMeta(selectedOrder.estado).step >= 3 ? styles.trackingStepDone : ""
                      }`}
                  >
                    <CheckCircle2 size={16} strokeWidth={2} />
                  </div>
                  <div className={styles.trackingStepText}>
                    <strong>Pedido entregado</strong>
                    <span>Te avisaremos por la campana cuando llegue o si hubiera un cambio importante.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        initialView={authView}
      />
    </>
  );
}