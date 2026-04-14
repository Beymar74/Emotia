"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PackagePlus, BarChart, Settings } from "lucide-react";

export default function BusinessWelcome() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Estilo para la fuente cursiva carta */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playball&display=swap');
        .fuente-carta { 
          font-family: 'Playball', cursive; 
        }
      `}} />

      {/* Banner de Bienvenida con tu Degradado Correcto */}
      <div 
        className="rounded-3xl p-10 text-white shadow-xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3D0A1A 0%, #8E1B3A 100%)" }}
      >
        {/* Decoración de fondo original */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M45.7,-76.1C58.9,-69.3,69.1,-55.3,77.1,-40.5C85.1,-25.7,90.8,-10.1,88.7,4.6C86.5,19.3,76.5,33.1,65.2,44.3C53.9,55.5,41.2,64.2,26.9,70.5C12.5,76.8,-3.4,80.8,-18.4,78.3C-33.3,75.8,-47.4,66.8,-59.5,55.3C-71.6,43.8,-81.8,29.8,-86.1,13.8C-90.4,-2.2,-88.9,-20.1,-81.1,-35.1C-73.3,-50.1,-59.3,-62.1,-44.6,-68.5C-29.8,-74.9,-14.9,-75.7,0.7,-76.8C16.3,-77.8,32.6,-82.9,45.7,-76.1Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Título con Letra Carta Aplicada */}
          <h1 className="text-5xl md:text-6xl mb-4 fuente-carta tracking-wide">
            ¡Hola, Artesanías La Paz!
          </h1>
          <p className="text-lg md:text-xl text-[#F5E6D0] max-w-2xl font-light">
            Bienvenido al panel premium de proveedores de Emotia. Estamos listos para ayudarte a llevar regalos inolvidables a más personas. ¿Qué te gustaría hacer hoy?
          </p>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">Accesos Rápidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <Link href="/business/dashboard" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-[#F5E6D0] transition-all">
          <div className="h-14 w-14 rounded-full bg-[#F5E6D0] text-[#8E1B3A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BarChart size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#3D0A1A] mb-2">Ver mi Dashboard</h3>
          <p className="text-[#B0B0B0] text-sm mb-6">Revisa tus ventas, ingresos y pedidos pendientes de hoy.</p>
          <div className="flex items-center text-[#BC9968] font-bold text-sm">
            Ir al dashboard <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/business/productos" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-[#F5E6D0] transition-all">
          <div className="h-14 w-14 rounded-full bg-[#F5E6D0] text-[#8E1B3A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PackagePlus size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#3D0A1A] mb-2">Añadir Productos</h3>
          <p className="text-[#B0B0B0] text-sm mb-6">Actualiza tu catálogo y añade nuevas opciones de personalización.</p>
          <div className="flex items-center text-[#BC9968] font-bold text-sm">
            Ir al catálogo <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/business/perfil" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-[#F5E6D0] transition-all">
          <div className="h-14 w-14 rounded-full bg-[#F5E6D0] text-[#8E1B3A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Settings size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#3D0A1A] mb-2">Configurar Tienda</h3>
          <p className="text-[#B0B0B0] text-sm mb-6">Actualiza tu logo, descripción y datos de contacto de tu negocio.</p>
          <div className="flex items-center text-[#BC9968] font-bold text-sm">
            Ir a mi perfil <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

      </div>
    </div>
  );
}