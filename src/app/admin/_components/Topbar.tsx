interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="bg-white border-b border-[#8E1B3A]/10 px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — solo visible en mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 -ml-1 text-[#5A0F24] hover:bg-[#8E1B3A]/8 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Sistema PREPE — Administración
          </p>
          <h2 className="font-serif text-lg sm:text-2xl font-semibold text-[#5A0F24] leading-tight">
            Dashboard General
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden sm:inline text-xs bg-[#8E1B3A]/10 text-[#8E1B3A] px-4 py-1.5 rounded-full font-medium tracking-wide">
          Acceso total
        </span>
        <span className="hidden md:inline text-sm text-[#7A5260] bg-[#F5E6D0] px-4 py-1.5 rounded-full">
          Abril 2026
        </span>
        <button className="relative p-1.5">
          <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a5 5 0 00-5 5v2.5L2.5 12h13L14 9.5V7A5 5 0 009 2z" stroke="#5A0F24" strokeWidth="1.3" />
            <path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="#5A0F24" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#8E1B3A] rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
