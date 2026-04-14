const categorias = [
  { nombre: "Flores",       porcentaje: 38 },
  { nombre: "Accesorios",   porcentaje: 24 },
  { nombre: "Dulces",       porcentaje: 20 },
  { nombre: "Manualidades", porcentaje: 12 },
  { nombre: "Perfumería",   porcentaje: 6  },
];

export default function VentasCategorias() {
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
              <span>{c.porcentaje}%</span>
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
