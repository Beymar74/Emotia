"use client";

import React, { useState, useRef } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  Info,
  Building2
} from "lucide-react";

export default function PerfilNegocioPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Datos simulados del negocio
  const [businessData, setBusinessData] = useState({
    nombre: "Artesanías La Paz",
    descripcion: "Especialistas en regalos artesanales con identidad boliviana. Cada pieza es única y hecha a mano con amor.",
    nit: "1234567015",
    categoria: "Regalos Compuestos",
    telefono: "+591 70000000",
    email: "contacto@artelapaz.com",
    direccion: "Av. Arce #2520, Sopocachi, La Paz",
    sitioWeb: "www.artesaniaslapaz.com",
    logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=300&fit=crop&q=80"
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(businessData.logo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Perfil de Negocio</h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">Esta información será visible para tus clientes en la plataforma Emotia.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Logo y Banner */}
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
            <p className="text-sm text-[#BC9968] font-bold uppercase tracking-wider">Proveedor Verificado</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A1A]">124</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Ventas</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-xl font-bold text-[#1A1A1A]">4.9</p>
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

        {/* COLUMNA DERECHA: Formularios */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjeta: Información General */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Building2 size={18} /> Información de la Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={businessData.nombre}
                  onChange={(e) => setBusinessData({...businessData, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none font-medium transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Descripción del Negocio</label>
                <textarea 
                  rows={4} 
                  value={businessData.descripcion}
                  onChange={(e) => setBusinessData({...businessData, descripcion: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none font-medium transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">NIT / RUC</label>
                <input 
                  type="text" 
                  value={businessData.nit}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-mono text-sm outline-none cursor-not-allowed" 
                  readOnly 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Categoría Principal</label>
                <select 
                  value={businessData.categoria}
                  onChange={(e) => setBusinessData({...businessData, categoria: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] outline-none font-medium"
                >
                  <option>Regalos Compuestos</option>
                  <option>Flores</option>
                  <option>Personalizados</option>
                  <option>Experiencias</option>
                  <option>Dulces</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tarjeta: Contacto y Enlaces */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={18} /> Contacto y Localización
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Teléfono de contacto</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={businessData.telefono} 
                    onChange={(e) => setBusinessData({...businessData, telefono: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    value={businessData.email} 
                    onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" 
                  />
                </div>
              </div>

              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Dirección Física del Taller/Local</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={businessData.direccion} 
                    onChange={(e) => setBusinessData({...businessData, direccion: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" 
                  />
                </div>
              </div>

              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-left">Sitio Web / Redes</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={businessData.sitioWeb} 
                    onChange={(e) => setBusinessData({...businessData, sitioWeb: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-4">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 font-bold animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 size={20} /> Perfil actualizado con éxito
              </div>
            )}
            <button 
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#8E1B3A] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#8E1B3A]/20 hover:bg-[#5A0F24] transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? (
                <>Guardando... <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <>Guardar Cambios <Save size={20} /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}