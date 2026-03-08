"use client";

import React from 'react';
import { COLORS, GiftIcon } from './constants';

export default function Footer() {
  return (
    <footer style={{ background: COLORS.chocolate, color: 'rgba(245,230,208,0.7)', padding: '40px 24px', borderTop: `1px solid ${COLORS.gold}30` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,230,208,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: "16px", height: "16px", color: COLORS.gold }}><GiftIcon /></div>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.beige }}>Emotia</span>
        </div>
        <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>© 2026 Grupo Explosión Pressman · Todos los derechos reservados.</p>
        <div style={{ display: 'flex', gap: 20, fontSize: '0.9rem' }}>
          {['Términos', 'Privacidad', 'Contacto'].map(l => (
            <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
              onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}