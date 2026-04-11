"use client";
import { useState, useEffect } from 'react';
import { X, User, Camera, MapPin, Phone, CalendarDays, Heart, Bell, Shield, Trash2, Plus } from 'lucide-react';
import { useUser } from "@stackframe/stack"; 

const TABS = ['Personal', 'Contacto', 'Preferencias', 'Seguridad'];

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Personal');
  
  const user = useUser();
  const [inicializado, setInicializado] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  // ESTADO ACTUALIZADO: Ahora "direcciones" es una lista (array)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    direcciones: [
      { id: Date.now(), alias: "Casa", ciudad: "La Paz", direccion: "", zona: "" }
    ]
  });

  useEffect(() => {
    if (user && !inicializado) {
      const datosGuardados = localStorage.getItem("emotia_perfil_usuario");

      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        
        // TRUCO: Migración para tu memoria vieja que no tenía el array de direcciones
        if (!parsed.direcciones) {
          parsed.direcciones = [{ 
            id: Date.now(), 
            alias: "Principal", 
            ciudad: parsed.ciudad || "La Paz", 
            direccion: parsed.direccion || "", 
            zona: parsed.zona || "" 
          }];
        }
        setFormData(parsed);
      } else {
        const nameParts = (user.displayName || "").split(" ");
        setFormData(prev => ({
          ...prev,
          nombre: nameParts[0] || "",
          apellido: nameParts.slice(1).join(" ") || "",
          correo: user.primaryEmail || prev.correo
        }));
      }

      setInicializado(true); 
    }
  }, [user, inicializado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === FUNCIONES PARA LA LIBRETA DE DIRECCIONES ===
  const agregarDireccion = () => {
    const nuevaDir = { id: Date.now(), alias: "", ciudad: "La Paz", direccion: "", zona: "" };
    setFormData({ ...formData, direcciones: [...formData.direcciones, nuevaDir] });
  };

  const eliminarDireccion = (id: number) => {
    setFormData({ ...formData, direcciones: formData.direcciones.filter(d => d.id !== id) });
  };

  const actualizarDireccion = (id: number, campo: string, valor: string) => {
    setFormData({
      ...formData,
      direcciones: formData.direcciones.map(d => d.id === id ? { ...d, [campo]: valor } : d)
    });
  };
  // ================================================

  const getInitials = () => {
    if (formData.nombre && formData.apellido) return `${formData.nombre[0]}${formData.apellido[0]}`.toUpperCase();
    if (formData.nombre) return formData.nombre.substring(0, 2).toUpperCase();
    if (user?.primaryEmail) return user.primaryEmail.substring(0, 2).toUpperCase();
    return "U"; 
  };

  const handleGuardar = () => {
    console.log("Datos listos para enviar a la BDD:", formData);
    localStorage.setItem("emotia_perfil_usuario", JSON.stringify(formData));
    onClose();
  };

  const handleEliminarCuenta = () => {
    console.log("ALERTA: Solicitud para ELIMINAR CUENTA");
    onClose();
  };

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
            <div className="w-20 h-20 bg-[#F5E6D0] rounded-full border-4 border-[#FFFFFF] shadow-md flex items-center justify-center text-[#8E1B3A] text-2xl font-bold uppercase">
              {getInitials()}
            </div>
            <button className="absolute bottom-0 right-0 bg-[#BC9968] text-[#FFFFFF] p-1.5 rounded-full shadow-sm hover:bg-[#8E1B3A] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#F5E6D0] shrink-0 px-4">
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setConfirmarEliminar(false); }}
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
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Apellido</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Correo Electrónico</label>
                <input type="email" name="correo" value={formData.correo} disabled className="w-full border border-[#F5E6D0] bg-gray-50 rounded-xl p-3 focus:outline-none text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Género</label>
                <select name="genero" value={formData.genero} onChange={handleChange} className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm text-[#5C3A2E]">
                  <option value="">Selecciona uno...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decir">Prefiero no decir</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'Contacto' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-[#5C3A2E] mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono / WhatsApp Principal</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-[#F5E6D0] rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A] text-sm" />
              </div>

              {/* === NUEVA SECCIÓN DE DIRECCIONES === */}
              <div className="border-t border-[#F5E6D0] pt-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[#5C3A2E] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8E1B3A]" /> Libreta de Direcciones
                  </h3>
                  <button onClick={agregarDireccion} className="flex items-center gap-1 text-xs font-bold text-[#8E1B3A] bg-[#F5E6D0] px-3 py-1.5 rounded-lg hover:bg-[#EBD6B1] transition-colors">
                    <Plus className="w-3 h-3" /> Nueva
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.direcciones.map((dir, index) => (
                    <div key={dir.id} className="p-4 border border-[#F5E6D0] rounded-xl bg-[#F5E6D0]/10 relative group">
                      
                      {/* Botón eliminar (Oculto hasta hacer hover) */}
                      {formData.direcciones.length > 1 && (
                        <button 
                          onClick={() => eliminarDireccion(dir.id)} 
                          title="Eliminar dirección"
                          className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-full shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8E1B3A] uppercase mb-1">Alias</label>
                          <input type="text" value={dir.alias} onChange={(e) => actualizarDireccion(dir.id, 'alias', e.target.value)} placeholder="Ej: Casa, Trabajo" className="w-full bg-white border border-[#F5E6D0] rounded-lg p-2 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#8E1B3A] uppercase mb-1">Ciudad</label>
                          <input type="text" value={dir.ciudad} onChange={(e) => actualizarDireccion(dir.id, 'ciudad', e.target.value)} className="w-full bg-white border border-[#F5E6D0] rounded-lg p-2 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-[10px] font-bold text-[#8E1B3A] uppercase mb-1">Dirección Exacta</label>
                        <input type="text" value={dir.direccion} onChange={(e) => actualizarDireccion(dir.id, 'direccion', e.target.value)} className="w-full bg-white border border-[#F5E6D0] rounded-lg p-2 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8E1B3A] uppercase mb-1">Referencias</label>
                        <input type="text" value={dir.zona} onChange={(e) => actualizarDireccion(dir.id, 'zona', e.target.value)} placeholder="Ej: Puerta verde, frente al parque..." className="w-full bg-white border border-[#F5E6D0] rounded-lg p-2 focus:outline-none focus:border-[#8E1B3A] text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* === FIN SECCIÓN DE DIRECCIONES === */}
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

              <div className="mt-8 pt-6 border-t border-red-100">
                <h3 className="text-red-600 font-bold text-sm mb-2">Zona de Peligro</h3>
                
                {!confirmarEliminar ? (
                  <button 
                    onClick={() => setConfirmarEliminar(true)}
                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors text-sm"
                  >
                    Eliminar mi cuenta y todos mis datos
                  </button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 animate-in zoom-in-95 duration-200">
                    <p className="text-sm text-red-800 font-medium mb-4">
                      ¿Estás absolutamente seguro? Esta acción <strong>no se puede deshacer</strong>. Perderás todos tus puntos, insignias e historial.
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setConfirmarEliminar(false)}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-50 text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleEliminarCuenta}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 text-sm transition-colors shadow-sm"
                      >
                        Sí, eliminar todo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F5E6D0] shrink-0">
          <button onClick={handleGuardar} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}