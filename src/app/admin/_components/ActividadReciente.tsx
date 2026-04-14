const actividades = [
  { color: "#8E1B3A", texto: "Admin suspendió cuenta de Sweet Perfumes",             tiempo: "Hace 5 min · log #4821"  },
  { color: "#BC9968", texto: "Pedido #1084 completado — Rosas & Tulipanes",          tiempo: "Hace 38 min · log #4820" },
  { color: "#AB3A50", texto: "Admin eliminó producto Ramo Eterno por incumplimiento",tiempo: "Hace 1h · log #4819"     },
  { color: "#5C3A2E", texto: "Admin resolvió pago fallido del pedido #1071",         tiempo: "Hace 2h · log #4818"     },
];

export default function ActividadReciente() {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Actividad reciente
      </h3>
      <div className="divide-y divide-[#8E1B3A]/6">
        {actividades.map((a, i) => (
          <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{ background: a.color }}
            />
            <div>
              <p className="text-sm text-[#2A0E18] leading-snug">{a.texto}</p>
              <p className="text-xs text-[#7A5260] mt-1">{a.tiempo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
