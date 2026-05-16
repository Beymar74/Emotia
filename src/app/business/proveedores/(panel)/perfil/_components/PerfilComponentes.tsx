"use client";

import React, { useRef } from "react";
import {
  Store,
  Camera,
  Info,
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Wallet,
  Star,
} from "lucide-react";

export interface RedSocialRegistro {
  plataforma: string;
  url: string;
}

export interface PerfilBusinessData {
  id?: number;
  nombre: string;
  descripcion: string;
  categorias: string[];
  categoriasDisponibles: {
    id: number;
    nombre: string;
  }[];
  redesSociales: RedSocialRegistro[];
  telefono: string;
  email: string;
  direccion: string;
  logo: string | null;
  estado?: string;
  ventas?: number;
  rating?: number;
}

interface TarjetaLogoProps {
  businessData: PerfilBusinessData;
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormulariosPerfilProps {
  businessData: PerfilBusinessData;
  setBusinessData: React.Dispatch<
    React.SetStateAction<PerfilBusinessData | null>
  >;
}

const PLATAFORMAS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "web", label: "Sitio web" },
];

export function TarjetaLogo({
  businessData,
  logoPreview,
  handleLogoChange,
}: TarjetaLogoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBs = (monto: number) =>
    `Bs ${monto.toLocaleString("es-BO", {
      maximumFractionDigits: 0,
    })}`;

  const ratingTexto =
    businessData.rating && businessData.rating > 0
      ? businessData.rating.toFixed(1)
      : "Sin calif.";

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F5E6D0] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#3D0A1A] via-[#5A0F24] to-[#8E1B3A]" />

        <div className="relative mt-8">
          <div className="h-32 w-32 rounded-2xl border-4 border-white bg-gray-50 mx-auto overflow-hidden shadow-lg relative group">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <Store size={40} />
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Camera size={24} />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <h3 className="text-xl font-bold text-[#3D0A1A] mt-4">
          {businessData.nombre}
        </h3>

        <p className="text-sm text-[#BC9968] font-bold uppercase tracking-wider">
          {businessData.estado === "pendiente"
            ? "Cuenta pendiente"
            : "Proveedor activo"}
        </p>

        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[#8E1B3A]">
              <Wallet size={18} />
              <p className="text-lg font-black text-[#1A1A1A]">
                {formatBs(businessData.ventas ?? 0)}
              </p>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              Ventas
            </p>
          </div>

          <div className="text-center border-l border-gray-100">
            <div className="flex items-center justify-center gap-1 text-[#BC9968]">
              <Star size={18} fill="#BC9968" />
              <p className="text-lg font-black text-[#1A1A1A]">
                {ratingTexto}
              </p>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              Rating
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#F5E6D0] to-white p-6 rounded-3xl border border-[#BC9968]/30 shadow-sm">
        <div className="flex gap-3">
          <Info className="text-[#8E1B3A] shrink-0" size={20} />
          <p className="text-xs text-[#5A0F24] leading-relaxed">
            <strong>Consejo Emotia:</strong> completa descripción, categorías y
            redes para mejorar la confianza del comprador.
          </p>
        </div>
      </div>
    </div>
  );
}
export function FormulariosPerfil({
  businessData,
  setBusinessData,
}: FormulariosPerfilProps) {
  const toggleCategoria = (categoria: string) => {
    setBusinessData((prev) => {
  if (!prev) return prev;
      const existe = prev.categorias.includes(categoria);

      return {
        ...prev,
        categorias: existe
          ? prev.categorias.filter((c) => c !== categoria)
          : [...prev.categorias, categoria],
      };
    });
  };

  const agregarRedSocial = () => {
    setBusinessData((prev) => {
  if (!prev) return prev;
      const usadas = prev.redesSociales.map((r) => r.plataforma);

      const disponibles = PLATAFORMAS.filter(
        (p) => !usadas.includes(p.value)
      );

      if (disponibles.length === 0) return prev;

      return {
        ...prev,
        redesSociales: [
          ...prev.redesSociales,
          {
            plataforma: disponibles[0].value,
            url: "",
          },
        ],
      };
    });
  };

  const actualizarRed = (
    index: number,
    campo: keyof RedSocialRegistro,
    valor: string
  ) => {
    setBusinessData((prev) => {
  if (!prev) return prev;
      const nuevas = [...prev.redesSociales];

      nuevas[index] = {
        ...nuevas[index],
        [campo]: valor,
      };

      return {
        ...prev,
        redesSociales: nuevas,
      };
    });
  };

  const eliminarRed = (index: number) => {
    setBusinessData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        redesSociales: prev.redesSociales.filter((_, i) => i !== index),
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Empresa */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F5E6D0] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3D0A1A] via-[#8E1B3A] to-[#BC9968]" />
        <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Building2 size={18} />
          Información del negocio
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Nombre comercial
            </label>

            <input
              type="text"
              value={businessData.nombre}
              onChange={(e) =>
                setBusinessData({
                  ...businessData,
                  nombre: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Descripción
            </label>

            <textarea
              rows={4}
              value={businessData.descripcion}
              onChange={(e) =>
                setBusinessData({
                  ...businessData,
                  descripcion: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">
              Categorías
            </label>

            <div className="flex flex-wrap gap-2">
              {businessData.categoriasDisponibles.map((cat) => {
  const active = businessData.categorias.includes(cat.nombre);

  return (
    <button
      key={cat.id}
      type="button"
      onClick={() => toggleCategoria(cat.nombre)}
      className="px-4 py-2 rounded-xl text-sm font-bold border transition-all"
      style={{
        background: active ? "#8E1B3A" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#5C3A2E",
        borderColor: active ? "#8E1B3A" : "#F5E6D0",
        boxShadow: active ? "0 4px 12px rgba(142,27,58,0.18)" : "none",
      }}
    >
      {cat.nombre}
    </button>
  );
})}
            </div>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F5E6D0] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3D0A1A] via-[#8E1B3A] to-[#BC9968]" />
        <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Mail size={18} />
          Contacto y presencia digital
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-[42px] text-gray-400"
              />

              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Teléfono
              </label>

              <input
                type="text"
                value={businessData.telefono}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    telefono: e.target.value,
                  })
                }
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10 transition-all"
              />
            </div>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-[42px] text-gray-400"
              />

              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Correo
              </label>

              <input
                type="email"
                disabled
                value={businessData.email}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
              />
            </div>
          </div>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-4 top-[42px] text-gray-400"
            />

            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Dirección
            </label>

            <input
              type="text"
              value={businessData.direccion}
              onChange={(e) =>
                setBusinessData({
                  ...businessData,
                  direccion: e.target.value,
                })
              }
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Redes sociales
              </label>

              <button
                type="button"
                onClick={agregarRedSocial}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8E1B3A] text-white text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-sm"
              >
                <Plus size={16} />
                Añadir
              </button>
            </div>

            <div className="space-y-3">
              {businessData.redesSociales.map((red, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[180px_1fr_50px] gap-3"
                >
                  <select
                    value={red.plataforma}
                    onChange={(e) =>
                      actualizarRed(index, "plataforma", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10 outline-none transition-all"
                  >
                    {PLATAFORMAS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <input
                    value={red.url}
                    onChange={(e) =>
                      actualizarRed(index, "url", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl bg-gray-50 border"
                    placeholder="https://..."
                  />

                  <button
                    type="button"
                    onClick={() => eliminarRed(index)}
                    className="rounded-xl border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}