interface Props {
  pedidosHoy: number;
  ingresosHoy: number;
  usuariosHoy: number;
  provPendientes: number;
}

export default function ResumenHoy({ pedidosHoy, ingresosHoy, usuariosHoy, provPendientes }: Props) {
  const items = [
    {
      label: "Pedidos hoy",
      value: pedidosHoy.toLocaleString("es-BO"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M6 4.5V3.5a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
      iconColor: "#8E1B3A",
      bg: "bg-[#8E1B3A]/8",
      urgent: false,
    },
    {
      label: "Ingresos hoy",
      value: `Bs ${ingresosHoy.toLocaleString("es-BO", { minimumFractionDigits: 0 })}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M9 5.5v1M9 11.5v1M7.2 8c0-.9 1-1.5 1.8-1.5s1.8.6 1.8 1.5c0 .8-.8 1.2-1.8 1.3-1 .1-1.8.6-1.8 1.5S8 12.3 9 12.3s1.8-.6 1.8-1.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ),
      iconColor: "#2D7A47",
      bg: "bg-[#2D7A47]/8",
      urgent: false,
    },
    {
      label: "Nuevos usuarios",
      value: usuariosHoy.toLocaleString("es-BO"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 15c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
      iconColor: "#5C3A2E",
      bg: "bg-[#5C3A2E]/8",
      urgent: false,
    },
    {
      label: "Empresas pendientes",
      value: provPendientes.toLocaleString("es-BO"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="3" width="14" height="12" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 6.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.5 10h1M10.5 10h1M6.5 13h1M10.5 13h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
      iconColor: provPendientes > 0 ? "#8C5E08" : "#BC9968",
      bg: provPendientes > 0 ? "bg-[#8C5E08]/8" : "bg-[#BC9968]/10",
      urgent: provPendientes > 0,
    },
  ];

  return (
    <section>
      <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold mb-3 opacity-80">
        Actividad de hoy
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`bg-white border rounded-xl p-4 flex items-center gap-3 ${
              item.urgent ? "border-[#8C5E08]/30" : "border-[#8E1B3A]/10"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}
              style={{ color: item.iconColor }}
            >
              {item.icon}
            </div>
            <div>
              <p className="font-semibold text-[#5A0F24] text-sm leading-tight">
                {item.value}
              </p>
              <p className="text-[10px] text-[#7A5260] mt-0.5 leading-tight">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
