"use client";
import { useState } from 'react';
import { X, User, Settings, Camera, MapPin, Phone, CalendarDays, Heart, Bell, Shield } from 'lucide-react';

const TABS = ['Personal', 'Contacto', 'Preferencias', 'Seguridad'];

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Personal');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5A0F24]/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] p-6 text-[#FFFFFF] flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2"><User className="w-5 h-5" /> Mi Perfil</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#FFFFFF]/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center pt-6 pb-2 shrink-0 bg-[#FFFFFF]">
          <div className="relative">
            <div className="w-20 h-20 bg-[#F5E6D0] rounded-full border-4 border-[#FFFFFF] shadow-md flex items-center justify-center text-[#8E1B3A] text-2xl font-bold">BM</div>
            <button className="absolute bottom-0 right-0 bg-[#BC9968] text-[#FFFFFF] p-1.5 rounded-full shadow-sm hover:bg-[#8E1B3A] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#F5E6D0] shrink-0 px-4">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === tab ? 'border-[#8E1B3A] text-[#8E1B3A]' : 'border-transparent text-[#B0B0B0] hover:text-[#5C3A2E]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-grow p-6">

          {activeTab === 'Personal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nombre</label>
                  <input type="text" defaultValue="Beymar" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Apellido</label>
                  <input type="text" defaultValue="Mamani" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Correo Electrónico</label>
                <input type="email" defaultValue="beymar@ejemplo.com" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Fecha de Nacimiento</label>
                <input type="date" defaultValue="2000-05-15" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Género</label>
                <select className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]">
                  <option>Masculino</option><option>Femenino</option><option>Prefiero no decir</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'Contacto' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono / WhatsApp</label>
                <input type="tel" defaultValue="+591 78901234" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Ciudad</label>
                <input type="text" defaultValue="La Paz" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Dirección Principal de Entrega</label>
                <input type="text" defaultValue="Av. 6 de Agosto, Sopocachi" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Zona / Referencia</label>
                <input type="text" placeholder="Ej: Cerca al supermercado, edificio azul..." className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
            </div>
          )}

          {activeTab === 'Preferencias' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-3 flex items-center gap-1"><Heart className="w-3 h-3 text-[#8E1B3A]" /> Categorías favoritas</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Experiencias', 'Cenas', 'Detalles', 'Dulces', 'Flores', 'Spa'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 p-3 rounded-xl border border-[#F5E6D0] cursor-pointer hover:border-[#BC9968] transition-colors">
                      <input type="checkbox" defaultChecked={['Experiencias','Dulces'].includes(cat)} className="accent-[#8E1B3A]" />
                      <span className="text-sm font-medium text-[#5C3A2E]">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-3 flex items-center gap-1"><Bell className="w-3 h-3 text-[#BC9968]" /> Notificaciones</label>
                <div className="space-y-3">
                  {['Recordatorios de fechas especiales', 'Estado de mis pedidos', 'Nuevos productos y ofertas'].map(n => (
                    <label key={n} className="flex items-center justify-between p-3 rounded-xl border border-[#F5E6D0]">
                      <span className="text-sm text-[#5C3A2E]">{n}</span>
                      <input type="checkbox" defaultChecked className="accent-[#8E1B3A]" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Seguridad' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#F5E6D0]/30 rounded-xl p-4 border border-[#F5E6D0] flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-[#8E1B3A]" />
                <p className="text-sm text-[#5C3A2E]">Mantén tu cuenta segura actualizando tu contraseña regularmente.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Contraseña Actual</label>
                <input type="password" placeholder="••••••••" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nueva Contraseña</label>
                <input type="password" placeholder="••••••••" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Confirmar Nueva Contraseña</label>
                <input type="password" placeholder="••••••••" className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F5E6D0] shrink-0">
          <button onClick={onClose} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
