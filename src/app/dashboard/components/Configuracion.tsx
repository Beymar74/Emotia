import React, { useState } from 'react';
import { Bell, Lock, Globe, Shield, Smartphone, Moon, X, Check } from 'lucide-react';
import { COLORS } from '../constants';

export default function Configuracion() {
  const [settings, setSettings] = useState({
    notifPedidos: true,
    notifSugerencias: true,
    darkMode: false,
    authTwoSteps: false,
    idioma: 'Español (Bolivia)'
  });

  // Estado para controlar qué modal está abierto ('idioma', 'password', o null)
  const [activeModal, setActiveModal] = useState<'idioma' | 'password' | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // Componente de Switch reutilizable
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      style={{ width: '48px', height: '26px', borderRadius: '100px', background: checked ? COLORS.garnet : '#E5E7EB', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}
    >
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: checked ? '25px' : '3px', transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
    </button>
  );

  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', position: 'relative' }}>
      
      {/* ─── Encabezado ─── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '8px' }}>
          Panel de <em style={{ color: COLORS.garnet }}>Configuración</em>
        </h1>
        <p style={{ color: COLORS.gray, fontSize: '1rem' }}>
          Ajusta tus preferencias de sistema, seguridad y notificaciones.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Sección: Notificaciones */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color={COLORS.garnet} /> Preferencias de Notificación
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${COLORS.beige}` }}>
            <div>
              <h4 style={{ fontWeight: 600, color: COLORS.choco, marginBottom: '4px' }}>Actualizaciones de Pedidos</h4>
              <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>Recibe alertas cuando tu pedido cambie de estado.</p>
            </div>
            <ToggleSwitch checked={settings.notifPedidos} onChange={() => handleToggle('notifPedidos')} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <div>
              <h4 style={{ fontWeight: 600, color: COLORS.choco, marginBottom: '4px' }}>Sugerencias Inteligentes de IA</h4>
              <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>Notificaciones sobre fechas importantes y recomendaciones de regalos.</p>
            </div>
            <ToggleSwitch checked={settings.notifSugerencias} onChange={() => handleToggle('notifSugerencias')} />
          </div>
        </div>

        {/* Sección: Apariencia y Sistema */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} color={COLORS.garnet} /> Apariencia y Sistema
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${COLORS.beige}` }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: `${COLORS.beige}40`, padding: '10px', borderRadius: '12px' }}><Moon size={18} color={COLORS.choco} /></div>
              <div>
                <h4 style={{ fontWeight: 600, color: COLORS.choco, marginBottom: '4px' }}>Modo Oscuro</h4>
                <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>Cambia la apariencia de la plataforma a tonos oscuros.</p>
              </div>
            </div>
            <ToggleSwitch checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: `${COLORS.beige}40`, padding: '10px', borderRadius: '12px' }}><Globe size={18} color={COLORS.choco} /></div>
              <div>
                <h4 style={{ fontWeight: 600, color: COLORS.choco, marginBottom: '4px' }}>Idioma</h4>
                <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>{settings.idioma}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('idioma')}
              style={{ background: 'white', border: `1px solid ${COLORS.gold}80`, color: COLORS.choco, padding: '6px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = `${COLORS.beige}30`}
              onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Sección: Seguridad */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color={COLORS.garnet} /> Seguridad y Privacidad
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${COLORS.beige}` }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: `${COLORS.beige}40`, padding: '10px', borderRadius: '12px' }}><Lock size={18} color={COLORS.choco} /></div>
              <div>
                <h4 style={{ fontWeight: 600, color: COLORS.choco, marginBottom: '4px' }}>Autenticación en Dos Pasos (2FA)</h4>
                <p style={{ fontSize: '0.85rem', color: COLORS.gray }}>Agrega una capa adicional de seguridad a tu cuenta.</p>
              </div>
            </div>
            <ToggleSwitch checked={settings.authTwoSteps} onChange={() => handleToggle('authTwoSteps')} />
          </div>

          <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'flex-start' }}>
             <button 
                onClick={() => setActiveModal('password')}
                style={{ background: 'transparent', color: COLORS.garnet, border: 'none', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
             >
               Cambiar mi contraseña
             </button>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════
          MODALES SUPERPUESTOS
      ════════════════════════════════════════════════════ */}
      {activeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(92, 58, 46, 0.4)', backdropFilter: 'blur(4px)', animation: 'fadeSlideUp 0.3s ease'
        }}>
          
          {/* MODAL: IDIOMA */}
          {activeModal === 'idioma' && (
            <div style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', position: 'relative', boxShadow: '0 24px 48px rgba(90,15,36,0.15)' }}>
              <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gray }}><X size={20} /></button>
              
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '8px' }}>Idioma de la plataforma</h2>
              <p style={{ fontSize: '0.9rem', color: COLORS.gray, marginBottom: '24px' }}>Selecciona tu idioma de preferencia.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Español (Bolivia)', 'Inglés (English)', 'Aymara', 'Quechua'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => { setSettings({...settings, idioma: lang}); setActiveModal(null); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px', borderRadius: '12px', background: settings.idioma === lang ? `${COLORS.garnet}10` : 'white',
                      border: `1px solid ${settings.idioma === lang ? COLORS.garnet : COLORS.beige}`,
                      cursor: 'pointer', color: COLORS.choco, fontWeight: settings.idioma === lang ? 700 : 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {lang}
                    {settings.idioma === lang && <Check size={18} color={COLORS.garnet} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODAL: CONTRASEÑA */}
          {activeModal === 'password' && (
            <div style={{ background: 'white', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '32px', position: 'relative', boxShadow: '0 24px 48px rgba(90,15,36,0.15)' }}>
              <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gray }}><X size={20} /></button>
              
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, color: COLORS.bordeaux, marginBottom: '8px' }}>Cambiar contraseña</h2>
              <p style={{ fontSize: '0.9rem', color: COLORS.gray, marginBottom: '24px' }}>Asegúrate de usar al menos 8 caracteres.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña Actual</label>
                  <input type="password" style={{ width: '100%', background: '#FDFBF9', border: `1px solid ${COLORS.gold}40`, padding: '12px 16px', borderRadius: '12px', outline: 'none', color: COLORS.choco, fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nueva Contraseña</label>
                  <input type="password" style={{ width: '100%', background: '#FDFBF9', border: `1px solid ${COLORS.gold}40`, padding: '12px 16px', borderRadius: '12px', outline: 'none', color: COLORS.choco, fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirmar Contraseña</label>
                  <input type="password" style={{ width: '100%', background: '#FDFBF9', border: `1px solid ${COLORS.gold}40`, padding: '12px 16px', borderRadius: '12px', outline: 'none', color: COLORS.choco, fontFamily: 'inherit' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: COLORS.gray, fontWeight: 600, padding: '12px 20px', cursor: 'pointer', borderRadius: '100px' }}>Cancelar</button>
                <button onClick={() => setActiveModal(null)} style={{ background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, color: 'white', border: 'none', fontWeight: 600, padding: '12px 24px', borderRadius: '100px', cursor: 'pointer', boxShadow: `0 4px 12px ${COLORS.garnet}40` }}>Guardar Cambios</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}