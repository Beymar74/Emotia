import React from 'react';
import { COLORS } from './constants';
import { IconGrid, IconChat, IconGift, IconClock, IconFile, IconStar } from './components/Icons';

export const TRACKING_STEPS = [
  { label: "Pedido confirmado",      date: "15 Mar · 09:14 hrs",          state: "done"    },
  { label: "En preparación",         date: "15 Mar · 10:30 hrs",          state: "done"    },
  { label: "En camino al destino",   date: "15 Mar · 14:05 hrs · En curso", state: "active" },
  { label: "Entregado",              date: "Estimado: 16:30 hrs",          state: "pending" },
];

export const NAV_ITEMS = [
  { id: "inicio",      icon: <IconGrid />,  label: "Dashboard"  },
  { id: "asesor",      icon: <IconChat />,  label: "Asesor IA",  badge: "Nuevo" },
  { id: "catalogo",    icon: <IconGift />,  label: "Catálogo"   },
  { id: "pedidos",     icon: <IconClock />, label: "Mis Pedidos"},
  { id: "historial",   icon: <IconFile />,  label: "Historial"  },
  { id: "suscripcion", icon: <IconStar />,  label: "Suscripción" }
];

export const STATS = [
  {
    id: "pedidos", num: 12, label: "Pedidos totales",
    color: "rgba(142,27,58,0.08)", stroke: COLORS.garnet,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
      </svg>
    ),
  },
  {
    id: "transito", num: 1, label: "En tránsito",
    color: "rgba(188,153,104,0.12)", stroke: COLORS.gold,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: "points", num: 450, label: "Emotia Points",
    color: "rgba(188,153,104,0.12)", stroke: COLORS.gold,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "fecha", num: 12, label: "Días próxima fecha",
    color: "rgba(90,15,36,0.07)", stroke: COLORS.bordeaux,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export const ORDERS = [
  {
    id: "#EM-2041", recipient: "María (Mamá)", item: "Caja Sorpresa Spa Botánico",
    date: "15 Mar 2026", status: "transit", statusText: "En tránsito", tab: "pedidos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
      </svg>
    ),
  },
  {
    id: "#EM-2038", recipient: "Carlos (Novio)", item: "Kit Café de Altura Local",
    date: "12 Mar 2026", status: "prep", statusText: "Preparando", tab: "pedidos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "#EM-1990", recipient: "Andrea (Amiga)", item: "Arreglo Floral y Chocolates",
    date: "28 Feb 2026", status: "done", statusText: "Entregado", tab: "historial",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];