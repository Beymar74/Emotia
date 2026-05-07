import Link from "next/link";

interface Producto {
  id: number;
  nombre: string;
  vendidos: number;
  imagen_url: string | null;
  categoria: string;
}

interface Props {
  productos: Producto[];
}

export default function TopProductos({ productos }: Props) {
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
          Más vendidos
        </h3>
        <p className="text-sm text-[#7A5260] py-4 text-center">
          Sin datos de ventas aún.
        </p>
      </div>
    );
  }

  const maxVentas = Math.max(...productos.map((p) => p.vendidos), 1);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">
          Más vendidos
        </h3>
        <Link href="/admin/productos" className="text-xs text-[#BC9968] hover:underline">
          Ver catálogo →
        </Link>
      </div>

      <div className="space-y-3">
        {productos.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-[#BC9968] w-4 flex-shrink-0 text-center">
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F5E6D0] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {p.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#8E1B3A]">
                  {p.nombre[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#5A0F24] font-medium truncate leading-tight">
                {p.nombre}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(p.vendidos / maxVentas) * 100}%`,
                      background: "linear-gradient(90deg, #8E1B3A, #BC9968)",
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#7A5260] whitespace-nowrap flex-shrink-0">
                  {p.vendidos} uds
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
