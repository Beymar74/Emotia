"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Building2, User, Check } from "lucide-react";

import { registrarProveedorDB } from "./actions";
import {
  PasoEmpresa,
  PasoRepresentante,
  RedSocialRegistro,
} from "./_components/FormulariosRegistro";

const P = {
  bordoNegro: "#3D0A1A",
  dorado: "#BC9968",
  choco: "#5C3A2E",
  blanco: "#FFFFFF",
  beige: "#F5E6D0",
};

export default function RegistroProductorPage() {
  const router = useRouter();

  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [errorSQL, setErrorSQL] = useState("");

  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    categorias: [] as string[],
    ciudad: "La Paz",
    direccionNegocio: "",
    referenciaDireccion: "",
    redesSociales: [] as RedSocialRegistro[],
    nombreRepresentante: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    anioNacimiento: "",
    aceptaTerminos: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleCategoria = (categoria: string) => {
    setFormData((prev) => {
      const yaExiste = prev.categorias.includes(categoria);

      return {
        ...prev,
        categorias: yaExiste
          ? prev.categorias.filter((c) => c !== categoria)
          : [...prev.categorias, categoria],
      };
    });
  };

  const agregarRedSocial = () => {
    setFormData((prev) => {
      const plataformasUsadas = prev.redesSociales.map((r) => r.plataforma);

      const plataformasDisponibles = [
        "instagram",
        "tiktok",
        "facebook",
        "whatsapp",
        "web",
      ].filter((p) => !plataformasUsadas.includes(p));

      if (plataformasDisponibles.length === 0) {
        return prev;
      }

      return {
        ...prev,
        redesSociales: [
          ...prev.redesSociales,
          {
            plataforma: plataformasDisponibles[0],
            url: "",
          },
        ],
      };
    });
  };

  const actualizarRedSocial = (
    index: number,
    campo: keyof RedSocialRegistro,
    valor: string
  ) => {
    setFormData((prev) => {
      const nuevasRedes = [...prev.redesSociales];

      nuevasRedes[index] = {
        ...nuevasRedes[index],
        [campo]: valor,
      };

      return {
        ...prev,
        redesSociales: nuevasRedes,
      };
    });
  };

  const eliminarRedSocial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      redesSociales: prev.redesSociales.filter((_, i) => i !== index),
    }));
  };

  const manejarRegistroFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    setCargando(true);
    setErrorSQL("");

    const resultado = await registrarProveedorDB(formData);

    if (resultado.success) {
      setCargando(false);
      router.push("/business/proveedores/login?registrado=true");
    } else {
      setCargando(false);
      setErrorSQL(resultado.error || "Ocurrió un error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col font-sans">
      <nav className="h-16 px-6 md:px-12 flex justify-between items-center bg-white/70 backdrop-blur-sm sticky top-0 z-50 border-b border-black/5">
        <div className="cursor-pointer" onClick={() => router.push("/business")}>
          <img
            src="/logo/logo-business-expandido.png"
            alt="Emotia Business"
            className="h-8 object-contain"
          />
        </div>

        <div
          className="flex items-center gap-2 text-sm font-bold"
          style={{ color: P.choco }}
        >
          <ShieldCheck size={17} style={{ color: P.dorado }} />
          <span>Registro Seguro</span>
        </div>
      </nav>

      <main className="flex-1 flex justify-center px-6 py-10 md:py-12">
        <div className="w-full max-w-3xl">
          <div className="mb-10">
            <div className="relative flex items-start justify-between">
            <div className="absolute left-[52px] right-[52px] top-5 h-0.5 bg-gray-200 z-0 -translate-y-1/2" />

            <div
              className="absolute left-[52px] top-5 h-0.5 z-0 transition-all duration-500 -translate-y-1/2"
              style={{
                width: paso === 1 ? "25%" : "calc(100% - 104px)",
                background: paso === 1 ? P.bordoNegro : P.dorado,
              }}
            />

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm"
                  style={{
                    background: paso > 1 ? P.dorado : P.bordoNegro,
                    color: P.blanco,
                    border: `2px solid ${paso > 1 ? P.dorado : P.bordoNegro}`,
                  }}
                >
                  {paso > 1 ? <Check size={19} /> : <Building2 size={20} />}
                </div>

                <span
                  className="hidden sm:block text-xs font-bold"
                  style={{ color: paso >= 1 ? P.bordoNegro : "#9ca3af" }}
                >
                  1. Datos del negocio
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm"
                  style={{
                    background: paso === 2 ? P.bordoNegro : P.blanco,
                    color: paso === 2 ? P.blanco : "#9ca3af",
                    border: `2px solid ${paso === 2 ? P.bordoNegro : "#e5e7eb"}`,
                  }}
                >
                  <User size={20} />
                </div>

                <span
                  className="hidden sm:block text-xs font-bold"
                  style={{ color: paso === 2 ? P.bordoNegro : "#9ca3af" }}
                >
                  2. Datos personales
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
            {errorSQL && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
                {errorSQL}
              </div>
            )}

            <AnimatePresence mode="wait">
              {paso === 1 ? (
                <PasoEmpresa
                  key="paso1"
                  formData={formData}
                  handleChange={handleChange}
                  toggleCategoria={toggleCategoria}
                  agregarRedSocial={agregarRedSocial}
                  actualizarRedSocial={actualizarRedSocial}
                  eliminarRedSocial={eliminarRedSocial}
                  onNext={() => setPaso(2)}
                />
              ) : (
                <PasoRepresentante
                  key="paso2"
                  formData={formData}
                  handleChange={handleChange}
                  onBack={() => setPaso(1)}
                  onSubmit={manejarRegistroFinal}
                  cargando={cargando}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center items-center gap-2 text-xs font-medium text-gray-400">
            <ShieldCheck size={15} style={{ color: P.dorado }} />
            <span>Tu información está protegida y será tratada de forma confidencial.</span>
          </div>
        </div>
      </main>
    </div>
  );
}