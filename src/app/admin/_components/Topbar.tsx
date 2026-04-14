export default function Topbar() {
  return (
    <header className="bg-white border-b border-[#8E1B3A]/10 px-8 h-16 flex items-center justify-between flex-shrink-0">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Sistema PREPE — Administración
        </p>
        <h2 className="font-serif text-2xl font-semibold text-[#5A0F24] leading-tight">
          Dashboard General
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs bg-[#8E1B3A]/10 text-[#8E1B3A] px-4 py-1.5 rounded-full font-medium tracking-wide">
          Acceso total
        </span>
        <span className="text-sm text-[#7A5260] bg-[#F5E6D0] px-4 py-1.5 rounded-full">
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
