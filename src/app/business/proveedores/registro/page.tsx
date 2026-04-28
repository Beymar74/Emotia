"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Building2, User } from "lucide-react";

// Importamos la acción de Base de Datos y los componentes visuales
import { registrarProveedorDB } from "./actions";
import { PasoEmpresa, PasoRepresentante } from "./_components/FormulariosRegistro";

const P = { bordoNegro: "#3D0A1A", dorado: "#BC9968", choco: "#5C3A2E", blanco: "#FFFFFF" };

export default function RegistroProductorPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [errorSQL, setErrorSQL] = useState("");

  const [formData, setFormData] = useState({
    nombreEmpresa: "", categoria: "", ciudad: "La Paz", linkRedes: "",
    nombreRepresentante: "", email: "", telefono: "", password: "",
    anioNacimiento: "" // <-- Se inicializa vacío
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ESTA ES LA FUNCIÓN QUE CONECTA CON PRISMA
  const manejarRegistroFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErrorSQL("");
    
    // Llamamos al Server Action
    const resultado = await registrarProveedorDB(formData);

    if (resultado.success) {
      // Registro exitoso en la Base de Datos
      setCargando(false);
      // Redirigimos al login con un parámetro de éxito
      router.push("/business/proveedores/login?registrado=true");
    } else {
      // Si falla (ej. correo duplicado)
      setCargando(false);
      setErrorSQL(resultado.error || "Ocurrió un error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col font-sans">
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
          
          {/* Indicador de pasos */}
          <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: paso >= 1 ? P.bordoNegro : P.blanco, color: paso >= 1 ? P.blanco : P.choco, border: `2px solid ${paso >= 1 ? P.bordoNegro : '#e5e7eb'}` }}>
                <Building2 size={20} />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: paso === 2 ? P.bordoNegro : P.blanco, color: paso === 2 ? P.blanco : '#9ca3af', border: `2px solid ${paso === 2 ? P.bordoNegro : '#e5e7eb'}` }}>
                <User size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
            
            {/* Mostrar errores de la base de datos si existen */}
            {errorSQL && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
                {errorSQL}
              </div>
            )}

            <AnimatePresence mode="wait">
              {paso === 1 ? (
                <PasoEmpresa 
                  key="paso1" formData={formData} handleChange={handleChange} onNext={() => setPaso(2)} 
                />
              ) : (
                <PasoRepresentante 
                  key="paso2" formData={formData} handleChange={handleChange} onBack={() => setPaso(1)} onSubmit={manejarRegistroFinal} cargando={cargando} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}