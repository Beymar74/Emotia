"use client";

import { useState, useTransition } from "react";
import { toggleMetodoPago } from "../actions";

interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  activo: boolean;
}

/* ── Per-method accent colours ── */
const ACCENT: Record<string, { bg: string; iconBg: string; iconColor: string; bar: string }> = {
  "Tarjeta": {
    bg: "from-[#1A4FA0]/5 to-[#1A4FA0]/0",
    iconBg: "bg-[#1A4FA0]/10",
    iconColor: "text-[#1A4FA0]",
    bar: "bg-[#1A4FA0]",
  },
  "Transferencia QR": {
    bg: "from-[#0D7A55]/5 to-[#0D7A55]/0",
    iconBg: "bg-[#0D7A55]/10",
    iconColor: "text-[#0D7A55]",
    bar: "bg-[#0D7A55]",
  },
  "Efectivo": {
    bg: "from-[#BC9968]/8 to-[#BC9968]/0",
    iconBg: "bg-[#BC9968]/15",
    iconColor: "text-[#7A5C38]",
    bar: "bg-[#BC9968]",
  },
};

const DEFAULT_ACCENT = {
  bg: "from-[#8E1B3A]/5 to-[#8E1B3A]/0",
  iconBg: "bg-[#8E1B3A]/10",
  iconColor: "text-[#8E1B3A]",
  bar: "bg-[#8E1B3A]",
};

/* ── SVG icons ── */
function IconTarjeta({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="10" width="32" height="20" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="16" width="32" height="5" fill="currentColor" opacity=".18" />
      <rect x="8" y="25" width="8" height="2.5" rx="1.25" fill="currentColor" opacity=".5" />
      <rect x="20" y="25" width="5" height="2.5" rx="1.25" fill="currentColor" opacity=".35" />
      <circle cx="28" cy="26.25" r="2.5" fill="currentColor" opacity=".5" />
      <circle cx="31.5" cy="26.25" r="2.5" fill="currentColor" opacity=".3" />
    </svg>
  );
}

function IconQR({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor" opacity=".4" />
      <rect x="23" y="5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="8" width="6" height="6" rx="1" fill="currentColor" opacity=".4" />
      <rect x="5" y="23" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="26" width="6" height="6" rx="1" fill="currentColor" opacity=".4" />
      <path d="M23 23h3v3h-3zM29 23h6v3h-6zM26 26h3v3h-3zM29 29h3v6h-3zM23 32h6v3h-6z" fill="currentColor" opacity=".5" />
    </svg>
  );
}

function IconEfectivo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="11" width="32" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity=".35" />
      <circle cx="8" cy="20" r="2" fill="currentColor" opacity=".3" />
      <circle cx="32" cy="20" r="2" fill="currentColor" opacity=".3" />
    </svg>
  );
}

function getIcon(nombre: string, className: string) {
  const n = nombre.toLowerCase();
  if (n.includes("tarjeta")) return <IconTarjeta className={className} />;
  if (n.includes("qr")) return <IconQR className={className} />;
  if (n.includes("efectivo")) return <IconEfectivo className={className} />;
  return <IconEfectivo className={className} />;
}

/* ── Toggle switch ── */
function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-[#2D7A47]" : "bg-[#D1C7C0]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ── Individual card — own transition so each spins independently ── */
function MetodoPagoCard({ metodo }: { metodo: MetodoPago }) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(metodo.activo);
  const accent = ACCENT[metodo.nombre] ?? DEFAULT_ACCENT;

  const handleToggle = () => {
    const next = !optimistic;
    setOptimistic(next);
    startTransition(async () => {
      await toggleMetodoPago(metodo.id, optimistic);
    });
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        optimistic
          ? "border-[#8E1B3A]/12 shadow-sm"
          : "border-[#8E1B3A]/6 opacity-70"
      }`}
    >
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accent.bar} ${!optimistic ? "opacity-30" : ""}`} />

      {/* Gradient tint */}
      <div className={`absolute inset-0 bg-gradient-to-b ${optimistic ? accent.bg : "from-transparent"} pointer-events-none`} />

      <div className="relative p-6 flex flex-col gap-5">

        {/* Top row: icon + status pill */}
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-xl ${accent.iconBg} flex items-center justify-center flex-shrink-0`}>
            {getIcon(metodo.nombre, `w-8 h-8 ${accent.iconColor}`)}
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              optimistic
                ? "bg-[#EEF8F0] text-[#2D7A47]"
                : "bg-[#F1EFE8] text-[#7A7A7A]"
            }`}
          >
            {optimistic ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Name + description */}
        <div>
          <h3 className="text-base font-bold text-[#2A0E18] leading-tight">{metodo.nombre}</h3>
          <p className="text-sm text-[#7A5260] mt-1 leading-relaxed">{metodo.descripcion}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#8E1B3A]/6" />

        {/* Toggle row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2A0E18]">
              {optimistic ? "Habilitado para pagos" : "Deshabilitado"}
            </p>
            <p className="text-[11px] text-[#7A5260] mt-0.5">
              {optimistic
                ? "Los clientes pueden usar este método"
                : "No visible para los clientes"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPending && (
              <svg className="w-4 h-4 animate-spin text-[#8E1B3A]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <ToggleSwitch
              checked={optimistic}
              onChange={handleToggle}
              disabled={isPending}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Main export ── */
export default function MetodosPagoClient({ metodos }: { metodos: MetodoPago[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metodos.map((m) => (
        <MetodoPagoCard key={m.id} metodo={m} />
      ))}
    </div>
  );
}
