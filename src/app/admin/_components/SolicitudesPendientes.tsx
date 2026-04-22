const solicitudes = [
  { label: "Proveedores nuevos",         valor: "5",  urgente: true  },
  { label: "Productos a revisar",        valor: "12", urgente: true  },
  { label: "Cancelaciones por resolver", valor: "3",  urgente: false },
  { label: "Pagos fallidos",             valor: "2",  urgente: false },
];

export default function SolicitudesPendientes() {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Solicitudes pendientes
      </h3>
      <div className="divide-y divide-[#8E1B3A]/6">
        {solicitudes.map((s) => (
          <div key={s.label} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-[#7A5260]">{s.label}</span>
            <span className={`text-sm font-semibold ${s.urgente ? "text-[#8C5E08]" : "text-[#5A0F24]"}`}>
              {s.urgente ? `${s.valor} ⚑` : s.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
