"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_TABS, COLORS } from '../constants';
import { IconMenu, IconSearch, IconBell, IconUser, IconLogout } from './Icons';
import { useStackApp } from "@stackframe/stack";

// Íconos personalizados idénticos a tu diseño de Figma/UI
const DropdownUserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.choco} stroke="none">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const DropdownSettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.choco} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Agregamos "navigate" a los props del componente
export default function Topbar({ activeTab, setSidebarOpen, navigate }: { activeTab: string, setSidebarOpen: (v: boolean) => void, navigate?: (t: string) => void }) {
  const router = useRouter();
  const stackApp = useStackApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hasNotifs, setHasNotifs] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await stackApp.signOut();
  };

  const handleClearNotifs = () => {
    setHasNotifs(false);
    setShowNotifs(false);
  };

  return (
    <header className="topbar">
      {/* ─── Izquierda: Botón Menú Móvil y Título ─── */}
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
          <IconMenu />
        </button>
        <h2 className="topbar-title">{NAV_TABS[activeTab] ?? "Dashboard"}</h2>
      </div>

      {/* ─── Derecha: Buscador y Botones ─── */}
      <div className="topbar-right">
        
        {/* Buscador */}
        <div className="search-bar">
          <IconSearch />
          <input type="text" placeholder="Buscar pedidos..." autoComplete="off" />
        </div>

        {/* Botón de Notificaciones */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="icon-btn" 
            aria-label="Notificaciones"
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            style={{ borderColor: showNotifs ? COLORS.gold : '' }}
          >
            <IconBell />
            {hasNotifs && <div className="notif-dot" />}
          </button>

          {/* Dropdown de Notificaciones */}
          {showNotifs && (
            <div style={{
              position: 'absolute', top: '120%', right: '-10px', width: '320px',
              background: 'white', borderRadius: '16px', boxShadow: '0 12px 40px rgba(90,15,36,0.15)',
              border: `1px solid ${COLORS.gold}30`, padding: '20px', zIndex: 100,
              animation: 'fadeSlideUp 0.2s ease', cursor: 'default'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${COLORS.beige}`, paddingBottom: '12px' }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 800, color: COLORS.bordeaux }}>Notificaciones</h4>
                {hasNotifs && <span style={{ background: `${COLORS.garnet}15`, color: COLORS.garnet, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>2 Nuevas</span>}
              </div>
              
              {hasNotifs ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.garnet, marginTop: '6px', flexShrink: 0, boxShadow: `0 0 8px ${COLORS.garnet}80` }} />
                    <div>
                      <p style={{ fontSize: '0.85rem', color: COLORS.choco, fontWeight: 700, marginBottom: '2px' }}>¡Tu pedido está cerca!</p>
                      <p style={{ fontSize: '0.8rem', color: COLORS.gray, lineHeight: 1.4 }}>El repartidor de la "Caja Botánica" llegará en aprox. 15 minutos.</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.gold, marginTop: '6px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.85rem', color: COLORS.choco, fontWeight: 700, marginBottom: '2px' }}>Nuevas sugerencias IA</p>
                      <p style={{ fontSize: '0.8rem', color: COLORS.gray, lineHeight: 1.4 }}>Tenemos 3 opciones curadas para el aniversario de tus papás.</p>
                    </div>
                  </div>
                  
                  <button onClick={handleClearNotifs} style={{ width: '100%', marginTop: '8px', background: `${COLORS.beige}40`, border: 'none', color: COLORS.gold, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = `${COLORS.beige}`} onMouseOut={e => e.currentTarget.style.background = `${COLORS.beige}40`}>
                    Marcar todas como leídas
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: COLORS.gray, textAlign: 'center', padding: '10px 0' }}>No tienes notificaciones nuevas.</p>
              )}
            </div>
          )}
        </div>

        {/* Botón de Perfil */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button 
            className="icon-btn" 
            aria-label="Perfil"
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            style={{ borderColor: showProfile ? COLORS.gold : '', background: showProfile ? `${COLORS.beige}40` : '' }}
          >
            <IconUser />
          </button>

          {/* Dropdown de Perfil */}
          {showProfile && (
            <div style={{
              position: 'absolute', top: '130%', right: '0', width: '260px',
              background: 'white', borderRadius: '20px', boxShadow: '0 12px 40px rgba(90,15,36,0.12)',
              border: `1px solid ${COLORS.beige}`, padding: '12px', zIndex: 100,
              animation: 'fadeSlideUp 0.2s ease', cursor: 'default'
            }}>
              
              {/* Info de Usuario */}
              <div style={{ padding: '8px 12px 16px', borderBottom: `1px solid ${COLORS.beige}`, marginBottom: '8px' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: COLORS.bordeaux, marginBottom: '2px' }}>Beymar Mamani</p>
                <p style={{ fontSize: '0.8rem', color: COLORS.gray }}>Cliente VIP</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                
                {/* Botón Mi Perfil -> Dispara navigate('perfil') */}
                <button 
                  onClick={() => { if(navigate) navigate('perfil'); setShowProfile(false); }} 
                  style={{ background: `${COLORS.beige}50`, border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '1rem', color: COLORS.choco, cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <DropdownUserIcon /> Mi Perfil
                </button>
                
                {/* Botón Configuración -> Dispara navigate('configuracion') */}
                <button 
                  onClick={() => { if(navigate) navigate('configuracion'); setShowProfile(false); }} 
                  style={{ background: 'transparent', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '1rem', color: COLORS.choco, cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '14px' }} 
                  onMouseOver={e => e.currentTarget.style.background = `${COLORS.beige}50`} 
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <DropdownSettingsIcon /> Configuración
                </button>
                
                <div style={{ height: '1px', background: COLORS.beige, margin: '8px 0' }} />
                
                {/* Botón Cerrar Sesión */}
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'transparent', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '1rem', color: COLORS.garnet, cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 600 }} 
                  onMouseOver={e => e.currentTarget.style.background = `${COLORS.garnet}10`} 
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                   <IconLogout /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}