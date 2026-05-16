"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Plus,
  Trash2,
  MapPin,
  Store,
  Gem,
  Flower2,
  CakeSlice,
  Candy,
  Sparkles,
  ScrollText,
  Shirt,
  Amphora,
  Gift,
  Info,
  Calendar,
  ShieldCheck,
} from "lucide-react";

const P = {
  bordoNegro: "#3D0A1A",
  doradoOscuro: "#9A7A48",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  choco: "#5C3A2E",
  gris: "#B0B0B0",
};

export interface RedSocialRegistro {
  plataforma: string;
  url: string;
}

export interface FormDataRegistro {
  nombreEmpresa: string;
  categorias: string[];
  ciudad: string;
  direccionNegocio: string;
  referenciaDireccion: string;
  redesSociales: RedSocialRegistro[];
  nombreRepresentante: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  anioNacimiento: string;
  aceptaTerminos: boolean;
}

interface PasoEmpresaProps {
  formData: FormDataRegistro;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  toggleCategoria: (categoria: string) => void;
  agregarRedSocial: () => void;
  actualizarRedSocial: (
    index: number,
    campo: keyof RedSocialRegistro,
    valor: string
  ) => void;
  eliminarRedSocial: (index: number) => void;
  onNext: () => void;
  errores: Record<string, string>;
  
}

interface PasoRepresentanteProps {
  formData: FormDataRegistro;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  cargando: boolean;
  errores: Record<string, string>;
}

const CATEGORIAS = [
  { value: "artesanias", label: "Artesanías", icon: Sparkles },
  { value: "joyeria", label: "Joyería", icon: Gem },
  { value: "floreria", label: "Florería", icon: Flower2 },
  { value: "reposteria", label: "Repostería", icon: CakeSlice },
  { value: "chocolateria", label: "Chocolatería", icon: Candy },
  { value: "decoracion", label: "Decoración", icon: Gift },
  { value: "papeleria_creativa", label: "Papelería creativa", icon: ScrollText },
  { value: "textiles", label: "Textiles", icon: Shirt },
  { value: "ceramica", label: "Cerámica", icon: Amphora },
  { value: "regalos_personalizados", label: "Regalos personalizados", icon: Store },
];

const PLATAFORMAS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "web", label: "Sitio web" },
];

function obtenerLabelsCategorias(valores: string[]) {
  return valores
    .map((valor) => CATEGORIAS.find((cat) => cat.value === valor)?.label)
    .filter(Boolean)
    .join(", ");
}
function errorInputClass(tieneError?: boolean) {
  return tieneError
    ? "border-red-400 bg-red-50/50 ring-2 ring-red-100 animate-pulse"
    : "";
}

function MensajeError({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;

  return (
    <p className="text-xs font-bold text-red-500 ml-1 mt-1">
      {mensaje}
    </p>
  );
}
export function PasoEmpresa({
  formData,
  handleChange,
  toggleCategoria,
  agregarRedSocial,
  actualizarRedSocial,
  eliminarRedSocial,
  onNext,
  errores,
}: PasoEmpresaProps) {
  const plataformasUsadas = formData.redesSociales.map((r) => r.plataforma);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="mb-8">
  <h1
    className="text-3xl font-black mb-2"
    style={{ color: P.bordoNegro }}
  >
    Registra tu negocio
  </h1>

  <p className="text-sm font-medium" style={{ color: P.choco }}>
    Cuéntanos sobre tu marca o taller artesanal.
  </p>

  <p
    className="text-sm mt-3"
    style={{ color: P.choco, opacity: 0.8 }}
  >
    ¿Ya tienes una cuenta?
    <Link
      href="/business/proveedores/login"
      className="ml-1 font-bold hover:underline"
      style={{ color: P.doradoOscuro }}
    >
      Inicia sesión
    </Link>
  </p>
</div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-6"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
            Nombre del negocio
          </label>

          <input
  required
  type="text"
  name="nombreEmpresa"
  value={formData.nombreEmpresa}
  onChange={handleChange}
  placeholder="Ej: Joyería Los Andes"
  autoComplete="organization"
  maxLength={150}
  spellCheck={false}
  className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none focus:bg-white transition-all ${errorInputClass(
    Boolean(errores.nombreEmpresa)
  )}`}
  style={{
    border: `1px solid ${errores.nombreEmpresa ? "#ef4444" : P.beige}`,
  }}
/>
<MensajeError mensaje={errores.nombreEmpresa} />
        </div>

        <div className="space-y-3">
  <div>
    <label
      className="text-xs font-black uppercase tracking-wider ml-1"
      style={{ color: P.doradoOscuro }}
    >
      Categorías del negocio
    </label>

    <p
      className="text-xs mt-1"
      style={{ color: P.choco, opacity: 0.7 }}
    >
      Selecciona todas las categorías que describen tu negocio.
    </p>
  </div>

  <div
  className={`grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl transition-all ${
    errores.categorias
      ? "ring-2 ring-red-100 p-2 bg-red-50/40"
      : ""
  }`}
>
            {CATEGORIAS.map((cat) => {
              const active = formData.categorias.includes(cat.value);
              const Icon = cat.icon;

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleCategoria(cat.value)}
                  className="px-3 py-3 rounded-xl text-sm font-bold border transition-all text-left flex items-center gap-3"
                  style={{
                    background: active ? P.bordoNegro : "#F9FAFB",
                    color: active ? "#FFFFFF" : P.choco,
                    borderColor: active ? P.bordoNegro : P.beige,
                    boxShadow: active ? `0 10px 20px ${P.bordoNegro}18` : "none",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: active ? "#FFFFFF80" : P.beige,
                      background: active ? "#FFFFFF20" : "#FFFFFF",
                    }}
                  >
                    {active && <CheckCircle2 size={13} />}
                  </span>

                  <Icon size={17} style={{ color: active ? "#FFFFFF" : P.doradoOscuro }} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <MensajeError mensaje={errores.categorias} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
              Ciudad base
            </label>

            <input
              name="ciudad"
              value={formData.ciudad}
              disabled
              className="w-full px-5 py-4 rounded-2xl bg-gray-100 border text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
              Dirección del negocio
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                required
                type="text"
                name="direccionNegocio"
                value={formData.direccionNegocio}
                onChange={handleChange}
                placeholder="Av. Arce, Local 4"
                autoComplete="street-address"
                maxLength={255}
                spellCheck={false}
                className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none focus:bg-white transition-all ${errorInputClass(
                  Boolean(errores.direccionNegocio)
                )}`}
                style={{
                  border: `1px solid ${
                    errores.direccionNegocio ? "#ef4444" : P.beige
                  }`,
                }}
              />
              
            </div>
            <p className="text-xs ml-1" style={{ color: P.choco, opacity: 0.65 }}>
              Indica la dirección donde se encuentra tu negocio.
            </p>
            <MensajeError mensaje={errores.direccionNegocio} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
            Referencia de ubicación
          </label>

          <input
            type="text"
            name="referenciaDireccion"
            value={formData.referenciaDireccion}
            onChange={handleChange}
            placeholder="Ej: Frente a la plaza, segundo piso, tienda con letrero dorado"
            maxLength={255}
            spellCheck={false}
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none focus:bg-white transition-all"
            style={{ border: `1px solid ${P.beige}` }}
          />
        </div>

        <div className="space-y-3 pb-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
                Redes sociales o web
              </label>
              <p className="text-xs mt-1" style={{ color: P.choco, opacity: 0.7 }}>
                Opcional. Añade solo las plataformas que uses.
              </p>
            </div>

            <button
              type="button"
              onClick={agregarRedSocial}
              disabled={formData.redesSociales.length >= PLATAFORMAS.length}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 border disabled:opacity-40"
              style={{ color: P.bordoNegro, borderColor: P.beige }}
            >
              <Plus size={14} />
              Añadir
            </button>
          </div>

          {formData.redesSociales.length === 0 && (
            <div className="rounded-2xl border border-dashed p-4 text-sm text-gray-400">
              No agregaste redes todavía.
            </div>
          )}

          <div className="space-y-3">
            {formData.redesSociales.map((red, index) => {
              const opciones = PLATAFORMAS.filter(
                (p) => p.value === red.plataforma || !plataformasUsadas.includes(p.value)
              );

              return (
                <div key={`${red.plataforma}-${index}`} className="grid grid-cols-1 md:grid-cols-[160px_1fr_44px] gap-3">
                  <select
                    value={red.plataforma}
                    onChange={(e) => actualizarRedSocial(index, "plataforma", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border outline-none"
                    style={{ border: `1px solid ${P.beige}` }}
                  >
                    {opciones.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type={red.plataforma === "whatsapp" ? "tel" : "url"}
                    value={red.url}
                    onChange={(e) => actualizarRedSocial(index, "url", e.target.value)}
                    placeholder={red.plataforma === "whatsapp" ? "Ej: 71234567" : "https://..."}
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border outline-none"
                    style={{ border: `1px solid ${P.beige}` }}
                  />

                  <button
                    type="button"
                    onClick={() => eliminarRedSocial(index)}
                    className="h-[48px] rounded-2xl flex items-center justify-center border text-red-500 hover:bg-red-50"
                    style={{ borderColor: P.beige }}
                    aria-label="Eliminar red social"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
          style={{ background: P.bordoNegro }}
        >
          Siguiente paso <ChevronRight size={20} />
        </button>
      </form>
    </motion.div>
  );
}

export function PasoRepresentante({
  formData,
  handleChange,
  onBack,
  onSubmit,
  cargando,
  errores,
}: PasoRepresentanteProps) {
  const categoriasTexto = obtenerLabelsCategorias(formData.categorias);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold mb-6 hover:opacity-70"
        style={{ color: P.doradoOscuro }}
      >
        <ArrowLeft size={14} /> Volver a datos del negocio
      </button>

      <div className="mb-8">
        <h1
          className="text-3xl font-black mb-2"
          style={{ color: P.bordoNegro }}
        >
          Crea tu cuenta
        </h1>

        <p className="text-sm font-medium" style={{ color: P.choco }}>
          Tus datos de acceso personales y de contacto.
        </p>

        <p
          className="text-sm mt-3"
          style={{ color: P.choco, opacity: 0.8 }}
        >
          ¿Ya tienes una cuenta?
          <Link
            href="/business/proveedores/login"
            className="ml-1 font-bold hover:underline"
            style={{ color: P.doradoOscuro }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
            Nombre completo
          </label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              required
              type="text"
              name="nombreRepresentante"
              value={formData.nombreRepresentante}
              onChange={handleChange}
              placeholder="Tu nombre y apellido completo"
              autoComplete="name"
              maxLength={150}
              spellCheck={false}
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none"
              style={{ border: `1px solid ${P.beige}` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
            Correo corporativo
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@tunegocio.com"
              autoComplete="email"
              spellCheck={false}
              maxLength={150}
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none"
              style={{ border: `1px solid ${P.beige}` }}
            />
          </div>
          <p className="text-xs ml-1" style={{ color: P.choco, opacity: 0.65 }}>
            Usaremos este correo para enviarte información importante de tu cuenta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
              Celular / WhatsApp
            </label>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                required
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, "");
                  if (soloNumeros.length <= 8) {
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: "telefono",
                        value: soloNumeros,
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                placeholder="71234567"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[67][0-9]{7}"
                maxLength={8}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none"
                style={{ border: `1px solid ${P.beige}` }}
              />
            </div>
            <p className="text-xs ml-1" style={{ color: P.choco, opacity: 0.65 }}>
              Número de contacto principal.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
              Año de nacimiento
            </label>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                required
                type="number"
                name="anioNacimiento"
                value={formData.anioNacimiento}
                onChange={handleChange}
                placeholder="Ej: 1995"
                min="1900"
                max={String(new Date().getFullYear() - 18)}
                inputMode="numeric"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none"
                style={{ border: `1px solid ${P.beige}` }}
              />
            </div>
            <p className="text-xs ml-1" style={{ color: P.choco, opacity: 0.65 }}>
              Debes ser mayor de 18 años.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>
              Contraseña
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                maxLength={100}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none"
                style={{ border: `1px solid ${P.beige}` }}
              />
            </div>
            <p className="text-xs ml-1" style={{ color: P.choco, opacity: 0.65 }}>
              Mínimo 8 caracteres.
            </p>
          </div>

          <div className="space-y-1.5">
  <label
    className="text-xs font-black uppercase tracking-wider ml-1"
    style={{ color: P.doradoOscuro }}
  >
    Confirmar contraseña
  </label>

  <div className="relative">
    <Lock
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
      size={18}
    />

    <input
      required
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="••••••••"
      autoComplete="new-password"
      minLength={8}
      maxLength={100}
      className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none ${errorInputClass(
        Boolean(errores.confirmPassword)
      )}`}
      style={{
        border: `1px solid ${
          errores.confirmPassword ? "#ef4444" : P.beige
        }`,
      }}
    />
  </div>

  <MensajeError mensaje={errores.confirmPassword} />
</div>
        </div>

        <div
          className="rounded-2xl p-4 flex gap-3 border"
          style={{ background: `${P.beige}40`, borderColor: P.beige }}
        >
          <Info size={18} className="shrink-0 mt-0.5" style={{ color: P.doradoOscuro }} />
          <div>
            <h4 className="text-sm font-black mb-1" style={{ color: P.choco }}>
              ¿Por qué pedimos tu año de nacimiento?
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: P.choco, opacity: 0.75 }}>
              Es un requisito legal para verificar que eres mayor de edad y garantizar la seguridad de la plataforma.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ borderColor: P.beige, background: "#FFFFFF" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Store size={18} style={{ color: P.doradoOscuro }} />
            <h4 className="font-black text-sm" style={{ color: P.choco }}>
              Resumen de tu negocio
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-black uppercase mb-1" style={{ color: P.doradoOscuro }}>
                Negocio
              </p>
              <p style={{ color: P.choco }}>{formData.nombreEmpresa || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase mb-1" style={{ color: P.doradoOscuro }}>
                Categorías
              </p>
              <p style={{ color: P.choco }}>{categoriasTexto || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase mb-1" style={{ color: P.doradoOscuro }}>
                Ciudad
              </p>
              <p style={{ color: P.choco }}>{formData.ciudad || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase mb-1" style={{ color: P.doradoOscuro }}>
                Dirección
              </p>
              <p style={{ color: P.choco }}>{formData.direccionNegocio || "—"}</p>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            required
            type="checkbox"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />

          <span style={{ color: P.choco }}>
            Acepto los términos de servicio y la política de privacidad de Emotia Business.
          </span>
        </label>

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-4 mt-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
          style={{ background: cargando ? P.gris : P.bordoNegro }}
        >
          {cargando ? (
            "Registrando en BD..."
          ) : (
            <>
              Finalizar registro <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}