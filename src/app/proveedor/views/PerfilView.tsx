"use client";
import React, { useState, useEffect } from "react";
import { 
  Building2, Mail, Phone, MapPin, Globe, 
  Camera, Save, CheckCircle2, Store, Tag 
} from "lucide-react";
import { toast } from "sonner"; // Notificaciones elegantes

const CATEGORIAS_EMOTIA = [
  "Chocolates", "Flores", "Vinos y Licores", "Desayunos", 
  "Experiencias", "Joyas", "Artesanías", "Peluches", "Spa y Bienestar"
];

export default function PerfilView() {
  const [cargando, setCargando] = useState(false);
  const [inicializado, setInicializado] = useState(false);
  
  // Estado inicial por defecto
  const [datosNegocio, setDatosNegocio] = useState({
    nombreMarca: "Flores Illimani",
    descripcion: "Especialistas en arreglos florales premium con flores frescas de los valles bolivianos.",
    correoCorporativo: "contacto@floresillimani.com",
    telefono: "+591 76543210",
    ciudad: "La Paz",
    direccion: "Av. Ballivián, Calacoto",
    sitioWeb: "www.floresillimani.com",
    categorias: ["Flores", "Experiencias"]
  });

  // Cargamos los datos de la memoria al abrir la página
  useEffect(() => {
    if (!inicializado) {
      const datosGuardados = localStorage.getItem("emotia_perfil_proveedor");
      if (datosGuardados) {
        setDatosNegocio(JSON.parse(datosGuardados));
      }
      setInicializado(true);
    }
  }, [inicializado]);

  // Manejador para agregar o quitar categorías
  const handleToggleCategoria = (cat: string) => {
    setDatosNegocio(prev => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter(c => c !== cat)
        : [...prev.categorias, cat]
    }));
  };

  // Guardar cambios en la memoria temporal
  const handleGuardar = () => {
    setCargando(true);
    
    // Guardamos en la memoria del navegador
    localStorage.setItem("emotia_perfil_proveedor", JSON.stringify(datosNegocio));

    // Simulamos el tiempo de respuesta de la base de datos
    setTimeout(() => {
      setCargando(false);
      toast.success("Perfil de negocio actualizado correctamente");
    }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Cabecera de la Vista */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Perfil de Negocio</h1>
          <p className="text-[#6b7280] text-sm mt-1">Gestiona la información pública de tu marca y datos de contacto.</p>
        </div>
        <button 
          onClick={handleGuardar}
          disabled={cargando}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#701030] text-white rounded-xl font-semibold hover:bg-[#5a0c26] transition-all shadow-md disabled:opacity-50"
        >
          {cargando ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Logo y Datos Básicos */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjeta de Información General */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
              <Building2 className="text-[#BC9968]" size={20} />
              <h2 className="font-bold text-[#374151]">Información de la Marca</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6b7280] uppercase">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={datosNegocio.nombreMarca}
                  onChange={(e) => setDatosNegocio({...datosNegocio, nombreMarca: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#701030] text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6b7280] uppercase">Sitio Web (Opcional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    value={datosNegocio.sitioWeb}
                    onChange={(e) => setDatosNegocio({...datosNegocio, sitioWeb: e.target.value})}
                    className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#701030] text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-[#6b7280] uppercase">Descripción del Negocio</label>
                <textarea 
                  rows={3}
                  value={datosNegocio.descripcion}
                  onChange={(e) => setDatosNegocio({...datosNegocio, descripcion: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#701030] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta de Categorías */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-0">
              <Tag className="text-[#BC9968]" size={20} />
              <h2 className="font-bold text-[#374151]">Categorías de Productos</h2>
            </div>
            <p className="text-sm text-gray-500">Selecciona las categorías que mejor describen tus productos para aparecer en las búsquedas correctas.</p>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS_EMOTIA.map(cat => {
                const isSelected = datosNegocio.categorias.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleToggleCategoria(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      isSelected 
                      ? 'bg-[#701030] text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat} {isSelected && <CheckCircle2 size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Logo y Contacto */}
        <div className="space-y-6">
          
          {/* Logo del Negocio */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-[#F5E6D0] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                <Store size={48} className="text-[#701030]" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-[#BC9968] text-white rounded-full shadow-md hover:bg-[#a6865a] transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg">{datosNegocio.nombreMarca}</h3>
              <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full mt-1">Proveedor Verificado</p>
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-[#374151] border-b border-gray-50 pb-3">Datos de Contacto</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                  <span className="text-sm font-medium">{datosNegocio.correoCorporativo}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</span>
                  <span className="text-sm font-medium">{datosNegocio.telefono}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Dirección</span>
                  <span className="text-sm font-medium">{datosNegocio.direccion}, {datosNegocio.ciudad}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}