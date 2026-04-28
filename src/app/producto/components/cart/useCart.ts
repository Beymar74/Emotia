"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  subtitle?: string;
};

const STORAGE_KEY = "emotia_cart";
const CART_EVENT = "emotia-cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const syncCart = useCallback(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    syncCart();

    const handleStorage = () => syncCart();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CART_EVENT, handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CART_EVENT, handleStorage);
    };
  }, [syncCart]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    const current = readCart();
    const existing = current.find((cartItem) => cartItem.id === item.id);

    const next = existing
      ? current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      : [...current, { ...item, quantity: 1 }];

    writeCart(next);
    setItems(next);
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    const next = readCart()
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    writeCart(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((id: number) => {
    const next = readCart().filter((item) => item.id !== id);
    writeCart(next);
    setItems(next);
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
    setItems([]);
  }, []);

  const count = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    count,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
