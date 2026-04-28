"use client";

import React, { useState } from "react";
import { 
  Clock, Package, CheckCircle, Truck, 
  MessageSquare, MapPin, ChevronRight,
  AlertTriangle, Eye, X, FileText, ImageIcon
} from "lucide-react";

interface Pedido {
  id: string;
  cliente: string;
  producto: string;
  imagen: string; // <-- Nuevo campo para la imagen
  personalizacion: string | null;
  direccion: string;
  total: string;
  estado: "Pendiente" | "En preparación" | "Listo" | "Entregado";
  fecha: string;
}

export default function PedidosPage() {
  // Datos simulados con las imágenes de Unsplash coherentes con el Catálogo
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { 
      id: "PED-1042", cliente: "Evelyn Burgoa", producto: "Caja Sorpresa Premium", 
      imagen: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&h=150&fit=crop&q=80",
      personalizacion: "Mensaje: 'Feliz Aniversario mi amor. Te amo.'", direccion: "Av. Arce #2520, Sopocachi", total: "150", estado: "Pendiente", fecha: "Hoy, 10:30 AM" 
    },
    { 
      id: "PED-1043", cliente: "Carlos Zenteno", producto: "Set de Chocolates", 
      imagen: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=150&h=150&fit=crop&q=80",
      personalizacion: null, direccion: "Calle 21 de Calacoto", total: "85", estado: "Pendiente", fecha: "Hoy, 11:15 AM" 
    },
    { 
      id: "PED-1041", cliente: "Beymar Mamani", producto: "Arreglo Floral + Peluche", 
      imagen: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=150&h=150&fit=crop&q=80",
      personalizacion: "Empaque extra rojo", direccion: "Ciudad Satélite, Plan 56", total: "220", estado: "En preparación", fecha: "Ayer, 16:45 PM" 
    },
    { 
      id: "PED-1040", cliente: "Mauricio Menacho", producto: "Taza Personalizada Mágica", 
      imagen: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=150&h=150&fit=crop&q=80",
      personalizacion: "Foto impresa de gatito", direccion: "Obrajes, Calle 14", total: "45", estado: "Listo", fecha: "Ayer, 09:20 AM" 
    },
    { 
      id: "PED-1039", cliente: "Lucía Pérez", producto: "Desayuno Sorpresa", 
      imagen: "https://images.unsplash.com/photo-1513885535616-e41c4dc9e846?w=150&h=150&fit=crop&q=80",
      personalizacion: "Sin fresas, alergia.", direccion: "Miraflores, Av. Busch", total: "180", estado: "Entregado", fecha: "11 Abr 2026" 
    },
  ]);

  const [pedidoAConfirmar, setPedidoAConfirmar] = useState<Pedido | null>(null);
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  const columnas = [
    { titulo: "Nuevos / Pendientes", estado: "Pendiente", color: "border-red-200", bg: "bg-red-50", icon: <Clock size={18} className="text-red-600" />, btnText: "Preparar Pedido" },
    { titulo: "En Preparación", estado: "En preparación", color: "border-orange-200", bg: "bg-orange-50", icon: <Package size={18} className="text-orange-600" />, btnText: "Marcar Listo" },
    { titulo: "Listos para Envío", estado: "Listo", color: "border-blue-200", bg: "bg-blue-50", icon: <Truck size={18} className="text-blue-600" />, btnText: "Marcar Entregado" },
    { titulo: "Completados", estado: "Entregado", color: "border-green-200", bg: "bg-gray-100", icon: <CheckCircle size={18} className="text-[#1A1A1A]" />, btnText: "" }
  ];

  const solicitarAvance = (pedido: Pedido) => setPedidoAConfirmar(pedido);

  const confirmarAvance = () => {
    if (!pedidoAConfirmar) return;
    const estados = ["Pendiente", "En preparación", "Listo", "Entregado"];
    const indexActual = estados.indexOf(pedidoAConfirmar.estado);
    if (indexActual < estados.length - 1) {
      const nuevoEstado = estados[indexActual + 1] as Pedido["estado"];
      setPedidos(pedidos.map(p => p.id === pedidoAConfirmar.id ? { ...p, estado: nuevoEstado } : p));
    }
    setPedidoAConfirmar(null);
  };

  const getSiguienteEstado = (estadoActual: string) => {
    const estados = ["Pendiente", "En preparación", "Listo", "Entregado"];
    return estados[estados.indexOf(estadoActual) + 1];
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto pb-12">
      
      <div>
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Gestión de Pedidos</h1>
        <p className="text-[#B0B0B0] mt-1 font-medium">Administra el flujo de trabajo. Las imágenes te ayudan a identificar los productos rápidamente.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        {columnas.map((columna) => {
          const pedidosColumna = pedidos.filter(p => p.estado === columna.estado);

          return (
            <div key={columna.estado} className="flex-1 min-w-[320px] max-w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col max-h-[75vh]">
              
              <div className={`p-4 border-b ${columna.color} ${columna.bg} rounded-t-2xl flex justify-between items-center sticky top-0 z-10`}>
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  {columna.icon}
                  {columna.titulo}
                </div>
                <span className="bg-white text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm">
                  {pedidosColumna.length}
                </span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50/30">
                {pedidosColumna.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
                    No hay pedidos en esta etapa
                  </div>
                ) : (
                  pedidosColumna.map((pedido) => (
                    <div key={pedido.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden">
                      
                      {/* Borde superior decorativo dorado sutil */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#BC9968]/20 group-hover:bg-[#BC9968] transition-colors" />

                      <div className="flex justify-between items-start mb-3 mt-1">
                        <span className="text-xs font-black text-[#8E1B3A] bg-[#F5E6D0] px-2 py-1 rounded-md tracking-wider">
                          {pedido.id}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPedidoDetalle(pedido)}
                            className="text-gray-400 hover:text-[#8E1B3A] transition-colors bg-gray-50 hover:bg-[#F5E6D0] p-1.5 rounded-lg"
                            title="Ver detalles completos"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      {/* --- NUEVA ESTRUCTURA CON IMAGEN --- */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                          {pedido.imagen ? (
                            <img src={pedido.imagen} alt={pedido.producto} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-400" /></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight mb-1 line-clamp-2">{pedido.producto}</h3>
                          <p className="text-xs text-gray-600 font-medium">👤 {pedido.cliente}</p>
                        </div>
                      </div>

                      {pedido.personalizacion && (
                        <div className="bg-yellow-50 border border-yellow-200 p-2.5 rounded-lg mb-3 flex items-start gap-2">
                          <MessageSquare size={14} className="text-yellow-600 mt-0.5 shrink-0" />
                          <p className="text-xs font-bold text-yellow-800 leading-snug line-clamp-2">
                            {pedido.personalizacion}
                          </p>
                        </div>
                      )}

                      <div className="flex items-start gap-2 text-xs text-gray-500 mb-4 flex-1">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span className="leading-tight line-clamp-2">{pedido.direccion}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                        <div className="text-sm font-black text-[#3D0A1A]">
                          Bs. {pedido.total}
                        </div>
                        
                        {pedido.estado !== "Entregado" && (
                          <button 
                            onClick={() => solicitarAvance(pedido)}
                            className="flex items-center gap-1 text-xs font-bold text-white bg-[#BC9968] hover:bg-[#9A7A48] px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm"
                          >
                            {columna.btnText} <ChevronRight size={14} />
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL CONFIRMACIÓN (Se mantiene igual) --- */}
      {pedidoAConfirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D0A1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <AlertTriangle size={32} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-2">
                ¿Avanzar a "{getSiguienteEstado(pedidoAConfirmar.estado)}"?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Estás cambiando el estado de <span className="font-bold text-[#8E1B3A]">{pedidoAConfirmar.id}</span>. 
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
                <p className="text-xs font-semibold text-gray-700 flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 shrink-0" />
                  El cliente recibirá una notificación automática.
                </p>
                <p className="text-xs font-semibold text-gray-700 flex items-start gap-2 mt-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  <span className="text-red-600">Atención: Acción irreversible.</span>
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setPedidoAConfirmar(null)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">Cancelar</button>
              <button onClick={confirmarAvance} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#BC9968] text-white hover:bg-[#9A7A48]">Confirmar Avance</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLES --- */}
      {pedidoDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fb]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#F5E6D0] text-[#8E1B3A] rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#3D0A1A]">Detalle del Pedido</h2>
                  <p className="text-xs text-gray-500 font-bold">{pedidoDetalle.id}</p>
                </div>
              </div>
              <button onClick={() => setPedidoDetalle(null)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Información del Cliente</p>
                <p className="font-bold text-gray-800">{pedidoDetalle.cliente}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><MapPin size={14} /> {pedidoDetalle.direccion}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resumen de Compra</p>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <img src={pedidoDetalle.imagen} alt="prod" className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                  <div className="flex-1">
                    <p className="font-bold text-[#1A1A1A] text-sm">{pedidoDetalle.producto}</p>
                  </div>
                  <p className="font-black text-[#8E1B3A]">Bs. {pedidoDetalle.total}</p>
                </div>
              </div>
              {pedidoDetalle.personalizacion && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instrucciones Especiales</p>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                    <MessageSquare size={18} className="text-yellow-600 shrink-0" />
                    <p className="text-sm font-semibold text-yellow-800 whitespace-pre-wrap">{pedidoDetalle.personalizacion}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setPedidoDetalle(null)} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#8E1B3A] text-white hover:bg-[#5A0F24]">Cerrar Detalles</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}