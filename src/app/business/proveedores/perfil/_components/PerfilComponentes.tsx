"use client";

import React, { useRef } from "react";
import { Store, Camera, Info, Building2, Phone, Mail, MapPin, Globe } from "lucide-react";

// --- 1. DEFINIMOS LOS TIPOS DE DATOS ---
export interface PerfilBusinessData {
  id?: number;
  nombre: string;
  descripcion: string;
  nit: string;
  categoria: string;
  telefono: string;
  email: string;
  direccion: string;
  sitioWeb: string;
  logo: string | null;
  estado?: string;
}

// Interfaces para las "Props" de cada componente
interface TarjetaLogoProps {
  businessData: PerfilBusinessData;
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormulariosPerfilProps {
  businessData: PerfilBusinessData;
  setBusinessData: (data: any) => void;
}

// --- 2. APLICAMOS LOS TIPOS A LOS COMPONENTES ---

export function TarjetaLogo({ businessData, logoPreview, handleLogoChange }: TarjetaLogoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-[#5A0F24]"></div>
        
        <div className="relative mt-8">
          <div className="h-32 w-32 rounded-2xl border-4 border-white bg-gray-50 mx-auto overflow-hidden shadow-lg relative group">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
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
          <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
        </div>

        <h3 className="text-xl font-bold text-[#3D0A1A] mt-4">{businessData.nombre}</h3>
        <p className="text-sm text-[#BC9968] font-bold uppercase tracking-wider">
          {businessData.estado === "SUSPENDIDO" ? "Cuenta Pendiente" : "Proveedor Verificado"}
        </p>
        
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-[#1A1A1A]">0</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Ventas</p>
          </div>
          <div className="text-center border-l border-gray-100">
            <p className="text-xl font-bold text-[#1A1A1A]">-</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Rating</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F5E6D0]/30 p-6 rounded-3xl border border-[#F5E6D0]">
        <div className="flex gap-3">
          <Info className="text-[#8E1B3A] shrink-0" size={20} />
          <p className="text-xs text-[#5A0F24] leading-relaxed">
            <strong>Consejo Emotia:</strong> Un logo de alta resolución y una descripción detallada aumentan la confianza del comprador en un 40%.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FormulariosPerfil({ businessData, setBusinessData }: FormulariosPerfilProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Información de la Empresa */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Building2 size={18} /> Información de la Empresa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Comercial</label>
            <input type="text" value={businessData.nombre} onChange={(e) => setBusinessData({...businessData, nombre: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none font-medium transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Descripción del Negocio</label>
            <textarea rows={4} value={businessData.descripcion} onChange={(e) => setBusinessData({...businessData, descripcion: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none font-medium transition-all resize-none" />
          </div>
        </div>
      </div>

      {/* Contacto y Localización */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Mail size={18} /> Contacto y Localización
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Teléfono de contacto</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={businessData.telefono} onChange={(e) => setBusinessData({...businessData, telefono: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Correo (Lectura)</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={businessData.email} disabled className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Dirección Física</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={businessData.direccion} onChange={(e) => setBusinessData({...businessData, direccion: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}