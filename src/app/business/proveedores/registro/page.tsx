"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Store, User, ShieldCheck, 
  ChevronRight, CheckCircle2, Building2, Mail, Lock, Phone, X 
} from "lucide-react";

// Paleta Oficial Emotia Business
const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  carmesi: "#AB3A50",
  dorado: "#BC9968",
  doradoOscuro: "#9A7A48",
  choco: "#5C3A2E",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A"
};

export default function RegistroProductorPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);

  // ESTADO PARA LOS MODALES LEGALES
  const [modalAbierto, setModalAbierto] = useState<"terminos" | "privacidad" | null>(null);

  // Estados del formulario completo
  const [formData, setFormData] = useState({
    // Paso 1: Empresa
    nombreEmpresa: "",
    categoria: "",
    ciudad: "La Paz",
    linkRedes: "",
    // Paso 2: Persona
    nombreRepresentante: "",
    email: "",
    telefono: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarSiguiente = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2);
  };

  const manejarRegistroFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Simulación de registro y redirección al home del panel
    setTimeout(() => {
      setCargando(false);
      router.push("/business/proveedores/home");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col font-sans">
      
      {/* HEADER SIMPLIFICADO */}
      <nav className="p-6 md:px-12 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="cursor-pointer" onClick={() => router.push("/business")}>
          <img src="/logo/logo-business-expandido.png" alt="Emotia Business" className="h-8 object-contain" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: P.choco }}>
          <ShieldCheck size={18} style={{ color: P.dorado }} />
          <span>Registro Seguro</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-xl">
          
          {/* INDICADOR DE PASOS */}
          <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                style={{ 
                  background: paso >= 1 ? P.bordoNegro : P.blanco, 
                  color: paso >= 1 ? P.blanco : P.choco,
                  border: `2px solid ${paso >= 1 ? P.bordoNegro : '#e5e7eb'}` 
                }}
              >
                <Building2 size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: paso === 1 ? P.bordoNegro : '#9ca3af' }}>Tu Negocio</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                style={{ 
                  background: paso === 2 ? P.bordoNegro : P.blanco, 
                  color: paso === 2 ? P.blanco : '#9ca3af',
                  border: `2px solid ${paso === 2 ? P.bordoNegro : '#e5e7eb'}` 
                }}
              >
                <User size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: paso === 2 ? P.bordoNegro : '#9ca3af' }}>Tu Perfil</span>
            </div>
          </div>

          {/* CONTENEDOR DEL FORMULARIO */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {paso === 1 ? (
                <motion.div
                  key="paso1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2" style={{ color: P.bordoNegro }}>Registra tu negocio</h1>
                    <p className="text-sm font-medium" style={{ color: P.choco }}>Cuéntanos sobre tu marca o taller artesanal.</p>
                  </div>

                  <form onSubmit={manejarSiguiente} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Nombre del Negocio</label>
                      <input 
                        required name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange}
                        placeholder="Ej: Joyería Los Andes" 
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 outline-none transition-all"
                        style={{ border: `1px solid ${P.beige}` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Categoría</label>
                        <select 
                          name="categoria" value={formData.categoria} onChange={handleChange}
                          className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none appearance-none"
                          style={{ border: `1px solid ${P.beige}` }}
                        >
                          <option value="">Selecciona...</option>
                          <option value="artesanias">Artesanías</option>
                          <option value="joyeria">Joyería</option>
                          <option value="flores">Florería</option>
                          <option value="gourmet">Gourmet / Comida</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Ciudad Base</label>
                        <input name="ciudad" value={formData.ciudad} disabled className="w-full px-5 py-4 rounded-2xl bg-gray-100 border text-gray-400 cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="space-y-1.5 pb-4">
                      <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Redes Sociales o Web (Opcional)</label>
                      <input 
                        name="linkRedes" value={formData.linkRedes} onChange={handleChange}
                        placeholder="instagram.com/tu_negocio" 
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
                        style={{ border: `1px solid ${P.beige}` }}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 group transition-all"
                      style={{ background: P.bordoNegro, boxShadow: `0 10px 25px ${P.bordoNegro}30` }}
                    >
                      Siguiente Paso <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="paso2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
                >
                  <button onClick={() => setPaso(1)} className="flex items-center gap-1.5 text-xs font-bold mb-6 hover:opacity-70 transition-opacity" style={{ color: P.doradoOscuro }}>
                    <ArrowLeft size={14} /> Volver a datos del negocio
                  </button>

                  <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2" style={{ color: P.bordoNegro }}>Crea tu cuenta</h1>
                    <p className="text-sm font-medium" style={{ color: P.choco }}>Tus datos de acceso personales y de contacto.</p>
                  </div>

                  <form onSubmit={manejarRegistroFinal} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Nombre Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          required name="nombreRepresentante" value={formData.nombreRepresentante} onChange={handleChange}
                          placeholder="Tu nombre y apellido" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Correo Corporativo</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          required type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="nombre@tunegocio.com" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Celular / WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required name="telefono" value={formData.telefono} onChange={handleChange}
                            placeholder="71234567" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Contraseña</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required type="password" name="password" value={formData.password} onChange={handleChange}
                            placeholder="••••••••" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none" style={{ border: `1px solid ${P.beige}` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" disabled={cargando}
                      className="w-full py-4 mt-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 group transition-all"
                      style={{ background: cargando ? P.gris : P.bordoNegro, boxShadow: cargando ? 'none' : `0 10px 25px ${P.bordoNegro}30` }}
                    >
                      {cargando ? "Procesando..." : <>Finalizar Registro <CheckCircle2 size={20} /></>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PARTE SUBRAYADA CON LOS CLICKS A MODALES */}
          <p className="mt-8 text-center text-xs font-medium text-gray-400">
            Al registrarte, aceptas nuestros{" "}
            <span 
              onClick={() => setModalAbierto("terminos")} 
              className="underline cursor-pointer transition-colors hover:text-[#3D0A1A]" 
              style={{ color: P.dorado }}
            >
              Términos de Socio
            </span>{" "}
            y{" "}
            <span 
              onClick={() => setModalAbierto("privacidad")} 
              className="underline cursor-pointer transition-colors hover:text-[#3D0A1A]" 
              style={{ color: P.dorado }}
            >
              Privacidad
            </span>.
          </p>
        </div>
      </main>

      {/* MODALES LEGALES (IDÉNTICOS AL FOOTER) */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAbierto(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ background: P.dorado }}></div>
              <button onClick={() => setModalAbierto(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} style={{ color: P.bordoNegro }} />
              </button>

              <div className="max-h-[70vh] overflow-y-auto">
                {modalAbierto === "terminos" ? (
                  <div className="p-2">
                    <h3 className="text-2xl font-black mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>Términos de Servicio</h3>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                      <p>Al unirte como Socio Proveedor a Emotia Business, aceptas nuestros términos de colaboración corporativa.</p>
                      <p><strong>1. Calidad Garantizada:</strong> Te comprometes a mantener los más altos estándares artesanales y respetar los tiempos de preparación establecidos.</p>
                      <p><strong>2. Pagos y Comisiones:</strong> Emotia retiene una tarifa de intermediación por cada venta exitosa. Los desembolsos se realizan semanalmente.</p>
                      <p><strong>3. Gestión de Pedidos:</strong> Todo pedido aceptado debe ser empaquetado bajo los lineamientos premium de Emotia.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    <h3 className="text-2xl font-black mb-4" style={{ color: P.bordoNegro, fontFamily: "'Montserrat', sans-serif" }}>Política de Privacidad</h3>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: P.choco }}>
                      <p>En Emotia valoramos y protegemos la información de tu negocio como nuestro activo más importante.</p>
                      <p><strong>Datos Recopilados:</strong> Guardamos información de ventas, inventario y datos de contacto estrictamente para el funcionamiento de tu panel.</p>
                      <p><strong>Seguridad:</strong> Utilizamos protocolos de encriptación avanzados para asegurar que tu información corporativa esté a salvo.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 text-right">
                <button onClick={() => setModalAbierto(null)} className="px-6 py-2.5 rounded-xl font-bold text-white transition-transform hover:scale-105" style={{ background: P.bordoNegro }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}