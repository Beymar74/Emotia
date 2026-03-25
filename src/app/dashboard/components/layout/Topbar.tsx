"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Star, Bell, User, LayoutGrid, Package, Crown, Truck, CalendarDays, Settings, LogOut, CreditCard } from 'lucide-react';

const navLinks = [
  { href: '/dashboard/catalog', name: 'Catálogo', icon: LayoutGrid },
  { href: '/dashboard/orders', name: 'Pedidos', icon: Package },
  { href: '/dashboard/special-dates', name: 'Fechas', icon: CalendarDays },
  { href: '/dashboard/points', name: 'Puntos', icon: Star },
  { href: '/dashboard/payments', name: 'Pagos', icon: CreditCard },
  { href: '/dashboard/subscription', name: 'VIP', icon: Crown },
];

export default function Topbar({ userName = "Beymar M.", points = 450, onOpenProfile }: { userName?: string, points?: number, onOpenProfile?: () => void }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F5E6D0] px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center transition-transform hover:scale-105 shrink-0">
          <Image
            src="/logo/logoextendido.png"
            alt="Emotia"
            width={130}
            height={40}
            className="object-contain h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ href, name, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${isActive ? 'bg-[#F5E6D0] text-[#8E1B3A]' : 'text-[#5C3A2E] hover:bg-[#F5E6D0]/50'}`}>
                <Icon className="w-3.5 h-3.5" />{name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden xl:flex items-center gap-2 bg-[#F5E6D0] px-3 py-1.5 rounded-full border border-[#BC9968]">
          <Star className="w-4 h-4 text-[#BC9968] fill-[#BC9968]" />
          <span className="text-sm font-extrabold text-[#8E1B3A]">{points} Pts</span>
        </div>

        <div className="relative">
          <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} className="relative p-2 text-[#B0B0B0] hover:text-[#8E1B3A] hover:bg-[#F5E6D0]/50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#AB3A50] rounded-full border border-[#FFFFFF]"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#F5E6D0] overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="p-4 bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] text-[#FFFFFF] font-bold flex justify-between items-center">
                Notificaciones <span className="text-xs bg-[#FFFFFF]/20 px-2 py-1 rounded-full">2 Nuevas</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-[#F5E6D0] hover:bg-[#F5E6D0]/30 cursor-pointer flex gap-3">
                  <div className="bg-[#F5E6D0] p-2 rounded-full h-fit"><Truck className="w-4 h-4 text-[#8E1B3A]" /></div>
                  <div><p className="text-sm font-bold text-[#5C3A2E]">Tu pedido está en camino</p><p className="text-xs text-[#B0B0B0] mt-1">La Caja Sorpresa llegará en aprox. 30 mins.</p></div>
                </div>
                <div className="p-4 hover:bg-[#F5E6D0]/30 cursor-pointer flex gap-3">
                  <div className="bg-[#BC9968]/20 p-2 rounded-full h-fit"><CalendarDays className="w-4 h-4 text-[#BC9968]" /></div>
                  <div><p className="text-sm font-bold text-[#5C3A2E]">¡Fecha especial próxima!</p><p className="text-xs text-[#B0B0B0] mt-1">El aniversario de tus papás es en 12 días.</p></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} className="flex items-center gap-2 bg-[#FFFFFF] border border-[#F5E6D0] p-1.5 pr-3 rounded-full hover:shadow-sm transition-all">
            <div className="bg-[#F5E6D0] p-1.5 rounded-full"><User className="w-4 h-4 text-[#8E1B3A]" /></div>
            <span className="text-xs font-medium text-[#5C3A2E] hidden sm:block">{userName}</span>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-xl shadow-xl border border-[#F5E6D0] overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="p-2">
                <button onClick={() => { onOpenProfile?.(); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#5C3A2E] hover:bg-[#F5E6D0]/50 hover:text-[#8E1B3A] rounded-lg transition-colors">
                  <Settings className="w-4 h-4" /> Editar Perfil
                </button>
                <div className="h-px bg-[#F5E6D0] my-1"></div>
                <Link href="/login">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}