"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';
import {
  LayoutDashboard, Package, ShoppingBag, User,
  Menu, X, ChevronRight, LogOut, Bell, Star
} from 'lucide-react';

const navLinks = [
  { href: '/proveedor', name: 'Dashboard', icon: LayoutDashboard },
  { href: '/proveedor/productos', name: 'Mis Productos', icon: Package },
  { href: '/proveedor/pedidos', name: 'Pedidos', icon: ShoppingBag },
  { href: '/proveedor/perfil', name: 'Mi Perfil', icon: User },
];

export default function ProveedorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const [showMobile, setShowMobile] = useState(false);

  const userName = user?.displayName ?? user?.primaryEmail?.split('@')[0] ?? 'Proveedor';

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'w-72 max-w-[85vw]' : 'w-64'} bg-[#FFFFFF] h-full flex flex-col border-r border-[#F5E6D0]`}>
      {/* Logo */}
      <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] p-5 flex items-center justify-between">
        <div className="flex flex-col">
          <Image src="/logo/logoextendido.png" alt="Emotia" width={110} height={35} className="object-contain h-7 w-auto brightness-0 invert" />
          <span className="text-[#BC9968] text-xs font-bold mt-1 uppercase tracking-widest">Panel Proveedor</span>
        </div>
        {mobile && (
          <button onClick={() => setShowMobile(false)} className="text-white p-1 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Info proveedor */}
      <div className="px-5 py-4 border-b border-[#F5E6D0] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F5E6D0] rounded-full flex items-center justify-center text-[#8E1B3A] font-bold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-[#5C3A2E] text-sm">{userName}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#BC9968] fill-[#BC9968]" />
            <span className="text-xs text-[#BC9968] font-semibold">Proveedor Verificado</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-grow py-4 px-3 overflow-y-auto">
        {navLinks.map(({ href, name, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setShowMobile(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${isActive ? 'bg-[#F5E6D0] text-[#8E1B3A]' : 'text-[#5C3A2E] hover:bg-[#F5E6D0]/50'}`}>
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#F5E6D0]">
        <button onClick={() => router.push('/login')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5E6D0]/20 flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Drawer móvil */}
      {showMobile && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-[#5A0F24]/40 backdrop-blur-sm" onClick={() => setShowMobile(false)} />
          <div className="relative animate-in slide-in-from-left duration-300 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar móvil */}
        <header className="lg:hidden sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F5E6D0] px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setShowMobile(true)} className="p-2 text-[#5C3A2E] hover:bg-[#F5E6D0] rounded-full">
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/logo/logoextendido.png" alt="Emotia" width={110} height={35} className="object-contain h-7 w-auto" />
          <button className="relative p-2 text-[#B0B0B0] hover:text-[#8E1B3A] rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#AB3A50] rounded-full border border-white"></span>
          </button>
        </header>

        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
