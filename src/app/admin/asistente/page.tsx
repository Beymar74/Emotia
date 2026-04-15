const sesiones = [
  { id: "S-001", usuario: "Laura Mendoza",  ocasion: "Cumpleaños",  presupuesto: "Bs 100–200", recomendaciones: 3, compro: true,  fecha: "14/04/2026" },
  { id: "S-002", usuario: "Carlos Quispe",  ocasion: "Aniversario", presupuesto: "Bs 200–400", recomendaciones: 4, compro: true,  fecha: "14/04/2026" },
  { id: "S-003", usuario: "Invitado",       ocasion: "Cumpleaños",  presupuesto: "Bs 50–100",  recomendaciones: 2, compro: false, fecha: "13/04/2026" },
  { id: "S-004", usuario: "Ana Torres",     ocasion: "Graduación",  presupuesto: "Bs 100–200", recomendaciones: 5, compro: true,  fecha: "13/04/2026" },
  { id: "S-005", usuario: "Diego Mamani",   ocasion: "Cumpleaños",  presupuesto: "Bs 50–100",  recomendaciones: 2, compro: false, fecha: "12/04/2026" },
];

const topProductos = [
  { nombre: "Ramo Primaveral",  recomendaciones: 842, conversiones: 312, tasa: "37%" },
  { nombre: "Caja de Trufas",   recomendaciones: 698, conversiones: 241, tasa: "35%" },
  { nombre: "Pulsera Artesanal",recomendaciones: 543, conversiones: 167, tasa: "31%" },
  { nombre: "Collar de Perlas", recomendaciones: 421, conversiones: 189, tasa: "45%" },
];

export default function AsistentePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes & Sistema</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Asistente IA — PREPE</h1>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Sesiones del mes",      valor: "2,814", color: "#8E1B3A" },
          { label: "Tasa de conversión",    valor: "34.2%", color: "#2D7A47" },
          { label: "Ocasión más frecuente", valor: "Cumpleaños", color: "#BC9968" },
          { label: "Presupuesto top",       valor: "Bs 100–200", color: "#5C3A2E" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top productos recomendados */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Productos más recomendados</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Producto", "Recomend.", "Compras", "Tasa"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProductos.map((p) => (
                <tr key={p.nombre} className="border-b border-[#8E1B3A]/5 last:border-0">
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{p.nombre}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{p.recomendaciones}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{p.conversiones}</td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-semibold text-[#2D7A47]">{p.tasa}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Distribución por ocasión */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Parámetros más usados</h3>
          <p className="text-xs tracking-widest uppercase text-[#7A5260] font-medium mb-3">Por ocasión</p>
          <div className="space-y-3 mb-5">
            {[
              { nombre: "Cumpleaños",  pct: 42 },
              { nombre: "Aniversario", pct: 28 },
              { nombre: "Graduación",  pct: 16 },
              { nombre: "San Valentín",pct: 9  },
              { nombre: "Otro",        pct: 5  },
            ].map((o) => (
              <div key={o.nombre}>
                <div className="flex justify-between text-sm text-[#7A5260] mb-1"><span>{o.nombre}</span><span>{o.pct}%</span></div>
                <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${o.pct}%`, background: "linear-gradient(90deg,#8E1B3A,#BC9968)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sesiones recientes */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Sesiones recientes</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID Sesión", "Usuario", "Ocasión", "Presupuesto", "Recomend.", "Compró", "Fecha"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sesiones.map((s) => (
              <tr key={s.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                <td className="px-3 py-3 text-xs font-mono text-[#7A5260]">{s.id}</td>
                <td className="px-3 py-3 text-sm text-[#2A0E18]">{s.usuario}</td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{s.ocasion}</td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{s.presupuesto}</td>
                <td className="px-3 py-3 text-sm text-[#2A0E18]">{s.recomendaciones}</td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${s.compro ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                    {s.compro ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{s.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
