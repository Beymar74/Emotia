const actions = [
  {
    label: "Aprobar proveedor",
    sub: "5 pendientes",
    bg: "bg-[#8E1B3A]/10",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="#8E1B3A" strokeWidth="1.3" />
        <path d="M3 13c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="#8E1B3A" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Desactivar producto",
    sub: "12 a revisar",
    bg: "bg-[#BC9968]/15",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M3 3h10l-1.2 9H4.2L3 3z" stroke="#BC9968" strokeWidth="1.3" />
        <path d="M1.5 3h13" stroke="#BC9968" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Gestionar pedidos",
    sub: "3 cancelaciones",
    bg: "bg-[#5C3A2E]/10",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#5C3A2E" strokeWidth="1.3" />
        <path d="M5 4V3a3 3 0 016 0v1" stroke="#5C3A2E" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Exportar reporte PDF",
    sub: "Ventas del mes",
    bg: "bg-[#AB3A50]/8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M2 13l3-4 3 3 4-7" stroke="#AB3A50" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          className="bg-white border border-[#8E1B3A]/10 rounded-xl p-5 text-center cursor-pointer hover:border-[#8E1B3A]/40 hover:shadow-sm transition-all"
        >
          <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${action.bg}`}>
            {action.icon}
          </div>
          <p className="text-sm text-[#2A0E18] font-medium">{action.label}</p>
          <p className="text-xs text-[#7A5260] mt-1">{action.sub}</p>
        </button>
      ))}
    </div>
  );
}
