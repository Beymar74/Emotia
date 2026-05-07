interface CategoriaVenta {
  nombre: string;
  total: number;
  porcentaje: number;
}

interface Props {
  categorias: CategoriaVenta[];
}

const GRADIENTES = [
  ["#8E1B3A", "#BC9968"],
  ["#AB3A50", "#D4A96A"],
  ["#5C3A2E", "#BC9968"],
  ["#7A5260", "#C4A878"],
  ["#BC9968", "#F5E6D0"],
];

export default function VentasCategorias({ categorias }: Props) {
  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
          Ventas por categoría
        </h3>
        <p className="text-sm text-[#7A5260] py-4 text-center">Sin datos de ventas aún.</p>
      </div>
    );
  }

  const totalBs = categorias.reduce((a, c) => a + c.total, 0);

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">
          Ventas por categoría
        </h3>
        <span className="text-[10px] text-[#7A5260] bg-[#FAF3EC] px-2 py-1 rounded-md shrink-0">
          Bs {totalBs.toLocaleString("es-BO", { minimumFractionDigits: 0 })}
        </span>
      </div>
      <div className="space-y-3">
        {categorias.map((c, i) => {
          const [from, to] = GRADIENTES[i % GRADIENTES.length];
          return (
            <div key={c.nombre}>
              <div className="flex justify-between text-sm text-[#7A5260] mb-1.5">
                <span>{c.nombre}</span>
                <span className="font-medium text-[#5A0F24]">{c.porcentaje}%</span>
              </div>
              <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${c.porcentaje}%`,
                    background: `linear-gradient(90deg, ${from}, ${to})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
