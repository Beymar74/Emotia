"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { TarjetaLogo, FormulariosPerfil } from "./_components/PerfilComponentes";
import { obtenerPerfilProveedor, actualizarPerfilProveedor } from "./actions";

export default function PerfilNegocioPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado inicial vacío hasta que Prisma responda
  const [businessData, setBusinessData] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // 1. Al cargar la página, traemos los datos de la Base de Datos
  useEffect(() => {
    obtenerPerfilProveedor().then((datos) => {
      if (datos) {
        setBusinessData(datos);
        setLogoPreview(datos.logo);
      }
      setIsLoading(false);
    });
  }, []);

  // Manejo de la subida local de la imagen (preview visual)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      // setBusinessData({...businessData, logoFile: file}); // Para enviar al backend luego
    }
  };

  // 2. Al darle a "Guardar Cambios"
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData || !businessData.id) return;
    
    setIsSaving(true);
    
    // Llamamos al Server Action para guardar en Prisma
    const resultado = await actualizarPerfilProveedor(businessData.id, businessData);
    
    setIsSaving(false);
    
    if (resultado.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#8E1B3A]" size={40} /></div>;
  }

  if (!businessData) {
    return <div className="text-center text-red-500 font-bold mt-10">No se pudo cargar el perfil del proveedor.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Perfil de Negocio</h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">Esta información será visible para tus clientes en la plataforma Emotia.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Usamos el componente modular de la izquierda */}
        <TarjetaLogo 
          businessData={businessData} 
          logoPreview={logoPreview} 
          handleLogoChange={handleLogoChange} 
        />

        <div className="lg:col-span-2 space-y-6">
          {/* Usamos el componente modular de la derecha */}
          <FormulariosPerfil 
            businessData={businessData} 
            setBusinessData={setBusinessData} 
          />

          {/* Botón de Guardar */}
          <div className="flex items-center justify-end gap-4 mt-8">
            {showSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold animate-in fade-in">
                <CheckCircle2 size={20} /> Perfil actualizado
              </div>
            )}
            <button 
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#8E1B3A] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#8E1B3A]/20 hover:bg-[#5A0F24] transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? <>Guardando... <Loader2 size={20} className="animate-spin" /></> : <>Guardar Cambios <Save size={20} /></>}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}