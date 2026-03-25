"use client";
import { useState } from 'react';
import {
  Gift, Star, Package, CheckCircle, Sparkles, X,
  CreditCard, MapPin, CalendarDays, ArrowRight, ChevronLeft, User
} from 'lucide-react';

const DESTINATARIOS = ['Mamá 💐', 'Papá 🎩', 'Pareja ❤️', 'Amigo/a 🎉', 'Colega 💼', 'Hijo/a 🌟'];

export default function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [selectedDestinatario, setSelectedDestinatario] = useState('');
  const [selectedEmpaque, setSelectedEmpaque] = useState('premium');

  if (!product) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const discount = usePoints ? 50 : 0;
  const total = product.price - discount + 15;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#5A0F24]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">

        {/* Imagen */}
        <div className={`w-full md:w-5/12 relative bg-[#F5E6D0] ${step > 0 ? 'hidden md:block' : 'h-64 md:h-auto'}`}>
          <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
          {step === 0 && (
            <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-[#FFFFFF]/80 backdrop-blur rounded-full text-[#5A0F24] md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
          {step > 0 && <div className="absolute inset-0 bg-[#5A0F24]/40 backdrop-blur-[2px]"></div>}
          {step > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Preparando</p>
              <p className="text-xl font-extrabold text-center leading-tight">{product.title}</p>
              <p className="text-2xl font-bold text-[#BC9968] mt-2">{product.price} Bs</p>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="w-full md:w-7/12 p-6 md:p-8 relative flex flex-col overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-[#F5E6D0] rounded-full text-[#8E1B3A] hover:bg-[#BC9968] hover:text-[#FFFFFF] transition-colors hidden md:block z-10">
            <X className="w-5 h-5" />
          </button>

          {/* Stepper */}
          {step > 0 && step < 4 && (
            <div className="flex items-center gap-2 mb-6 mt-2 md:mt-0">
              <button onClick={handleBack} className="p-1 mr-2 text-[#B0B0B0] hover:text-[#8E1B3A]"><ChevronLeft className="w-6 h-6" /></button>
              {['Personalizar','Entrega','Pago'].map((label, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-2 w-full rounded-full transition-colors ${step >= i+1 ? 'bg-[#8E1B3A]' : 'bg-[#F5E6D0]'}`}></div>
                  <span className={`text-[10px] font-bold hidden sm:block ${step >= i+1 ? 'text-[#8E1B3A]' : 'text-[#B0B0B0]'}`}>{label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex-grow flex flex-col">

            {/* PASO 0: Detalle */}
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <span className="bg-[#F5E6D0] text-[#8E1B3A] text-xs font-bold px-3 py-1 rounded-full">{product.category ?? 'Regalo'}</span>
                <h2 className="text-3xl font-extrabold text-[#5A0F24] mt-3 mb-2">{product.title}</h2>
                <p className="text-2xl font-bold text-[#8E1B3A] mb-2">{product.price} Bs</p>
                <div className="flex items-center gap-1 mb-6">
                  <Star className="w-4 h-4 text-[#BC9968] fill-[#BC9968]" />
                  <span className="text-sm font-semibold text-[#5C3A2E]">{product.rating ?? '4.9'}</span>
                  <span className="text-xs text-[#B0B0B0]">({product.reviews ?? '80'} reseñas)</span>
                </div>
                <p className="text-[#5C3A2E] mb-8 leading-relaxed">{product.description}</p>
                <button onClick={handleNext} className="w-full bg-[#8E1B3A] hover:bg-[#5A0F24] text-[#FFFFFF] py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-transform hover:scale-105">
                  <Gift className="w-5 h-5" /> Preparar Regalo
                </button>
              </div>
            )}

            {/* PASO 1: Personalización con destinatario */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold text-[#5A0F24] mb-6 flex items-center gap-2"><Sparkles className="text-[#BC9968]" /> Toques Únicos</h2>
                <div className="space-y-6">

                  {/* Destinatario */}
                  <div>
                    <label className="block text-sm font-bold text-[#5C3A2E] mb-3 flex items-center gap-2"><User className="w-4 h-4 text-[#BC9968]" /> ¿Para quién es?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {DESTINATARIOS.map((d) => (
                        <button key={d} onClick={() => setSelectedDestinatario(d)}
                          className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all ${selectedDestinatario === d ? 'bg-[#8E1B3A] text-white border-[#8E1B3A]' : 'bg-[#FFFFFF] text-[#5C3A2E] border-[#F5E6D0] hover:border-[#BC9968]'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empaque */}
                  <div>
                    <label className="block text-sm font-bold text-[#5C3A2E] mb-3">Elige el Empaque</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => setSelectedEmpaque('premium')}
                        className={`rounded-xl p-4 cursor-pointer relative overflow-hidden border-2 transition-all ${selectedEmpaque === 'premium' ? 'border-[#8E1B3A] bg-[#F5E6D0]/30' : 'border-[#F5E6D0] hover:border-[#BC9968]'}`}>
                        {selectedEmpaque === 'premium' && <div className="absolute top-0 right-0 bg-[#8E1B3A] text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">✓</div>}
                        <Package className={`w-6 h-6 mb-2 ${selectedEmpaque === 'premium' ? 'text-[#8E1B3A]' : 'text-[#B0B0B0]'}`} />
                        <p className={`font-bold text-sm ${selectedEmpaque === 'premium' ? 'text-[#5C3A2E]' : 'text-[#B0B0B0]'}`}>Caja Premium</p>
                      </div>
                      <div onClick={() => setSelectedEmpaque('ecologica')}
                        className={`rounded-xl p-4 cursor-pointer border-2 transition-all ${selectedEmpaque === 'ecologica' ? 'border-[#8E1B3A] bg-[#F5E6D0]/30' : 'border-[#F5E6D0] hover:border-[#BC9968]'}`}>
                        {selectedEmpaque === 'ecologica' && <div className="absolute top-0 right-0 bg-[#8E1B3A] text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">✓</div>}
                        <Package className={`w-6 h-6 mb-2 ${selectedEmpaque === 'ecologica' ? 'text-[#8E1B3A]' : 'text-[#B0B0B0]'}`} />
                        <p className={`font-bold text-sm ${selectedEmpaque === 'ecologica' ? 'text-[#5C3A2E]' : 'text-[#B0B0B0]'}`}>Bolsa Ecológica</p>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-bold text-[#5C3A2E] mb-3">Mensaje en la Tarjeta</label>
                    <textarea className="w-full border border-[#B0B0B0]/40 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC9968] bg-[#FFFFFF] resize-none" rows={3}
                      placeholder={selectedDestinatario ? `Ej: ¡Para ${selectedDestinatario}, con mucho cariño!` : 'Ej: ¡Feliz aniversario! Gracias por todo...'}></textarea>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#F5E6D0]">
                  <button onClick={handleNext} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#5A0F24]">
                    Siguiente: Entrega <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: Entrega */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold text-[#5A0F24] mb-6 flex items-center gap-2"><MapPin className="text-[#BC9968]" /> ¿A dónde enviamos?</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Nombre de quien recibe</label>
                    <input type="text" className="w-full border border-[#B0B0B0]/40 rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A]"
                      placeholder="Ej: María Elena" defaultValue={selectedDestinatario ? selectedDestinatario.replace(/[^\w\s]/gi, '').trim() : ''} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Dirección de Entrega</label>
                    <input type="text" className="w-full border border-[#B0B0B0]/40 rounded-xl p-3 focus:outline-none focus:border-[#8E1B3A]" defaultValue="Av. 6 de Agosto, Sopocachi" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A2E] mb-1">Fecha de Entrega</label>
                    <div className="flex items-center gap-3 border border-[#8E1B3A] bg-[#F5E6D0]/20 rounded-xl p-3 text-[#8E1B3A] font-medium cursor-pointer">
                      <CalendarDays className="w-5 h-5" /> Viernes, 14 de Marzo 2026
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#F5E6D0]">
                  <button onClick={handleNext} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#5A0F24]">
                    Siguiente: Pago <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Pago */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold text-[#5A0F24] mb-6 flex items-center gap-2"><CreditCard className="text-[#BC9968]" /> Finalizar Compra</h2>
                <div className="bg-[#F5E6D0]/30 rounded-xl p-5 mb-6 border border-[#F5E6D0]">
                  <h3 className="font-bold text-[#5C3A2E] mb-4 border-b border-[#BC9968]/30 pb-2">Resumen</h3>
                  {selectedDestinatario && (
                    <div className="flex justify-between text-sm mb-2 text-[#8E1B3A] font-semibold">
                      <span>Para</span><span>{selectedDestinatario}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-2 text-[#5C3A2E]"><span>{product.title}</span><span>{product.price} Bs</span></div>
                  <div className="flex justify-between text-sm mb-2 text-[#5C3A2E]"><span>Empaque {selectedEmpaque === 'premium' ? 'Premium' : 'Ecológico'}</span><span>Incluido</span></div>
                  <div className="flex justify-between text-sm mb-2 text-[#5C3A2E]"><span>Envío</span><span>15 Bs</span></div>

                  <div className="mt-4 bg-[#FFFFFF] p-3 rounded-lg border border-[#BC9968] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-[#BC9968] fill-[#BC9968]" />
                      <span className="font-bold text-[#8E1B3A]">Tienes 450 Pts → usar 500 pts = -50 Bs</span>
                    </div>
                    <label className="flex items-center cursor-pointer shrink-0">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={usePoints} onChange={() => setUsePoints(!usePoints)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${usePoints ? 'bg-[#8E1B3A]' : 'bg-[#B0B0B0]'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${usePoints ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  {usePoints && <div className="flex justify-between text-sm mt-3 text-[#8E1B3A] font-bold"><span>Descuento Puntos</span><span>-50 Bs</span></div>}
                  <div className="flex justify-between text-xl font-extrabold text-[#5A0F24] mt-4 pt-4 border-t border-[#BC9968]/30">
                    <span>Total</span><span>{total} Bs</span>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#5A0F24] hover:scale-105 transition-transform shadow-lg">
                  Pagar con QR / Tarjeta
                </button>
                <p className="text-center text-xs text-[#B0B0B0] mt-3">Transacción 100% segura. Encriptación SSL.</p>
              </div>
            )}

            {/* PASO 4: Éxito */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-full animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-[#F5E6D0] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12 text-[#8E1B3A]" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#5A0F24] mb-2">¡Pedido Confirmado!</h2>
                {selectedDestinatario && <p className="text-[#BC9968] font-bold mb-2">🎁 Para: {selectedDestinatario}</p>}
                <p className="text-[#5C3A2E] mb-8">Tu regalo está en las mejores manos. Te notificaremos cada paso del proceso.</p>
                <div className="bg-[#FFFFFF] border-2 border-[#BC9968] rounded-xl p-4 mb-8 shadow-md w-full">
                  <p className="text-xs font-bold text-[#B0B0B0] uppercase tracking-wider mb-1">Recompensa Emotia</p>
                  <p className="text-lg font-bold text-[#8E1B3A] flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-[#BC9968] fill-[#BC9968]" /> +{Math.floor(total * 0.1)} Pts ganados
                  </p>
                </div>
                <button onClick={onClose} className="w-full bg-[#8E1B3A] text-[#FFFFFF] py-3 rounded-xl font-bold hover:bg-[#5A0F24] transition-colors shadow-md">
                  Cerrar
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
