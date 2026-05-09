interface CategoriaData {
  nombre: string;
  porcentaje: number;
  total: number;
}

interface VentasCategoriasProps {
  categorias: CategoriaData[];
}

export default function VentasCategorias({ categorias }: VentasCategoriasProps) {
  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
          Ventas por categoría
        </h3>
        <p className="text-sm text-[#7A5260] text-center py-6 italic">
          Sin datos de ventas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Ventas por categoría
      </h3>
      <div className="space-y-3">
        {categorias.map((c) => (
          <div key={c.nombre}>
            <div className="flex justify-between text-sm text-[#7A5260] mb-1.5">
              <span>{c.nombre}</span>
              <span className="font-medium">{c.porcentaje}%</span>
            </div>
            <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.porcentaje}%`,
                  background: "linear-gradient(90deg, #8E1B3A, #BC9968)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
