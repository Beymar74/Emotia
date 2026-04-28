const metricas = [
  { label: "Sesiones del mes",       valor: "2,814",      extra: ""               },
  { label: "Tasa de conversión",     valor: "34.2%",      extra: "text-[#2D7A47]" },
  { label: "Ocasión más frecuente",  valor: "Cumpleaños", extra: ""               },
  { label: "Presupuesto top",        valor: "Bs 100–200", extra: ""               },
];

export default function AsistenteIA() {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Asistente IA — PREPE
      </h3>
      <div className="divide-y divide-[#8E1B3A]/6">
        {metricas.map((m) => (
          <div key={m.label} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-[#7A5260]">{m.label}</span>
            <span className={`text-sm font-semibold text-[#5A0F24] ${m.extra}`}>
              {m.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
