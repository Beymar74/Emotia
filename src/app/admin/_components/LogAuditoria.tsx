const logs = [
  { label: "Acciones hoy",              valor: "48"    },
  { label: "Último log registrado",     valor: "#4821" },
  { label: "Cambios de contraseña",     valor: "3"     },
  { label: "Inicios de sesión (admin)", valor: "7"     },
];

export default function LogAuditoria() {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Log de auditoría
      </h3>
      <div className="divide-y divide-[#8E1B3A]/6">
        {logs.map((l) => (
          <div key={l.label} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-[#7A5260]">{l.label}</span>
            <span className="text-sm font-semibold text-[#5A0F24]">{l.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
