import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle, Info } from 'lucide-react';
import { COLORS } from '../constants';

// ─── Datos Mock del Pedido Activo ───
const ACTIVE_ORDER = {
  id: "#EM-2041",
  recipient: "María (Mamá)",
  address: "Av. Arce, Edificio Illimani, Piso 5, La Paz",
  item: 'Caja Botánica "Calma"',
  vendor: "Vivero Illimani",
  total: "180 Bs",
  eta: "Hoy, 16:30 hrs",
  courier: {
    name: "Roberto C.",
    phone: "+591 71234567",
    vehicle: "Motocicleta Blanca - 1234-ABC",
    rating: 4.9
  },
  currentStep: 2 // 0: Confirmado, 1: Preparando, 2: Tránsito, 3: Entregado
};

const TRACKING_STEPS = [
  { id: 0, label: "Pedido Confirmado", time: "09:14 hrs", icon: <CheckCircle size={20} /> },
  { id: 1, label: "Preparando Regalo", time: "10:30 hrs", icon: <Package size={20} /> },
  { id: 2, label: "En Tránsito", time: "14:05 hrs (En curso)", icon: <Truck size={20} /> },
  { id: 3, label: "Entregado", time: "Estimado: 16:30 hrs", icon: <MapPin size={20} /> },
];

export default function Tracking() {
  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* ─── Encabezado ─── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${COLORS.beige}60`, border: `1px solid ${COLORS.gold}40`, borderRadius: '100px', padding: '6px 16px', marginBottom: '16px' }}>
          <span style={{ width: '8px', height: '8px', background: '#3B82F6', borderRadius: '50%', boxShadow: '0 0 8px #3B82F6' }}></span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.choco, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pedido Activo</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '8px' }}>
          Sigue la emoción en <em style={{ color: COLORS.garnet }}>tiempo real</em>
        </h1>
        <p style={{ color: COLORS.gray, fontSize: '1rem' }}>
          Detalles y estado de entrega de tu pedido <strong>{ACTIVE_ORDER.id}</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        
        {/* ─── Columna Izquierda: Línea de Tiempo y Detalles ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tarjeta de Línea de Tiempo */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 12px 32px rgba(90, 15, 36, 0.04)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '24px' }}>Estado del Envío</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {TRACKING_STEPS.map((step, index) => {
                const isCompleted = step.id < ACTIVE_ORDER.currentStep;
                const isActive = step.id === ACTIVE_ORDER.currentStep;
                const isPending = step.id > ACTIVE_ORDER.currentStep;

                return (
                  <div key={step.id} style={{ display: 'flex', gap: '20px', position: 'relative', paddingBottom: index === TRACKING_STEPS.length - 1 ? '0' : '32px' }}>
                    
                    {/* Línea conectora */}
                    {index !== TRACKING_STEPS.length - 1 && (
                      <div style={{ position: 'absolute', left: '19px', top: '38px', bottom: '-2px', width: '2px', background: isCompleted ? COLORS.garnet : `${COLORS.gold}30`, zIndex: 1 }}></div>
                    )}

                    {/* Círculo del Icono */}
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2,
                      background: isActive ? COLORS.garnet : isCompleted ? `${COLORS.garnet}15` : 'white',
                      color: isActive ? 'white' : isCompleted ? COLORS.garnet : COLORS.gray,
                      border: isPending ? `2px solid ${COLORS.gold}30` : 'none',
                      boxShadow: isActive ? `0 4px 12px ${COLORS.garnet}40` : 'none'
                    }}>
                      {step.icon}
                    </div>

                    {/* Textos del paso */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '2px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isPending ? COLORS.gray : COLORS.choco, marginBottom: '4px' }}>{step.label}</h4>
                      <span style={{ fontSize: '0.85rem', color: isActive ? COLORS.garnet : COLORS.gray, fontWeight: isActive ? 600 : 400 }}>{step.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tarjeta de Detalles del Regalo */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '16px' }}>Detalles del Regalo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: `${COLORS.beige}30`, padding: '16px', borderRadius: '16px', border: `1px solid ${COLORS.gold}20` }}>
              <div style={{ fontSize: '2.5rem' }}>🪴</div>
              <div>
                <h4 style={{ fontWeight: 700, color: COLORS.choco, fontSize: '1rem', marginBottom: '2px' }}>{ACTIVE_ORDER.item}</h4>
                <p style={{ fontSize: '0.85rem', color: COLORS.gray, marginBottom: '4px' }}>Vendido por: {ACTIVE_ORDER.vendor}</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: COLORS.garnet }}>{ACTIVE_ORDER.total}</div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Columna Derecha: Mapa y Courier ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Placeholder del Mapa Animado */}
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 12px 32px rgba(90, 15, 36, 0.04)', height: '320px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: COLORS.gray }}>
              {/* Grid pattern simulando mapa */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: `radial-gradient(${COLORS.choco} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
              
              {/* Ruta simulada */}
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', zIndex: 1, overflow: 'visible' }}>
                <path d="M 40 160 Q 80 160 100 100 T 160 40" fill="none" stroke={COLORS.garnet} strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
                <circle cx="160" cy="40" r="8" fill={COLORS.garnet} />
                <circle cx="40" cy="160" r="6" fill={COLORS.gold} />
                
                {/* Vehículo animado */}
                <g style={{ animation: 'moveAlongPath 6s linear infinite alternate' }}>
                  <circle cx="100" cy="100" r="14" fill="white" stroke={COLORS.garnet} strokeWidth="3" />
                  <text x="100" y="104" fontSize="14" textAnchor="middle" fill={COLORS.garnet}>🚚</text>
                </g>
              </svg>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes moveAlongPath {
                  0% { transform: translate(-60px, 60px); }
                  100% { transform: translate(60px, -60px); }
                }
              `}} />

              <div style={{ zIndex: 2, background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '100px', fontWeight: 600, fontSize: '0.85rem', color: COLORS.choco, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: 'auto', marginBottom: '20px' }}>
                Llegada aprox: {ACTIVE_ORDER.eta}
              </div>
            </div>
          </div>

          {/* Tarjeta de Información de Entrega y Courier */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
              <MapPin size={20} color={COLORS.garnet} style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>Dirección de Entrega</h4>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: COLORS.choco }}>{ACTIVE_ORDER.recipient}</p>
                <p style={{ fontSize: '0.9rem', color: COLORS.gray }}>{ACTIVE_ORDER.address}</p>
              </div>
            </div>

            <div style={{ height: '1px', background: `rgba(188, 153, 104, 0.2)`, margin: '0 -24px 24px' }}></div>

            <h4 style={{ fontSize: '0.85rem', color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '16px' }}>Tu Repartidor</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                  RC
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, color: COLORS.choco, fontSize: '1rem' }}>{ACTIVE_ORDER.courier.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>{ACTIVE_ORDER.courier.vehicle} • ⭐ {ACTIVE_ORDER.courier.rating}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${COLORS.beige}60`, border: 'none', color: COLORS.garnet, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = `${COLORS.beige}`} onMouseOut={e => e.currentTarget.style.background = `${COLORS.beige}60`}>
                  <MessageCircle size={18} />
                </button>
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: COLORS.garnet, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 4px 12px ${COLORS.garnet}40`, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <Phone size={18} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}