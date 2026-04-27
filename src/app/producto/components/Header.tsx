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
      return PackageSearch;
    case "promo":
      return Gift;
    default:
      return BellRing;
  }
}

export default function Header({
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Buscar regalos, flores, detalles...",
  onSearchChange,
}: HeaderProps) {
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

  const unreadCount = accountOverview?.unreadNotifications ?? 0;
  const activeCount = accountOverview?.summary?.activeOrders ?? 0;
  const accountMenuContent = isLoggedIn && user ? (
    <>
      <div className={styles.accountInfo}>
        <span className={styles.accountInfoLabel}>Sesion activa</span>
        <strong>{accountOverview?.profile?.shortName || user.name}</strong>
        <span>{accountOverview?.profile?.email || user.email}</span>
      </div>

      <div className={styles.accountSection}>
        <div className={styles.accountSectionHeader}>
          <div>
            <strong>Mis pedidos</strong>
            <span>
              {activeCount > 0
                ? `${activeCount} pedido${activeCount === 1 ? "" : "s"} en movimiento`
                : "Revisa tus compras y el estado de cada entrega"}
            </span>
          </div>
          <button
            type="button"
            className={styles.accountLinkButton}
            onClick={() => {
              setIsAccountOpen(false);
              router.push("/mis-pedidos");
            }}
          >
            Ver todos
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>

        {isOverviewLoading && !accountOverview ? (
          <p className={styles.accountEmptyState}>Cargando tus pedidos...</p>
        ) : null}

        {accountOverview?.orders.length ? (
          <div className={styles.orderList}>
            {accountOverview.orders.map((order) => {
              const statusMeta = getOrderStatusMeta(order.estado);

              return (
                <article key={order.id} className={styles.orderCard}>
                  <div className={styles.orderCardTop}>
                    <div className={styles.orderCardText}>
                      <span className={styles.orderCode}>Pedido {formatOrderCode(order.id)}</span>
                      <strong>{order.primaryProductName}</strong>
                      <span>{order.brandName}</span>
                    </div>
                    <span
                      className={`${styles.orderStatusBadge} ${styles[`orderStatus${statusMeta.tone}`]}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className={styles.orderCardMeta}>
                    <span>{formatShortDate(order.createdAt)}</span>
                    <span>{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
                    <strong>Bs. {order.total.toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    className={styles.orderActionButton}
                    onClick={() => openOrderDetail(order)}
                  >
                    {statusMeta.actionLabel}
                    <ArrowRight size={14} strokeWidth={2} />
                  </button>
                </article>
              );
            })}
          </div>
        ) : !isOverviewLoading ? (
          <p className={styles.accountEmptyState}>
            Cuando hagas tu primera compra, aqui veras tus productos y el estado del pedido.
          </p>
        ) : null}
      </div>

      <div className={styles.accountMenuActions}>
        <button
          className={`${styles.accountMenuButton} ${styles.accountMenuButtonSoft}`}
          onClick={() => {
            setIsAccountOpen(false);
            router.push("/mis-pedidos");
          }}
        >
          <PackageSearch size={16} strokeWidth={2} />
          Mis pedidos
        </button>
        <button className={styles.accountMenuButton} onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={16} strokeWidth={2} />
          {isLoggingOut ? "Cerrando..." : "Log out"}
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
        <div className={styles.notificationList}>
          {accountOverview.notifications.map((notification) => {
            const NotificationIcon = getNotificationIcon(notification.tipo);

            return (
              <article
                key={notification.id}
                className={`${styles.notificationCard} ${
                  !notification.leida ? styles.notificationCardUnread : ""
                }`}
              >
                <div className={styles.notificationIcon}>
                  <NotificationIcon size={16} strokeWidth={2} />
                </div>
                <div className={styles.notificationBody}>
                  <div className={styles.notificationTitleRow}>
                    <strong>{notification.titulo}</strong>
                    {!notification.leida ? <span className={styles.notificationDot} /> : null}
                  </div>
                  <p>{notification.mensaje || "Tienes una nueva novedad en tu cuenta."}</p>
                  <span>{formatLongDate(notification.createdAt)}</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : !isOverviewLoading ? (
        <p className={styles.notificationEmptyState}>
          Cuando un pedido sea aceptado, entregado o cancelado, te avisaremos aqui.
        </p>
      ) : null}

      {highlightedOrder ? (
        <button
          type="button"
          className={styles.notificationActionButton}
          onClick={() => openOrderDetail(highlightedOrder)}
        >
          Ver seguimiento del ultimo pedido
          <ArrowRight size={14} strokeWidth={2} />
        </button>
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
              className={`${styles.actionButton} ${styles.cartButton}`}
              aria-label="Carrito"
              onClick={() => {
                setIsAccountOpen(false);
                setIsNotificationsOpen(false);
                setIsCartOpen(true);
              }}
            >
              <ShoppingCart size={18} strokeWidth={2} />
              <span className={styles.badge}>{count}</span>
            </button>
          </div>
        </div>
      </header>

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

            {selectedOrder.estado === "cancelado" ? (
              <div className={styles.trackingCancelled}>
                <CircleSlash size={18} strokeWidth={2} />
                <p>Este pedido fue cancelado. Si necesitas ayuda, revisa el detalle del pago o contacta a la marca.</p>
              </div>
            ) : (
              <div className={styles.trackingSteps}>
                <div className={styles.trackingStep}>
                  <div
                    className={`${styles.trackingStepIcon} ${
                      getOrderStatusMeta(selectedOrder.estado).step >= 1 ? styles.trackingStepDone : ""
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
                    className={`${styles.trackingStepIcon} ${
                      getOrderStatusMeta(selectedOrder.estado).step >= 2 ? styles.trackingStepDone : ""
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
                    className={`${styles.trackingStepIcon} ${
                      getOrderStatusMeta(selectedOrder.estado).step >= 3 ? styles.trackingStepDone : ""
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
