"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Mail, Lock, ArrowRight, ShieldCheck, 
  Loader2, Store, HelpCircle, AlertCircle, CheckCircle2
} from "lucide-react";
import { validarLogin } from "./actions";

const P = {
  bordoNegro: "#3D0A1A", bordoOscuro: "#5A0F24", granate: "#8E1B3A",
  dorado: "#BC9968", doradoOscuro: "#9A7A48", choco: "#5C3A2E",
  beige: "#F5E6D0", blanco: "#FFFFFF", negro: "#1A1A1A", gris: "#B0B0B0"
};

export default function LoginProductorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registradoRecientemente = searchParams.get("registrado") === "true";

  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const manejarLogin = async (formData: FormData) => {
    setCargando(true);
    setErrorMsg("");

    // Llamamos a la base de datos
    const resultado = await validarLogin(formData);

    if (resultado?.error) {
      setErrorMsg(resultado.error);
      setCargando(false);
    } else if (resultado?.success) {
      // Si fue exitoso, vamos al panel
      router.push("/business/proveedores/home");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col font-sans">
      
      <nav className="p-6 md:px-12 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="cursor-pointer" onClick={() => router.push("/business")}>
          <img src="/logo/logo-business-expandido.png" alt="Emotia Business" className="h-8 object-contain" />
        </div>
        <button 
          onClick={() => router.push("/business/proveedores/registro")}
          className="text-sm font-bold flex items-center gap-2 hover:opacity-70 transition-opacity"
          style={{ color: P.bordoNegro }}
        >
          ¿No tienes cuenta? <span style={{ color: P.dorado }}>Regístrate</span>
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 pb-20 relative overflow-hidden">
        
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-10" style={{ background: P.dorado }}></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full blur-[100px] opacity-10" style={{ background: P.granate }}></div>

        <div className="w-full max-w-md relative z-10">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-gray-200/60 border border-gray-100">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#F5E6D0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Store size={32} style={{ color: P.bordoNegro }} />
              </div>
              <h1 className="text-3xl font-black mb-2" style={{ color: P.bordoNegro }}>Portal de Socios</h1>
              <p className="text-sm font-medium" style={{ color: P.choco }}>Ingresa a tu panel de gestión corporativa.</p>
            </div>

            {/* Mensaje de Éxito al venir de Registro */}
            {registradoRecientemente && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
                <CheckCircle2 size={18} /> Cuenta creada con éxito. Inicia sesión.
              </div>
            )}

            {/* Mensaje de Error */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {/* Fíjate que cambiamos onSubmit por action={manejarLogin} para usar FormData */}
            <form action={manejarLogin} className="space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider ml-1" style={{ color: P.doradoOscuro }}>Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#BC9968] transition-colors" size={18} />
                  <input required type="email" name="email" placeholder="socio@tu-negocio.com" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none focus:bg-white focus:ring-2 transition-all" style={{ border: `1px solid ${P.beige}` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: P.doradoOscuro }}>Contraseña</label>
                  <button type="button" className="text-[10px] font-bold underline opacity-60 hover:opacity-100 transition-opacity">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#BC9968] transition-colors" size={18} />
                  <input required type="password" name="password" placeholder="••••••••" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border outline-none focus:bg-white focus:ring-2 transition-all" style={{ border: `1px solid ${P.beige}` }} />
                </div>
              </div>

              <button type="submit" disabled={cargando} className="w-full py-4 mt-2 rounded-2xl font-black text-white flex items-center justify-center gap-2 group transition-all active:scale-95 shadow-xl" style={{ background: cargando ? P.gris : P.bordoNegro, boxShadow: cargando ? 'none' : `0 10px 25px ${P.bordoNegro}30` }}>
                {cargando ? <>Autenticando... <Loader2 size={20} className="animate-spin" /></> : <>Entrar al Panel <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-300">
              <div className="h-[1px] flex-1 bg-gray-100"></div>
              <span>Conexión Segura</span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
             <div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={14} /> Encriptación SSL</div>
             <div className="flex items-center gap-2 text-xs font-bold cursor-pointer hover:opacity-100"><HelpCircle size={14} /> Centro de Ayuda</div>
          </div>
        </div>
      </main>
    </div>
  );
}