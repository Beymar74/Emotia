import React from 'react';
import { Star, CheckCircle2, Zap, Gem } from 'lucide-react';
import { COLORS } from '../constants';

export default function Suscripcion() {
  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* ─── Encabezado ─── */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${COLORS.beige}60`, border: `1px solid ${COLORS.gold}40`, borderRadius: '100px', padding: '6px 16px', marginBottom: '16px' }}>
          <Star size={14} color={COLORS.garnet} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.choco, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mejora tu experiencia</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '12px' }}>
          Elige el plan ideal para <em style={{ color: COLORS.garnet }}>ti</em>
        </h1>
        <p style={{ color: COLORS.gray, fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Desbloquea envíos prioritarios, empaques exclusivos y la máxima capacidad de nuestra IA generativa de regalos.
        </p>
      </div>

      {/* ─── Tarjetas de Planes ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center' }}>
        
        {/* Plan Básico (Actual) */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px 32px', border: `1px solid rgba(188, 153, 104, 0.3)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', background: `${COLORS.beige}`, color: COLORS.choco, fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '100px' }}>Tu Plan Actual</div>
          
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: COLORS.choco, marginBottom: '8px' }}>Básico</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, marginBottom: '24px' }}>
            0 <span style={{ fontSize: '1rem', color: COLORS.gray, fontWeight: 500 }}>Bs / mes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {['Acceso al Asesor IA estándar', 'Catálogo de proveedores locales', 'Tracking de pedidos básico'].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: COLORS.choco, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color={COLORS.gold} /> {benefit}
              </div>
            ))}
          </div>

          <button style={{ width: '100%', background: `${COLORS.beige}40`, color: COLORS.gray, border: 'none', padding: '14px', borderRadius: '100px', fontWeight: 700, cursor: 'not-allowed' }}>
            Plan Activo
          </button>
        </div>

        {/* Plan Premium (Recomendado) */}
        <div style={{ background: `linear-gradient(145deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, borderRadius: '24px', padding: '48px 32px', border: `1px solid ${COLORS.crimson}`, boxShadow: `0 24px 48px ${COLORS.garnet}40`, position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: COLORS.gold, color: 'white', fontSize: '0.8rem', fontWeight: 800, padding: '6px 20px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(188,153,104,0.4)' }}>Recomendado</div>
          
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color={COLORS.gold} /> Emotia Plus
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '24px' }}>
            35 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Bs / mes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {['Envíos gratis ilimitados en La Paz', 'Empaquetado premium exclusivo', 'IA con análisis de sentimientos avanzado', 'Prioridad en soporte al cliente'].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color={COLORS.gold} /> {benefit}
              </div>
            ))}
          </div>

          <button style={{ width: '100%', background: 'white', color: COLORS.garnet, border: 'none', padding: '14px', borderRadius: '100px', fontWeight: 800, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Actualizar a Plus
          </button>
        </div>

        {/* Plan VIP */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px 32px', border: `1px solid rgba(188, 153, 104, 0.3)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gem size={20} color={COLORS.garnet} /> Emotia VIP
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, marginBottom: '24px' }}>
            80 <span style={{ fontSize: '1rem', color: COLORS.gray, fontWeight: 500 }}>Bs / mes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {['Todo lo del plan Plus', 'Entregas Express (Mismo día)', 'Video-dedicatorias con RA', 'Regalo sorpresa de cumpleaños gratis'].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: COLORS.choco, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color={COLORS.garnet} /> {benefit}
              </div>
            ))}
          </div>

          <button style={{ width: '100%', background: 'white', color: COLORS.garnet, border: `2px solid ${COLORS.garnet}`, padding: '12px', borderRadius: '100px', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = COLORS.garnet; e.currentTarget.style.color = 'white'}} onMouseOut={e => {e.currentTarget.style.background = 'white'; e.currentTarget.style.color = COLORS.garnet}}>
            Obtener VIP
          </button>
        </div>

      </div>
    </div>
  );
}