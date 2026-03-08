"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, SECTION_IDS, SECTION_LABELS, GiftIcon } from './constants';

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const router = useRouter(); 
  
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.4s', padding: scrolled ? '12px 0' : '20px 0',
    }} className={scrolled ? 'nav-glass' : ''}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo/logo.png" alt="Emotia Logo" style={{ width: "40px", height: "40px" }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: COLORS.bordeaux }}>Emotia</span>
        </div>

        {/* Links ocultos en móviles */}
        <div style={{ display: 'flex', gap: 32 }} className="hidden md:flex">
          {SECTION_LABELS.slice(1, 4).map((label, i) => (
            <a key={label} href={`#${SECTION_IDS[i+1]}`} className="nav-link">{label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="hidden md:block" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: COLORS.chocolate, fontFamily: 'inherit' }}
            onClick={() => router.push('/login')}
          >
            Iniciar sesión
          </button>
          <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '100px', fontSize: '0.9rem' }}
            onClick={() => router.push('/login')}
          >
            Probar IA
          </button>
        </div>
      </div>
    </nav>
  );
}