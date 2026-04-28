"use client";
import { useState } from 'react';
import { CalendarDays, Plus, Trash2, Bell, Heart, Gift, Star, Cake, Users } from 'lucide-react';

const OCASION_ICONS: Record<string, any> = {
  'Cumpleaños': Cake,
  'Aniversario': Heart,
  'Día de la Madre': Gift,
  'Graduación': Star,
  'Otro': CalendarDays,
};

const MOCK_DATES = [
  { id: 1, nombre: 'Aniversario de Papás', fecha: '2026-04-05', ocasion: 'Aniversario', recordar: 7 },
  { id: 2, nombre: 'Cumpleaños de Andrea', fecha: '2026-05-15', ocasion: 'Cumpleaños', recordar: 3 },
];

function diasRestantes(fecha: string) {
  const hoy = new Date();
  const target = new Date(fecha);
  target.setFullYear(hoy.getFullYear());
  if (target < hoy) target.setFullYear(hoy.getFullYear() + 1);
  return Math.ceil((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export default function SpecialDatesPage() {
  const [dates, setDates] = useState(MOCK_DATES);
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState({ nombre: '', fecha: '', ocasion: 'Cumpleaños', recordar: 7 });

  const addDate = () => {
    if (!newDate.nombre || !newDate.fecha) return;
    setDates(prev => [...prev, { ...newDate, id: Date.now() }]);
    setNewDate({ nombre: '', fecha: '', ocasion: 'Cumpleaños', recordar: 7 });
    setShowForm(false);
  };

  const removeDate = (id: number) => setDates(prev => prev.filter(d => d.id !== id));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-2 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-[#BC9968]" /> Fechas Especiales
          </h1>
          <p className="text-[#5C3A2E]">Registra las fechas importantes y nunca olvides sorprender a quien amas.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
          <Plus className="w-5 h-5" /> Agregar
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#F5E6D0] shadow-md mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-[#5A0F24] mb-4 text-lg">Nueva Fecha Especial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nombre o Descripción</label>
              <input type="text" value={newDate.nombre} onChange={e => setNewDate({...newDate, nombre: e.target.value})}
                className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm"
                placeholder="Ej: Cumpleaños de mamá" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Fecha</label>
              <input type="date" value={newDate.fecha} onChange={e => setNewDate({...newDate, fecha: e.target.value})}
                className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Ocasión</label>
              <select value={newDate.ocasion} onChange={e => setNewDate({...newDate, ocasion: e.target.value})}
                className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]">
                {Object.keys(OCASION_ICONS).map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Recordarme con anticipación</label>
              <select value={newDate.recordar} onChange={e => setNewDate({...newDate, recordar: parseInt(e.target.value)})}
                className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]">
                <option value={1}>1 día antes</option>
                <option value={3}>3 días antes</option>
                <option value={7}>1 semana antes</option>
                <option value={15}>2 semanas antes</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addDate} className="flex-1 bg-[#8E1B3A] text-white py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors">Guardar Fecha</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold border border-[#F5E6D0] text-[#5C3A2E] hover:bg-[#F5E6D0] transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista de fechas */}
      <div className="space-y-4">
        {dates.sort((a, b) => diasRestantes(a.fecha) - diasRestantes(b.fecha)).map((date) => {
          const dias = diasRestantes(date.fecha);
          const Icon = OCASION_ICONS[date.ocasion] ?? CalendarDays;
          const urgente = dias <= date.recordar;
          return (
            <div key={date.id} className={`bg-[#FFFFFF] rounded-2xl p-6 border shadow-sm flex items-center justify-between gap-4 transition-shadow hover:shadow-md ${urgente ? 'border-[#BC9968] bg-[#F5E6D0]/20' : 'border-[#F5E6D0]'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${urgente ? 'bg-[#8E1B3A]' : 'bg-[#F5E6D0]'}`}>
                  <Icon className={`w-6 h-6 ${urgente ? 'text-white' : 'text-[#8E1B3A]'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#5C3A2E] text-lg">{date.nombre}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-[#8E1B3A] font-semibold">{date.ocasion}</span>
                    <span className="text-xs text-[#B0B0B0]">{new Date(date.fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'long' })}</span>
                    {urgente && (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#8E1B3A] bg-[#F5E6D0] px-2 py-0.5 rounded-full">
                        <Bell className="w-3 h-3" /> ¡Pronto!
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center hidden sm:block">
                  <p className={`text-2xl font-extrabold ${dias <= 7 ? 'text-[#8E1B3A]' : 'text-[#5C3A2E]'}`}>{dias}</p>
                  <p className="text-xs text-[#B0B0B0]">días</p>
                </div>
                <button onClick={() => removeDate(date.id)} className="p-2 text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {dates.length === 0 && (
        <div className="text-center py-16">
          <CalendarDays className="w-16 h-16 text-[#F5E6D0] mx-auto mb-4" />
          <p className="text-[#B0B0B0] font-medium">No hay fechas registradas todavía.</p>
          <p className="text-sm text-[#B0B0B0]">Agrega la primera para no olvidar ningún momento especial.</p>
        </div>
      )}
    </main>
  );
}
