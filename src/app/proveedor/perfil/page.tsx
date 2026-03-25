"use client";
import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Store, MapPin, Phone, Star, Package, ShoppingBag, Camera, Save } from 'lucide-react';

const CATEGORIAS = ['Experiencias', 'Cenas', 'Detalles', 'Dulces', 'Flores', 'Spa'];

export default function PerfilProveedorPage() {
  const user = useUser();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-1">Mi Perfil de Proveedor</h1>
        <p className="text-[#5C3A2E] text-sm">Esta información será visible para los compradores en Emotia.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Ventas', valor: '95', icon: ShoppingBag },
          { label: 'Productos', valor: '8', icon: Package },
          { label: 'Calificación', valor: '4.9', icon: Star },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#F5E6D0] shadow-sm text-center">
            <s.icon className="w-5 h-5 text-[#BC9968] mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-[#5A0F24]">{s.valor}</p>
            <p className="text-xs text-[#B0B0B0] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5E6D0] shadow-sm overflow-hidden">
        {/* Foto/banner */}
        <div className="h-28 bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] relative">
          <button className="absolute bottom-3 right-3 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-10 mb-4">
            <div className="w-20 h-20 bg-[#F5E6D0] rounded-full border-4 border-white shadow-md flex items-center justify-center text-[#8E1B3A] text-2xl font-bold">
              {(user?.displayName ?? 'P').charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nombre del Negocio</label>
                <input type="text" defaultValue={user?.displayName ?? ''} placeholder="Ej: Regalos Artesanales Bolivia"
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp</label>
                <input type="tel" defaultValue="+591 78901234"
                  className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Correo de Contacto</label>
              <input type="email" defaultValue={user?.primaryEmail ?? ''}
                className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Ciudad / Zona de Cobertura</label>
              <input type="text" defaultValue="La Paz - Toda la ciudad"
                className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><Store className="w-3 h-3" /> Descripción del Negocio</label>
              <textarea rows={3} defaultValue="Ofrecemos regalos artesanales únicos con entrega el mismo día en La Paz."
                className="w-full border border-[#F5E6D0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E1B3A] resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-3">Categorías que ofrezco</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIAS.map(c => (
                  <label key={c} className="flex items-center gap-2 p-2.5 rounded-xl border border-[#F5E6D0] cursor-pointer hover:border-[#BC9968] transition-colors">
                    <input type="checkbox" defaultChecked={['Detalles','Spa','Experiencias'].includes(c)} className="accent-[#8E1B3A]" />
                    <span className="text-xs font-medium text-[#5C3A2E]">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleSave}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${saved ? 'bg-green-500 text-white' : 'bg-[#8E1B3A] text-white hover:bg-[#5A0F24]'}`}>
              <Save className="w-5 h-5" />
              {saved ? '¡Guardado correctamente!' : 'Guardar Perfil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
