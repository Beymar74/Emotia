import Link from "next/link";

interface Solicitud {
  label: string;
  valor: number;
  urgente: boolean;
  href: string;
}

interface Props {
  solicitudes: Solicitud[];
}

export default function SolicitudesPendientes({ solicitudes }: Props) {
  const hayUrgentes = solicitudes.some((s) => s.urgente && s.valor > 0);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Pendientes</h3>
        {hayUrgentes && (
          <span className="text-[10px] bg-[#8C5E08]/12 text-[#8C5E08] px-2.5 py-1 rounded-full font-medium uppercase tracking-wide">
            Requiere atención
          </span>
        )}
      </div>
      <div className="divide-y divide-[#8E1B3A]/6">
        {solicitudes.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 hover:bg-[#FAF3EC] -mx-2 px-2 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  s.urgente && s.valor > 0 ? "bg-[#8C5E08]" : "bg-[#BC9968]/40"
                }`}
              />
              <span className="text-sm text-[#7A5260] group-hover:text-[#5A0F24] transition-colors">
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  s.urgente && s.valor > 0 ? "text-[#8C5E08]" : "text-[#5A0F24]"
                }`}
              >
                {s.valor}
              </span>
              <svg
                className="w-3 h-3 text-[#BC9968] opacity-0 group-hover:opacity-100 transition-opacity"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
