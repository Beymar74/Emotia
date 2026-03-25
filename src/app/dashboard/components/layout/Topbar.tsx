"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';
import { 
  Star, Bell, User, LayoutGrid, Package, Crown, 
  Truck, CalendarDays, Settings, LogOut, CreditCard, 
  Menu, X, ChevronRight
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard/catalog', name: 'Catálogo', icon: LayoutGrid },
  { href: '/dashboard/orders', name: 'Mis Pedidos', icon: Package },
  { href: '/dashboard/special-dates', name: 'Fechas Especiales', icon: CalendarDays },
  { href: '/dashboard/points', name: 'Mis Puntos', icon: Star },
  { href: '/dashboard/payments', name: 'Historial de Pagos', icon: CreditCard },
  { href: '/dashboard/subscription', name: 'Plan VIP', icon: Crown },
];

export default function Topbar({ points = 450, onOpenProfile }: { points?: number, onOpenProfile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Nombre real desde Stack Auth
  const userName = user?.displayName
    ?? user?.primaryEmail?.split('@')[0]
    ?? 'Usuario';

  const closeAll = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F5E6D0] px-4 py-3 flex items-center justify-between shadow-sm">
        
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowMobileMenu(true); closeAll(); }}
            className="lg:hidden p-2 text-[#5C3A2E] hover:bg-[#F5E6D0] rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center transition-transform hover:scale-105 shrink-0">
            <Image src="/logo/logoextendido.png" alt="Emotia" width={130} height={40} className="object-contain h-8 w-auto" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {navLinks.map(({ href, name, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${isActive ? 'bg-[#F5E6D0] text-[#8E1B3A]' : 'text-[#5C3A2E] hover:bg-[#F5E6D0]/50'}`}>
                  <Icon className="w-3.5 h-3.5" />{name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-[#F5E6D0] px-3 py-1.5 rounded-full border border-[#BC9968]">
            <Star className="w-4 h-4 text-[#BC9968] fill-[#BC9968]" />
            <span className="text-sm font-extrabold text-[#8E1B3A]">{points} Pts</span>
          </div>

          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className="relative p-2 text-[#B0B0B0] hover:text-[#8E1B3A] hover:bg-[#F5E6D0]/50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#AB3A50] rounded-full border border-[#FFFFFF]"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#F5E6D0] overflow-hidden animate-in slide-in-from-top-2 z-50">
                <div className="p-4 bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] text-[#FFFFFF] font-bold flex justify-between items-center">
                  Notificaciones <span className="text-xs bg-[#FFFFFF]/20 px-2 py-1 rounded-full">2 Nuevas</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-[#F5E6D0] hover:bg-[#F5E6D0]/30 cursor-pointer flex gap-3">
                    <div className="bg-[#F5E6D0] p-2 rounded-full h-fit"><Truck className="w-4 h-4 text-[#8E1B3A]" /></div>
                    <div>
                      <p className="text-sm font-bold text-[#5C3A2E]">Tu pedido está en camino</p>
                      <p className="text-xs text-[#B0B0B0] mt-1">La Caja Sorpresa llegará en aprox. 30 mins.</p>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-[#F5E6D0]/30 cursor-pointer flex gap-3">
                    <div className="bg-[#BC9968]/20 p-2 rounded-full h-fit"><CalendarDays className="w-4 h-4 text-[#BC9968]" /></div>
                    <div>
                      <p className="text-sm font-bold text-[#5C3A2E]">¡Fecha especial próxima!</p>
                      <p className="text-xs text-[#B0B0B0] mt-1">El aniversario de tus papás es en 12 días.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 bg-[#FFFFFF] border border-[#F5E6D0] p-1.5 pr-3 rounded-full hover:shadow-sm transition-all">
              <div className="bg-[#F5E6D0] p-1.5 rounded-full"><User className="w-4 h-4 text-[#8E1B3A]" /></div>
              <span className="text-xs font-medium text-[#5C3A2E] hidden sm:block">{userName}</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-xl shadow-xl border border-[#F5E6D0] overflow-hidden animate-in slide-in-from-top-2 z-50">
                <div className="p-2">
                  <button onClick={() => { onOpenProfile?.(); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#5C3A2E] hover:bg-[#F5E6D0]/50 hover:text-[#8E1B3A] rounded-lg transition-colors">
                    <Settings className="w-4 h-4" /> Editar Perfil
                  </button>
                  <div className="h-px bg-[#F5E6D0] my-1"></div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-[#5A0F24]/40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#FFFFFF] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] p-5 flex items-center justify-between">
              <Image src="/logo/logoextendido.png" alt="Emotia" width={110} height={35} className="object-contain h-7 w-auto brightness-0 invert" />
              <button onClick={() => setShowMobileMenu(false)} className="p-1.5 hover:bg-[#FFFFFF]/20 rounded-full transition-colors text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-[#F5E6D0] flex items-center gap-3">
              <div className="bg-[#F5E6D0] p-2.5 rounded-full"><User className="w-5 h-5 text-[#8E1B3A]" /></div>
              <div>
                <p className="font-bold text-[#5C3A2E] text-sm">{userName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-[#BC9968] fill-[#BC9968]" />
                  <span className="text-xs font-bold text-[#8E1B3A]">{points} Pts · Nivel Oro</span>
                </div>
              </div>
            </div>

            <nav className="flex-grow overflow-y-auto py-3 px-3">
              {navLinks.map(({ href, name, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href} onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${isActive ? 'bg-[#F5E6D0] text-[#8E1B3A]' : 'text-[#5C3A2E] hover:bg-[#F5E6D0]/50'}`}>
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#F5E6D0] space-y-2">
              <button onClick={() => { onOpenProfile?.(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#5C3A2E] hover:bg-[#F5E6D0] transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-semibold text-sm">Editar Perfil</span>
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-semibold text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
