"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, User, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";

// Paleta exportada para usarla aquí
const P = { bordoNegro: "#3D0A1A", doradoOscuro: "#9A7A48", beige: "#F5E6D0", choco: "#5C3A2E", gris: "#B0B0B0" };

// --- 1. DEFINIMOS LOS TIPOS DE DATOS DE TYPESCRIPT ---
export interface FormDataRegistro {
  nombreEmpresa: string;
  categoria: string;
  ciudad: string;
  linkRedes: string;
  nombreRepresentante: string;
  email: string;
  telefono: string;
  password: string;
  anioNacimiento: string; // <-- ¡ESTA ES LA LÍNEA QUE FALTA!
}

interface PasoEmpresaProps {
  formData: FormDataRegistro;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
}

interface PasoRepresentanteProps {
  formData: FormDataRegistro;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  cargando: boolean;
}

// --- 2. APLICAMOS LOS TIPOS A LOS COMPONENTES ---
export function PasoEmpresa({ formData, handleChange, onNext }: PasoEmpresaProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: P.bordoNegro }}>Registra tu negocio</h1>
        <p className="text-sm font-medium" style={{ color: P.choco }}>Cuéntanos sobre tu marca o taller artesanal.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Nombre del Negocio</label>
          <input required name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange} placeholder="Ej: Joyería Los Andes" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Categoría</label>
            <select required name="categoria" value={formData.categoria} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }}>
              <option value="">Selecciona...</option>
              <option value="artesanias">Artesanías</option>
              <option value="joyeria">Joyería</option>
              <option value="flores">Florería</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Ciudad Base</label>
            <input name="ciudad" value={formData.ciudad} disabled className="w-full px-5 py-4 rounded-2xl bg-gray-100 border text-gray-400 cursor-not-allowed" />
          </div>
        </div>
        <div className="space-y-1.5 pb-4">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Redes Sociales o Web (Opcional)</label>
          <input name="linkRedes" value={formData.linkRedes} onChange={handleChange} placeholder="instagram.com/tu_negocio" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
        </div>
        <button type="submit" className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2" style={{ background: P.bordoNegro }}>
          Siguiente Paso <ChevronRight size={20} />
        </button>
      </form>
    </motion.div>
  );
}

export function PasoRepresentante({ formData, handleChange, onBack, onSubmit, cargando }: PasoRepresentanteProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold mb-6 hover:opacity-70" style={{ color: P.doradoOscuro }}>
        <ArrowLeft size={14} /> Volver a datos del negocio
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: P.bordoNegro }}>Crea tu cuenta</h1>
        <p className="text-sm font-medium" style={{ color: P.choco }}>Tus datos de acceso personales y de contacto.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input required name="nombreRepresentante" value={formData.nombreRepresentante} onChange={handleChange} placeholder="Tu nombre y apellido" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Correo Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nombre@tunegocio.com" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Celular / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="71234567" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }} />
            </div>
          </div>
          {/* Nuevo campo para Año de Nacimiento */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Año de Nacimiento</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required 
                type="number" 
                name="anioNacimiento" 
                value={formData.anioNacimiento} 
                onChange={handleChange} 
                placeholder="Ej: 1995" 
                min="1900" 
                max="2008"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" 
                style={{ border: `1px solid ${P.beige}` }} 
              />
            </div>
          </div>
        </div>
        <button type="submit" disabled={cargando} className="w-full py-4 mt-4 rounded-2xl font-black text-white flex items-center justify-center gap-2" style={{ background: cargando ? P.gris : P.bordoNegro }}>
          {cargando ? "Registrando en BD..." : <>Finalizar Registro <CheckCircle2 size={20} /></>}
        </button>
      </form>
    </motion.div>
  );
}