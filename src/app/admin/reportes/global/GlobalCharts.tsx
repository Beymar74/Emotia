"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#8E1B3A", "#BC9968", "#5C3A2E", "#AB3A50", "#185FA5"];

interface SemanaData { periodo: string; pedidos: number; monto: number }
interface EmpresaData { nombre_negocio: string; total_vendido: number | null }
interface CatData { nombre: string; monto: number; items: number; pct: number }

const fmt = (n: number) => n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

export function GraficoSemanalGlobal({ data, totalIngresos }: { data: SemanaData[]; totalIngresos: number }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Evolución semanal de ingresos</h3>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradGlobal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8E1B3A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8E1B3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="monto"
            stroke="#8E1B3A"
            strokeWidth={2.5}
            fill="url(#gradGlobal)"
            dot={{ fill: "#8E1B3A", r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7, fill: "#8E1B3A" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoEmpresasGlobal({ data, totalIngresos }: { data: EmpresaData[]; totalIngresos: number }) {
  const chartData = data.map((e) => ({
    nombre: e.nombre_negocio.length > 14 ? e.nombre_negocio.slice(0, 13) + "…" : e.nombre_negocio,
    ventas: Number(e.total_vendido || 0),
    pct: totalIngresos > 0 ? Math.round((Number(e.total_vendido || 0) / totalIngresos) * 100) : 0,
  }));

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Ventas por empresa</h3>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ventas"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ventas" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoCategoriasGlobal({ data }: { data: CatData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Desglose por categoría</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="monto" nameKey="nombre" cx="50%" cy="50%" innerRadius={50} outerRadius={82} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
            </Pie>
            <Tooltip
              formatter={(v: any, name: any) => [`Bs ${Number(v).toLocaleString()}`, name]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((c, i) => (
            <div key={c.nombre} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate">{c.nombre}</span>
              <span className="text-xs font-bold text-[#5A0F24]">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
