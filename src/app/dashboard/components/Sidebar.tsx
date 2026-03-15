import React from 'react';
import { NAV_ITEMS } from '../data';
import { IconX, IconLogout } from './Icons';

export function NavItem({ id, icon, label, badge, active, onClick }: { id: string, icon: React.ReactNode, label: string, badge?: string, active: boolean, onClick: (id: string) => void }) {
  return (
    <button className={`nav-item${active ? " nav-item--active" : ""}`} onClick={() => onClick(id)}>
      {icon}
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </button>
  );
}

export function SidebarOverlay({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: (v: boolean) => void }) {
  return (
    <div
      className={`sidebar-overlay${sidebarOpen ? " sidebar-overlay--visible" : ""}`}
      style={{ display: sidebarOpen ? "block" : "none" }}
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />
  )
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, navigate, handleLogout }: { sidebarOpen: boolean, setSidebarOpen: (v: boolean) => void, activeTab: string, navigate: (t: string) => void, handleLogout: () => void }) {
  return (
    <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
      {/* Logo */}
      <div className="logo-area" onClick={() => navigate("inicio")} role="button" tabIndex={0}>
        <img src="/logo/logo.png" alt="Emotia Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        <span className="logo-text">Emotia</span>
        <button className="sidebar-close-btn" onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }} aria-label="Cerrar menú">
          <IconX />
        </button>
      </div>

      {/* Nav */}
      <nav className="nav">
        <span className="nav-section">Principal</span>
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.id} {...item} active={activeTab === item.id} onClick={navigate} />
        ))}
        <span className="nav-section">Compras</span>
        {NAV_ITEMS.slice(2).map((item) => (
          <NavItem key={item.id} {...item} active={activeTab === item.id} onClick={navigate} />
        ))}
      </nav>

      {/* Profile */}
      <div className="profile-area">
        <div className="avatar">BM</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="profile-name">Beymar Mamani</div>
          <div className="badge-vip">VIP</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <IconLogout />
        </button>
      </div>
    </aside>
  );
}