"use client";

import {
  BarChart, Bar, Cell, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ProdVenta { id: number; nombre: string; categoria: string; empresa: string; precio: number; unidades: number; ingresos: number; activo: boolean }
interface CatData { nombre: string; total: number; activos: number; ingresos: number }

const fmt = (n: number) => n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

export function GraficoTopProductos({ data, totalIngresos }: { data: ProdVenta[]; totalIngresos: number }) {
  const chartData = data.map((p) => ({
    nombre: p.nombre.length > 20 ? p.nombre.slice(0, 18) + "…" : p.nombre,
    ingresos: p.ingresos,
    unidades: p.unidades,
    pct: totalIngresos > 0 ? Math.round((p.ingresos / totalIngresos) * 100) : 0,
  }));

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Top productos por ingresos</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="nombre"
            width={130}
            tick={{ fontSize: 10, fill: "#2A0E18" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v: any, name: any) => [
              name === "ingresos" ? `Bs ${Number(v).toLocaleString()}` : v + " uds",
              name === "ingresos" ? "Ingresos" : "Unidades",
            ]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ingresos" radius={[0, 6, 6, 0]} label={{ position: "right", formatter: (v: any) => `${chartData.find(d => d.ingresos === v)?.pct ?? 0}%`, fontSize: 10, fill: "#7A5260" }}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "#5A0F24" : i < 3 ? "#8E1B3A" : "#BC9968"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoEstadoProductos({ activos, inactivos }: { activos: number; inactivos: number }) {
  const data = [
    { name: "Activos", value: activos, color: "#2D7A47" },
    { name: "Inactivos", value: inactivos, color: "#A32D2D" },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Estado del catálogo</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={4}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip
              formatter={(v: any, name: any) => [v + " productos", name]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-4">
          {data.map((d) => (
            <div key={d.name}>
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm font-medium text-[#2A0E18]">{d.name}</span>
                </div>
                <span className="font-serif text-lg font-bold" style={{ color: d.color }}>{d.value}</span>
              </div>
              <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.value / (activos + inactivos)) * 100}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoCategorias({ data }: { data: CatData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Ingresos por categoría</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data.slice(0, 7)} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v.length > 10 ? v.slice(0, 9) + "…" : v} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ingresos" radius={[6, 6, 0, 0]}>
            {data.slice(0, 7).map((_, i) => (
              <Cell key={i} fill={["#8E1B3A", "#AB3A50", "#BC9968", "#5C3A2E", "#185FA5", "#2D7A47", "#8C5E08"][i % 7]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
